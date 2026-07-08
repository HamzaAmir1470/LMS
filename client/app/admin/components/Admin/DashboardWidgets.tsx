import React, { FC } from "react";
import UsersAnalytics from "../../../admin/components/Admin/Course/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "./Course/OrdersAnalytics";
import AllInvoices from "../Admin/Orders/AllInvoices";
import { useTheme } from "next-themes";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ value, open }) => {
  const { theme } = useTheme();

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
        sx={{
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {value}%
        </span>
      </Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const { theme } = useTheme();

  return (
    <div className="w-full mt-25 pr-20">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
        {/* Users Analytics - Top Left */}
        <div className="col-span-2 row-span-1 bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Users Analytics
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Last 30 days
            </span>
          </div>
          <div className="h-[calc(100%-30px)]">
            <UsersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Sales Obtained - Top Right Left */}
        <div className="col-span-1 row-span-1 bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <BiBorderLeft className="text-[#45CBA0] text-2xl" />
              <h5 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                120
              </h5>
              <p className="text-xs text-[#45CBA0] font-medium">
                Sales Obtained
              </p>
            </div>
            <div className="text-center">
              <CircularProgressWithLabel value={100} open={open} />
              <p className="text-xs font-semibold text-green-500 mt-1">+120%</p>
            </div>
          </div>
        </div>

        {/* New Users - Top Right Right */}
        <div className="col-span-1 row-span-1 bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <PiUsersFourLight className="text-[#45CBA0] text-2xl" />
              <h5 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                450
              </h5>
              <p className="text-xs text-[#45CBA0] font-medium">New Users</p>
            </div>
            <div className="text-center">
              <CircularProgressWithLabel value={100} open={open} />
              <p className="text-xs font-semibold text-green-500 mt-1">+150%</p>
            </div>
          </div>
        </div>

        {/* Orders Analytics - Bottom Left */}
        <div className="col-span-2 row-span-1 bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Orders Analytics
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Last 30 days
            </span>
          </div>
          <div className="h-[calc(100%-30px)]">
            <OrdersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Recent Transactions - Bottom Right */}
        <div className="col-span-2 row-span-1 bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Recent Transactions
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Latest orders
            </span>
          </div>
          <div className="h-[calc(100%-30px)]">
            <AllInvoices isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
