import React, { useEffect, useState } from "react";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading, isError, refetch } = useGetUsersAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      refetch();
      setCourses(data?.courses);
    }
  }, [data]);

  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto `}>
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Expand Your Career{" "}
          <span className="bg-gradient-to-r from-[#21b3e4] to-[#46e256] bg-clip-text text-transparent">
            Opportunity
          </span>{" "}
          <br />
          with Our Courses
        </h1>

        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-[35px] mb-12 border-0">
          {courses &&
            courses.map((item: any, index: number) => (
              <CourseCard key={index} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
