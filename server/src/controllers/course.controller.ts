import { NextFunction, Request, Response } from "express";
import CourseModel from "../models/course.model.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import {
  createCourse,
  getAllCoursesService,
} from "../services/course.service.js";
import { redis } from "../utils/redis.js";
import mongoose from "mongoose";
import path from "node:path";
import sendEmail from "../utils/sendMail.js";
import * as ejs from "ejs";
import NotificationModel from "../models/notification.model.js";
import axios from "axios";

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
      const courseId = req.params.id;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Only upload if a NEW base64 image was sent
      if (
        data.thumbnail &&
        typeof data.thumbnail === "string" &&
        data.thumbnail.startsWith("data:")
      ) {
        // Delete old Cloudinary image
        if (course.thumbnail?.public_id) {
          await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        }

        // Upload new image
        const uploadedImage = await cloudinary.v2.uploader.upload(
          data.thumbnail,
          {
            folder: "courses",
          },
        );

        data.thumbnail = {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      } else {
        // Keep existing thumbnail
        data.thumbnail = course.thumbnail;
      }

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course: updatedCourse,
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

        await redis.set(
          `course:${courseId}`,
          JSON.stringify(course),
          "EX",
          604800,
        ); // 7 days in seconds

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
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
      );
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// get course content --valid user
export const getCourseByUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId,
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not enrolled in this course", 403),
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// add question in the course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }
      if (!req.user) {
        return next(new ErrorHandler("Please login", 401));
      }
      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add the new question to the course content's questions array
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        userId: req.user!._id.toString(),
        title: "New Question",
        message: `${req.user?.name} has asked a new question in the course ${courseContent?.title}`,
      });

      // save the updated course document
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// add answering question in the course
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }
      const question = courseContent?.questions?.find((q: any) =>
        q._id.equals(questionId),
      );

      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add the new answer to the question's questionReplies array
      question.questionReplies.push(newAnswer);

      // save the updated course document
      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          userId: req.user?._id.toString(),
          title: "New Answer",
          message: `${req.user?.name} has answered your question in the course ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data,
        );
        try {
          await sendEmail({
            email: question.user.email,
            subject: "New reply to your question",
            template: "question-reply.ejs",
            data,
          });
        } catch (error) {
          return next(new ErrorHandler((error as Error).message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // check if the courseId already exists in the user's course list
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId,
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not enrolled in this course", 403),
        );
      }

      const course = await CourseModel.findById(courseId);
      const { review, rating }: IAddReviewData = req.body;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((review) => {
        avg += review.rating;
      });
      course!.ratings = avg / course!.reviews.length;

      await course?.save();

      const notification = {
        title: "New Review",
        message: `${req.user?.name} has added a new review for the course ${course?.name}`,
      };
      // create a notification for the admin

      res.status(200).json({
        success: true,
        message: "Review added successfully",
        course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// add reply in review
interface IAddReplyData {
  comment: string;
  reviewId: string;
  courseId: string;
}
export const addReplyToReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId, comment, courseId } = req.body;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course.reviews.find((r) => r._id.toString() === reviewId);
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies.push(replyData);
      await course?.save();

      res.status(200).json({
        success: true,
        message: "Reply added successfully",
        course,
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// get all courses (admin only)
export const getAllCoursesAdmin = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// delete course (admin only)
export const deleteCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({ id: courseId });
      await redis.del(`course:${courseId}`);
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  },
);

// generate video url
export const generateVideoUrl = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_KEY}`,
          },
        },
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
