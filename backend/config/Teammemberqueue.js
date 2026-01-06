import { Queue } from "bullmq";
import redis from "./redis.js";



const organiserQueue = new Queue("organiser-queue", {
  connection: redis
});

export default organiserQueue;
