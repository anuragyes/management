import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    // 1. Basic Workshop Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Web Development",
        "AI / ML",
        "Cyber Security",
        "Cloud Computing",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
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

    timing: {
      type: String, // e.g. "10:00 AM - 4:00 PM"
      required: true,
    },

    duration: {
      type: String, // e.g. "2 Days"
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

    // 4. Speaker / Trainer
    trainer: {
      name: String,
      designation: String,
      organization: String,
      experience: Number, // in years
      profileLink: String,
    },

    // 5. Workshop Content
    topicsCovered: {
      type: [String],
      required: true,
    },

    toolsUsed: {
      type: [String], // React, Python, AWS, etc.
    },

    isHandsOn: {
      type: Boolean,
      default: true,
    },

    prerequisites: {
      type: [String], // Laptop, Basic Coding
    },

    // 6. Registration Details
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

    paymentMode: {
      type: String, // UPI / Cash / Online
    },

    totalSeats: {
      type: Number,
    },

    // 7. Eligibility
    eligibleBranches: {
      type: [String], // CSE, IT, ECE
      default: ["All"],
    },

    eligibleYears: {
      type: [String], // 1st, 2nd, 3rd, 4th
    },

    // 8. Certificate & Benefits
    certificateProvided: {
      type: Boolean,
      default: true,
    },

    certificateType: {
      type: String,
      enum: ["Participation", "Completion"],
    },

    benefits: {
      type: [String], // Resume boost, Internship guidance
    },

    // 9. Organizer Info
    organizer: {
      name: String,
      department: String,
      phone: String,
      email: String,
      whatsappGroupLink: String,
    },

    // 10. Extra
    posterImage: String,

    status: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", workshopSchema);
