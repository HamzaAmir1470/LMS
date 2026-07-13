"use client";

import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar, AiOutlineStar } from "react-icons/ai";
import Image from "next/image";

type Props = {
  data: any[];
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  id: string;
  user: any;
};

const CourseContentMedia = ({
  data,
  activeVideo,
  setActiveVideo,
  id,
  user,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const isFirstVideo = activeVideo === 0;
  const isLastVideo = activeVideo === data?.length - 1;

  // Safe validation check against course query data parameters
  const isReviewExists = data?.reviews?.find(
    (item: any) => item.user._id === user?._id,
  );

  const handleQuestionSubmit = () => {
    if (question.trim().length === 0) return;
    // Todo: Hook your redux framework backend query trigger function here
    console.log("Submitted Question:", question);
    setQuestion("");
  };

  const handleReviewSubmit = () => {
    if (rating === 0 || reviewComment.trim().length === 0) return;
    // Todo: Hook your redux framework backend query trigger function here
    console.log("Submitted Review:", { rating, reviewComment });
    setReviewComment("");
    setRating(0);
  };

  return (
    <div className="w-[95%] md:w-[92%] py-6 mx-auto min-h-screen text-black dark:text-white transition-colors duration-200">
      {/* Video Player */}
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-between my-5">
        <button
          className={`${styles.button} !w-auto !min-h-[40px] px-4 flex items-center justify-center text-black dark:text-white bg-slate-200/60 dark:bg-slate-800/80 rounded-md transition-all ${
            isFirstVideo
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "hover:bg-slate-300 dark:hover:bg-slate-700"
          }`}
          onClick={() => !isFirstVideo && setActiveVideo(activeVideo - 1)}
          disabled={isFirstVideo}
        >
          <AiOutlineArrowLeft className="mr-2" /> Prev Lesson
        </button>

        <button
          className={`${styles.button} !w-auto !min-h-[40px] px-4 flex items-center justify-center text-white bg-sky-500 rounded-md transition-all ${
            isLastVideo
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "hover:bg-sky-600"
          }`}
          onClick={() => !isLastVideo && setActiveVideo(activeVideo + 1)}
          disabled={isLastVideo}
        >
          Next Lesson <AiOutlineArrowRight className="ml-2" />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-semibold font-Poppins my-3">
        {data[activeVideo]?.title}
      </h1>

      {/* Tab Navigation Menu */}
      <div className="w-full p-2 md:p-4 flex items-center justify-between bg-slate-500/5 dark:bg-slate-800/40 backdrop-blur rounded-xl shadow-inner border border-slate-200 dark:border-slate-800/50 my-6">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`text-sm md:text-base font-Poppins font-medium cursor-pointer py-2 px-3 rounded-md transition-all duration-200 ${
              activeBar === index
                ? "text-sky-500 bg-sky-500/10 font-semibold shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="mt-4 px-1">
        {/* Panel 0: Overview */}
        {activeBar === 0 && (
          <p className="text-[15px] md:text-base leading-relaxed font-Poppins whitespace-pre-line text-slate-700 dark:text-slate-300">
            {data[activeVideo]?.description || "No description provided for this lesson."}
          </p>
        )}

        {/* Panel 1: Resources */}
        {activeBar === 1 && (
          <div className="flex flex-col gap-4">
            {data[activeVideo]?.links?.map((item: any, index: number) => (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-500/5 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800/40" key={index}>
                <h2 className="text-sm md:text-base font-medium font-Poppins">
                  {item.title ? `${item.title} :` : "Resource Link:"}
                </h2>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 dark:text-sky-400 hover:underline break-all text-sm md:text-base font-Poppins"
                >
                  {item.url}
                </a>
              </div>
            ))}
            {(!data[activeVideo]?.links || data[activeVideo]?.links?.length === 0) && (
              <p className="text-slate-400 font-Poppins text-sm bg-slate-500/5 p-4 rounded-lg text-center">
                No resources available for this lesson.
              </p>
            )}
          </div>
        )}

        {/* Panel 2: Q&A */}
        {activeBar === 2 && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            <div className="flex gap-3 w-full items-start">
              <Image
                src={
                  user?.avatar?.url
                    ? user.avatar.url
                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                }
                alt="User Avatar"
                width={45}
                height={45}
                className="w-[45px] h-[45px] rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="Write your question..."
                className="w-full p-3 text-[15px] font-Poppins bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 resize-none custom-scrollbar"
              />
            </div>
            
            <div className="w-full flex justify-end">
              <button
                onClick={handleQuestionSubmit}
                disabled={question.trim().length === 0}
                className="bg-sky-500 hover:bg-sky-600 text-white font-Poppins px-6 py-2 rounded-md font-medium text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                Submit Question
              </button>
            </div>

            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 my-4" />
            {/* Thread responses loop injection boundary if needed */}
          </div>
        )}

        {/* Panel 3: Reviews */}
        {activeBar === 3 && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            {!isReviewExists ? (
              <div className="w-full flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <Image
                    src={
                      user?.avatar?.url
                        ? user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    alt="User Avatar"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h5 className="text-[16px] font-Poppins font-medium">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    {/* Interactive Stars Row Component */}
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="cursor-pointer" onClick={() => setRating(star)}>
                          {rating >= star ? (
                            <AiFillStar size={24} className="text-amber-400 transition-colors" />
                          ) : (
                            <AiOutlineStar size={24} className="text-slate-400 dark:text-slate-600 hover:text-amber-400 transition-colors" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full pl-0 md:pl-[57px]">
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Write an insightful review comment..."
                    className="w-full p-3 text-[15px] font-Poppins bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 resize-none custom-scrollbar"
                  />
                  
                  <div className="w-full flex justify-end mt-3">
                    <button
                      onClick={handleReviewSubmit}
                      disabled={rating === 0 || reviewComment.trim().length === 0}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-Poppins px-6 py-2 rounded-md font-medium text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 font-Poppins text-sm bg-slate-500/5 p-4 rounded-lg text-center">
                You have already shared your review feedback for this course.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentMedia;