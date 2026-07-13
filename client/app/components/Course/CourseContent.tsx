import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import CourseContentMedia from "./CourseContentMedia";
import Loader from "../Loader/Loader";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const {
    data: contentData,
    isLoading,
    refetch,
  } = useGetCourseContentQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const data = contentData?.content || [];
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            route={route}
            setRoute={setRoute}
          />
          {/* Main Layout Grid */}
          <div className="w-full grid grid-cols-1 800px:grid-cols-10 gap-4">
            {/* Left Content Column */}
            <div className="col-span-1 800px:col-span-7">
              <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
              />
            </div>

            {/* Right Sidebar Playlist Column */}
            <div className="hidden 800px:block 800px:col-span-3 border-l border-slate-200 dark:border-slate-800 p-4">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseContent;
