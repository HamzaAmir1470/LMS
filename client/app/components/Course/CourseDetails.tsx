import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { Ratings } from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckoutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { MdVerified } from "react-icons/md"; 


type Props = {
  data: any;
  clientSecret: string;
  stripePromise: any;
};


// Sub-component to manage "Show Replies" state cleanly per review
const ReviewCard = ({ item }: { item: any }) => {
  const [showReplies, setShowReplies] = useState(false);
  const avatarUrl = item?.user?.avatar?.url || item?.user?.avatar;
  
  // Filter admin replies
  const adminReplies = item?.commentReplies?.filter(
    (reply: any) => reply?.user?.role === "admin"
  ) || [];

  return (
    <div className="w-full pb-4 border-b border-[#0000001a] dark:border-[#ffffff1a]">
      {/* Parent Review Row */}
      <div className="flex gap-3">
        {/* Avatar Circle */}
        <div className="w-[50px] h-[50px] flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={item?.user?.name || "user"}
              className="w-[50px] h-[50px] rounded-full object-cover border-2 border-slate-400 dark:border-slate-600"
            />
          ) : (
            <div className="w-[50px] h-[50px] bg-slate-600 rounded-full flex items-center justify-center cursor-pointer">
              <h1 className="uppercase text-[18px] text-white font-Poppins font-medium">
                {item?.user?.name ? item.user.name.slice(0, 2) : "UI"}
              </h1>
            </div>
          )}
        </div>

        {/* Review Details */}
        <div className="w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="text-[18px] text-black dark:text-white font-semibold font-Poppins">
              {item?.user?.name}
            </h5>
            <Ratings rating={item?.rating} />
          </div>
          <p className="text-black dark:text-white font-Poppins mt-1">
            {item?.comment}
          </p>
          <small className="text-[#000000d1] dark:text-[#ffffff83] block mt-1 font-Poppins">
            {format(item?.createdAt)}
          </small>

          {/* Toggle Action Button for Replies */}
          {adminReplies.length > 0 && (
            <span
              className="flex items-center gap-1 text-[14px] text-[#000000b3] dark:text-[#ffffffb3] mt-3 cursor-pointer select-none font-Poppins hover:underline w-fit"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <>Hide Replies <VscTriangleUp size={16} /></>
              ) : (
                <>All Replies ({adminReplies.length}) <VscTriangleDown size={16} /></>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Admin Replies Section */}
      {showReplies && adminReplies.length > 0 && (
        <div className="w-full pl-[20px] 800px:pl-[60px] mt-3 flex flex-col gap-3 transition-all duration-300">
          {adminReplies.map((reply: any, rIndex: number) => {
            const replyAvatarUrl = reply?.user?.avatar?.url || reply?.user?.avatar;

            return (
              <div className="flex gap-3 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg" key={rIndex}>
                {/* Admin Avatar */}
                <div className="w-[40px] h-[40px] flex-shrink-0">
                  {replyAvatarUrl ? (
                    <img
                      src={replyAvatarUrl}
                      alt={reply?.user?.name || "admin"}
                      className="w-[40px] h-[40px] rounded-full object-cover border border-slate-400 dark:border-slate-600"
                    />
                  ) : (
                    <div className="w-[40px] h-[40px] bg-red-600 rounded-full flex items-center justify-center">
                      <h1 className="uppercase text-[14px] text-white font-Poppins font-medium">
                        {reply?.user?.name ? reply.user.name.slice(0, 2) : "AD"}
                      </h1>
                    </div>
                  )}
                </div>

                {/* Admin Reply Details */}
                <div className="w-full">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-[16px] text-black dark:text-white font-semibold font-Poppins">
                      {reply?.user?.name}
                    </h5>
                    {/* Verified Icon Implementation */}
                    <MdVerified size={18} className="text-[#0052FF] dark:text-[#3b82f6] flex-shrink-0" />
                  </div>
                  <p className="text-black dark:text-white font-Poppins text-[15px] mt-0.5">
                    {reply?.comment}
                  </p>
                  <small className="text-[#000000d1] dark:text-[#ffffff83] block mt-1 text-[12px] font-Poppins">
                    {format(reply?.createdAt)}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CourseDetails = ({ data, clientSecret, stripePromise }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [visibleComments, setVisibleComments] = useState(3); // State for limiting comments
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;

  const estimatedPrice = data?.estimatedPrice || 0;
  const price = data?.price || 0;
  const courseRating = data?.ratings || 0;
  const reviewsCount = data?.reviews?.length || 0;

  const discountPercentage =
    estimatedPrice > 0 ? ((estimatedPrice - price) / estimatedPrice) * 100 : 0;

  const discountPercentagePrice =
    discountPercentage > 0 ? discountPercentage.toFixed(0) : "0";

  const isPurchased =
    user && user?.courses?.find((item: any) => item.courseId === data?._id);

  const handleOrder = () => {
    setOpen(true);
  };

  return (
    <div className="w-[90%] 800px:w-[90%] m-auto py-5">
      <div className="w-full flex flex-col-reverse 800px:flex-row gap-5">
        {/* Left Side: Course Information */}
        <div className="w-full 800px:w-[65%] 800px:pr-5">
          {/* Course Title */}
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            {data?.name}
          </h1>

          {/* Ratings and Stats */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={courseRating} />
              <h5 className="text-black dark:text-white ml-2 font-Poppins">
                {reviewsCount} Reviews
              </h5>
            </div>
            <h5 className="text-black dark:text-white font-Poppins">
              {data?.purchased || 0} Students
            </h5>
          </div>

          <br />

          {/* Course Benefits Section */}
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            What you will learn from this course
          </h1>

          <div className="pt-2">
            {data?.benefits?.map((item: any, index: number) => (
              <div className="w-full flex items-start py-2" key={index}>
                <div className="w-[20px] mr-2 mt-1 flex-shrink-0">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="text-black dark:text-white font-Poppins">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          <br />
          <br />

          {/* Course Syllabus / Accordion */}
          <div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Course Overview
            </h1>
            <CourseContentList data={data?.courseData} isDemo={true} />
          </div>

          <br />
          <br />

          {/* Course Description */}
          <div className="w-full">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Course Details
            </h1>
            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white font-Poppins">
              {data?.description}
            </p>
          </div>

          <br />
          <br />

          {/* Reviews Wrapper Section */}
          <div className="w-full">
            <div className="800px:flex items-center gap-2 mb-5">
              <Ratings rating={courseRating} />
              <h5 className="text-[22px] font-Poppins text-black dark:text-white">
                {Number.isInteger(courseRating)
                  ? courseRating.toFixed(1)
                  : courseRating.toFixed(2)}{" "}
                Course Rating || {reviewsCount} Reviews
              </h5>
            </div>

            {/* Render Map Items Flexibly */}
            <div className="w-full flex flex-col gap-4 mt-4">
              {data?.reviews &&
                [...data.reviews]
                  .reverse()
                  .slice(0, visibleComments) 
                  .map((item: any, index: number) => (
                    <ReviewCard item={item} key={index} />
                  ))}
            </div>

            {/* Show More / Show Less for Main Comments */}
            {data?.reviews && data.reviews.length > 3 && (
              <div className="w-full flex justify-center mt-5">
                {visibleComments < data.reviews.length ? (
                  <button
                    className="text-[16px] text-blue-500 font-Poppins font-[500] hover:underline"
                    onClick={() => setVisibleComments((prev) => prev + 3)}
                  >
                    Show More Reviews
                  </button>
                ) : (
                  <button
                    className="text-[16px] text-blue-500 font-Poppins font-[500] hover:underline"
                    onClick={() => setVisibleComments(3)}
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Floating Sticky Video/Purchase Sidebar */}
        <div className="w-full 800px:w-[35%] relative">
          <div className="sticky top-[100px] left-0 z-40 w-full bg-white dark:bg-slate-900 shadow-xl rounded-lg p-4">
            <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />

            <div className="flex items-center pt-3">
              <h1 className="text-[25px] font-Poppins font-bold text-black dark:text-white">
                {price === 0 ? "Free" : `${price}$`}
              </h1>
              {estimatedPrice > 0 && (
                <h5 className="pl-3 text-[20px] line-through opacity-60 text-black dark:text-white font-Poppins">
                  {estimatedPrice}$
                </h5>
              )}
              {discountPercentage > 0 && (
                <h4 className="pl-4 text-[20px] text-green-500 font-semibold font-Poppins">
                  {discountPercentagePrice}% OFF
                </h4>
              )}
            </div>

            <div className="flex items-center my-3">
              {isPurchased ? (
                <Link
                  href={`/course-access/${data?._id}`}
                  className={`${styles.button} !w-full font-Poppins cursor-pointer !bg-[crimson] text-center flex items-center justify-center py-2 text-white rounded`}
                >
                  Enter to Course
                </Link>
              ) : (
                <button
                  className={`${styles.button} !w-full font-Poppins cursor-pointer !bg-[crimson] text-white py-2 rounded`}
                  onClick={handleOrder}
                >
                  Enroll Now {price}$
                </button>
              )}
            </div>

            <div className="text-sm space-y-1 font-Poppins text-black dark:text-white opacity-80 pt-2">
              <p>• Source code included</p>
              <p>• Full lifetime access</p>
              <p>• Certificate of completion</p>
              <p>• Premium support on course content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {open && (
        <div className="w-full h-screen bg-[#0000005d] fixed top-0 left-0 z-50 flex items-center justify-center p-4">
          <div className="w-[500px] min-h-[400px] bg-white rounded-xl shadow-lg p-5 relative flex flex-col justify-between">
            {/* Close Button Row */}
            <div className="w-full flex justify-end">
              <IoCloseOutline
                size={35}
                className="text-black cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Payment Container */}
            <div className="w-full my-auto text-black">
              {stripePromise && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm setOpen={setOpen} data={data} />
                </Elements>
              ) : (
                <div className="flex justify-center items-center h-[200px]">
                  <span className="text-black font-Poppins animate-pulse">
                    Loading Payment Engine...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;