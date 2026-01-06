// routes/authRoutes.js
import express from "express";
import { loginStudent, logout, registerStudent } from "../../controllers/StudentControllers/LoginUser.js";
import { isAuth } from "../../middleware/IsAuth.js";
// import getToken from "../../config/Auth.js"

const Registerrouter = express.Router();

// POST /api/auth/register
Registerrouter.post("/register", registerStudent);

// POST /api/auth/login
Registerrouter.post("/login", loginStudent);

Registerrouter.post("/logout", isAuth, logout);

export default Registerrouter;