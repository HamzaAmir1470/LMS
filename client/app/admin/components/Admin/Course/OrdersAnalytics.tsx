"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Loader from "../../../../components/Loader/Loader";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {};


interface AnalyticsItem {
  month: string;
  count: number;
}

interface ChartDataPoint {
  name: string;
  count: number;
}

const OrdersAnalytics = (props: Props) => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData = useMemo<ChartDataPoint[]>(() => {
    if (!data?.orders?.last12Months) return [];

    return data.orders.last12Months.map((item: AnalyticsItem) => ({
      name: item.month,
      count: item.count,
    }));
    

    return [
      { name: "Sep 2, 2025", count: 120 },
      { name: "Sep 30, 2025", count: 450 },
      { name: "Oct 28, 2025", count: 310 },
      { name: "Nov 25, 2025", count: 340 },
      { name: "Dec 23, 2025", count: 190 },
      { name: "Jan 20, 2026", count: 110 },
      { name: "Feb 17, 2026", count: 280 },
      { name: "Mar 17, 2026", count: 540 },
      { name: "Apr 14, 2026", count: 210 },
      { name: "May 12, 2026", count: 420 },
      { name: "Jun 9, 2026", count: 680 },
      { name: "Jul 7, 2026", count: 520 },
    ];
  }, []);

  
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
        <div className="h-screen  text-white">
          <div className="mt-[50px] pt-4">
            <h1 className={`${styles.title} px-5 !text-start !text-white`}>
              Orders Analytics
            </h1>
            <p className={`${styles.label} px-5 !text-gray-400`}>
              Analyze order activity and engagement over time.
            </p>
          </div>

          <div className="w-full h-[75%] flex items-center justify-center">
            {!hasData ? (
              <div className="text-center">
                <p className="text-gray-500 font-medium">
                  No order activity recorded yet.
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  New orders will appear on the timeline below.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="95%" height="70%">
                <LineChart
                  data={analyticsData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />

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

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "4px",
                      border: "none",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ display: "none" }}
                    itemStyle={{ color: "#3b49df", fontWeight: "600", fontSize: "14px" }}
                    cursor={{ stroke: "#3b49df", strokeWidth: 1 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b49df"
                    strokeWidth={3}
                    dot={{ r: 2, fill: "#3b49df", strokeWidth: 0 }}
                    activeDot={{
                      r: 6,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                      fill: "#3b49df",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersAnalytics;