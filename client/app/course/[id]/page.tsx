"use client";
import { use } from "react"; //  Import the use hook
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);

  return (
    <div className="">
      <CourseDetailsPage id={resolvedParams.id} />
    </div>
  );
};

export default Page;
