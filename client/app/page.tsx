"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Review from "./components/Route/Reviews";
import FAQ from "./components/Route/FAQ";
import Footer from "./components/Route/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

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
      <Footer/>
    </div>
  );
};

export default Page;
