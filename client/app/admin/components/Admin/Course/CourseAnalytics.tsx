"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from "recharts";
import Loader from "../../../../components/Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {};

// 1. Defined clear TypeScript interfaces instead of using "any"
interface AnalyticsItem {
  month: string;
  count: number;
}

interface ChartDataPoint {
  name: string;
  uv: number;
}

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  // 2. Wrapped the data transformation in useMemo so it only runs when data changes
  const analyticsData = useMemo<ChartDataPoint[]>(() => {
    if (!data?.courses?.last12Months) return [];
    
    return data.courses.last12Months.map((item: AnalyticsItem) => ({
      name: item.month,
      uv: item.count,
    }));
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Course Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Analyze course performance and engagement over time.
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center">
            {/* 3. Added a fallback check to render a message if analyticsData is empty */}
            {analyticsData.length === 0 ? (
              <p className="text-gray-500">No data available for the last 12 months.</p>
            ) : (
              <ResponsiveContainer width="90%" height="50%">
                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <Label offset={0} position="insideBottom" />
                  <YAxis domain={[0, "auto"]} />
                  <Bar dataKey="uv" fill="#3faf82">
                    <LabelList dataKey="uv" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;