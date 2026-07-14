"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Review from "./components/Route/Reviews";
import FAQ from "./components/Route/FAQ";
import Footer from "./components/Route/Footer";
import socketIO from "socket.io-client";
const ENDPOINT =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:8000";
const isSocketEnabled = process.env.NEXT_PUBLIC_ENABLE_SOCKET === "true";
const socketId = isSocketEnabled
  ? socketIO(ENDPOINT, { transports: ["websocket"] })
  : null;

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  useEffect(() => {
    socketId?.on("connection", () => {
      console.log("Connected to socket server with ID:", socketId.id);
    });
  }, []);
  return (
    <div>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <Review />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
