import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis.js";

// Helper function to define cookie options (match this with your user.controller.js options)
const accessTokenOptions = {
  expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  maxAge: 5 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

// Authenticated User Middleware
export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.cookies.access_token;

    // 1. If no access token, try to recover using the refresh token automatically
    if (!accessToken) {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(
          new ErrorHandler("Access token not found. Please log in.", 401),
        );
      }

      // Try to silently renew tokens before failing
      try {
        accessToken = await handleTokenRefresh(req, res);
      } catch (err: any) {
        return next(new ErrorHandler(err.message || "Session expired.", 401));
      }
    }

    try {
      // 2. Attempt to verify the access token
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN || "",
      ) as JwtPayload;

      if (!decoded) {
        return next(
          new ErrorHandler("Invalid access token. Please log in again.", 401),
        );
      }

      // 3. Retrieve user from Redis cache
      let user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("User session not found. Please log in again.", 404),
        );
      }

      req.user = JSON.parse(user);
      return next();
    } catch (error: any) {
      // 4. Handle token expiration automatically
      if (error.name === "TokenExpiredError") {
        try {
          // Silently refresh the token, update cookies, and get the new access token string
          const newAccessToken = await handleTokenRefresh(req, res);

          // Re-decode the brand new token to get the user ID
          const decoded = jwt.verify(
            newAccessToken,
            process.env.ACCESS_TOKEN || "",
          ) as JwtPayload;
          const user = await redis.get(decoded.id);

          if (!user) {
            return next(new ErrorHandler("User session not found.", 404));
          }

          req.user = JSON.parse(user);
          return next(); // Seamless pass-through to controller!
        } catch (refreshError: any) {
          return next(
            new ErrorHandler(refreshError.message || "Session expired.", 401),
          );
        }
      }

      return next(new ErrorHandler("Invalid access token.", 401));
    }
  },
);

/**
 * Helper function to handle the internal token regeneration logic safely
 */
const handleTokenRefresh = async (
  req: Request,
  res: Response,
): Promise<string> => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new ErrorHandler("Session expired. Please login again.", 401);
  }

  // Verify the refresh token
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN || "",
  ) as JwtPayload;

  if (!decoded) {
    throw new ErrorHandler("Invalid refresh token. Please login again.", 401);
  }

  // Validate session exists in Redis
  const session = await redis.get(decoded.id);
  if (!session) {
    throw new ErrorHandler("User session not found. Please login again.", 401);
  }

  // Generate a brand new access token
  const newAccessToken = jwt.sign(
    { id: decoded.id },
    process.env.ACCESS_TOKEN || "",
    { expiresIn: "5m" },
  );

  // Send the new cookie out in the response header
  res.cookie("access_token", newAccessToken, accessTokenOptions);

  return newAccessToken;
};

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
