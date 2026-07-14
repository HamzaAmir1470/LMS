"use client";

import React, { useEffect } from "react";
import SidebarProfile from "./SidebarProfile";
import { signOut } from "next-auth/react";
import { useLogoutQuery } from "../../../redux/features/auth/authApi";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {
  user: any;
};

const Profile: React.FC<Props> = ({ user }) => {
  const [scroll, setScroll] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const [avatar, setAvatar] = React.useState(user?.avatar?.url || null);
  const [logOut, setLogOut] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  // Handles RTK Query logout trigger safely
  useLogoutQuery(undefined, {
    skip: !logOut,
  });

  const logOutHandler = async () => {
    await signOut();
    setLogOut(true);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // FIXED: Adjusted to look for courseId and added dependency array to prevent infinite loops
  useEffect(() => {
    if (data && data.courses && user && user.courses) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find(
            (course: any) => course._id === userCourse.courseId,
          ),
        )
        .filter((course: any) => course !== undefined);

      setCourses(filteredCourses);
    }
  }, [data, user]); // Runs only when raw data or user fields change

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] min-[800px]:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 bg-white dark:border-[#ffffff1d] border-[#000000fe] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SidebarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}

      {active === 3 && (
        <div className="flex-grow w-full min-[800px]:w-[calc(100%-310px)] pl-5 min-[800px]:pl-10 pr-2 mt-[80px]">
          {isLoading ? (
            <div className="text-center text-[18px] font-Poppins text-black dark:text-white py-10">
              Loading courses...
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
              {courses.map((item: any, index: number) => (
                <CourseCard
                  key={item?._id || index}
                  item={item}
                  user={user}
                  isProfile={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-[18px] font-Poppins text-black dark:text-white opacity-80">
                You don't have any purchased courses yet.
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
