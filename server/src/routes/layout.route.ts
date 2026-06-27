import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";
import { createLayout } from "../controllers/layout.controller.js";
const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout,
);


export default layoutRouter;