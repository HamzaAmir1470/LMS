import express from "express";
import {
  activateUser,
  getUserInfo,
  LoginUser,
  logoutUser,
  registerationUser,
  socialAuth,
  updateAccessToken,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/registeration", registerationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login-user", LoginUser);

userRouter.get("/logout-user", isAuthenticated, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);
  
export default userRouter;
