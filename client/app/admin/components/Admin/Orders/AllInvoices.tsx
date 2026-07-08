"use client";

import React, { useMemo } from "react";
import { useGetAllOrdersQuery } from "../../../../../redux/features/orders/orderApi";
import { useGetAllUsersQuery } from "../../../../../redux/features/user/userApi";
import { useGetAllCoursesQuery } from "../../../../../redux/features/courses/coursesApi";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../../../components/Loader/Loader";
import { format } from "timeago.js";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();

  // --- API QUERIES ---
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Combine loading states
  const globalLoading = ordersLoading || usersLoading || coursesLoading;

  // --- DYNAMIC ROWS PROCESSING ---
  const rows = useMemo(() => {
    if (!ordersData?.orders) return [];

    return ordersData.orders.map((order: any, index: number) => {
      // Find corresponding user and course details dynamically
      const user = usersData?.users?.find((u: any) => u._id === order.userId);
      const course = coursesData?.courses?.find((c: any) => c._id === order.courseId);

      return {
        id: order._id || `inv-${index}`,
        _id: order._id,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "N/A",
        courseName: course?.name || "Unknown Course",
        price: order.payment_info?.amount 
          ? `$${(order.payment_info.amount / 100).toFixed(2)}`
          : `$${order.price || 0}`,
        createdAt: order.createdAt ? format(order.createdAt) : "N/A",
      };
    });
  }, [ordersData, usersData, coursesData]);

  // --- COLUMNS DEFINITION ---
  const columns = useMemo(() => {
    const baseColumns = [
      { field: "_id", headerName: "ID", flex: isDashboard ? 0.35 : 0.3 },
      { field: "userName", headerName: "Name", flex: 0.5 },
    ];

    const fullColumns = [
      ...baseColumns,
      { field: "userEmail", headerName: "Email", flex: 0.7 },
      { field: "courseName", headerName: "Course Title", flex: 0.5 },
      { field: "price", headerName: "Price", flex: 0.3 },
      { field: "createdAt", headerName: "Created At", flex: 0.3 },
      {
        field: "mail",
        headerName: "Email",
        flex: 0.2,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => {
          return (
            <Box className="flex items-center justify-center h-full w-full">
              <a href={`mailto:${params.row.userEmail}`} className="min-w-0 p-2">
                <AiOutlineMail
                  size={20}
                  className="dark:text-white text-black hover:text-green-500 transition-colors"
                />
              </a>
            </Box>
          );
        },
      },
    ];

    const dashboardColumns = [
      ...baseColumns,
      { field: "price", headerName: "Price", flex: 0.2 },
      { field: "createdAt", headerName: "Created At", flex: 0.3 },
    ];

    return isDashboard ? dashboardColumns : fullColumns;
  }, [isDashboard]);

  return (
    <div className={`w-full ${isDashboard ? '' : 'md:pl-[20px] pr-[20px] mt-[120px] overflow-x-hidden'}`}>
      {globalLoading ? (
        <Loader />
      ) : (
        <Box m="0 auto" className={isDashboard ? 'w-full' : 'max-w-[98%]'}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "350px" : "80vh"}
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
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
                backgroundColor: theme === "dark" ? "#3e4396" : "#2190ff",
              },
              "& .MuiCheckbox-root": {
                color: `${theme === "dark" ? "#fff" : "#000"} !important`,
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;