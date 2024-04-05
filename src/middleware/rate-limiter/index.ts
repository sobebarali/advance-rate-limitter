import rateLimit from "express-rate-limit";

import config from "../../configs";

const rateLimiter = rateLimit({
  windowMs: config.requestLimits.windowMs,
  max: config.requestLimits.max,
  message: "Too many requests from this IP, please try again later",
});

export {  rateLimiter };
