import React, { FC, useState } from "react";
import { BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  isActiveVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>(),
  );

  const videoSections: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount: number = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-[15px] w-full ${!props.isDemo && "ml-[30px] sticky top-24 left-0 z-30"}`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);

        // Calculate videos specific to this section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section,
        );

        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0,
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;
        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            key={sectionIndex}
            className="border-b border-slate-200 dark:border-slate-700 pb-3"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSection(section)}
            >
              <h2 className="text-[20px] font-Poppins text-black dark:text-white">
                {section}
              </h2>
              <span className="text-[18px] text-black dark:text-white">
                ({sectionVideoCount})
              </span>
            </div>

            {isSectionVisible && (
              <div className="pl-4">
                <div
                  className={`${props.isDemo && "border-b border-[#ffffff8e] pb-2"}`}
                >
                  <div className="w-full flex">
                    <div className="w-full flex justify-between items-center">
                      <h2 className="text-[22px] text-black dark:text-white">
                        {section}
                      </h2>
                      <button
                        onClick={() => toggleSection(section)}
                        className="mr-4 cursor-pointer text-black dark:text-white"
                      >
                        {isSectionVisible ? (
                          <BsChevronUp size={20} />
                        ) : (
                          <BsChevronUp size={20} className="rotate-180" />
                        )}
                      </button>
                    </div>
                  </div>
                  <h5>
                    {sectionVideoCount} Lessons.{" "}
                    {sectionVideoLength < 60
                      ? sectionVideoLength
                      : sectionContentHours.toFixed(2)}{" "}
                    {sectionVideoLength > 60 ? "Hours" : "Minutes"}
                  </h5>
                  <br />

                  <div className="w-full">
                    {sectionVideos.map((item: any, index: number) => {
                      const videoIndex: number = sectionStartIndex + index;
                      const contentLength: number = item.videoLength / 60;

                      return (
                        <div
                          className={`w-full ${
                            videoIndex === props.isActiveVideo
                              ? "bg-slate-200 dark:bg-slate-800"
                              : ""
                          } cursor-pointer transition-all p-2 rounded`}
                          key={item._id || index}
                          onClick={() =>
                            props.isDemo
                              ? null
                              : props?.setActiveVideo(videoIndex)
                          }
                        >
                          <div className="flex items-center">
                            <div>
                              <MdOutlineOndemandVideo
                                size={25}
                                className="mr-2"
                                color="#1cdada"
                              />
                            </div>
                            <h1 className="text-[18px] inline-block break-words font-Poppins text-black dark:text-white">
                              {item.title}
                            </h1>
                          </div>
                          <h5 className="pl-8 text-black dark:text-white">
                            {item.videoLength > 60
                              ? contentLength.toFixed(2)
                              : item.videoLength}{" "}
                            {item.videoLength > 60 ? "Hours" : "Minutes"}
                          </h5>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
