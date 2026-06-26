import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { generateLast12MonthsData } from "../utils/analytics.generator.js";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import OrderModel from "../models/order.model.js";

// get users analytics
export const getUsersAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get courses analytics
export const getCoursesAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel);
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get orders analytics
export const getOrdersAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
