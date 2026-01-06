



import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { connectDB } from "./config/db.js";
import LoginRouter from "./routers/Studentroute/LoginRouter.js";
import RouterWorkShop from "./routers/OrganiserRouter/WorkshopRouter.js";
import Seminarrouter from "./routers/OrganiserRouter/SeminarRouter.js";
import HackathonRouter from "./routers/OrganiserRouter/HackathonRouter.js";
import CulturalRouter from "./routers/OrganiserRouter/CulturalRouters.js";
import SportRouter from "./routers/OrganiserRouter/EsportsRouter/SportRouter.js";
import startuprouter from "./routers/OrganiserRouter/StartupRouter/StartupInovation.js";
import TeamRouter from "./routers/OrganiserRouter/Teammember.js";
import Razorpayrouter from "./routers/OrganiserRouter/PaymentRouter/PaymentRouters.js";
import Registerrouter from "./routers/Studentroute/LoginRouter.js";


const port = 5000;
const app = express();

/* ---------- MIDDLEWARES ---------- */
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // or 5173 (Vite)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

/* ---------- DATABASE ---------- */
connectDB();



app.use(express.urlencoded({ extended: true }));
/* ---------- ROUTES ---------- */
app.use("/api/Auth/student",Registerrouter);
app.use("/api/management/user", LoginRouter);
app.use("/api/workshope/event", RouterWorkShop);
app.use("/api/event/seminar", Seminarrouter);
app.use("/api/event/hackathon", HackathonRouter);
app.use("/api/event/CuturalEvent", CulturalRouter);
app.use("/api/Event/ESports", SportRouter);
app.use("/api/startup/event", startuprouter);
app.use("/api/teammember" ,  TeamRouter);
app.use("/api/account/razorpay" , Razorpayrouter);

app.get("/", (req, res) => {
    res.send("hello world!");
});

/* ---------- SERVER ---------- */
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
