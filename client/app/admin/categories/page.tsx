"use client";

import React from "react";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "../../../app/hooks/adminProtected";
import EditCategories from "../../admin/components/Admin/Customization/EditCategories";
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
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
