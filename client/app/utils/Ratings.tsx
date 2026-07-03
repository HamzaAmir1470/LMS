import React, { FC } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

type Props = {
  rating: number;
};

export const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <AiFillStar
          key={i}
          className="mr-2 cursor-pointer"
          color="#f6b100"
          size={20}
        />,
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf
          key={i}
          className="mr-2 cursor-pointer"
          color="#f6ba00"
          size={20}
        />,
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          className="mr-2 cursor-pointer"
          color="#f6ba00"
          size={20}
        />,
      );
    }
  }
  return <div className="flex mt-1 ml-2 800px:mt-0 800px:ml-0">{stars}</div>;
};
