"use client";

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../../../components/Loader/Loader";
import { format } from "timeago.js";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
  const { data, isLoading, error } = useGetAllCoursesQuery({});

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
            <Button className="min-w-0 p-2">
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
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
