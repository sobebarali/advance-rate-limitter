import { Request, Response, NextFunction } from "express";
import { createClient, RedisClientType } from "redis";
import config from "../../configs";

const MAX_CONCURRENT_REQUESTS = config.concurrency.max; // 10
const RESET_INTERVAL = config.requestLimits.windowMs / 1000; // convert to seconds

let redisClient: RedisClientType;

const initRedisClient = async () => {
  redisClient = createClient();

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redisClient.connect();
};

initRedisClient();

const concurrentRequestLimiter = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `concurrent_requests:${ip}`;

    try {
      const currentRequests = await redisClient.incr(key);

      if (currentRequests === 1) {
        await redisClient.expire(key, RESET_INTERVAL);
      }

      if (currentRequests > MAX_CONCURRENT_REQUESTS) {
        await redisClient.decr(key);
        return res
          .status(429)
          .send(
            `Your IP has exceeded the ${MAX_CONCURRENT_REQUESTS} request limit per ${RESET_INTERVAL} seconds(s). Try again in ${RESET_INTERVAL} seconds(s).`
          );
      }

      res.on("finish", async () => {
        await redisClient.decr(key);
      });

      next();
    } catch (err) {
      console.error("Redis error:", err);
      res.status(500).send("Internal Server Error");
    }
  };
};

export default concurrentRequestLimiter;
