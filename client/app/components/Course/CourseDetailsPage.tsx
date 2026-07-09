import React, { useState } from "react";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1>page</h1>
    </div>
  );
};

export default CourseDetailsPage;
