import React, { FC, useState } from "react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
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
      className={`mt-[15px] w-full px-1 800px:pl-4 800px:pr-1 ${
        !props.isDemo && "sticky top-24 z-30"
      }`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);

        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section,
        );

        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + Number(item.videoLength || 0),
          0,
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        return (
          <div
            key={sectionIndex}
            className="border-b border-slate-200 dark:border-slate-800/80 pb-2"
          >
            {/* Main Section Header */}
            <div
              className="flex items-center justify-between py-4 cursor-pointer transition-colors group"
              onClick={() => toggleSection(section)}
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] md:text-[18px] font-Poppins font-medium text-black dark:text-white group-hover:text-sky-500 transition-colors">
                  {section}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-light block mt-0.5">
                  {sectionVideoCount} Lessons • {sectionVideoLength} minutes
                </span>
              </div>

              <div className="text-slate-500 dark:text-slate-400 pl-2">
                {isSectionVisible ? (
                  <BsChevronUp size={18} />
                ) : (
                  <BsChevronDown size={18} />
                )}
              </div>
            </div>

            {/* Lessons Nested List */}
            {isSectionVisible && (
              <div className="w-full flex flex-col gap-1 mt-1 pl-1 transition-all">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const isSelected = videoIndex === props.isActiveVideo;

                  return (
                    <div
                      key={item._id || index}
                      className={`w-full flex flex-col px-3 py-3 rounded-md cursor-pointer transition-all ${
                        isSelected
                          ? "bg-sky-500/10 dark:bg-slate-800 text-sky-500 dark:text-sky-400 font-medium"
                          : "text-slate-800 dark:text-slate-300 hover:bg-slate-500/5"
                      }`}
                      onClick={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                    >
                      {/* Flex layout aligning icon with item headers */}
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <div className="shrink-0">
                          {/* Render custom colored svg layout matches your mock exact style indicator */}
                          <MdOutlineOndemandVideo
                            size={20}
                            className={
                              isSelected
                                ? "text-sky-400"
                                : "text-sky-500 dark:text-sky-400 opacity-90"
                            }
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                          <h1 className="text-[15px] font-Poppins truncate pr-1">
                            {item.title}
                          </h1>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-light shrink-0">
                            {item.videoLength} mins
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;