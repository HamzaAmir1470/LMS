import Link from "next/link";
import React, { FC } from "react";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  const getClassName = (index: number) =>
    `text-[18px] px-6 font-Poppins font-[400] transition-colors duration-300 ${
      activeItem === index
        ? "text-red-500 dark:text-[#37a39a]"
        : "text-black dark:text-white"
    }`;

  return (
    <>
      {/* Desktop */}
      <div className="hidden 800px:flex items-center">
        {navItemsData.map((item, index) => (
          <Link key={item.name} href={item.url} className={getClassName(index)}>
            {item.name}
          </Link>
        ))}
      </div>

      {/* Mobile */}
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href="/" passHref>
              <span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
                E-Learning
              </span>
            </Link>
            {navItemsData.map((item, index) => (
              <Link
                key={item.name}
                href={item.url}
                className={`${getClassName(index)} block py-3 mt-3`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NavItems;
