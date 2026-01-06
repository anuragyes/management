import express from 'express';

import SportsEvent from "../../../models/Organizermodel/EsportsEvent/Esportsgames.js"
import redis from '../../../config/redis.js';

/**
 * CREATE SPORTS EVENT
 * Write-heavy → DB + Cache Invalidation
 */
export const createSportsEvent = async (req, res) => {
  try {
    const event = await SportsEvent.create(req.body);

    // Invalidate cache
    await redis.del("ALL_SPORTS_EVENTS");

    res.status(201).json({
      success: true,
      message: "Sports event created successfully",
      data: event
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




//  this api do both 1 all data fetch and 2 is fecth only those data who is bfore today 
export const getAllSportsEvents = async (req, res) => {
  try {
    const { beforeToday, beforeDate } = req.query;

    let filter = { status: "Approved" };

    //  Filter events before today
    if (beforeToday === "true") {
      filter.eventDate = { $lt: new Date() };
    }

    //  Filter events before a specific date
    if (beforeDate) {
      filter.eventDate = { $lt: new Date(beforeDate) };
    }

    //  Dynamic cache key (VERY IMPORTANT)
    const cacheKey = `SPORTS_EVENTS_${JSON.stringify(filter)}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cached),
      });
    }

    const events = await SportsEvent.find(filter).sort({ eventDate: -1 });

    await redis.set(cacheKey, JSON.stringify(events), "EX", 120);

    res.json({
      success: true,
      source: "db",
      data: events,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




export const getSportsEventById = async (req, res) => {
  try {
    const { id } = req.params;

     console.log("this is the id " , id)
    const cacheKey = `SPORTS_EVENT_${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cached)
      });
    }

    const event = await SportsEvent.findById(id);
    if (!event ) {
      return res.status(404).json({
        success: false,
        message: "Sports event not found"
      });
    }

    await redis.set(cacheKey, JSON.stringify(event), "EX", 120);

    res.json({
      success: true,
      source: "db",
      data: event
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateSportsEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await SportsEvent.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Sports event not found"
      });
    }

    // Invalidate cache
    await redis.del(`SPORTS_EVENT_${id}`);
    await redis.del("ALL_SPORTS_EVENTS");

    res.json({
      success: true,
      message: "Sports event updated",
      data: event
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const deleteSportsEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await SportsEvent.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Sports event not found"
      });
    }

    // Clear cache
    await redis.del(`SPORTS_EVENT_${id}`);
    await redis.del("ALL_SPORTS_EVENTS");

    res.json({
      success: true,
      message: "Sports event deleted (soft delete)"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const approveSportEvent= async(req, res)=> {
  await   SportsEvent.findByIdAndUpdate(
        req.params.id,
        { status: "Approved" },
        { new: true }
    )
        .then((hackathon) => {
            if (!hackathon) {
                return res.status(404).json({
                    success: false,
                    message: "Sport  not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Sport approved successfully",
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
