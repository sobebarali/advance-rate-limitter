import rateLimit from "express-rate-limit";

import config from "../configs";
import ipLimiting from "./helper/ipLimiting";

const rateLimiter = rateLimit({
  windowMs: config.requestLimits.windowMs,
  max: config.requestLimits.max,
  message: "Too many requests from this IP, please try again later",
});

const ipLimiter = ipLimiting({
  limit: config.concurrency.max,
  resetInterval: config.requestLimits.windowMs,
});

export { rateLimiter, ipLimiter };
