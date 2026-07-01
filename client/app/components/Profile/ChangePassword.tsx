import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {};

const ChangePassword = (props) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [updatePassword, { isSuccess, error: errorData }] =
    useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
    } else {
        if(oldPassword !== newPassword && newPassword === confirmPassword) {
          await updatePassword({ oldPassword, newPassword });
        } else {
            toast.error("New password cannot be the same as old password");
        }
    }
    setError("");
  };

 useEffect(() => {
  if (isSuccess) {
    toast.success("Password updated successfully")
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  if (errorData) {
    if ("status" in errorData) {
      const err = errorData.data as { message?: string };
      toast.error(err.message || "Something went wrong");
    } else {
      toast.error(errorData.message || "Something went wrong");
    }
  }
}, [isSuccess, errorData]);

  return (
    <div className="w-full h-full px-4 md:px-5">
      {/* Title */}
      <h2 className="text-[25px] md:text-[30px] font-Poppins text-center font-[500] text-black dark:text-white pb-4">
        Change Password
      </h2>

      <div className="w-full max-w-[600px] mx-auto">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center gap-5"
        >
          {/* Old Password */}
          <div className="w-full">
            <label
              htmlFor="oldPassword"
              className="block pb-2 text-sm font-medium text-black dark:text-white"
            >
              Old Password <span className="text-red-500">*</span>
            </label>
            <input
              id="oldPassword"
              type="password"
              className={`${styles.input} w-full text-black dark:text-white`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
          </div>

          {/* New Password */}
          <div className="w-full">
            <label
              htmlFor="newPassword"
              className="block pb-2 text-sm font-medium text-black dark:text-white"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              className={`${styles.input} w-full text-black dark:text-white`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <label
              htmlFor="confirmPassword"
              className="block pb-2 text-sm font-medium text-black dark:text-white"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`${styles.input} w-full text-black dark:text-white`}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(""); // Reset error on typing
              }}
              placeholder="Confirm new password"
            />
          </div>

          {/* Client-side Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium self-start">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <input
            type="submit"
            value="Update Password"
            className="w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer hover:bg-[#37a39a] hover:text-white transition-all duration-300"
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
