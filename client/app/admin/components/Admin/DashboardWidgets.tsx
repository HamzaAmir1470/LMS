"use client";

import React, { FC, useEffect } from "react";
import UsersAnalytics from "../../../admin/components/Admin/Course/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "./Course/OrdersAnalytics";
import AllInvoices from "../Admin/Orders/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ value = 0, open }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={clampedValue}
        size={45}
        thickness={4.5}
        style={{ zIndex: open ? -1 : 1 }}
        sx={{
          color: value >= 0 ? "#45CBA0" : "#ff4d4d",
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
        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
          {value > 0 ? `+${Math.round(value)}` : `${Math.round(value)}`}%
        </span>
      </Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] =
    React.useState<any>("");
  const [userComparePercentage, setUserComparePercentage] =
    React.useState<any>("");

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading || ordersLoading) return;

    if (data && ordersData) {
      const usersLastTwoMonths = data.users?.last12Months?.slice(-2) || [];
      const ordersLastTwoMonths = ordersData.orders?.last12Months?.slice(-2) || [];
      
      if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
        const usersCurrentMonth = usersLastTwoMonths[1].count;
        const usersPreviousMonth = usersLastTwoMonths[0].count;
        const ordersCurrentMonth = ordersLastTwoMonths[1].count;
        const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        const usersPercentageChange = usersPreviousMonth > 0 
          ? ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) * 100 
          : usersCurrentMonth * 100;

        const ordersPercentageChange = ordersPreviousMonth > 0 
          ? ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) * 100 
          : ordersCurrentMonth * 100;

        setUserComparePercentage({
          currentMonth: usersCurrentMonth,
          previous: usersPreviousMonth,
          percentageChange: usersPercentageChange.toFixed(0),
        });
        setOrdersComparePercentage({
          currentMonth: ordersCurrentMonth,
          previous: ordersPreviousMonth,
          percentageChange: ordersPercentageChange.toFixed(0),
        });
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    // Outer Container using your exact custom layout settings
    <div className="w-full mt-[80px] h-[calc(100vh-80px)] p-6 px-20 bg-slate-50 dark:bg-[#090F26] overflow-hidden flex flex-col justify-center">
      
      {/* Dynamic 2x2 grid fitting cleanly inside the viewport height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-6 h-full max-h-[82vh] w-full">
        
        {/* Quadrant 1: Users Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111C43] rounded-lg border border-slate-100 dark:border-slate-800/50 p-5 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white font-Poppins">
              Users Analytics
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-Poppins">
              Last 12 Months
            </span>
          </div>
          <div className="flex-grow w-full min-h-0">
            <UsersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Quadrant 2: KPI Summaries */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6 h-full overflow-hidden">
          {/* Sales Card */}
          <div className="bg-white dark:bg-[#111C43] rounded-lg border border-slate-100 dark:border-slate-800/50 p-5 flex items-center justify-between w-full h-full overflow-hidden">
            <div className="space-y-1">
              <BiBorderLeft className="text-[#45CBA0] text-2xl" />
              <h5 className="text-2xl font-bold text-gray-800 dark:text-white font-Poppins">
                {ordersComparePercentage?.currentMonth || 0}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-Poppins">
                Sales Obtained
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <CircularProgressWithLabel 
                value={Number(ordersComparePercentage?.percentageChange) || 0} 
                open={open} 
              />
              <p className={`text-xs font-bold font-Poppins ${Number(ordersComparePercentage?.percentageChange) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Number(ordersComparePercentage?.percentageChange) >= 0 ? "+" : ""}
                {ordersComparePercentage?.percentageChange || 0}%
              </p>
            </div>
          </div>

          {/* New Users Card */}
          <div className="bg-white dark:bg-[#111C43] rounded-lg border border-slate-100 dark:border-slate-800/50 p-5 flex items-center justify-between w-full h-full overflow-hidden">
            <div className="space-y-1">
              <PiUsersFourLight className="text-[#45CBA0] text-2xl" />
              <h5 className="text-2xl font-bold text-gray-800 dark:text-white font-Poppins">
                {userComparePercentage?.currentMonth || 0}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-Poppins">
                New Users
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <CircularProgressWithLabel 
                value={Number(userComparePercentage?.percentageChange) || 0} 
                open={open} 
              />
              <p className={`text-xs font-bold font-Poppins ${Number(userComparePercentage?.percentageChange) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Number(userComparePercentage?.percentageChange) >= 0 ? "+" : ""}
                {userComparePercentage?.percentageChange || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Quadrant 3: Orders Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111C43] rounded-lg border border-slate-100 dark:border-slate-800/50 p-5 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white font-Poppins">
              Orders Analytics
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-Poppins">
              Last 12 Months
            </span>
          </div>
          <div className="flex-grow w-full min-h-0">
            <OrdersAnalytics isDashboard={true} />
          </div>
        </div>

        {/* Quadrant 4: Recent Transactions (FIXED) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111C43] rounded-lg border border-slate-100 dark:border-slate-800/50 p-5 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white font-Poppins">
              Recent Transactions
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-Poppins">
              Latest orders
            </span>
          </div>
          
          {/* Scroll wrapper to keep tables perfectly responsive inside their container */}
          <div className="flex-grow w-full overflow-y-auto overflow-x-hidden min-h-0 max-h-[100%] rounded pb-2">
            <AllInvoices isDashboard={true} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardWidgets;