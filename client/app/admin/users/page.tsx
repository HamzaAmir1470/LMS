"use client";

import AdminProtected from "@/app/hooks/adminProtected";
import React from "react";
import DashboardHero from "../components/Admin/DashboardHero";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import AllUsers from "../components/Admin/users/AllUsers";

type Props = {};

const page = (props: Props) => {
  return (
    <AdminProtected>
      <div className="flex w-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <AllUsers/>
        </div>
      </div>
    </AdminProtected>
  );
};

export default page;
