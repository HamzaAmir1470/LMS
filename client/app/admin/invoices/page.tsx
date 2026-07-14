import React from "react";
import AllInvoices from "../components/Admin/Orders/AllInvoices";
import DashboardHeader from "../components/Admin/DashboardHeader";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";

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
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default page;
