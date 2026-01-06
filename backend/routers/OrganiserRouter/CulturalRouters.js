import express from 'express';
import { createCulturalFest, deleteCulturalFest, getAllCulturalEvents, getCulturalFestById, handDeleteCuturalFest, updateCulturalFest } from '../../controllers/OrganzitionControllers/CulturalEvents.js';


const CulturalRouter = express.Router();

CulturalRouter.post("/createEvent", createCulturalFest
)
CulturalRouter.get("/GetCuturalEvent", getAllCulturalEvents)
CulturalRouter.get("/getCuturalById/:id" , getCulturalFestById)
CulturalRouter.put("/UpdateEvent/:id", updateCulturalFest);
CulturalRouter.delete("/deleteEvent/:id", deleteCulturalFest);
CulturalRouter.delete("/hardcoredelete/:id", handDeleteCuturalFest);


export default CulturalRouter;