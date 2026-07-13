"use client";

import React, { use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../../components/Loader/Loader";
import CourseContent from "../../components/Course/CourseContent";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = ({ params }: Props) => {
  const { id } = use(params);

  const router = useRouter();

  const { data, error, isLoading, isSuccess } = useLoadUserQuery(undefined);

  const isPurchased = useMemo(() => {
    if (!data?.user?.courses) return false;

    return data.user.courses.some(
      (item: any) => item.courseId.toString() === id,
    );
  }, [data, id]);

  useEffect(() => {
    if (isLoading) return;

    // User is not logged in
    if (error || !isSuccess || !data?.user) {
      router.replace("/");
      return;
    }

    if (!isPurchased) {
      router.replace("/");
    }
  }, [isLoading, isSuccess, error, data, isPurchased, router]);

  if (isLoading) {
    return <Loader />;
  }

  // Prevent rendering while redirecting
  if (error || !isSuccess || !data?.user || !isPurchased) {
    return null;
  }

  return (
    <div>
      <CourseContent id={id} user={data.user} />
    </div>
  );
};

export default Page;
