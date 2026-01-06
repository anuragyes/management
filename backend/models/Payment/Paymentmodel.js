import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Razorpay order id
    orderId: {
      type: String,
      required: true
    },

    // Razorpay payment id
    paymentId: {
      type: String
    },

    // Razorpay signature
    signature: {
      type: String
    },

    // Amount in paise
    amount: {
      type: Number,
      required: true
    },

    // Event details (snapshot at payment time)
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      // required: true
    },

   

    sportName: {
      type: String,
   
    },

    category: {
      type: String,
   
    },

    eventType: {
      type: String,
      enum: ["Solo", "Team"],
     
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
    
    },

    registrationFee: {
      type: Number,
  
    },

    // User who paid
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Payment status
    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
