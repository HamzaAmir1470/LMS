import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  // Track collapse state securely by index using a key-value map
  const [collapsedIndices, setCollapsedIndices] = React.useState<Record<number, boolean>>({});
  const [activeSection, setActiveSection] = React.useState(1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index: number) => {
    setCollapsedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Renames the section across all items that belong to the same section group
  const handleSectionRename = (index: number, newName: string) => {
    const updatedData = [...courseContentData];
    const oldName = updatedData[index].videoSection;

    updatedData.forEach((item, i) => {
      if (item.videoSection === oldName) {
        updatedData[i].videoSection = newName;
      }
    });

    updatedData[index].videoSection = newName;
    setCourseContentData(updatedData);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = JSON.parse(JSON.stringify(courseContentData));
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links = [...updatedData[index].links, { title: "", url: "" }];
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      !item.title ||
      !item.videoUrl ||
      !item.description ||
      !item.links?.[0]?.url ||
      !item.links?.[0]?.title
    ) {
      toast.error("Please fill all fields (including the first link) before adding new content");
      return;
    }

    let newVideoSection = "Untitled Section";
    if (courseContentData.length > 0) {
      const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;
      if (lastVideoSection) {
        newVideoSection = lastVideoSection;
      }
    }

    const newContent = {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: newVideoSection,
      links: [{ title: "", url: "" }],
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  const addNewSection = () => {
    const lastItem = courseContentData[courseContentData.length - 1];
    if (
      !lastItem.title ||
      !lastItem.videoUrl ||
      !lastItem.description ||
      !lastItem.links?.[0]?.url ||
      !lastItem.links?.[0]?.title
    ) {
      toast.error("Please fill all fields before adding a new section");
      return;
    }

    setActiveSection((prev) => prev + 1);
    const newContent = {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: `Untitled Section ${activeSection + 1}`,
      links: [{ title: "", url: "" }],
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    const lastItem = courseContentData[courseContentData.length - 1];
    if (
      !lastItem.title ||
      !lastItem.videoUrl ||
      !lastItem.description ||
      !lastItem.links?.[0]?.url ||
      !lastItem.links?.[0]?.title
    ) {
      toast.error("Please fill all structural fields before moving forward");
      return;
    }
    setActive(active + 1);
    handleCourseSubmit();
  };

  return (
    <div className="w-[80%] m-auto mt-0 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          
          const isCurrentCollapsed = !!collapsedIndices[index];

          return (
            <div key={index} className={`w-full bg-[#cdc8c817] p-4 ${showSectionInput ? "mt-10" : "mb-0"}`}>
              {showSectionInput && (
                <>
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className={`text-[20px] ${
                        item.videoSection?.startsWith("Untitled Section") ? "w-[190px]" : "w-auto"
                      } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                      value={item.videoSection}
                      onChange={(e) => handleSectionRename(index, e.target.value)}
                    />
                    <BsPencil className="cursor-pointer dark:text-white text-black ml-2" />
                  </div>
                  <br />
                </>
              )}

              <div className="flex w-full items-center justify-between my-0">
                {isCurrentCollapsed && item.title && (
                  <p className="font-Poppins dark:text-white text-black">
                    {index + 1}. {item.title}
                  </p>
                )}

                <div className="flex items-center ml-auto">
                  <AiOutlineDelete
                    className={`dark:text-white text-[20px] mr-2 text-black ${
                      index > 0 ? "cursor-pointer" : "cursor-no-drop"
                    }`}
                    onClick={() => {
                      if (index > 0) {
                        const updateData = [...courseContentData];
                        updateData.splice(index, 1);
                        
                        const updatedCollapse = { ...collapsedIndices };
                        delete updatedCollapse[index];
                        setCollapsedIndices(updatedCollapse);
                        
                        setCourseContentData(updateData);
                      }
                    }}
                  />
                  <MdOutlineKeyboardArrowDown
                    fontSize="large"
                    className="dark:text-white text-black cursor-pointer"
                    style={{
                      transform: isCurrentCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(index)}
                  />
                </div>
              </div>

              {!isCurrentCollapsed && (
                <>
                  <div className="my-3">
                    <label className={styles.label}>Video Title</label>
                    <input
                      type="text"
                      placeholder="Project Plan ..."
                      className={styles.input}
                      value={item.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].title = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="my-3">
                    <label className={styles.label}>Video Url</label>
                    <input
                      type="text"
                      placeholder="Enter video URL..."
                      className={styles.input}
                      value={item.videoUrl}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoUrl = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="my-3">
                    <label className={styles.label}>Video Description</label>
                    <textarea
                      rows={4}
                      placeholder="Enter description..."
                      className={`${styles.input} !h-min py-2`}
                      value={item.description}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].description = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>

                  {item?.links?.map((link: any, linkIndex: number) => (
                    <div key={linkIndex} className="mb-4 block border-l-2 border-[#37a39a] pl-3 ml-1">
                      <div className="w-full flex items-center justify-between mb-1">
                        <label className={styles.label}>Link {linkIndex + 1}</label>
                        <AiOutlineDelete
                          className={linkIndex === 0 ? "cursor-no-drop text-gray-400" : "cursor-pointer text-red-500"}
                          onClick={() => {
                            if (linkIndex > 0) {
                              handleRemoveLink(index, linkIndex);
                            }
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Link Title (e.g., Source Code)"
                        className={`${styles.input} mb-2`}
                        value={link.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <input
                        type="url"
                        placeholder="URL (https://...)"
                        className={`${styles.input}`}
                        value={link.url}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].url = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                  ))}

                  <div className="inline-block mb-4 mt-2">
                    <p
                      className="flex items-center text-[16px] dark:text-white text-black cursor-pointer hover:underline"
                      onClick={() => handleAddLink(index)}
                    >
                      <BsLink45Deg className="mr-2" />
                      Add Link
                    </p>
                  </div>
                </>
              )}

              {index === courseContentData.length - 1 && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p
                    className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                    onClick={() => newContentHandler(item)}
                  >
                    <AiOutlinePlusCircle className="mr-2" />
                    Add New Content
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer mt-6 p-2 bg-[#cdc8c80f] rounded"
          onClick={addNewSection}
        >
          <AiOutlinePlusCircle className="mr-2" />
          Add New Section
        </div>
      </form>

      <div className="w-full flex items-center justify-between mt-8">
        <button
          type="button"
          className="w-full sm:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-white rounded cursor-pointer"
          onClick={prevButton}
        >
          Previous
        </button>
        <button
          type="button"
          className="w-full sm:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-white rounded cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </button>
          </div>
          <br />
          <br />
    </div>
  );
};

export default CourseContent;