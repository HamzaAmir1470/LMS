"use client";

import React from "react";
import SidebarProfile from "./SidebarProfile";
import { signOut } from "next-auth/react";
import { useLogoutQuery } from "../../../redux/features/auth/authApi";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

type Props = {
  user: any;
};

const Profile: React.FC<Props> = ({ user }) => {
  const [scroll, setScroll] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const [avatar, setAvatar] = React.useState(user?.avatar?.url || null);
  const [logOut, setLogOut] = React.useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logOut ? true : false,
  });

  const logOutHandler = async () => {
    await signOut();
    setLogOut(true);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 bg-white dark:border-[#ffffff1d]  border-[#000000fe] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SidebarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
    </div>
  );
};

export default Profile;
