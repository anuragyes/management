import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    rollNumber: {
      type: String,
      required: true,
      uppercase: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    phone: String,
    college: String,
    branch: String,
    semester: Number,
    role: { type: String, default: "student" },
    status: { type: String, default: "active" }
  },
  { timestamps: true }
);


export default mongoose.model("Student", studentSchema);
