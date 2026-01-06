import redis from "./redis.js"

export  const  RateLimit = async (req, res, next) => {
  const key = `rate_limit:event:${req.ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 1 minute
  }

  if (count > 100) {
    return res.status(429).json({
      success: false,
      message: "Too many requests"
    });
  }

  next();
};
