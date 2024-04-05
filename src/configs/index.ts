import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  PROD_CORS_ORIGIN: process.env.PROD_CORS_ORIGIN || "",
  requestLimits: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
  },
  concurrency: {
    max: 10,
  },
  dynamodb: {
    region: process.env.AWS_REGION || "",
    tableName: process.env.TABLE_NAME || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

export default config;
