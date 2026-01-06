import mongoose from 'mongoose'

const startupEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },

    category: {
      type: String,
      enum: [
        "Startup Pitch Event",
        "Business Plan Competition",
        "Innovation Challenge",
        "Idea Hackathon"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    organizer: {
      type: String, // College / Organization name
      required: true
    },

    eventMode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline"
    },

    teamSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 5 }
    },

    registrationDeadline: {
      type: Date,
      required: true,
      index: true
    },

    eventDate: {
      start: Date,
      end: Date
    },

    prizes: [
      {
        position: String,
        reward: String
      }
    ],

    status: {
      type: String,
      enum: ["Draft", "Open", "Closed", "Completed"],
      default: "Draft",
      index: true
    },

    totalRegistrations: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("StartupEvent", startupEventSchema);
