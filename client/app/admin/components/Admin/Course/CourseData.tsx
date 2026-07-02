"use client";

import { styles } from "@/app/styles/style";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { FC } from "react";
import { toast } from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: {
    prerequisites: (prerequisites: { title: string }[]) => void;
  };
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisiteChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };


  const prevButton = () => {
    setActive(active - 1);
  };
  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill in all the fields before proceeding.");
    }
  };
  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div className="">
        <label htmlFor="email" className={`${styles.label} text-[20px]`}>
          What are the benefits of this course?
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            name={`benefit-${index}`}
            placeholder="You will be able to build a full stack LMS platform"
            required
            value={benefit.title}
            onChange={(e) => {
              handleBenefitChange(index, e.target.value);
            }}
            className={`${styles.input} my-2`}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>
      <div className="">
        <label htmlFor="email" className={`${styles.label} text-[20px]`}>
          What are the prerequisites for this course?
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type="text"
            key={index}
            name={`prerequisite-${index}`}
            placeholder="You need basic knowledge of MERN stack to take this course"
            required
            value={prerequisite.title}
            onChange={(e) => {
              handlePrerequisiteChange(index, e.target.value);
            }}
            className={`${styles.input} my-2`}
          />
        ))}
        <AddCircleIcon
          style={{ margin: "10px 0", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisite}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Previous
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
