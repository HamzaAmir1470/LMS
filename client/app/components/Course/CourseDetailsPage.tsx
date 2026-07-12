import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";

import Loader from "../Loader/Loader";
import Header from "../Header";
import Footer from "../Route/Footer";
import CourseDetails from "./CourseDetails";
type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
                      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
                      <CourseDetails data={data.course} />
                      <Footer />
        </>
      )}
    </>
  );
};

export default CourseDetailsPage;
