
import mongoose from 'mongoose';
import Seminar from '../../models/Organizermodel/Seminarmodel.js';

export const createSeminar = async (req, res) => {
    await Seminar.create(req.body)
        .then((seminar) => {
            res.status(201).json({
                success: true,
                message: "Seminar created successfully",
                data: seminar,
            });
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                message: "Error creating seminar",
                error: error.message,
            });
        });
}

export const getAllSeminars = async (req, res) => {
  try {
    const { beforeToday, beforeDate } = req.query;

    let filter = { status: "Approved" };

    // 📅 Before today
    if (beforeToday === "true") {
      filter.eventDate = { $lt: new Date() };
    }

    // 📅 Before specific date
    if (beforeDate) {
      filter.eventDate = { $lt: new Date(beforeDate) };
    }

    const seminars = await Seminar
      .find(filter)
      .sort({ eventDate: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: seminars.length,
      data: seminars,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching seminars",
      error: error.message,
    });
  }
};


export const getSeminarById = (req, res) => {
    Seminar.findById(req.params.id)
        .then((seminar) => {
            if (!seminar) {
                return res.status(404).json({
                    success: false,
                    message: "Seminar not found",
                });
            }

            res.status(200).json({
                success: true,
                data: seminar,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error fetching seminar",
                error: error.message,
            });
        });
}


export const updateSeminar = async (req, res) => {
    Seminar.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .then((seminar) => {
            if (!seminar) {
                return res.status(404).json({
                    success: false,
                    message: "Seminar not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Seminar updated successfully",
                data: seminar,
            });
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                message: "Error updating seminar",
                error: error.message,
            });
        });
}

export const deleteSeminar = (req, res) => {
    Seminar.findByIdAndDelete(req.params.id)
        .then((seminar) => {
            if (!seminar) {
                return res.status(404).json({
                    success: false,
                    message: "Seminar not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Seminar deleted successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error deleting seminar",
                error: error.message,
            });
        });
}


export const approveSeminar = async (req, res) => {
    Seminar.findByIdAndUpdate(
        req.params.id,
        { status: "Approved" },
        { new: true }
    )
        .then((seminar) => {
            if (!seminar) {
                return res.status(404).json({
                    success: false,
                    message: "Seminar not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Seminar approved successfully",
                data: seminar,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Seminar approval failed",
                error: error.message,
            });
        });
}

