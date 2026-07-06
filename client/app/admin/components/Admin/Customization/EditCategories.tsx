import Loader from "@/app/components/Loader/Loader";
import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = React.useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "Something went wrong");
      }
    }
  }, [isSuccess, error, refetch]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category: any) =>
        category._id === id ? { ...category, title: value } : category,
      ),
    );
  };

  const newCategoryHandler = () => {
    setCategories([
      ...categories,
      {
        _id: Date.now().toString(), // Temporary runtime unique ID
        title: "",
      },
    ]);
  };

  const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
    if (!originalCategories || !newCategories) return true;
    const cleanOriginal = originalCategories.map((c) => ({ title: c.title }));
    const cleanNew = newCategories.map((c) => ({ title: c.title }));
    return JSON.stringify(cleanOriginal) === JSON.stringify(cleanNew);
  };

  const isAnyCategoryEmpty = (categoryList: any[]) => {
    return categoryList.some((c) => !c.title || c.title.trim() === "");
  };

  const handleEdit = async () => {
    if (!areCategoriesUnchanged(data?.layout?.categories, categories) && !isAnyCategoryEmpty(categories)) {
      await editLayout({
        type: "Categories",
        categories: categories.map((c) => ({
          title: c.title,
        })),
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] m-auto mt-[120px] relative min-h-[70vh]">
          <div className="text-center">
            <h1 className={`${styles.title}`}>All Categories</h1>
            <div className="mt-6 inline-block w-full max-w-[600px] text-left">
              {categories.map((item: any) => (
                <div key={item._id} className="p-3">
                  <div className="flex items-center w-full justify-center gap-3">
                    <input
                      className={`${styles.input} !w-full !border-b !border-gray-300 dark:!border-gray-700 !bg-transparent !text-[20px] focus:!border-[#42d383] transition-colors pb-1`}
                      placeholder="Enter Category title..."
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[22px] cursor-pointer hover:text-red-500 transition-colors shrink-0"
                      onClick={() => {
                        setCategories((prevCategories) =>
                          prevCategories.filter(
                            (category) => category._id !== item._id,
                          ),
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <IoMdAddCircleOutline
                  className="dark:text-white text-black text-[30px] cursor-pointer hover:scale-105 transition-transform"
                  onClick={newCategoryHandler}
                />
              </div>
            </div>
          </div>
          
          <button
            disabled={areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoryEmpty(categories)}
            className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoryEmpty(categories)
                ? "!cursor-not-allowed opacity-50"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={handleEdit}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default EditCategories;