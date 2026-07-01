import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { styles } from "../../../app/styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/default-avatar.png";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState((user && user?.name) || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();

  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();

  // Destructure refetch directly from the hook
  const { refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      if (fileReader.readyState === 2) {
        const base64Image = fileReader.result as string;

        // 1. Set instant local preview
        setAvatarPreview(base64Image);

        // 2. Upload to backend
        await updateAvatar({ avatar: base64Image });
      }
    };

    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess || success) {
      refetch();
    }
    if (error || updateError) {
      console.error("Error updating profile:", error || updateError);
    }
    if (success) {
      toast.success("Profile updated successfully!")
    }
  }, [isSuccess, success, error, updateError, refetch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({ name:name });
    }
  };

  return (
    <>
      {/* Avatar Container */}
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            // Priority order: 1. Local preview -> 2. Freshly fetched server avatar -> 3. Prop avatar -> 4. Default fallback
            src={avatarPreview || user?.avatar?.url || avatar || avatarIcon}
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
