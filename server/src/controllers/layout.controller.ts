import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import LayoutModel from "../models/layout.model.js";
import cloudinary from "cloudinary";
import { AnyBulkWriteOperation } from "mongoose";

// create a new layout
export const createLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      const isTypeExist = await LayoutModel.findOne({ type });

      if (isTypeExist) {
        return next(new ErrorHandler(`${type} layout already exists`, 400));
      }

      if (type === "Banner") {
        const { image, title, subtitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });
        await LayoutModel.create({
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subtitle,
          },
        });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoryItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoryItems,
        });
      }

      res.status(201).json({
        success: true,
        message: `${type} layout created successfully`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// edit Layout
export const editLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subtitle } = req.body;
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(
            bannerData.banner.image.public_id,
          );
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });
        const banner = {
          type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItems = await LayoutModel.findOne({ type: "FAQ" });

        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.findByIdAndUpdate(FaqItems!._id, { faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoryItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        const CategoriesItems = await LayoutModel.findOne({
          type: "Categories",
        });
        if (!CategoriesItems) {
          return next(new ErrorHandler("Categories layout not found", 404));
        }
        await LayoutModel.findByIdAndUpdate(CategoriesItems._id, {
          categories: categoryItems,
        });
      }

      res.status(201).json({
        success: true,
        message: `${type} layout updated successfully`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get Layout by type
export const getLayoutByType = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const layout = await LayoutModel.findOne(req.body.type);
      if (!layout) {
        return next(new ErrorHandler("Layout not found", 404));
      }
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
