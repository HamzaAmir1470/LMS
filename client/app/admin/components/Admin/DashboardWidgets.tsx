import React, { FC } from "react";
import UsersAnalytics from "../../../admin/components/Admin/Course/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "./Course/OrdersAnalytics";
import AllInvoices from "../Admin/Orders/AllInvoices";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ value = 0, open }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={40}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
        sx={{
          color: value > 99 ? "#45CBA0" : "#ff4d4d",
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
        <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
          {value}%
        </span>
      </Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  return (
   
    <div className="w-full max-w-full mt-24 p-4 md:px-12 lg:h-[calc(100vh-7rem)] overflow-x-hidden lg:overflow-y-hidden">
      
      {/* The layout uses 'w-full min-w-0 grid-cols-1' to recalculate widths cleanly on mobile viewports.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 h-full pb-4 w-full min-w-0">
        
        {/* Quadrant 1: Users Analytics */}
        <div className="bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex flex-col min-h-[300px] lg:min-h-0 w-full min-w-0 overflow-x-hidden">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Users Analytics
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Last 30 days
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <UsersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Quadrant 2: KPI Summaries */}
        <div className="grid grid-rows-2 gap-4 min-h-[240px] lg:min-h-0 w-full min-w-0 overflow-hidden">
          {/* Sales Card */}
          <div className="bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex items-center justify-between w-full min-w-0 overflow-hidden">
            <div>
              <BiBorderLeft className="text-[#45CBA0] text-xl" />
              <h5 className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">
                120
              </h5>
              <p className="text-[11px] text-[#45CBA0] font-medium">
                Sales Obtained
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <CircularProgressWithLabel value={100} open={open} />
              <p className="text-[10px] font-semibold text-green-500 mt-0.5">+120%</p>
            </div>
          </div>

          {/* New Users Card */}
          <div className="bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex items-center justify-between w-full min-w-0 overflow-hidden">
            <div>
              <PiUsersFourLight className="text-[#45CBA0] text-xl" />
              <h5 className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">
                450
              </h5>
              <p className="text-[11px] text-[#45CBA0] font-medium">New Users</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <CircularProgressWithLabel value={100} open={open} />
              <p className="text-[10px] font-semibold text-green-500 mt-0.5">+150%</p>
            </div>
          </div>
        </div>

        {/* Quadrant 3: Orders Analytics */}
        <div className="bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex flex-col min-h-[300px] lg:min-h-0 w-full min-w-0 overflow-x-hidden">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Orders Analytics
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Last 30 days
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <OrdersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Quadrant 4: Recent Transactions/Invoices */}
        <div className="bg-white dark:bg-[#111C43] rounded-lg shadow-sm p-4 flex flex-col min-h-[300px] lg:min-h-0 w-full min-w-0 overflow-x-hidden">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Recent Transactions
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Latest orders
            </span>
          </div>
          {/* Added overflow-x-auto here so that if the inner invoice table is too wide, 
              only this small card scrolls horizontally, instead of breaking your whole mobile screen width. */}
          <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden">
            <AllInvoices isDashboard={true} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardWidgets;