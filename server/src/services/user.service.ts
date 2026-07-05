import { type Request, type Response, type NextFunction } from "express";
import { redis } from "../utils/redis.js";
import userModel from "../models/user.model.js";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({
      success: true,
      user,
    });
  }
};

// get all users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

export const updateUserRoleService = async (
  email: string,
  role: string,
  res: Response,
) => {
  const user = await userModel.findOneAndUpdate(
    { email },
    { role },
    {
      returnDocument: "after",
    }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
};