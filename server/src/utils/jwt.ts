import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { IUser } from "../models/user.model.js";
import { redis } from "./redis.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "./ErrorHandler.js";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const accessTokenExpire = Number(process.env.ACCESS_TOKEN_EXPIRE) || 300;
const refreshTokenExpire = Number(process.env.REFRESH_TOKEN_EXPIRE) || 1200;

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  redis.set(user._id.toString(), JSON.stringify(user));

  const isProduction = process.env.NODE_ENV === "production";

  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

// Logout user by clearing the cookies
export const logoutUser = CatchAsyncErrors(
  async (req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const userId = req.user?._id?.toString() || "";
    if (userId) {
      await redis.del(userId);
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
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
