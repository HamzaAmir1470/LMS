import { NextFunction, Request, Response } from "express";
import CourseModel from "../models/course.model.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service.js";
import { redis } from "../utils/redis.js";

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

// get single course
export const getSingleCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCachExist = await redis.get(`course:${courseId}`);
      if (isCachExist) {
        const course = JSON.parse(isCachExist);
        return res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
        );

        await redis.set(`course:${courseId}`, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// get all courses
export const getAllCourses = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCachExist = await redis.get("allCourses");
      if (isCachExist) {
        const courses = JSON.parse(isCachExist);
        return res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);
