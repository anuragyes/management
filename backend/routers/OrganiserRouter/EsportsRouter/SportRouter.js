 import express from 'express';
import { approveSportEvent, createSportsEvent, deleteSportsEvent, getAllSportsEvents, getSportsEventById, updateSportsEvent } from '../../../controllers/OrganzitionControllers/SportsEvent/ESportsEvent.js';

  const SportRouter = express.Router();


SportRouter.post("/createsport", createSportsEvent);
SportRouter.get("/getAllsports", getAllSportsEvents);
SportRouter.get("/getSportByEventid/:id", getSportsEventById);
SportRouter.put("/updateEvenet/:id", updateSportsEvent);
SportRouter.delete("/deletesportEvent/:id", deleteSportsEvent);
SportRouter.patch("/approve/:id",approveSportEvent);
export default SportRouter
