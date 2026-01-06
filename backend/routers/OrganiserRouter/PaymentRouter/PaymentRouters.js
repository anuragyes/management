import express from "express";
import mongoose from "mongoose"
import { HistoryRecipt, payment_verification, RazorpayPayment } from "../../../controllers/Payment/Payment.js";





const Razorpayrouter = express.Router();

Razorpayrouter.post("/create-order/:userId", RazorpayPayment);
Razorpayrouter.post("/verify-payment", payment_verification);
Razorpayrouter.get("/historypayment/:userId" , HistoryRecipt
);
export default Razorpayrouter