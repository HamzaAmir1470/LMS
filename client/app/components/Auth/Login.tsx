"use client";

import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { styles } from "../../styles/style";
import { FaGoogle } from "react-icons/fa6";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Email is required!"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required!"),
});

const Login: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      // Handle login logic here
      console.log("Login submitted:", email, password);
    },
  });

  const { errors, touched, handleChange, handleSubmit, values, handleBlur } =
    formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login with E-Learning</h1>
      <form onSubmit={handleSubmit}>
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
            type={show ? "text" : "password"} // Fixed: Changes dynamically to show password text
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
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          {" "}
          {/* Fixed dark mode spacing */}
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
          Don&apos;t have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
            onClick={() => setRoute("SignUp")} // Fixed: Matches string casing ("SignUp") inside Header component
          >
            Sign up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
