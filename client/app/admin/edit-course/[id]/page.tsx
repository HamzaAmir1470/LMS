import React from "react";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import EditCourse from "../../components/Admin/Course/EditCourse";

type Props = {};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params; 
  const id = resolvedParams?.id; 


  return (
    <div>
      <DashboardHeader />
      <div className="flex">
        <div className="1500px:w-[16px] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] ml-8 mt-4">
          <EditCourse id={id} />
        </div>
      </div>
    </div>
  );
};

export default page;