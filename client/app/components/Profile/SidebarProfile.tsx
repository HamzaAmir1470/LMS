import React, { FC } from "react";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import avatarIcon from "../../../public/assets/default-avatar.png";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer  ${active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user?.avatar?.url || avatar || avatarIcon}
          alt="Avatar"
          width={20}
          height={20}
          className="800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="  pl-2 800px:block hidden font-Poppins text:black dark:text-white">
          My Account
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? "bg-slate-800" : "bg-transparent"}`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins text:black dark:text-white">
          Change Password
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? "bg-slate-800" : "bg-transparent"}`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins text:black dark:text-white">
          Enrolled Courses
        </h5>
      </div>
      {user?.role === "admin" && (
        <Link
          href="/admin"
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? "bg-slate-800" : "bg-transparent"}`}
        >
          <MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black" />
          <h5 className="pl-2 800px:block hidden font-Poppins text:black dark:text-white">
            Admin Panel
          </h5>
        </Link>
      )}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 5 ? "bg-slate-800" : "bg-transparent"}`}
        onClick={() => logOutHandler()}
      >
        <AiOutlineLogout size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins text:black dark:text-white">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SidebarProfile;
