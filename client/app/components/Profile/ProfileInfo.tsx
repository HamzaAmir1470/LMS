import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { styles } from "../../../app/styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/default-avatar.png";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState((user && user?.name) || "");
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { 
    skip: loadUser ? false : true,
  });
  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        await updateAvatar({avatar});
      }
    };
    fileReader.readAsDataURL(e.target.files![0]);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoadUser(true);
    }
    if (error) {
      console.log("Error updating avatar:", error);
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting name update:", name);
    // Your update profile API call here
  };

  return (
    <>
      {/* Avatar Container */}
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user?.avatar?.url || avatar || avatarIcon}
            alt="avatar"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full object-cover"
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer evaluation-zone">
              <AiOutlineCamera size={20} className="z-1 text-white" />
            </div>
          </label>
        </div>
      </div>

      <br />
      <br />

      {/* Form Fields Container */}
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            {/* Full Name Input */}
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white text-black">
                Full Name
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Address Input (Read Only) */}
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">
                Email Address
              </label>
              <input
                type="email"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0 cursor-not-allowed opacity-70`}
                value={user?.email || ""}
                readOnly
              />
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              value="Update Profile"
              className="w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer hover:bg-[#37a39a] hover:text-white transition-all duration-300"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
