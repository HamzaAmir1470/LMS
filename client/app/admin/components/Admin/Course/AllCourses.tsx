"use client";

import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../../../components/Loader/Loader";
import { format } from "timeago.js";
import toast from "react-hot-toast";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = React.useState(false);
  const [courseId, setCourseId] = React.useState("");
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation();

  useEffect(() => { 
    if (isSuccess) {
      refetch();
      toast.success("Course deleted successfully");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errMsg = (error as any).data?.message || "An error occurred";
        toast.error(errMsg);
      }
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    await deleteCourse(courseId);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.3 },
    { field: "purchased", headerName: "Purchased", flex: 0.4 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <Box className="flex items-center justify-center h-full w-full">
            <Button className="min-w-0 p-2">
              <FiEdit2
                size={20}
                className="dark:text-white text-black hover:text-green-500 transition-colors"
              />
            </Button>
          </Box>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <Box className="flex items-center justify-center h-full w-full">
            <Button
              className="min-w-0 p-2"
              onClick={() => {
                setOpen(true);
                setCourseId(params.row.id);
              }}
            >
              <AiOutlineDelete
                size={20}
                className="dark:text-white text-black hover:text-red-500 transition-colors"
              />
            </Button>
          </Box>
        );
      },
    },
  ];

  type CourseItem = {
    _id: string;
    name: string;
    ratings: number;
    purchased: number;
    createdAt: string;
  };

  const rows =
    data?.courses?.map((item: CourseItem) => ({
      id: item._id,
      title: item.name,
      ratings: item.ratings,
      purchased: item.purchased,
      created_at: format(item.createdAt),
    })) ?? [];

  return (
    <div className="w-full md:pl-[20px] pr-[20px] mt-[120px] overflow-x-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="0 auto" className="max-w-[98%]">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .MuiSvgIcon-root": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff20 !important"
                    : "1px solid #e0e0e0 !important",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "#2A3B56 !important"
                    : "#f1f1f1 !important",
              },
              // ✅ FIX: Styles selected rows cleanly to keep text legible in dark & light mode
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor:
                  theme === "dark"
                    ? "#1c2c42 !important"
                    : "#e2e8f0 !important",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "#2A3B56 !important"
                    : "#cbd5e1 !important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeaderRow": {
                backgroundColor:
                  theme === "dark"
                    ? "#1F2A40 !important"
                    : "#f5f5f5 !important",
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor:
                  theme === "dark"
                    ? "#1F2A40 !important"
                    : "#f5f5f5 !important",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#fff",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color: `${theme === "dark" ? "#fff" : "#000"} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-course-modal"
          >
            <Box
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] sm:w-[420px]
                bg-white dark:bg-slate-900
                rounded-lg
                border border-gray-200 dark:border-slate-800
                shadow-2xl
                outline-none
                p-8"
            >
              <h2
                className="
                    text-2xl
                    font-semibold
                    text-center
                    text-black
                    dark:text-white"
              >
                Are you sure you want to delete this course?
              </h2>

              <div className="flex justify-center gap-6 mt-8">
                <Button
                  onClick={handleClose}
                  variant="contained"
                  sx={{
                    backgroundColor: "#57c7a3",
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 4,
                    "&:hover": {
                      backgroundColor: "#45a384",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleDelete}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 4,
                    "&:hover": {
                      backgroundColor: "#dc2626",
                    },
                  }}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
