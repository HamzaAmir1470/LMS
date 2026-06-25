import dotenv from "dotenv";
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import jwt from "jsonwebtoken";
dotenv.config();

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;

  comparePassword(candidatePassword: string): Promise<boolean>;

  SignAccessToken(): string;
  SignRefreshToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Hash Password before saving the user document
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error: any) {
    throw error;
  }
});

// Method to sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    (process.env.ACCESS_TOKEN as string) || "",
    {
      expiresIn: 5 * 60, // 5 minutes
    },
  );
};

// Method to sign refresh token
userSchema.methods.SignRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    (process.env.REFRESH_TOKEN as string) || "",
    {
      expiresIn: 3 * 24 * 60 * 60, // 3 days
    },
  );
};

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;
