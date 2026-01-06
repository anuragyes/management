import express from 'express'
import { getHackathonById,getAllHackathons, createHackathon, updateHackathon, deleteHackathon, approveHackathon } from '../../controllers/OrganzitionControllers/Hackathoncontroller.js';



const HackathonRouter = express.Router();


// Students
HackathonRouter.get("/getallhackthon", getAllHackathons);
HackathonRouter.get("/gethanckthonbyId/:id", getHackathonById);

// Admin / Organizer
HackathonRouter.post("/createhackathon", createHackathon);
HackathonRouter.put("/updateHackathon/:id", updateHackathon);
HackathonRouter.delete("/deletehackathon/:id", deleteHackathon);
HackathonRouter.patch("/:id/hackathon/approve", approveHackathon);

export default HackathonRouter
