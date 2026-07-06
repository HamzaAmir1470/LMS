"use client";

import React, { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlinedIcon,
  ArrowBackIosIcon,
  ArrowForwardIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../../../public/assets/default-avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type itemProps = {
  title: string;
  to?: string;
  icon: React.ReactElement;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  onClick?: () => void;
};

type SidebarUser = {
  name?: string;
  role?: string;
  avatar?: string | { url?: string };
};

type AuthState = {
  auth: {
    user: SidebarUser | null;
  };
};

const Item: FC<itemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    setSelected(title);
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      router.push(to);
    }
  };

  return (
    <MenuItem active={selected === title} onClick={handleClick} icon={icon}>
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    </MenuItem>
  );
};

const AdminSidebar = () => {
  const { user } = useSelector((state: AuthState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  // 1. Hook to track current path name changes
  const pathname = usePathname();

  const avatarSrc =
    typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || avatarDefault;

  const logOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // 2. Synchronize active navigation link title with browser location path matching
  useEffect(() => {
    if (pathname === "/admin") setSelected("Dashboard");
    else if (pathname === "/admin/users") setSelected("Users");
    else if (pathname === "/admin/invoices") setSelected("Invoices");
    else if (pathname === "/admin/create-course") setSelected("Create Course");
    else if (pathname === "/admin/courses") setSelected("Live Courses");
    else if (pathname === "/admin/hero") setSelected("Hero");
    else if (pathname === "/admin/faq") setSelected("FAQ");
    else if (pathname === "/admin/categories") setSelected("Categories");
    else if (pathname === "/admin/team") setSelected("Manage Team");
    else if (pathname === "/admin/course-analytics") setSelected("Course Analytics");
    else if (pathname === "/admin/orders-analytics") setSelected("Orders Analytics");
    else if (pathname === "/admin/users-analytics") setSelected("Users Analytics");
    else if (pathname === "/admin/settings") setSelected("Settings");
  }, [pathname]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${isDark ? "#111C43 !important" : "#fff !important"}`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${!isDark && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "80px" : "250px",
        }}
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  ml: "15px",
                }}
              >
                <Link href="/">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    E-Learning
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1] " />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box sx={{ mb: "25px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={avatarSrc}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize!"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ pl: isCollapsed ? 0 : "10%" }}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Content"}
            </Typography>

            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Customization"}
            </Typography>

            <Item
              title="Hero"
              to="/admin/hero"
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Controllers"}
            </Typography>

            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Analytics"}
            </Typography>

            <Item
              title="Course Analytics"
              to="/admin/course-analytics"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Extras"}
            </Typography>
           

            <Item
              title="Logout"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={logOutHandler}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;