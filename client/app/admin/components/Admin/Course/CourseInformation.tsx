import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Course Name
          </label>
          <input
            type="text"
            required
            value={courseInfo?.title || ""}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, title: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`${styles.input}`}
          />
        </div>

        <div>
          <label htmlFor="description" className={`${styles.label}`}>
            Course Description
          </label>
          <textarea
            required
            cols={30}
            rows={10}
            value={courseInfo?.description || ""}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
            id="description"
            placeholder="Enter course description"
            className={`${styles.input} !h-[100px] py-2`}
          />
        </div>

        {/* First split row: Price details and Level */}
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-[33%]">
            <label htmlFor="price" className={`${styles.label}`}>
              Course Price
            </label>
            <input
              type="number"
              required
              value={courseInfo?.price || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="Enter course price"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full md:w-[33%]">
            <label htmlFor="estimatedPrice" className={`${styles.label}`}>
              Estimated Price (Optional)
            </label>
            <input
              type="number"
              value={courseInfo?.estimatedPrice || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="estimatedPrice"
              placeholder="Enter estimated price"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full md:w-[34%]">
            <label htmlFor="level" className={`${styles.label}`}>
              Course Level
            </label>
            <input
              type="text"
              required
              value={courseInfo?.level || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Beginner, Intermediate, Expert"
              className={`${styles.input}`}
            />
          </div>
        </div>

        {/* Second split row: Tags, Category selector and Demo URL */}
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-[33%]">
            <label htmlFor="tags" className={`${styles.label}`}>
              Course Tags
            </label>
            <input
              type="text"
              required
              value={courseInfo?.tags || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="Nextjs, MERN, React"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full md:w-[33%]">
            <label htmlFor="category" className={`${styles.label}`}>
              Course Category
            </label>
            <select
              id="category"
              required
              value={courseInfo?.category || courseInfo?.categories || ""}
              onChange={(e) =>
                setCourseInfo({
                  ...courseInfo,
                  category: e.target.value,
                  categories: e.target.value, // Update both fields to be completely safe
                })
              }
              className={`${styles.input} dark:bg-[#111C2D] dark:text-white bg-white text-black border border-gray-300 dark:border-gray-700 rounded p-2 h-[45px] w-full focus:outline-none`}
            >
              <option value="" className="dark:bg-[#111C2D] text-gray-400">
                Select Category
              </option>
              {categories?.map((category: any) => (
                <option
                  key={category._id}
                  value={category.title}
                  className="dark:bg-[#111C2D] dark:text-white text-black"
                >
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-[34%]">
            <label htmlFor="demoUrl" className={`${styles.label}`}>
              Demo URL
            </label>
            <input
              type="text"
              required
              value={courseInfo?.demoUrl || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="Enter demo URL"
              className={`${styles.input}`}
            />
          </div>
        </div>

        {/* Image upload section */}
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[20vh] dark:border-white border-[#00000026] p-4 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              dragging ? "bg-blue-500/10 border-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo?.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="Thumbnail Preview"
                className="w-full max-h-[300px] object-contain rounded"
              />
            ) : (
              <span className="text-gray-500 text-center px-4">
                Drag and drop a thumbnail here, or click to browse files
              </span>
            )}
          </label>
        </div>

        <div className="w-full flex items-center justify-end pt-4 mb-5">
          <input
            type="submit"
            value="Next"
            className="w-full md:w-[180px] h-[40px] bg-[#37a39a] text-center text-white rounded font-medium hover:bg-[#2b857e] transition-colors cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
