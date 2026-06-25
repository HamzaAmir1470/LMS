import { type Request, type Response, type NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// get user by id
export const getUserById = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await userModel.findById(id).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);
