import express from "express"
import { approveSeminar, createSeminar, deleteSeminar, getAllSeminars, getSeminarById, updateSeminar } from "../../controllers/OrganzitionControllers/Seminar.js";
const Seminarrouter = express.Router()


// Public (Students)
Seminarrouter.get("/getseminar", getAllSeminars);
Seminarrouter.get("/getseminarid/:id", getSeminarById);

// Admin / Organizer
Seminarrouter.post("/createseminar", createSeminar);
Seminarrouter.put("/updateseminar/:id", updateSeminar);
Seminarrouter.delete("/deleteseminar/:id", deleteSeminar);
Seminarrouter.patch("/approveseminar/:id", approveSeminar);

 export default  Seminarrouter;
