"use client";

import React, { FC } from "react";
import CoursePlayer from "../../../../utils/CoursePlayer";
import { styles } from "@/app/styles/style";
import { Ratings } from "@/app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit,
}) => {
  // Safe math parsing to prevent NaN errors if fields are empty strings
  const estimatedPrice = Number(courseData?.estimatedPrice) || 0;
  const price = Number(courseData?.price) || 0;

  const discountPercentage =
    estimatedPrice > 0 ? ((estimatedPrice - price) / estimatedPrice) * 100 : 0;
  const discountPercentagePrice = Math.max(0, Math.round(discountPercentage));

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-[90%] md:w-[85%] m-auto py-6 mb-8 font-Poppins text-black dark:text-white">
      {/* Video Media Section */}
      <div className="w-full relative bg-gray-100 dark:bg-zinc-950 rounded-lg overflow-hidden shadow-sm p-2">
        <div className="w-full">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title || "Course Demo Preview"}
          />
        </div>

        {/* Pricing Dashboard */}
        <div className="flex items-center gap-4 mt-5 px-2 flex-wrap">
          <h1 className="text-[28px] font-[700] text-[#37a39a]">
            {price === 0 ? "Free" : `$${price}`}
          </h1>
          {estimatedPrice > 0 && (
            <h5 className="text-[20px] line-through text-gray-400 dark:text-gray-500 font-[500]">
              ${estimatedPrice}
            </h5>
          )}
          {discountPercentagePrice > 0 && (
            <h4 className="text-[18px] font-[600] text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-full text-sm">
              {discountPercentagePrice}% Off
            </h4>
          )}
        </div>
      </div>

      {/* Course Actions & Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start border-b border-gray-100 dark:border-zinc-800 pb-8">
        <div className="space-y-4">
          <div
            className={`${styles.button} !w-full sm:!w-[220px] !h-[45px] !bg-red-600 hover:!bg-red-700 text-white font-[600] transition-colors shadow-sm cursor-not-allowed flex items-center justify-center`}
          >
            Buy Now ${price}
          </div>

          <div className="flex items-center gap-2 max-w-md w-full">
            <input
              type="text"
              placeholder="Discount code..."
              className="w-full h-[40px] px-3 bg-transparent border border-gray-300 dark:border-zinc-700 rounded-md outline-none text-[15px] focus:border-[#37a39a] transition-all"
            />
            <div
              className={`${styles.button} !w-[110px] !h-[40px] !mt-0 font-[500] hover:bg-opacity-90 transition-all flex items-center justify-center cursor-pointer`}
            >
              Apply
            </div>
          </div>
        </div>

        {/* Perks list */}
        <div className="space-y-2 text-[15px] text-gray-600 dark:text-gray-300 font-[400] md:pl-4">
          <p className="flex items-center gap-2">• Source code included</p>
          <p className="flex items-center gap-2">• Full lifetime access</p>
          <p className="flex items-center gap-2">• Certificate of completion</p>
          <p className="flex items-center gap-2">• Premium Dedicated Support</p>
        </div>
      </div>

      {/* Main Metadata Display */}
      <div className="w-full space-y-6">
        <div className="w-full">
          <h1 className="text-[26px] font-[600] tracking-tight leading-tight">
            {courseData?.name || "Untitled Course"}
          </h1>
          <div className="flex items-center justify-between pt-3 text-[15px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Ratings rating={0} />
              <span>0 Reviews</span>
            </div>
            <span>0 Students Enrolled</span>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-zinc-800" />

        {/* Benefits Segment */}
        <div>
          <h2 className="text-[22px] font-[600] mb-3">
            What you will learn from this course?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courseData?.benefits?.map((item: any, index: number) => (
              <div key={index} className="w-full flex items-start gap-3 py-1">
                <div className="mt-1 text-[#37a39a] flex-shrink-0">
                  <IoCheckmarkDoneOutline size={20} />
                </div>
                <p className="text-[16px] text-gray-700 dark:text-gray-300 font-[400]">
                  {item?.title ||
                    "Learning milestone dynamic description placeholder"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites Segment */}
        <div>
          <h2 className="text-[22px] font-[600] mb-3">
            What are the pre-requisites for this course?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courseData?.prerequisites?.map((item: any, index: number) => (
              <div key={index} className="w-full flex items-start gap-3 py-1">
                <div className="mt-1 text-[#37a39a] flex-shrink-0">
                  <IoCheckmarkDoneOutline size={20} />
                </div>
                <p className="text-[16px] text-gray-700 dark:text-gray-300 font-[400]">
                  {item?.title || "Prerequisite setup node title"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Description Segment */}
        <div className="w-full">
          <h2 className="text-[22px] font-[600] mb-3">Course Details</h2>
          <p className="text-[16px] leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line w-full break-words">
            {courseData?.description ||
              "No description provided for this course yet."}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="w-full flex items-center justify-between mt-12 pt-6 border-t border-gray-100 dark:border-zinc-800">
        <button
          type="button"
          className="w-[140px] sm:w-[180px] flex items-center justify-center h-[42px] bg-[#37a39a] hover:bg-[#2d8880] text-white font-[500] rounded-md transition-colors cursor-pointer shadow-sm"
          onClick={prevButton}
        >
          Previous
        </button>
        <button
          type="button"
          className="w-[140px] sm:w-[180px] flex items-center justify-center h-[42px] bg-[#219087] hover:bg-[#1a756d] text-white font-[600] rounded-md transition-colors cursor-pointer shadow-sm"
          onClick={createCourse}
        >
          {isEdit ? "Update Course" : "Publish Course"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;
