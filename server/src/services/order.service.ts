import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/order.model.js";

// create order
export const NewOrder = CatchAsyncErrors(
  async (data: any, next: NextFunction, res: Response) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  },
);

// get all orders (admin only)
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders,
  });
};
