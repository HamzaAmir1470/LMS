"use client";

import React, { FC, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseOptions from "./CourseOptions";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  // Corrected destructuring for RTK Query mutation hook
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  const router = useRouter();
  const [active, setActive] = React.useState(0);

  // Fetching all courses to extract cache target cleanly
  const { data, isLoading, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const editCourseData = data && data.courses.find((i: any) => i._id === id);

  const [courseInfo, setCourseInfo] = React.useState({
    title: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "", // Keeps components stable by holding a plain string URL
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

  // Synchronize dynamic DB record fields cleanly into localized working states
  useEffect(() => {
    if (editCourseData) {
      // Safely grab the string URL from the Cloudinary object structure
      const currentThumbnailUrl =
        editCourseData.thumbnail && typeof editCourseData.thumbnail === "object"
          ? editCourseData.thumbnail.url
          : editCourseData.thumbnail || "";

      setCourseInfo({
        title: editCourseData.name || "",
        description: editCourseData.description || "",
        price: editCourseData.price?.toString() || "",
        estimatedPrice: editCourseData.estimatedPrice?.toString() || "",
        tags: editCourseData.tags || "",
        level: editCourseData.level || "",
        demoUrl: editCourseData.demoUrl || "",
        thumbnail: currentThumbnailUrl, // Extracted plain string URL prevents breaks in image tags
      });

      setBenefits(
        editCourseData.benefits?.length
          ? editCourseData.benefits
          : [{ title: "" }],
      );
      setPrerequisites(
        editCourseData.prerequisites?.length
          ? editCourseData.prerequisites
          : [{ title: "" }],
      );
      setCourseContentData(
        editCourseData.courseData?.length
          ? editCourseData.courseData
          : editCourseData.courseContent || [],
      );
    }
  }, [editCourseData]);

  // Handle the lifecycle of the API update mutation request
  useEffect(() => {
    if (isSuccess) {
      refetch(); // Refetch global list data to sync frontend cache with new DB values
      toast.success("Course changes updated successfully");
      router.push("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errMsg =
          (error as any).data?.message || "An error occurred while saving";
        toast.error(errMsg);
      } else {
        toast.error("Failed to update course data.");
      }
    }
  }, [isSuccess, error, router, refetch]);

  // Serializes state data structures into an integrated payload object
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

    // If the thumbnail wasn't modified, we wrap it back into the object your DB structure expects
    let finalThumbnail = courseInfo.thumbnail;
    if (
      editCourseData?.thumbnail &&
      typeof editCourseData.thumbnail === "object" &&
      courseInfo.thumbnail === editCourseData.thumbnail.url
    ) {
      finalThumbnail = editCourseData.thumbnail;
    }

    return {
      name: courseInfo.title,
      description: courseInfo.description,
      price: Number(courseInfo.price) || 0,
      estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
      tags: courseInfo.tags,
      level: courseInfo.level,
      thumbnail: finalThumbnail,
      demoUrl: courseInfo.demoUrl,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
      totalVideos: courseContentData.length,
    };
  };

  // Prepares structural snapshot right before navigating to step 4 (CoursePreview)
  const handleSubmit = async () => {
    const data = prepareCoursePayload();
    setCourseData(data);
  };

  // Triggers real mutation submission back to the backend service APIs
  const handleCourseCreate = async () => {
    const payloadData = prepareCoursePayload();

    // Execute mutation request with data payload wrapper context
    await editCourse({
      id: editCourseData._id,
      data: payloadData,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          Loading data parameters...
        </p>
      </div>
    );
  }

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
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
