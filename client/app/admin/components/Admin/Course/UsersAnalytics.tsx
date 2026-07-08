"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import Loader from "../../../../components/Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {
  isDashboard?: boolean;
};

interface AnalyticsItem {
  month: string;
  count: number;
}

interface ChartDataPoint {
  name: string;
  count: number;
}

const UsersAnalytics = ({ isDashboard = false }: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData = useMemo<ChartDataPoint[]>(() => {
    if (!data?.users?.last12Months) return [];

    return data.users.last12Months.map((item: AnalyticsItem) => ({
      name: item.month,
      count: item.count,
    }));
  }, [data]);

  const hasData = useMemo(() => {
    return (
      analyticsData.length > 0 && analyticsData.some((item) => item.count > 0)
    );
  }, [analyticsData]);

  if (isLoading) return <Loader />;

  // Full page view (when not in dashboard)
  if (!isDashboard) {
    return (
      <div className="h-screen">
        <div className="mt-[50px]">
          <h1 className={`${styles.title} px-5 !text-start`}>
            Users Analytics
          </h1>
          <p className={`${styles.label} px-5`}>
            Analyze user activity and engagement over time.
          </p>
        </div>

        <div className="w-full h-[90%] flex items-center justify-center">
          {!hasData ? (
            <p className="text-gray-500">
              No data available for the last 12 months.
            </p>
          ) : (
            <ResponsiveContainer width="90%" height="50%">
              <AreaChart
                data={analyticsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <Label offset={0} position="insideBottom" />
                <YAxis domain={[0, "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "none",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ display: "none" }}
                  itemStyle={{
                    color: "#3faf82",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  cursor={{ stroke: "#3faf82", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3faf82"
                  strokeWidth={3}
                  fill="#3faf82"
                  fillOpacity={0.2}
                  activeDot={{
                    r: 5,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    fill: "#3faf82",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }

  // Dashboard view (compact)
  return (
    <div className="w-full h-full">
      {!hasData ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No user activity recorded yet.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={analyticsData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              interval={Math.floor(analyticsData.length / 6)}
            />
            <YAxis
              domain={[0, "auto"]}
              allowDecimals={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                border: "none",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                padding: "8px 12px",
              }}
              labelStyle={{ display: "none" }}
              itemStyle={{
                color: "#3faf82",
                fontWeight: "600",
                fontSize: "12px",
              }}
              cursor={{ stroke: "#3faf82", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3faf82"
              strokeWidth={2}
              fill="#3faf82"
              fillOpacity={0.2}
              activeDot={{
                r: 4,
                stroke: "#ffffff",
                strokeWidth: 2,
                fill: "#3faf82",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UsersAnalytics;
