"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Route/Footer";
type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading, isError } = useGetUsersAllCoursesQuery(
    undefined,
    {},
  );
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = React.useState("Login");
  const [open, setOpen] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [category, setCategory] = React.useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses.filter((course: any) => course.categories === category),
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((course: any) =>
          course.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories || [];

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <>
            <Header
              route={route}
              setRoute={setRoute}
              open={open}
              setOpen={setOpen}
              activeItem={1}
            />
            <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
              <div className="w-full flex items-center flex-wrap">
                <div
                  className={`h-[35px] ${
                    category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                  } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setCategory("All")}
                >
                  All
                </div>
                {categories?.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"} m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-[12px]`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
              {courses && courses.length === 0 && (
                <p
                  className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
                >
                  {search
                    ? "No courses found!"
                    : "No courses available in this category! Please try another category."}
                </p>
              )}
              <br />
              <br />
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg-gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                {courses &&
                  courses.map((course: any, index: number) => (
                    <CourseCard key={index} item={course} />
                  ))}
              </div>
            </div>
            <Footer />
          </>
        </div>
      )}
    </div>
  );
};

export default Page;
