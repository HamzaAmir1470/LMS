import NotificationModel from "../models/notification.model.js";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// get all notifications only for admin
export const getNotifications = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// update notification  --admin
export const updateNotification = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification.status;
      }

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        message: "Notification status updated successfully",
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 404));
    }
  },
);
