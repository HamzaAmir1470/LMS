"use client";

import React, { useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseOptions from "./CourseOptions";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {};

const CreateCourse = (props: Props) => {
  const router = useRouter();
  const [active, setActive] = React.useState(0);

  const [createCourse, { isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const [courseInfo, setCourseInfo] = React.useState({
    title: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [benefits, setBenefits] = React.useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = React.useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = React.useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = React.useState<any>({});

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      router.push("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errMsg = (error as any).data?.message || "An error occurred";
        toast.error(errMsg);
      }
    }
  }, [isLoading, isSuccess, error, router]);

  // Builds the clean payload object from your active states
  const prepareCoursePayload = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));

    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoSection: content.videoSection,
      links: content.links.map((item) => ({
        title: item.title,
        url: item.url,
      })),
      suggestion: content.suggestion,
    }));

    return {
      name: courseInfo.title,
      description: courseInfo.description,
      price: Number(courseInfo.price) || 0,
      estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
      tags: courseInfo.tags,
      level: courseInfo.level,
      thumbnail: courseInfo.thumbnail,
      demoUrl: courseInfo.demoUrl,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
      totalVideos: courseContentData.length,
    };
  };

  const handleSubmit = async () => {
    const data = prepareCoursePayload();
    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    if (!isLoading) {
      const payloadData = prepareCoursePayload();
      console.log("OUTGOING PAYLOAD:", JSON.stringify(payloadData, null, 2));
      await createCourse(payloadData);
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
