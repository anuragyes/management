
/*introduce redis here lets understand if multiple users commes and get the events we have seen alots of traffic so lets make sclable 


*/
import express from "express";
import Culturalmodel from "../../models/Organizermodel/Culturalmodel.js";
import redis from "../../config/redis.js";
import festQueue from "../../config/fastQueue.js";




/*
 queue is userd for 
User hits API
   ↓
Fest saved in DB
   ↓
Job added to Queue
   ↓
API responds immediately 
   ↓
Worker processes job later (email, notification)
 */



/*
Problem  for getAllCulturalFests function 
1 Thousands of users viewing fest details
2 DB gets overloaded

Solution → Redis Caching
flow for redis woking 
Request → Controller
   ↓
Check Redis Cache

If Found → Return Response
If Not → Fetch from MongoDB → Save to Redis

*/
export const getAllCulturalEvents = async (req, res) => {
  try {
    const { beforeToday, beforeDate } = req.query;

    let filter = {};

    // 📅 Filter events before today
    if (beforeToday === "true") {
      filter.eventDate = { $lt: new Date() };
    }

    // 📅 Filter events before specific date
    if (beforeDate) {
      filter.eventDate = { $lt: new Date(beforeDate) };
    }

    //  Dynamic Redis key 
    const cacheKey = `CULTURAL_EVENTS_${JSON.stringify(filter)}`;

    // 1️ Check Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedData),
      });
    }

    // 2️ Fetch from DB
    const fests = await Culturalmodel
      .find(filter)
      .sort({ eventDate: -1 })
      .lean();

    // 3️ Store in Redis
    await redis.set(cacheKey, JSON.stringify(fests), "EX", 60);

    res.json({
      success: true,
      source: "db",
      data: fests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// createCulturalFest  write heavy 

/*Problem

1.Admin creates fest

2.Cache becomes stale

3.Email notifications slow response

Solution

1.Invalidate Redis cache

2.Background jobs via Queue



  flow of data :-


  Create Fest → Save to DB
     ↓
Invalidate Cache
     ↓
Push job to Queue (Email / Notification)
     ↓
Respond to client immediately
*/



export const createCulturalFest = async (req, res) => {
    const fest = await Culturalmodel.create(req.body);

    // Invalidate cache
    await redis.del("ALL_FESTS");

    // Push background job
    festQueue.add("notify-users", { festId: fest._id });

    res.status(201).json({
        success: true,
        message: "Fest created",
        data: fest
    });
};











/*
getCulturalFestById (to get by id  ENDPOINT)

Why this scales
Uses per-ID caching
Avoids DB hit on repeated requests

 flow of data 
 Request → Redis → MongoDB → Redis
 Benefit
Handles millions of read requests

*/




export const getCulturalFestById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `FEST_${id}`;

        // 1️ Check cache
        const cachedFest = await redis.get(cacheKey);
        if (cachedFest) {
            return res.status(200).json({
                success: true,
                source: "cache",
                data: JSON.parse(cachedFest)
            });
        }

        // 2️ Fetch from DB
        const fest = await Culturalmodel.findById(id);
        if (!fest) {
            return res.status(404).json({
                success: false,
                message: "Cultural Fest not found"
            });
        }

        // 3️ Save to cache (TTL: 2 minutes)
        await redis.set(cacheKey, JSON.stringify(fest), "EX", 120);

        res.status(200).json({
            success: true,
            source: "db",
            data: fest
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





/*   UPDATE Cultural Fest 
Why this scales
Cache invalidation
Stateless update
Safe for multi-node setup


*/



export const updateCulturalFest = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedFest = await Culturalmodel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFest) {
            return res.status(404).json({
                success: false,
                message: "Cultural Fest not found"
            });
        }

        //  Invalidate cache
        await redis.del(`FEST_${id}`);
        await redis.del("ALL_FESTS");

        res.status(200).json({
            success: true,
            message: "Cultural Fest updated successfully",
            data: updatedFest
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




/*Why NOT hard delete?
DELETE Cultural Fest (SOFT DELETE – RECOMMENDED)

Data recovery

Audit logs

Safe at scale*/


export const deleteCulturalFest = async (req, res) => {
    try {
        const { id } = req.params;

        const fest = await Culturalmodel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!fest) {
            return res.status(404).json({
                success: false,
                message: "Cultural Fest not found"
            });
        }

        //  Clear cache
        await redis.del(`FEST_${id}`);
        await redis.del("ALL_FESTS");

        res.status(200).json({
            success: true,
            message: "Cultural Fest deleted successfully (soft delete)"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const handDeleteCuturalFest = async (req, res) => {


    try {

        const { id } = req.params;

        const fest = await Culturalmodel.findByIdAndDelete(id);

        if (!fest) {
            return res.status(404).json({ success: false });
        }


        await redis.del(`FEST_${id}`);
        await redis.del("ALL_FESTS")
    } catch (error) {

    }
}
