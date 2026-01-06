import  mongoose from "mongoose";

const seminarSchema = new mongoose.Schema(
  {
    // 1. Basic Seminar Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    seminarType: {
      type: String,
      enum: [
        "Industry Expert",
        "Startup Founder",
        "Alumni Talk"
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      required: true,
    },

    // 2. Date & Time
    date: {
      type: Date,
      required: true,
    },

    timing: {
      type: String, // "11:00 AM - 1:00 PM"
      required: true,
    },

    duration: {
      type: String, // "2 Hours"
    },

    // 3. Venue / Platform
    venue: {
      collegeName: String,
      hallName: String,
      roomNumber: String,
    },

    onlinePlatform: {
      type: String, // Zoom / Google Meet
    },

    // 4. Speaker Details
    speaker: {
      name: {
        type: String,
        required: true,
      },
      designation: String,
      organization: String, // Company / Startup
      experience: Number, // in years
      alumniBatch: String, // only for alumni
      linkedinProfile: String,
    },

    // 5. Audience / Eligibility
    eligibleBranches: {
      type: [String],
      default: ["All"],
    },

    eligibleYears: {
      type: [String], // 1st / 2nd / 3rd / 4th
    },

    // 6. Registration Details
    registrationRequired: {
      type: Boolean,
      default: true,
    },

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

    totalSeats: Number,

    // 7. Certificate & Benefits
    certificateProvided: {
      type: Boolean,
      default: false,
    },

    certificateType: {
      type: String,
      enum: ["Participation", "Attendance"],
    },

    keyTakeaways: {
      type: [String], // Career guidance, Industry insights
    },

    // 8. Organizer Details
    organizer: {
      name: String,
      department: String,
      phone: String,
      email: String,
    },

    // 9. Media & Status
    posterImage: String,

    status: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seminar", seminarSchema);
