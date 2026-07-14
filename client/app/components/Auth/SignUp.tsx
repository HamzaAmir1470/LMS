"use client";

import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { styles } from "../../styles/style";
import { FaGoogle } from "react-icons/fa6";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  email: Yup.string().email("Invalid email!").required("Email is required!"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required!"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful!";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errData = error as { data: { message?: string } };
        toast.error(errData.data?.message || "Registration failed!");
      }
    }
  }, [isSuccess, error, data, setRoute]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });

  const { errors, touched, handleChange, handleSubmit, values, handleBlur } =
    formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to E-Learning</h1>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="w-full mb-4">
          <label className={`${styles.label}`}>Enter your name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 pt-2 block text-sm">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="w-full mb-4">
          <label className={`${styles.label}`}>Enter your email</label>
          <input
            type="email"
            name="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 pt-2 block text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="w-full relative mb-4">
          <label className={`${styles.label}`}>Enter your password</label>
          <input
            type={show ? "text" : "password"} // Fixed: Dynamically flips type
            name="password"
            placeholder="********"
            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Toggle Eye Icons */}
          <div
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500 dark:text-gray-400"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <AiOutlineEye size={25} />
            ) : (
              <AiOutlineEyeInvisible size={25} />
            )}
          </div>

          {errors.password && touched.password && (
            <p className="text-red-500 pt-2 block text-sm">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="w-full mt-6">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          {" "}
          {/* Fixed space bug */}
          Or join with
        </h5>

        {/* Social Providers */}
        <div className="flex items-center justify-center my-3 gap-4">
          <FaGoogle
            size={20}
            className="cursor-pointer text-gray-700 dark:text-white hover:opacity-80 transition"
          />
          <AiFillGithub
            size={24}
            className="cursor-pointer text-gray-700 dark:text-white hover:opacity-80 transition"
          />
        </div>

        {/* Route Selector Toggle */}
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
            onClick={() => setRoute("Login")} // Matches the route checker key exactly
          >
            Log in
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
