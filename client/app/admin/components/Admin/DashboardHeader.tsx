"use client";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationApi";
import ThemeSwitcher from "../../../utils/ThemeSwitcher";
import React, { FC, useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { IoMdNotificationsOutline } from "react-icons/io";
import SocketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";
const socket = SocketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioRef.current = new Audio(
      "https://res.cloudinary.com/hamzacloud/video/upload/v1784022679/Notification_sound_csfguq.mp3",
    );
  }, []);

  const playerNotificationSound = () => {
    audioRef.current?.play();
  };

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread"),
      );
    }
    if (isSuccess) {
      refetch();
    }
    audioRef.current?.load();
  }, [data, isSuccess, refetch]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      refetch();
      playerNotificationSound();
    });
  }, [refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-3 fixed top-5 right-0 z-50">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen && setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white font-Poppins">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Professional Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setOpen && setOpen(false)}
        />
      )}

      {open && (
        <div className="w-[350px] h-[54vh] dark:bg-[#111c24] bg-white shadow-xl absolute top-16 right-5 z-50 rounded overflow-y-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3 sticky top-0 bg-white dark:bg-[#111c24] z-10">
            Notifications
          </h5>

          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-[40vh]">
              <p className="text-gray-500 dark:text-gray-400 font-Poppins text-[14px]">
                No new notifications
              </p>
            </div>
          ) : (
            notifications.map((item: any) => (
              <div
                key={item._id || item.id}
                className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] last:border-0"
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white font-medium text-[15px]">
                    {item.title}
                  </p>
                  <p
                    className="text-[#3ccba0] hover:underline cursor-pointer text-[13px] font-semibold"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white text-[14px] leading-relaxed">
                  {item.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[12px] opacity-80">
                  {format(item.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
