"use client";

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";

const Hero: FC = () => {
  const { data } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") return;
    router.push(`/courses?title=${search}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col 1000px:flex-row items-center justify-center relative overflow-hidden px-4 1000px:px-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Left Section - Image with Animation Background */}
      <div className="1000px:w-[45%] flex 1000px:min-h-screen items-center justify-center pt-[100px] 1000px:pt-[0] z-10 relative">
        {/* Animated Circle Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] max-w-[500px] max-h-[500px] 1500px:max-w-[600px] 1500px:max-h-[600px] hero_animation rounded-full opacity-60 dark:opacity-20 bg-gradient-to-r from-[#21b3e4] to-[#46e256]"></div>

        <Image
          src={data?.layout?.banner?.image?.url || "/assets/hero-banner.png"}
          alt="Online Learning Banner"
          width={400}
          height={400}
          className="object-contain w-[85%] h-auto z-[10] max-w-[450px] 1000px:max-w-full relative"
          priority
        />
      </div>

      {/* Right Section - Content */}
      <div className="1000px:w-[55%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left mt-[40px] 1000px:mt-0 px-2 1000px:pl-8">
        <h2 className="text-gray-800 dark:text-white text-[28px] sm:text-[35px] md:text-[45px] 1000px:text-[50px] 1100px:text-[56px] 1500px:text-[68px] font-[600] font-Josefin py-2 1000px:leading-[65px] 1100px:leading-[70px] 1500px:leading-[80px] w-full tracking-wide">
          {data?.layout?.banner?.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 font-Josefin font-[600] text-[16px] sm:text-[17px] 1000px:text-[18px] max-w-full 1100px:max-w-[85%] 1500px:max-w-[70%] mt-6 leading-7 transition-colors duration-300">
          {data?.layout?.banner?.subtitle}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[600px] 1000px:max-w-[550px] 1500px:max-w-[620px] h-[50px] bg-gray-100 dark:bg-gray-800 rounded-[5px] relative mt-10 shadow-sm border border-transparent dark:border-gray-700 transition-all duration-300">
          <input
            type="search"
            placeholder="Search Courses.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/courses?search=${search}`);
              }
            }}
            className="bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-Josefin font-[500] pl-4 pr-[60px] w-full h-full outline-none text-[16px]"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute flex items-center justify-center w-[50px] h-[50px] right-0 top-0 bg-[#21b3e4] hover:bg-[#1da0ce] transition-colors duration-300 rounded-r-[5px] cursor-pointer"
          >
            <BiSearch className="text-white text-2xl" />
          </button>
        </div>

        {/* Client Avatars */}
        <div className="w-full max-w-[600px] 1000px:max-w-none flex flex-wrap items-center justify-center 1000px:justify-start gap-4 mt-10">
          <div className="flex items-center -space-x-3">
            <Image
              src="/assets/client-1.jpg"
              alt="Client 1"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover shadow-sm transition-colors duration-300"
            />
            <Image
              src="/assets/client-2.jpg"
              alt="Client 2"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover shadow-sm transition-colors duration-300"
            />
            <Image
              src="/assets/client-3.jpg"
              alt="Client 3"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover shadow-sm transition-colors duration-300"
            />
          </div>

          <p className="text-gray-600 dark:text-gray-300 font-Josefin font-[600] text-[14px] sm:text-[15px] 1000px:text-[15px] flex items-center flex-wrap justify-center gap-1 transition-colors duration-300">
            500K+ People already trusted us.{" "}
            <Link
              href="/courses"
              className="text-[#21b3e4] dark:text-[#46e256] font-[700] hover:underline transition-all duration-300 ml-1"
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
