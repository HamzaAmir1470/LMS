import { type Request, type Response, type NextFunction } from "express";
import userModel, { IUser } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import jwt, { JwtPayload, type Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendMail.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { getUserById, getAllUsersService } from "../services/user.service.js";
import cloudinary from "cloudinary";

interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerationUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: any = await userModel.create({
        name,
        email,
        password,
      });

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data,
      );

      try {
        await sendEmail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: "Activation email sent successfully!",
        });
      } catch (error) {
        return next(new ErrorHandler("Failed to send activation email", 500));
      }

      res.status(201).json({
        success: true,
        user,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    },
  );
  return { token, activationCode };
};

// activate USer
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as Secret,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Login User
interface ILoginRequest {
  email: string;
  password: string;
}

export const LoginUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: ILoginRequest = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res as any);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Logout user by clearing the cookies
export const logoutUser = CatchAsyncErrors(
  async (req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const userId = req.user?._id?.toString() || "";
    if (userId) {
      await redis.del(userId);
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return next(
        new ErrorHandler(
          `role: ${req.user?.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};

// update access token
export const updateAccessToken = CatchAsyncErrors(
  async (req: Request, res: Response, next: Function) => {
    try {
      const refresh_Token = req.cookies.refresh_token;
      const decoded = jwt.verify(
        refresh_Token,
        (process.env.REFRESH_TOKEN as string) || "",
      ) as JwtPayload;

      if (!decoded) {
        return next(
          new ErrorHandler("Invalid refresh token. Please log in again.", 401),
        );
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("User not found. Please log in again.", 404),
        );
      }

      const user = JSON.parse(session) as IUser;

      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        (process.env.ACCESS_TOKEN as string) || "",
        {
          expiresIn: 5 * 60, // 5 minutes
        },
      );

      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        (process.env.REFRESH_TOKEN as string) || "",
        {
          expiresIn: 3 * 24 * 60 * 60, // 3 days
        },
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to update access token", 500));
    }
  },
);

// get user info
export const getUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id?.toString() || "";
      return getUserById(userId, res);
    } catch (error) {
      return next(new ErrorHandler("Failed to get user info", 500));
    }
  },
);

// social auths
interface ISocialAuthRequest {
  name: string;
  email: string;
  avatar: string;
}

export const socialAuth = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthRequest;
      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({
          name,
          email,
          avatar: {
            public_id: "",
            url: avatar,
          },
        });
        sendToken(newUser, 200, res as any);
      } else {
        sendToken(user, 200, res as any);
      }
    } catch (error) {
      return next(new ErrorHandler("Failed to authenticate user", 500));
    }
  },
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export const updateUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id?.toString() || "";

      const user = await userModel.findById(userId);

      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist && isEmailExist._id.toString() !== userId) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to update user info", 500));
    }
  },
);

// update user password
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
      const user = await userModel.findById(req.user?._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      if (user?.password === undefined) {
        return next(new ErrorHandler("User password is not set", 400));
      }

      const isPasswordMatched = await user.comparePassword(oldPassword);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(user._id.toString(), JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to update user password", 500));
    }
  },
);

// update profile picture
interface IUpdateProfilePicture {
  avatar: string;
}
export const updateProfilePicture = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id?.toString() || "";
      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
          const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        } else {
          const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        }
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to update profile picture", 500));
    }
  },
);

// get all users (admin only)
export const getAllUsers = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error) {
      return next(new ErrorHandler("Failed to get all users", 500));
    }
  },
);
