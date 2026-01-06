import express from "express"
import { approveWorkshop, createWorkshop, deleteWorkshop, getAllWorkshops, getWorkshopById, updateWorkshop } from "../../controllers/OrganzitionControllers/WorkShopEvent.js";
const RouterWorkShop = express.Router();



RouterWorkShop.post("/createworkshop", createWorkshop);
RouterWorkShop.get("/getworkshop", getAllWorkshops);
RouterWorkShop.get("/workshop/:id", getWorkshopById);
RouterWorkShop.put("/updateworkshop/:id", updateWorkshop);
RouterWorkShop.delete("/deleteworkshop/:id", deleteWorkshop);
RouterWorkShop.patch("/approve/:id/approve",approveWorkshop);
  

 export default RouterWorkShop
