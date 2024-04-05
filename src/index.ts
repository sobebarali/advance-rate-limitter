import compression from "compression";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import config from "./configs";
import { rateLimiter } from "./middleware/rate-limiter";
import configurationRouter from "./modules/configuration/routes/configuration.routes";
import concurrentRequestLimiter from "./middleware/concurrecy";

const app: Application = express();
const port = config.PORT;

const env = config.NODE_ENV;
const isDevelopment = !env || env === "development";
const prodCorsOrigin = config.PROD_CORS_ORIGIN;

if (process.env.NODE_ENV !== "test") {
  if (isDevelopment) {
    console.warn("Running in development mode - allowing CORS for all origins");
    app.use(
      cors({
        origin: "http://localhost:3000",
        allowedHeaders: ["content-type"],
        methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true,
      })
    );
  } else if (prodCorsOrigin) {
    console.log(
      `Running in production mode - allowing CORS for domain: ${prodCorsOrigin}`
    );
    const corsOptions = {
      origin: prodCorsOrigin, // Restrict to production domain
      allowedHeaders: ["content-type"],
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    };
    app.use(cors(corsOptions));
  } else {
    console.warn("Production CORS origin not set, defaulting to no CORS.");
  }
}

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

// Rate limiting middleware setup
app.use(concurrentRequestLimiter());
app.use(rateLimiter);

// api routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api", configurationRouter);

// Handle undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send({
    data: null,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource does not exist",
    },
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
