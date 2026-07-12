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
import { NewOrder, getAllOrdersService } from "../services/order.service.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import { redis } from "../utils/redis.js";
import { fileURLToPath } from "url";

// 2. Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// create order
export const createOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;
      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id as string;
          const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);
          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not successful", 400));
          }
        }
      }
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
            template: "order-confirmation",
            data: mailData,
          });
        }
      } catch (error: any) {
        console.error("SEND MAIL ERROR:");
        console.error(error);

        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push({
        courseId: course._id.toString(),
      });

      await redis.set(req.user?._id.toString() ?? "", JSON.stringify(user));

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

// get all orders (admin only)
export const getAllOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// NEW PAYMENT
export const newPayment = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      // 1. Validation check for the integer amount
      if (!amount || isNaN(Number(amount))) {
        return next(
          new ErrorHandler(
            "Please provide a valid numeric amount in cents",
            400,
          ),
        );
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: Math.round(Number(amount)),
        currency: "USD",
        metadata: {
          company: "LMS",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
