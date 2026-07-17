import { styles } from "@/app/styles/style";
import React, { useEffect, useRef } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import type { RootState } from "@/redux/store";
import { toast } from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: React.FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = React.useState(false);
  const [verifyNumber, setVerifyNumber] = React.useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error("Invalid OTP", errorData.data.message);
        if (!invalidError) {
          setInvalidError(true);
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  }, [isSuccess, error, setRoute]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = {
      ...verifyNumber,
      [index]: value,
    };
    setVerifyNumber(newVerifyNumber);
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <h1
        className={`${styles.title} text-center text-xl sm:text-2xl md:text-3xl`}
      >
        Verify your email
      </h1>
      <br />

      {/* Icon Container */}
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted
            size={30}
            className="sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]"
          />
        </div>
      </div>
      <br />
      <br />

      {/* OTP Input Fields */}
      <div className="w-full m-auto flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            className={`w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] md:w-[65px] md:h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center justify-center text-black dark:text-white text-[16px] sm:text-[18px] md:text-[20px] font-Poppins outline-none text-center ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#497DF2]"
            }`}
            placeholder=""
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />

      {/* Verify Button */}
      <div className="w-full flex items-center justify-center">
        <button
          onClick={verificationHandler}
          className={`${styles.button} w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-8`}
        >
          Verify OTP
        </button>
      </div>
      <br />

      {/* Resend OTP */}
      <h5 className="text-center pt-4 font-Poppins text-xs sm:text-sm md:text-[14px] text-black dark:text-white">
        Didn&apos;t receive the OTP?{" "}
        <span className="text-[14px] sm:text-[16px] text-blue-500 cursor-pointer hover:underline">
          Resend
        </span>
      </h5>

      {/* Navigation Links */}
      <h5 className="text-center pt-4 font-Poppins text-xs sm:text-sm md:text-[14px] text-black dark:text-white">
        <span
          className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
          onClick={() => setRoute("SignUp")}
        >
          Change Email /
        </span>
        <span
          className="text-black dark:text-white pl-1 cursor-pointer hover:underline"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
