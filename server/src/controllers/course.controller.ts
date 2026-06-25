import { NextFunction, Request, Response } from "express";
import CourseModel from "../models/course.model.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service.js";

// upload course
export const uploadCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const result = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// edit course
export const editCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

        const result = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModel.findById(
        courseId,
        {
          $set: data,
        },
        { new: true },
      );

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);
