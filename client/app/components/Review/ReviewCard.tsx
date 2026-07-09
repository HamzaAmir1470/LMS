import { Ratings } from "@/app/utils/Ratings";
import Image from "next/image";
import React from "react";

type Props = {
  item: any;
};

const ReviewCard = (props: Props) => {
  return (
    <div className="w-full h-max pb-4 bg-white/30 dark:bg-slate-500/20 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/20 rounded-lg p-4 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:scale-[1.02]">
      {/* Header Section - Fixed layout */}
      <div className="flex items-start gap-3 w-full">
        {/* Avatar - Fixed size, won't stretch */}
        <div className="flex-shrink-0">
          <Image
            src={props.item?.avatar}
            alt={props.item?.name}
            width={50}
            height={50}
            className="rounded-full object-cover border-2 border-white/50 dark:border-white/10 shadow-md w-[50px] h-[50px]"
          />
        </div>

        {/* Content - Takes remaining space with proper truncation */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-1 800px:gap-2">
            {/* Name and Profession */}
            <div className="min-w-0 flex-1">
              <h5 className="text-[18px] 800px:text-[20px] text-black dark:text-white/80 font-semibold truncate">
                {props.item.name}
              </h5>
              <h6 className="text-[14px] 800px:text-[16px] text-gray-600 dark:text-white/60 truncate">
                {props.item.profession}
              </h6>
            </div>

            {/* Rating - Now properly positioned */}
            <div className="flex-shrink-0 self-start 800px:self-center">
              <Ratings rating={5} />
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      {props.item.comment && (
        <div className="mt-3 pl-[60px]">
          <p className="text-gray-700 dark:text-white/70 text-[14px] leading-relaxed line-clamp-3">
            {props.item.comment}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
