import Hackathon   from "../../models/Organizermodel/HackathonSchema.js"
import redis from "../../config/redis.js";
/**
 * CREATE HACKATHON
 * POST /api/hackathons
 */
export const  createHackathon = async(req, res)=> {
  await  Hackathon.create(req.body)
        .then((hackathon) => {
            res.status(201).json({
                success: true,
                message: "Hackathon created successfully",
                data: hackathon,
            });
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                message: "Error creating hackathon",
                error: error.message,
            });
        });
}

/**
 * GET ALL APPROVED HACKATHONS (Students)
 * GET /api/hackathons
 */
export const getAllHackathons = async (req, res) => {
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

    //  Dynamic Redis key
    const cacheKey = `HACKATHONS_${JSON.stringify(filter)}`;

    // 1️ Check Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: "cache",
        count: JSON.parse(cachedData).length,
        data: JSON.parse(cachedData),
      });
    }

    // 2️ Fetch from DB
    const hackathons = await Hackathon
      .find(filter)
      .sort({ eventDate: -1 })
      .lean();

    // 3️⃣ Store in Redis
    await redis.set(cacheKey, JSON.stringify(hackathons), "EX", 60);

    res.status(200).json({
      success: true,
      source: "db",
      count: hackathons.length,
      data: hackathons,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hackathons",
      error: error.message,
    });
  }
};


/**
 * GET SINGLE HACKATHON
 * GET /api/hackathons/:id
 */
export const  getHackathonById = async(req, res) =>{
    Hackathon.findById(req.params.id)
        .then((hackathon) => {
            if (!hackathon) {
                return res.status(404).json({
                    success: false,
                    message: "Hackathon not found",
                });
            }

            res.status(200).json({
                success: true,
                data: hackathon,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error fetching hackathon",
                error: error.message,
            });
        });
}

/**
 * UPDATE HACKATHON
 * PUT /api/hackathons/:id
 */
export const updateHackathon=async(req, res) =>{
   await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .then((hackathon) => {
            if (!hackathon) {
                return res.status(404).json({
                    success: false,
                    message: "Hackathon not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Hackathon updated successfully",
                data: hackathon,
            });
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                message: "Error updating hackathon",
                error: error.message,
            });
        });
}

/**
 * DELETE HACKATHON
 * DELETE /api/hackathons/:id
 */
export const deleteHackathon= async(req, res)=> {
   await Hackathon.findByIdAndDelete(req.params.id)
        .then((hackathon) => {
            if (!hackathon) {
                return res.status(404).json({
                    success: false,
                    message: "Hackathon not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Hackathon deleted successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error deleting hackathon",
                error: error.message,
            });
        });
}

/**
 * APPROVE HACKATHON (ADMIN)
 * PATCH /api/hackathons/:id/approve
 */

export const approveHackathon= async(req, res)=> {
  await   Hackathon.findByIdAndUpdate(
        req.params.id,
        { status: "Approved" },
        { new: true }
    )
        .then((hackathon) => {
            if (!hackathon) {
                return res.status(404).json({
                    success: false,
                    message: "Hackathon not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Hackathon approved successfully",
                data: hackathon,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Approval failed",
                error: error.message,
            });
        });
}

