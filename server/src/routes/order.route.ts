import express from "express";
const OrderRouter = express.Router();
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

OrderRouter.post("/create-order", isAuthenticated, createOrder);
OrderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders,
);

OrderRouter.get(
  "/payment/stripepublishablekey",
  isAuthenticated,
  sendStripePublishableKey,
);

OrderRouter.post("/payment", isAuthenticated, newPayment);

export default OrderRouter;
