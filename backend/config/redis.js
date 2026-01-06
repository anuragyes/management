import  Redis from "ioredis"

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
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