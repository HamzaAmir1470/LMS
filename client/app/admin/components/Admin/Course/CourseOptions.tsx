import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];
  return (
    <div>
      {options.map((option: any, index: number) => (
        <div 
          className="w-full flex items-start pb-8 last:pb-0 cursor-pointer" 
          key={index}
          onClick={() => setActive(index)}
        >
          {/* Circle Wrapper */}
          <div
            className={`w-[35px] h-[35px] rounded-full flex items-center justify-center flex-shrink-0 ${
              active >= index ? "bg-blue-500 text-white" : "bg-[#384766] text-slate-400"
            } relative`}
          >
            <IoMdCheckmark className="text-[20px]" />
            
            {/* Connecting Line */}
            {index !== options.length - 1 && (
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 h-[32px] w-[2px] ${
                  active > index ? "bg-blue-500" : "bg-[#384766]"
                }`}
              />
            )}
          </div>

          {/* Text Title */}
          <h5
            className={`pl-4 pt-1 font-medium text-[18px] transition-colors duration-200 ${
              active === index 
                ? "text-blue-500 dark:text-blue-400 font-semibold" 
                : active > index 
                ? "text-black dark:text-white" 
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;