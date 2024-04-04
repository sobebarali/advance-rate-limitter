import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  requestLimits: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
  },
  concurrency: {
    max: 10,
  },
};

export default config;
