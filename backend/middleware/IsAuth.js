import jwt from "jsonwebtoken";
import Student from "../models/Studentmodels/Studendmodel.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY_123"
    );

    // 4️⃣ Find student
    const student = await Student.findById(decoded.id).select("-password");

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
