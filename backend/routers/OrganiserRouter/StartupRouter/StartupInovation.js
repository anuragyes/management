import express from "express";
import { approveStartup, createStartupEvent, getAllStartupEvents, getStartupEventById, updateEventStatus } from "../../../controllers/OrganzitionControllers/Startupinovationcontrollers/startupinovaction.js";

const startuprouter = express.Router();


startuprouter.post("/createstartup", createStartupEvent);
startuprouter.get("/getAllIdeas", getAllStartupEvents);
startuprouter.get("/getIdeasbyid/:id", getStartupEventById);
startuprouter.patch("/eventstartup/:id/status", updateEventStatus);
startuprouter.patch("/approved/:id" , approveStartup)

export default startuprouter 
