"use client";

import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation, // Added mutation hook for review replies
} from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";

type Props = {
  data: any[];
  reviews: any[];
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  id: string;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  activeVideo,
  setActiveVideo,
  id,
  user,
  refetch,
  reviews,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerId, setAnswerId] = useState("");

  // New States for Review Replies
  const [reviewReply, setReviewReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReplyActive, setIsReviewReplyActive] = useState<{
    [key: string]: boolean;
  }>({});
  const [showReviewReplies, setShowReviewReplies] = useState<{
    [key: string]: boolean;
  }>({});
  

  const [
    addAnswerInQuestion,
    {
      isLoading: isAnswerLoading,
      error: answerError,
      isSuccess: isAnswerSuccess,
    },
  ] = useAddAnswerInQuestionMutation({});
  const [addNewQuestion, { isLoading, error, isSuccess }] =
    useAddNewQuestionMutation({});
  const [addNewReview, { error: reviewError, isSuccess: isReviewSuccess }] =
    useAddReviewInCourseMutation({});

  // Added mutation execution hook for Review Replies
  const [
    addReplyInReview,
    {
      isLoading: isReviewReplyLoading,
      error: reviewReplyError,
      isSuccess: isReviewReplySuccess,
    },
  ] = useAddReplyInReviewMutation({});

  const isFirstVideo = activeVideo === 0;
  const isLastVideo = activeVideo === data?.length - 1;

  const isReviewExists = Array.isArray(reviews)
    ? reviews.some(
        (item: any) =>
          item?.user?._id === user?._id || item?.user === user?._id,
      )
    : false;

  const handleQuestionSubmit = () => {
    if (question.trim().length === 0) {
      toast.error("Question cannot be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]?._id,
      });
      setQuestion("");
    }
  };

  const handleAnswerSubmitInternal = () => {
    if (answer.trim().length === 0) {
      toast.error("Answer cannot be empty");
    } else {
      addAnswerInQuestion({
        answer,
        courseId: id,
        contentId: data[activeVideo]?._id,
        questionId: answerId,
      });
      setAnswer("");
    }
  };

  const handleReviewReplySubmit = (rId: string) => {
    if (reviewReply.trim().length === 0) {
      toast.error("Reply cannot be empty");
    } else {
      addReplyInReview({
        comment: reviewReply, 
        courseId: id,
        reviewId: rId,
      });
    }
  };

  useEffect(() => {
    if (isAnswerSuccess) {
      toast.success("Answer submitted successfully");
      refetch();
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = answerError as any;
        toast.error(`Error: ${errorMessage.data.message}`);
      }
    }
  }, [isAnswerSuccess, answerError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Question submitted successfully");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(`Error: ${errorMessage.data.message}`);
      }
    }
  }, [isSuccess, error]);

  const handleReviewSubmit = async () => {
    if (rating === 0 || reviewComment.trim().length === 0) {
      toast.error("Please provide a rating and a review comment.");
      return;
    } else {
      addNewReview({
        review: reviewComment,
        rating,
        courseId: id,
      });
      setReviewComment("");
      setRating(0);
    }
  };

  useEffect(() => {
    if (isReviewSuccess) {
      toast.success("Review submitted successfully");
      refetch();
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = reviewError as any;
        toast.error(`Error: ${errorMessage.data.message}`);
      }
    }
  }, [isReviewSuccess, reviewError, refetch]);

  useEffect(() => {
    if (isReviewReplySuccess) {
      toast.success("Reply submitted successfully");
      setReviewReply("");
      setIsReviewReplyActive({});
      refetch();
    }
    if (reviewReplyError) {
      if ("data" in reviewReplyError) {
        const errorMessage = reviewReplyError as any;
        toast.error(`Error: ${errorMessage.data.message}`);
      }
    }
  }, [isReviewReplySuccess, reviewReplyError, refetch]);

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
            {data[activeVideo]?.description ||
              "No description provided for this lesson."}
          </p>
        )}

        {/* Panel 1: Resources */}
        {activeBar === 1 && (
          <div className="flex flex-col gap-4">
            {data[activeVideo]?.links?.map((item: any, index: number) => (
              <div
                className="flex flex-wrap items-center gap-2 p-3 bg-slate-500/5 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800/40"
                key={index}
              >
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
            {(!data[activeVideo]?.links ||
              data[activeVideo]?.links?.length === 0) && (
              <p className="text-slate-400 font-Poppins text-sm bg-slate-500/5 p-4 rounded-lg text-center">
                No resources available for this lesson.
              </p>
            )}
          </div>
        )}

        {/* Panel 2: Q&A */}
        {activeBar === 2 && (
          <div className="w-full flex flex-col gap-4">
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
                className="w-full p-3 text-[15px] font-Poppins bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 resize-none"
              />
            </div>

            <div className="w-full flex justify-end">
              <button
                onClick={isLoading ? () => {} : handleQuestionSubmit}
                disabled={question.trim().length === 0}
                className={`bg-sky-500 hover:bg-sky-600 text-white font-Poppins px-6 py-2 rounded-md font-medium text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${isLoading && "cursor-not-allowed"}`}
              >
                Submit Question
              </button>
            </div>

            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 my-4" />

            {/* Question Replies Wrapper */}
            <div className="w-full">
              <CommentReply
                data={data}
                activeVideo={activeVideo}
                answer={answer}
                setAnswer={setAnswer}
                handleAnswerSubmit={handleAnswerSubmitInternal}
                user={user}
                setAnswerId={setAnswerId}
              />
            </div>
          </div>
        )}

        {/* Panel 3: Reviews */}
        {activeBar === 3 && (
          <div className="w-full flex flex-col gap-4">
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
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="cursor-pointer"
                          onClick={() => setRating(star)}
                        >
                          {rating >= star ? (
                            <AiFillStar
                              size={24}
                              className="text-amber-400 transition-colors"
                            />
                          ) : (
                            <AiOutlineStar
                              size={24}
                              className="text-slate-400 dark:text-slate-600 hover:text-amber-400 transition-colors"
                            />
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
                    className="w-full p-3 text-[15px] font-Poppins bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 resize-none"
                  />

                  <div className="w-full flex justify-end mt-3">
                    <button
                      onClick={handleReviewSubmit}
                      disabled={
                        rating === 0 || reviewComment.trim().length === 0
                      }
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

            {/* Divider line before existing reviews */}
            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 my-4" />

            {/* Mapped Existing Reviews List */}
            <div className="w-full flex flex-col gap-4">
              {reviews &&
                reviews.map((item: any, index: number) => {
                  const reviewRepliesCount = item?.commentReplies?.length || 0;
                  const hasMultipleReplies = reviewRepliesCount > 1;
                  const showRepliesState =
                    showReviewReplies[item._id] ?? reviewRepliesCount <= 1;

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-slate-500/5 border border-slate-100 dark:border-slate-800/40"
                    >
                      <div className="flex gap-3 items-start">
                        {item?.user?.avatar?.url ? (
                          <Image
                            src={item.user.avatar.url}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="w-[40px] h-[40px] rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-[40px] h-[40px] bg-slate-600 rounded-full flex items-center justify-center text-white shrink-0">
                            <h1 className="uppercase text-[14px] font-semibold">
                              {item?.user?.name
                                ? item.user.name.slice(0, 2)
                                : "UN"}
                            </h1>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <h5 className="text-[15px] font-medium font-Poppins">
                                {item?.user?.name || "Anonymous"}
                              </h5>
                              {item?.user?.role === "admin" && (
                                <MdVerified
                                  className="text-green-500"
                                  size={15}
                                />
                              )}
                            </div>
                            {/* Star rendering for displaying reviews ratings */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star}>
                                  {item?.rating >= star ? (
                                    <AiFillStar
                                      size={16}
                                      className="text-amber-400"
                                    />
                                  ) : (
                                    <AiOutlineStar
                                      size={16}
                                      className="text-slate-300 dark:text-slate-600"
                                    />
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 font-Poppins">
                            {item?.comment || item?.review}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <small className="text-slate-400 dark:text-slate-500 font-Poppins">
                              {item?.createdAt
                                ? format(item.createdAt)
                                : "Just now"}
                            </small>
                            {/* Show reply toggle only if the logged-in user is an Admin */}
                            {user?.role === "admin" && (
                              <span
                                className="text-xs text-sky-500 dark:text-sky-400 cursor-pointer font-medium flex items-center gap-1 hover:underline"
                                onClick={() => {
                                  setIsReviewReplyActive((prev) => ({
                                    ...prev,
                                    [item._id]: !prev[item._id],
                                  }));
                                  setReviewId(item._id);
                                }}
                              >
                                <BiMessage size={14} /> Reply
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Chevron for multiple replies */}
                      {hasMultipleReplies && (
                        <div className="pl-8 md:pl-12 mt-3">
                          <button
                            type="button"
                            onClick={() =>
                              setShowReviewReplies((prev) => ({
                                ...prev,
                                [item._id]: !showRepliesState,
                              }))
                            }
                            className="flex items-center gap-1 text-xs font-Poppins font-medium text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                          >
                            {showRepliesState ? (
                              <>
                                Hide Replies <BiChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                Show {reviewRepliesCount} Replies{" "}
                                <BiChevronDown size={16} />
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Review Replies Listing */}
                      {showRepliesState &&
                        item?.commentReplies?.map(
                          (reply: any, rIndex: number) => (
                            <div
                              key={rIndex}
                              className="w-full flex gap-3 items-start pl-8 md:pl-12 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50"
                            >
                              {reply?.user?.avatar?.url ? (
                                <Image
                                  src={reply.user.avatar.url}
                                  alt="User Avatar"
                                  width={32}
                                  height={32}
                                  className="w-[32px] h-[32px] rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-[32px] h-[32px] bg-slate-500 rounded-full flex items-center justify-center text-white shrink-0">
                                  <h1 className="uppercase text-[11px] font-semibold">
                                    {reply?.user?.name
                                      ? reply.user.name.slice(0, 2)
                                      : "AD"}
                                  </h1>
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-medium font-Poppins">
                                    {reply?.user?.name || "Admin"}
                                  </h5>
                                  {reply?.user?.role === "admin" && (
                                    <MdVerified
                                      className="text-green-500"
                                      size={15}
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-Poppins mt-1">
                                  {reply?.comment}
                                </p>
                                <small className="text-[10px] text-slate-400 dark:text-slate-500 font-Poppins">
                                  {format(reply?.createdAt)}
                                </small>
                              </div>
                            </div>
                          ),
                        )}

                      {/* Admin Input Submission Bar */}
                      {isReviewReplyActive[item._id] && (
                        <div className="w-full flex gap-2 items-end mt-4 pl-8 md:pl-12">
                          <input
                            type="text"
                            placeholder="Write your official response..."
                            value={reviewReply}
                            onChange={(e: any) =>
                              setReviewReply(e.target.value)
                            }
                            className="w-full pb-1 text-sm font-Poppins bg-transparent border-b border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => handleReviewReplySubmit(item._id)}
                            disabled={
                              reviewReply.trim().length === 0 ||
                              isReviewReplyLoading
                            }
                            className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-Poppins px-3 py-1.5 rounded transition-all whitespace-nowrap"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              {(!reviews || reviews.length === 0) && (
                <p className="text-slate-400 font-Poppins text-sm text-center py-4">
                  No reviews left for this course yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// CommentReply and CommentItem remain exact same as previous
const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setAnswerId,
}: any) => {
  return (
    <div className="w-full my-3">
      {data[activeVideo]?.questions?.map((item: any, index: number) => (
        <CommentItem
          key={index}
          item={item}
          answer={answer}
          setAnswer={setAnswer}
          handleAnswerSubmit={handleAnswerSubmit}
          user={user}
          setAnswerId={setAnswerId}
        />
      ))}
    </div>
  );
};

const CommentItem = ({
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setAnswerId,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  const repliesCount = item?.questionReplies?.length || 0;
  const [showReplies, setShowReplies] = useState(repliesCount <= 1);

  return (
    <div className="my-6 p-4 rounded-lg bg-slate-500/5 border border-slate-100 dark:border-slate-800/40">
      <div className="flex gap-3 items-start">
        {item?.user?.avatar?.url ? (
          <Image
            src={item.user.avatar.url}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-[40px] h-[40px] rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-[40px] h-[40px] bg-slate-600 rounded-full flex items-center justify-center text-white shrink-0">
            <h1 className="uppercase text-[14px] font-semibold">
              {item?.user?.name ? item.user.name.slice(0, 2) : "UN"}
            </h1>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="text-[15px] font-medium font-Poppins">
              {item?.user?.name}
            </h5>
          </div>
          <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 font-Poppins">
            {item?.question}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <small className="text-slate-400 dark:text-slate-500 font-Poppins">
              {format(item?.createdAt)}
            </small>
            <span
              className="text-xs text-sky-500 dark:text-sky-400 cursor-pointer font-medium flex items-center gap-1 hover:underline"
              onClick={() => {
                setReplyActive(!replyActive);
                setAnswerId(item._id);
              }}
            >
              <BiMessage size={14} /> Reply
            </span>
          </div>
        </div>
      </div>

      {repliesCount > 1 && (
        <div className="pl-8 md:pl-12 mt-3">
          <button
            type="button"
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs font-Poppins font-medium text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            {showReplies ? (
              <>
                Hide Replies <BiChevronUp size={16} />
              </>
            ) : (
              <>
                Show {repliesCount} Replies <BiChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}

      {showReplies &&
        item?.questionReplies?.map((reply: any, index: number) => (
          <div
            key={index}
            className="w-full flex gap-3 items-start pl-8 md:pl-12 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50"
          >
            {reply?.user?.avatar?.url ? (
              <Image
                src={reply.user.avatar.url}
                alt="User Avatar"
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[32px] h-[32px] bg-slate-500 rounded-full flex items-center justify-center text-white shrink-0">
                <h1 className="uppercase text-[11px] font-semibold">
                  {reply?.user?.name ? reply.user.name.slice(0, 2) : "UN"}
                </h1>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium font-Poppins">
                  {reply?.user?.name}
                </h5>
                {reply?.user?.role === "admin" && (
                  <MdVerified className="text-green-500" size={15} />
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-Poppins mt-1">
                {reply?.answer}
              </p>
              <small className="text-[10px] text-slate-400 dark:text-slate-500 font-Poppins">
                {format(reply?.createdAt)}
              </small>
            </div>
          </div>
        ))}

      {replyActive && (
        <div className="w-full flex gap-2 items-end mt-4 pl-8 md:pl-12">
          <input
            type="text"
            placeholder="Write your answer..."
            value={answer}
            onChange={(e: any) => setAnswer(e.target.value)}
            className="w-full pb-1 text-sm font-Poppins bg-transparent border-b border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button
            type="button"
            onClick={handleAnswerSubmit}
            disabled={answer.trim().length === 0}
            className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-Poppins px-3 py-1.5 rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
