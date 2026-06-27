import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis.js";

// Authenticated User
export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return next(
        new ErrorHandler("Access token not found. Please log in.", 401),
      );
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN || "",
    ) as JwtPayload;

    if (!decoded) {
      return next(
        new ErrorHandler("Invalid access token. Please log in again.", 401),
      );
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler("User not found. Please log in again.", 404),
      );
    }

    req.user = JSON.parse(user);

    next();
  },
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return next(
        new ErrorHandler(
          `role: ${req.user?.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
