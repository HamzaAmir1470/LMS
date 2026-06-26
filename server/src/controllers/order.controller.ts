import { Request, NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order, { IOrder } from "../models/order.model.js";
import UserModel, { IUser } from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail.js";
import NotificationModel from "../models/notification.model.js";
import { NewOrder } from "../services/order.service.js";

// create order
export const createOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;
      const user = await UserModel.findById(req.user?._id);

      const courseExistsInUser = user?.courses.some(
        (course) => course.courseId === courseId,
      );

      if (courseExistsInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 404),
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData },
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error) {
        return next(
          new ErrorHandler("Failed to send order confirmation email", 500),
        );
      }

      user?.courses.push({
        courseId: course._id.toString(),
      });
      await user?.save();

      await NotificationModel.create({
        userId: user!._id.toString(),
        title: "New Order Created",
        message: `You have a new order for the course: ${course.name}`,
      });

      course.purchased ? (course.purchased += 1) : course.purchased;

      await course.save();

      NewOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
