import express from "express";
const OrderRouter = express.Router();
import { createOrder } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

OrderRouter.post("/create-order", isAuthenticated, createOrder);

export default OrderRouter;
