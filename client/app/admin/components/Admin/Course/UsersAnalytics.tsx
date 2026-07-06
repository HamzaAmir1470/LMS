"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Loader from "../../../../components/Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {};

interface AnalyticsItem {
  month: string;
  count: number;
}

interface ChartDataPoint {
  name: string;
  count: number; // Changed from 'uv' to 'count'
}

const UsersAnalytics = (props: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData = useMemo<ChartDataPoint[]>(() => {
    if (!data?.users?.last12Months) return [];

    return data.users.last12Months.map((item: AnalyticsItem) => ({
      name: item.month,
      count: item.count, // Maps directly to count
    }));
  }, [data]);

  // Checks if we have any active data or if it's all zeros
  const hasData = useMemo(() => {
    return (
      analyticsData.length > 0 && analyticsData.some((item) => item.count > 0)
    );
  }, [analyticsData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        /* Dark mode container sync matching the screenshot theme */
        <div className="h-screen  text-white">
          <div className="mt-[50px] pt-4">
            <h1 className={`${styles.title} px-5 !text-start !text-white`}>
              Users Analytics
            </h1>
            <p className={`${styles.label} px-5 !text-gray-400`}>
              Analyze user activity and engagement over time.
            </p>
          </div>

          <div className="w-full h-[75%] flex items-center justify-center">
            {!hasData ? (
              <div className="text-center">
                <p className="text-gray-500 font-medium">
                  No user activity recorded yet.
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  New users will appear on the timeline below.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="95%" height="70%">
                <AreaChart
                  data={analyticsData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  {/* Styled axes colors to remain visible and sharp on dark mode layouts */}
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#1e293b" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#1e293b" }}
                    tickLine={false}
                  />

                  {/* Matches the custom clean white box tooltip showing 'count : value' from image_f9c823.png */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "4px",
                      border: "none",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ display: "none" }} // Keeps the focus purely on the count line value
                    itemStyle={{
                      color: "#3b49df",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    cursor={{ stroke: "#3b49df", strokeWidth: 1 }} // Vertical alignment tracking bar
                  />

                  {/* Deep blue color layout sweep with a smooth monotone stroke line curve */}
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b49df"
                    strokeWidth={3}
                    fill="#243261"
                    fillOpacity={0.7}
                    activeDot={{
                      r: 5,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                      fill: "#3b49df",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsersAnalytics;
