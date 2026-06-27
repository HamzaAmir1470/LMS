import express from "express";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";
import { authorizeRoles } from "../middleware/auth.js";
import { isAuthenticated } from "../middleware/auth.js";

const NotificationRouter = express.Router();

NotificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications,
);
NotificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification,
);

export default NotificationRouter;
