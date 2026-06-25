import express from "express";
import {
  activateUser,
  LoginUser,
  registerationUser,
} from "../controllers/user.controller.js";
import { logoutUser } from "../utils/jwt.js";

const userRouter = express.Router();

userRouter.post("/registeration", registerationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", LoginUser);
userRouter.post("/logout-user", logoutUser);

export default userRouter;
