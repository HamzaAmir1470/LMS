"use client";

import React from "react";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "../../../app/hooks/adminProtected";
import EditHero from "../../admin/components/Admin/Customization/EditHero";
import DashboardHero from "../components/Admin/DashboardHero";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%] ml-8">
            <DashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
