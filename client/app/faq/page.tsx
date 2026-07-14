"use client";
import React from "react";
import About from "../components/About";
import Header from "../components/Header";
import Footer from "../components/Route/Footer";
import FAQ from "../components/Route/FAQ";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [route, setRoute] = React.useState("about");
  const [activeItem, setActiveItem] = React.useState(4);

  return (
    <div className="min-h-screen">
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        activeItem={activeItem}
        setRoute={setRoute}
      />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
