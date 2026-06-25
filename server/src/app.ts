import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "../src/middleware/error.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
export const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN?.split(","),
  }),
);
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/v1", userRouter);

app.use("/api/v1/course", courseRouter);

// Testing API
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working!" });
});

// Unknown route handler
app.use((req: Request, res: Response) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  res.status(error.statusCode).json({ message: error.message });
});

app.use(ErrorMiddleware);
