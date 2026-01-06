import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,          // 🔥 DB-level protection
      lowercase: true,
      index: true,           // 🔥 Fast lookup for 1M+ users
    },

    password: {
      type: String,
      required: true,
      select: false,         // 🔒 Never return password
    },

    role: {
      type: String,
      default: "ORGANIZER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
