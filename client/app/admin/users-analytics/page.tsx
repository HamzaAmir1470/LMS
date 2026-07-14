import React from "react";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import UsersAnalytics from "../components/Admin/Course/UsersAnalytics";
import DashboardHeader from "../components/Admin/DashboardHeader";

type Props = {};

const page = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex">
        <div className="1500px:w-[16px]  w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] ml-8">
          <DashboardHeader />
          <UsersAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
