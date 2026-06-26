import express from "express";
import {
  getUsersAnalytics,
  getCoursesAnalytics,
  getOrdersAnalytics,
} from "../controllers/analytics.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authorizeRoles } from "../controllers/user.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics,
);
analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics,
);
analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersAnalytics,
);

export default analyticsRouter;
