import express from "express";
import {
  activateUser,
  authorizeRoles,
  deleteUser,
  getAllUsers,
  getUserInfo,
  LoginUser,
  logoutUser,
  registerationUser,
  socialAuth,
  updateAccessToken,
  updateProfilePicture,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
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

userRouter.put("/update-user", isAuthenticated, updateUserInfo);

userRouter.put("/update-password", isAuthenticated, updateUserPassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers,
);
userRouter.put(
  "/update-user",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole,
);
userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser,
);

export default userRouter;
