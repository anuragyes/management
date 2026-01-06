import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema(
  {
    // 1. Basic Hackathon Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    hackathonType: {
      type: String,
      enum: [
        "24-Hour Hackathon",
        "48-Hour Hackathon",
        "Problem Solving Challenge"
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    theme: {
      type: String, // AI, FinTech, HealthTech
    },

    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      required: true,
    },

    // 2. Date & Time
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: String, // 24 Hours / 48 Hours
      required: true,
    },

    // 3. Venue / Platform
    venue: {
      collegeName: String,
      hallName: String,
      roomNumber: String,
    },

    onlinePlatform: String,

    // 4. Team Rules
    teamSize: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 4,
      },
    },

    allowedBranches: {
      type: [String],
      default: ["All"],
    },

    allowedYears: {
      type: [String], // 1st / 2nd / 3rd / 4th
    },

    // 5. Registration Details
    registrationStartDate: Date,
    registrationEndDate: Date,

    registrationFee: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },

    feeAmount: {
      type: Number,
      default: 0,
    },

    totalTeams: Number,

    // 6. Evaluation & Rules
    judgingCriteria: {
      type: [String], // Innovation, Code Quality
    },

    rules: {
      type: [String],
    },

    problemStatements: {
      type: [String], // Optional
    },

    // 7. Rewards
    prizes: {
      firstPrize: String,
      secondPrize: String,
      thirdPrize: String,
    },

    certificateProvided: {
      type: Boolean,
      default: true,
    },

    // 8. Organizer Info
    organizer: {
      name: String,
      department: String,
      phone: String,
      email: String,
    },

    // 9. Status
    status: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);



  export default mongoose.model("Hackathon", hackathonSchema);
