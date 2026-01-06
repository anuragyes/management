import bcrypt from "bcryptjs";
import TeamMember from "../../models/Organizermodel/TeamMember.js";
import redis from "../../config/redis.js";
import organiserQueue from "../../config/Teammemberqueue.js";


export const createTeamOrganiser = async (req, res) => {
    try {
        const {
            email,
            name,
            password,
            role,
            department,
            avatar,
            eventsOrganized,
            contribution,
            specialization,
            icon,
            year,
            motto,
            achievements,
        } = req.body;

        // 1️ Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase();

        // 2️ Redis quick existence check
        const emailKey = `organiser:email:${normalizedEmail}`;
        if (await redis.get(emailKey)) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // 3️ DB existence check
        const existingUser = await TeamMember.findOne({ email: normalizedEmail }).lean();
        if (existingUser) {
            await redis.set(emailKey, "1", "EX", 3600);
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // 4️ Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 5️ Save ALL data to DB
        const organiser = await TeamMember.create({
            email: normalizedEmail,
            name,
            password: hashedPassword,
            role,
            department,
            avatar,
            eventsOrganized,
            contribution,
            specialization,
            icon,
            year,
            motto,
            achievements,
        });

        // 6Prepare Redis-safe object (NO password)
        const redisPayload = {
            id: organiser._id,
            name: organiser.name,
            email: organiser.email,
            role: organiser.role,
            department: organiser.department,
            avatar: organiser.avatar,
            eventsOrganized: organiser.eventsOrganized,
            contribution: organiser.contribution,
            specialization: organiser.specialization,
            icon: organiser.icon,
            year: organiser.year,
            motto: organiser.motto,
            achievements: organiser.achievements,
            isActive: organiser.isActive,
            createdAt: organiser.createdAt,
        };

        // 7️ Cache full organiser profile
        await redis.set(
            `organiser:${organiser._id}`,
            JSON.stringify(redisPayload),
            "EX",
            3600
        );

        await redis.set(emailKey, "1", "EX", 3600);

        // 8️ Queue async tasks
        await organiserQueue.add("organiser-created", {
            organiserId: organiser._id,
            email: organiser.email,
            name: organiser.name,
        });

        // 9️ Response
        return res.status(201).json({
            success: true,
            message: "Organizer created successfully",
            data: redisPayload,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


/* ❌ Without Pagination

Server sends 10,000 records

High RAM usage

Slow UI

App crash risk

 With Pagination

Server sends 10 records

Fast response

Smooth UI

Scales to millions of users */

export const getAllTeamMembers = async (req, res) => {
    try {
        // 1️ Pagination (important for million users)  get smooth in scrolling 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2️ Redis cache key (unique per page)
        const cacheKey = `teamMembers:page:${page}:limit:${limit}`;

        // 3️ Check Redis first (FAST)
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                source: "cache",
                ...JSON.parse(cachedData),
            });
        }

        // 4️ DB Query (source of truth)
        const members = await TeamMember.find()
            .select("-password")          // NEVER send password
            .sort({ createdAt: -1 })      // newest first
            .skip(skip)
            .limit(limit)
            .lean();                      // lightweight objects

        const totalCount = await TeamMember.countDocuments();  //It counts how many documents (rows) exist in the TeamMember collection in MongoDB.

        const responseData = {
            success: true,
            source: "db",
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            data: members,
        };

        // 5️ Save to Redis (TTL = 60 seconds)   after 60 second redis remove that data because if not remove redis get heavy after some data  more traffic
        await redis.set(
            cacheKey,
            JSON.stringify(responseData),
            "EX",
            60
        );

        return res.status(200).json(responseData);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching team members",
            error: error.message,
        });
    }
};

