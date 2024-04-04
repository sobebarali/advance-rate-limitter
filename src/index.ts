import compression from "compression";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import config from "./configs";
import { ipLimiter, rateLimiter } from "./middleware/rateLimiter";


const app: Application = express();
const port = config.PORT;

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());

// Rate limiting middleware setup
app.use(ipLimiter);
app.use(rateLimiter);



// api routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

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
