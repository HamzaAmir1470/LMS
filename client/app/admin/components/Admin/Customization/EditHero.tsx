"use client";

import React, { FC, useEffect, useState } from "react";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "../../../../../redux/features/layout/layoutApi";
import { AiOutlineCamera } from "react-icons/ai";
import toast from "react-hot-toast";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data?.layout?.banner) {
      setTitle(data.layout.banner.title || "");
      setSubtitle(data.layout.banner.subtitle || "");
      setImage(data.layout.banner.image?.url || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero section updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "Something went wrong");
      }
    }
  }, [isSuccess, error, refetch]);

  // Read newly picked local files as base64 string streams for instant preview
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper check: True if the current inputs are exactly what's already on the server
  const isUnchanged = 
    title === (data?.layout?.banner?.title || "") &&
    subtitle === (data?.layout?.banner?.subtitle || "") &&
    image === (data?.layout?.banner?.image?.url || "");

  const handleSave = async () => {
    // 1. Guard check to stop unchanged edits from firing requests
    if (isUnchanged) {
      toast.error("No changes made to update.");
      return;
    }

    await editLayout({
      type: "Banner",
      image,
      title,
      subtitle,
    });
  };

  // Button disabled logic: empty values OR loading OR unchanged state
  const isButtonDisabled = !title || !subtitle || !image || isLoading || isUnchanged;

  return (
    <div className="w-full min-h-screen flex flex-col 1000px:flex-row items-center justify-center py-12 px-4 1000px:px-12 gap-8">
      {/* LEFT COLUMN: HERO BANNER IMAGE WITH THE RADIAL HOVER ANIMATION */}
      <div className="w-full 1000px:w-[50%] flex justify-center 1000px:justify-end relative min-h-[40vh] 1000px:min-h-[70vh] items-center">
        {/* Decorative background circle layout graphic */}
        <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] 1100px:w-[450px] 1100px:h-[450px] 1500px:w-[550px] 1500px:h-[550px] hero-animation rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0" />

        {/* Dynamic Image Canvas Wrapper */}
        <div className="relative w-[80%] max-w-[400px] 1500px:max-w-[500px] z-10 group flex justify-center items-center">
          {image ? (
            <img
              src={image}
              alt="Hero Preview"
              className="object-contain w-full h-auto max-h-[55vh] rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full aspect-square border-2 border-dashed dark:border-gray-700 border-gray-300 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <span className="text-gray-400 text-sm">
                No Banner Image Selected
              </span>
            </div>
          )}

          {/* Hidden File Input Integration Trigger */}
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />

          {/* Circular Camera Upload Action overlay button */}
          <label
            htmlFor="banner"
            className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <AiOutlineCamera className="text-gray-700 dark:text-gray-200 text-[22px]" />
          </label>
        </div>
      </div>

      {/* RIGHT COLUMN: TEXT CONTENT CAPTIONS UPDATE FORMS AND ACTIONS */}
      <div className="w-full 1000px:w-[50%] flex flex-col justify-center text-left z-10 max-w-[600px] 1000px:max-w-none">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Main Title Headline
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your main hero heading text..."
              rows={3}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-[26px] sm:text-[32px] 1100px:text-[40px] font-bold text-gray-800 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Sub-heading Context Text
            </label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter context narrative descriptors here..."
              rows={3}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-[16px] sm:text-[18px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
          </div>

          {/* Action Trigger Save Buttons */}
          <div className="pt-4 flex justify-start">
            <button
              onClick={handleSave}
              disabled={isButtonDisabled}
              className={`px-8 py-3.5 font-semibold text-white rounded-xl shadow-md transition-all duration-200 tracking-wide ${
                isButtonDisabled
                  ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-lg hover:shadow-blue-500/20"
              }`}
            >
              {isLoading ? "Saving..." : "Save Hero Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;