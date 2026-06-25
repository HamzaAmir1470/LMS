import { Response } from "express";

import CourseModel from "../models/course.model.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create a new course
export const createCourse = CatchAsyncErrors(
  async (data: any, res: Response, next: Function) => {
    try {
      const course = await CourseModel.create(data);
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);
