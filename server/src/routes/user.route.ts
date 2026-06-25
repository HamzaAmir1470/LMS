import express from "express";
import {
  activateUser,
  LoginUser,
  registerationUser,
} from "../controllers/user.controller.js";
import { logoutUser } from "../utils/jwt.js";
import { isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/registeration", registerationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", LoginUser);
userRouter.post("/logout-user", isAuthenticated, logoutUser);

export default userRouter;
