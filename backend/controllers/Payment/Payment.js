import express from "express"

import mongoose from "mongoose";
import razorpay from "../../config/Payment.js";
import Paymentmodel from "../../models/Payment/Paymentmodel.js";
import  crypto from "crypto";



export const RazorpayPayment = async (req, res) => {
    try {

        const {
            amount,      // already in paise
        } = req.body;

        console.log("this is -------------------------------------------------------------", req.body)


        let { userId } = req.params;
        userId = userId.replace(/"/g, "").trim();


        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount, planId are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId"
            });
        }


        //  order placed 
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        });


        await Paymentmodel.create({
            orderId: order.id,
            amount: amount,
            userId,
            status: "created"
        });


        res.status(200).json({
            success: true,
            order
        });


    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}





export const HistoryRecipt = async (req, res) => {
    try {
        const { userId } = req.params;
        //  console.log("this is userid--------------------------------------" , userId)

        const transactions = await Paymentmodel.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({

            success: true,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}







export const payment_verification = async (req, res) => {
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  try {
    console.log("Payment verification endpoint hit");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details"
      });
    }

    // Create signature string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Signature mismatch
    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // ✅ Signature valid → update existing payment
    const payment = await Paymentmodel.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success"
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found"
      });
    }

    console.log("Payment verified & updated:", payment._id);

    return res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: payment._id
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: error.message
    });
  }
};