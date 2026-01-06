import express from 'express';
import Workshop from "../../models/Organizermodel/Organizerworkshop.js"

export function createWorkshop(req, res) {
  Workshop.create(req.body)
    .then((workshop) => {
      res.status(201).json({
        success: true,
        message: "Workshop created successfully",
        data: workshop,
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: "Error creating workshop",
        error: error.message,
      });
    });
}


export const getAllWorkshops = async (req, res) => {
  try {
    const { beforeToday, beforeDate } = req.query;

    let filter = { status: "Approved" };

    // 📅 Filter workshops before today
    if (beforeToday === "true") {
      filter.eventDate = { $lt: new Date() };
    }

    // 📅 Filter workshops before a specific date
    if (beforeDate) {
      filter.eventDate = { $lt: new Date(beforeDate) };
    }

    const workshops = await Workshop
      .find(filter)
      .sort({ eventDate: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching workshops",
      error: error.message,
    });
  }
};




export function getWorkshopById(req, res) {
  Workshop.findById(req.params.id)
    .then((workshop) => {
      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Workshop not found",
        });
      }

      res.status(200).json({
        success: true,
        data: workshop,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error fetching workshop",
        error: error.message,
      });
    });
}


export function updateWorkshop(req, res) {
  Workshop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((workshop) => {
      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Workshop not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Workshop updated successfully",
        data: workshop,
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: "Error updating workshop",
        error: error.message,
      });
    });
}



export function deleteWorkshop(req, res) {
  Workshop.findByIdAndDelete(req.params.id)
    .then((workshop) => {
      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Workshop not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Workshop deleted successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error deleting workshop",
        error: error.message,
      });
    });
}


export function approveWorkshop(req, res) {
  Workshop.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    { new: true }
  )
    .then((workshop) => {
      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Workshop not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Workshop approved",
        data: workshop,
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
