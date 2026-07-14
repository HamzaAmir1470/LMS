"use client";
import React from "react";
import Header from "../components/Header";
import Policy from "../components/Policy";
import Footer from "../components/Route/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [route, setRoute] = React.useState("about");
  const [activeItem, setActiveItem] = React.useState(3);

  return (
    <div>
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        activeItem={activeItem}
        setRoute={setRoute}
      />
      <Policy />
      <Footer />
    </div>
  );
};

export default Page;
