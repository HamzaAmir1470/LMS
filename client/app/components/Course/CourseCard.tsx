"use client";

import Link from "next/link";
import Image from "next/image";
import React, { FC } from "react";
import { Ratings } from "@/app/utils/Ratings";
import { AiOutlineOrderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  console.log("Course Name:", item?.name, "Ratings Value:", item?.ratings);
  return (
    <Link
      href={!isProfile ? `/course/${item?._id}` : `/course-access/${item?._id}`}
    >
      <div className="w-full min-h-[35vh] flex flex-col justify-between bg-white dark:bg-slate-800 backdrop-blur border border-gray-200 dark:border-[#ffffff1d] rounded-lg p-3 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Thumbnail Section */}
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-slate-900 rounded overflow-hidden">
          {item?.thumbnail?.url ? (
            <Image
              src={item.thumbnail.url}
              fill
              className="object-cover"
              alt={item?.name || "Course Thumbnail"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 bg-slate-200 dark:bg-slate-700">
              No Preview Available
            </div>
          )}
        </div>

        {/* Content Elements */}
        <div className="flex-1 flex flex-col justify-between pt-3 space-y-2">
          {/* Title */}
          <h1 className="font-Poppins text-[16px] text-black dark:text-white line-clamp-2 font-medium">
            {item?.name || "Untitled Course"}
          </h1>

          {/* Ratings & Enrolled Status */}
          <div className="w-full flex items-center justify-between pt-1">
            <div className="flex-shrink-0">
              <Ratings rating={item?.rating || 4} />
            </div>

            <h5
              className={`text-black dark:text-white text-[13px] font-medium whitespace-nowrap pl-0 ${
                isProfile ? "hidden min-[800px]:inline" : "inline"
              }`}
            >
              {item?.purchased || 0} Std
            </h5>
          </div>

          {/* Pricing & Metadata Info */}
          <div className="w-full flex items-center justify-between pt-2">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-black dark:text-white font-semibold text-[16px]">
                {item?.price === 0 ? "Free" : `$${item?.price}`}
              </h3>
              {item?.estimatedPrice && (
                <h5 className="text-[13px] line-through opacity-60 text-black dark:text-white">
                  ${item.estimatedPrice}
                </h5>
              )}
            </div>

            <div className="flex items-center text-black dark:text-white opacity-90">
              <AiOutlineOrderedList size={18} />
              <h5 className="pl-1.5 text-[14px]">
                {item?.courseData?.length || 0} Lectures
              </h5>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
