"use client";

import React from "react";
import AdminSidebar from "./components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "./components/Admin/DashboardHero";


type Props = {};

const page = (props: Props) => {
  return (
    <AdminProtected>
      <div className="flex w-[200vh]">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
        </div>
      </div>
    </AdminProtected>
  );
};

export default page;
