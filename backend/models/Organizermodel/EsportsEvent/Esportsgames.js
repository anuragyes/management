import mongoose from "mongoose";

/**
 * Main Sports Event Schema
 */
const sportsEventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["Indoor Sports", "Outdoor Sports", "E-Sports"],
      required: true
    },

    sportName: {
      type: String,
      enum: [
        "Chess",
        "Carrom",
        "Table Tennis",
        "Cricket",
        "Football",
        "Volleyball",
        "Kabaddi",
        "BGMI",
        "Valorant",
        "FIFA"
      ],
      required: true
    },

    eventType: {
      type: String,
      enum: ["Solo", "Team"],
      required: true
    },

    maxParticipants: {
      type: Number,
      required: true
    },

    // ✅ Registration Fee
    registrationFee: {
      type: Number,
      required: true,
      min: 0
    },

    matchRules: String,

    venue: {
      type: String,
      required: true
    },

    eventDate: {
      type: Date,
      required: true
    },

    registrationDeadline: {
      type: Date,
      required: true
    },

    coordinator: {
      name: String,
      phone: String
    },

    status: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SportsEvent", sportsEventSchema);
