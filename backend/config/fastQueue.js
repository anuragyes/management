import { Queue } from "bullmq";

const festQueue = new Queue("festQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});

export default festQueue;
