import express from "express";
import { editCourse, uploadCourse } from "../controllers/course.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authorizeRoles } from "../controllers/user.controller.js";
const courseRouter = express.Router();

courseRouter.post(
  "/upload",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse,
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse,
);

export default courseRouter;
