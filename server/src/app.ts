import "dotenv/config";
import express, { NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "../src/middleware/error.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import OrderRouter from "./routes/order.route.js";
import NotificationRouter from "./routes/notification.route.js";
import layoutRouter from "./routes/layout.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import ErrorHandler from "./utils/ErrorHandler.js";
import { rateLimit } from "express-rate-limit";

// Define app instance locally
const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: "50mb" }));

// Routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  OrderRouter,
  NotificationRouter,
  analyticsRouter,
  layoutRouter,
);

// Root route handler (Prevents 404 on base URL)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "LMS Backend API is running!" });
});

// Testing API
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working!" });
});

// Unknown route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});

app.use(limiter);

app.use(ErrorMiddleware);

// Named export to keep compatibility with servers/sockets importing { app }
export { app };

// Default export for Vercel's Serverless handler
export default app;