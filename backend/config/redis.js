import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;




//   data flow 
/*  Browser / Frontend
        |
   http://localhost:5000
        |
   Node.js (Express)
        |
   Redis (6379)  ← internal
        |
   MongoDB */
