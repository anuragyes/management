import express from 'express'

import dotenv from 'dotenv';
import Razorpay from 'razorpay'

dotenv.config()     // helps to get data from .env file 



console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "LOADED" : "MISSING");


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
export default razorpay;