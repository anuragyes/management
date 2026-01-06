import mongoose  from 'mongoose';
import express from "express"
import { createTeamOrganiser, getAllTeamMembers } from '../../controllers/OrganzitionControllers/OrganizerTeam.js';
 const TeamRouter = express.Router();



   TeamRouter.post("/createTeam" , createTeamOrganiser);
   TeamRouter.get("/getAllTeammember" , getAllTeamMembers);

   export default TeamRouter;