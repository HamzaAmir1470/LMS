import express from "express";
const OrderRouter = express.Router();
import { createOrder, getAllOrders } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authorizeRoles } from "../controllers/user.controller.js";

OrderRouter.post("/create-order", isAuthenticated, createOrder);
OrderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders,
);

export default OrderRouter;
