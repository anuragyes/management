import express from 'express';
import mongoose from 'mongoose'
import StartupEvent from '../../../models/Organizermodel/Startup/StartupInovation.js';
import redis from '../../../config/redis.js';
import festQueue from '../../../config/fastQueue.js';
/**
 * CREATE EVENT
 * Handles millions of requests using validation + async ready
 */
export const createStartupEvent = async (req, res) => {
    try {
        const event = await StartupEvent.create(req.body);

        // Invalidate cache
        await redis.del("ALL_FESTS_STARTUP");

        // Push background job
        festQueue.add("notify-users", { event: event._id });

        res.status(201).json({
            success: true,
            message: "FeststartUp created",
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create startup event",
            error: error.message
        });
    }
};

/**
 * GET ALL EVENTS (Optimized for Read Traffic)
 */



//  this api do both 1 all data fetch and 2 is fecth only those data who is bfore today 
export const getAllStartupEvents = async (req, res) => {
    try {
        const { beforeToday, beforeDate } = req.query;

        let filter = { status: "Approved" };

        //  Before today
        if (beforeToday === "true") {
            filter.eventDate = { $lt: new Date() };
        }

        //  Before specific date
        if (beforeDate) {
            filter.eventDate = { $lt: new Date(beforeDate) };
        }

        // 🔑 Dynamic Redis key (critical)
        const cacheKey = `STARTUP_EVENTS_${JSON.stringify(filter)}`;

        // 1️⃣ Check cache
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                source: "cache",
                data: JSON.parse(cachedData),
            });
        }

        // 2️ Fetch from DB
        const events = await StartupEvent
            .find(filter)
            .sort({ eventDate: -1 })
            .lean();


        await redis.setex(cacheKey, 60, JSON.stringify(events));

        res.json({
            success: true,
            source: "db",
            data: events,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



/**
 * GET SINGLE EVENT
 */


export const getStartupEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1 Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        const cacheKey = `ALL_FESTS_STARTUP:${id}`;

        // 2️ Check Redis cache
        const cachedEvent = await redis.get(cacheKey);
        if (cachedEvent) {
            return res.status(200).json({
                success: true,
                source: "cache",
                data: JSON.parse(cachedEvent)
            });
        }

        // 3️ Fetch from DB (lean = fast)
        const event = await StartupEvent.findById(id).lean();

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // 4️ Store in Redis (TTL = 2 min)
        await redis.setex(cacheKey, 120, JSON.stringify(event));

        res.status(200).json({
            success: true,
            source: "db",
            data: event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching event",
            error: error.message
        });
    }
};



export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1️⃣ Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        // 2️⃣ Update DB
        const event = await StartupEvent.findByIdAndUpdate(
            id,
            { status },
            { new: true, lean: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // 3️⃣ Invalidate Redis cache
        await redis.del(`ALL_FESTS_STARTUP:${id}`);
        await redis.del("ALL_FESTS_STARTUP"); // if list depends on status

        res.status(200).json({
            success: true,
            message: "Event status updated",
            data: event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: error.message
        });
    }
};















export const approveStartup = async (req, res) => {
    try {
        const startEvent = await StartupEvent.findByIdAndUpdate(
            req.params.id,
            { status: "Approved" },
            { new: true }
        );

        if (!startEvent) {
            return res.status(404).json({
                success: false,
                message: "StartupEvent not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "StartupEvent approved successfully",
            data: startEvent,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Approval failed",
            error: error.message,
        });
    }
};

