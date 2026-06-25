import express from "express";
import { registerationUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/registeration", registerationUser);

export default userRouter;
