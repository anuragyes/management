import mongoose from "mongoose"
const performanceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Dance", "Singing", "Drama", "Fashion Show"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    participants: [
      {
        name: String,
        email: String,
        phone: String
      }
    ],
    durationMinutes: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const culturalFestSchema = new mongoose.Schema(
  {
    festName: {
      type: String,
      required: true
    },
    collegeName: {
      type: String,
      required: true
    },
    festDate: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    coordinator: {
      name: String,
      phone: String,
      email: String
    },
    // performances: [performanceSchema],
     status: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CulturalFest", culturalFestSchema);
