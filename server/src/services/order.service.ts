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
