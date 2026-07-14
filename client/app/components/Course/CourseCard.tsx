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
  
  return (
    <Link
      href={!isProfile ? `/course/${item?._id}` : `course-access/${item?._id}`}
    >
      <div className="w-full min-h-[35vh] bg-white dark:bg-slate-800 backdrop-blur border border-gray-200 dark:border-[#ffffff1d] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm hover:shadow-lg transition-all duration-300">
        <Image
          src={item?.thumbnail?.url}
          width={500}
          height={300}
          objectFit="contain"
          className="rounded w-full"
          alt=""
        />
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-white">
          {item?.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item?.ratings} />
          <h5
            className={`text-black dark:text-white ${isProfile && "hidden 800px:inline"}`}
          >
            {item?.purchased} Students
          </h5>
        </div>
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex ">
            <h3 className="text-black dark:text-white">
              {item?.price === 0 ? "Free" : `${item?.price} USD`}
            </h3>
            <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-black dark:text-white">
              {item?.estimatedPrice}$
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineOrderedList
              size={20}
              className="text-black dark:text-white"
            />
            <h5 className="pl-2 text-black dark:text-white">
              {item?.courseData?.length} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
