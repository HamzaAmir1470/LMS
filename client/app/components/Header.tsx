"use client";

import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import defaultAvatar from "../../public/assets/default-avatar.png";
import { signOut, useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logOut, setLogOut] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logOut ? true : false,
  });

  const logOutHandler = async () => {
    setLogOut(true);
    await signOut();
  };
  useEffect(() => {
    if (!user && data) {
      socialAuth({
        email: data.user?.email,
        name: data.user?.name,
        avatar: data.user?.image,
      });
    }
  }, [user, data, socialAuth]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.success("Login successful!");

    if (data === null && !logOut) {
      setLogOut(true);
    }
  }, [data, isSuccess, logOut]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="w-full relative">
        <div
          className={`${
            active
              ? "bg-white/80 backdrop-blur-md dark:bg-gray-900/50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b border-gray-200 dark:border-white/10 shadow-xl transition-all duration-500"
              : "w-full bg-white dark:bg-transparent border-b border-gray-100 dark:border-white/10 h-[80px] z-[80] shadow-sm dark:shadow "
          }`}
        >
          <div className="w-[95%] 800px:w-[92%] h-full mx-auto">
            <div className="w-full h-[80px] flex items-center justify-between">
              <div>
                <Link
                  href="/"
                  className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                >
                  E-Learning
                </Link>
              </div>
              <div className="flex items-center">
                <NavItems activeItem={activeItem} isMobile={false} />
                <ThemeSwitcher />

                {/* Mobile Menu Toggle */}
                <div className="800px:hidden ml-4">
                  <HiOutlineMenuAlt3
                    size={25}
                    className="cursor-pointer text-black dark:text-white"
                    onClick={() => setOpenSidebar(!openSidebar)}
                  />
                </div>

                {user ? (
                  <Link href="/profile" className="flex items-center">
                    <Image
                      src={
                        user?.avatar?.url?.trim()
                          ? user.avatar.url
                          : defaultAvatar
                      }
                      alt="User Avatar"
                      width={30}
                      height={30}
                      className="rounded-full ml-4"
                    />
                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className="hidden 800px:block cursor-pointer text-black dark:text-white ml-4"
                    onClick={() => {
                      setOpen(true);
                      setRoute("Login"); // Opens up Login form by default
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {openSidebar && (
            <div
              className="fixed w-full h-screen top-0 left-0 z-[99999] bg-[#00000024]"
              onClick={() => setOpenSidebar(false)}
            >
              <div
                className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <NavItems activeItem={activeItem} isMobile={true} />

                <div className="flex justify-center mt-6">
                  <ThemeSwitcher />
                </div>

                {/* Mobile User Action */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setOpen(true);
                      setRoute("Login");
                      setOpenSidebar(false);
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <HiOutlineUserCircle
                      size={25}
                      className="hidden 800px:block cursor-pointer text-black dark:text-white ml-4"
                      onClick={() => {
                        setOpen(true);
                        setRoute("Login");
                      }}
                    />
                  </button>
                </div>
                <br />
                <br />
                <br />
                <p className="text-[16px] px-2 pl-5 text-black dark:text-white text-center">
                  Copyright © 2023 E-Learning. All rights reserved.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Unified CustomModel Wrapper */}
        {open &&
          (route === "Login" ||
            route === "SignUp" ||
            route === "Verification") && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              activeItem={activeItem}
              component={
                route === "Login"
                  ? Login
                  : route === "SignUp"
                    ? SignUp
                    : Verification
              }
              setRoute={setRoute}
            />
          )}
      </div>
    </>
  );
};

export default Header;
