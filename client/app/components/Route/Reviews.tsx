import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import businessImage from "../../../public/assets/Buisness-image.png";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Jane Smith",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:FF6B6B/l_text:Arial_40_bold:JS,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Web Developer",
    comment:
      "This e-learning platform has been instrumental in advancing my career...",
  },

  {
    name: "Rachel Green",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:45B7D1/l_text:Arial_40_bold:RG,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Digital Marketer",
    comment:
      "I've gained valuable skills in digital marketing and analytics...",
  },
  {
    name: "Monica Geller",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:9B59B6/l_text:Arial_40_bold:MG,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Project Manager",
    comment: "These courses helped me understand technical aspects better...",
  },
  {
    name: "Joey Tribbiani",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:E74C3C/l_text:Arial_40_bold:JT,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Actor & Content Creator",
    comment: "The creative courses helped me build my personal brand...",
  },
  {
    name: "Phoebe Buffay",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:2ECC71/l_text:Arial_40_bold:PB,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Music Producer",
    comment:
      "The music production courses are amazing! I've learned so much...",
  },
  {
    name: "Ross Geller",
    avatar:
      "https://res.cloudinary.com/hamzacloud4/image/upload/w_100,h_100,c_fill,r_max/b_rgb:3498DB/l_text:Arial_40_bold:RG,co_rgb:FFFFFF,g_center/v1783322336/Layout/xg5fvvj0km8hxflemjrg.webp",
    profession: "Paleontologist & Data Analyst",
    comment: "The data analysis courses helped me transition from academia...",
  },
];

const Review = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-10">
      <div className="w-full 800px:flex items-center gap-12">
        {/* Left Side: Image Container */}
        <div className="800px:w-[50%] w-full flex justify-center relative">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-gradient-to-tr from-[#21b3e4]/15 to-[#46e256]/15 blur-[80px] rounded-full pointer-events-none" />

          {/* Animated Image Wrapper - Fixed sizing */}
          <div className="animate-float relative z-10 w-full max-w-[600px]">
            <Image
              src={businessImage}
              alt="Business Illustration"
              width={800}
              height={800}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="800px:w-[50%] w-full mt-8 800px:mt-0">
          <h3 className={`${styles.title} 800px:!text-[40px] !leading-snug`}>
            Our Students are{" "}
            <span className="bg-gradient-to-r from-[#21b3e4] to-[#46e256] bg-clip-text text-transparent font-[700]">
              Our Strength
            </span>
            <br />
            See what they have to say about us
          </h3>
          <p className={`${styles.label} mt-4`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
            optio volutes nostrum illo neque tenetur, autem ab libero quibusdam
            labore quaerat vero voluptatum incidunt ea, hic natus beatae cum
            explicabo?
          </p>
        </div>
      </div>
      <br />
      <br />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-[35px] mb-12 border-0">
        {reviews &&
          reviews.map((item: any, index: number) => (
            <ReviewCard key={index} item={item} />
          ))}
      </div>
    </div>
  );
};

export default Review;
