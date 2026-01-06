import jwt from "jsonwebtoken";
import Student from "../../models/Studentmodels/Studendmodel.js";
import bcrypt from "bcryptjs";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "SECRET_KEY_123", {
    expiresIn: "7d",
  });
};

// -------- REGISTER STUDENT --------
export const registerStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, password } = req.body;

    if (!name || !email || !rollNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // Check if user exists
    const existing = await Student.findOne({
      $or: [{ email }, { rollNumber: rollNumber.toUpperCase() }],
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email or Roll Number already exists",
      });
    }

    // Hash password manually (since you don't want it in model)
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      rollNumber: rollNumber.toUpperCase(),
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token, //  send token to frontend
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        role: student.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// -------- LOGIN STUDENT --------
export const loginStudent = async (req, res) => {
  try {
    const { email, rollNumber, password } = req.body;

    if (!password || (!email && !rollNumber)) {
      return res.status(400).json({
        success: false,
        message: "Email/RollNumber and password required",
      });
    }

    let student;
    if (email) {
      student = await Student.findOne({ email }).select("+password");
    } else {
      student = await Student.findOne({
        rollNumber: rollNumber.toUpperCase(),
      }).select("+password");
    }

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    if (student.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // ✅ send token
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        role: student.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

