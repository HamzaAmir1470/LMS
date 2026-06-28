import { styles } from "@/app/styles/style";
import React, { useRef } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: React.FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = React.useState(false);
  const [verifyNumber, setVerifyNumber] = React.useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

    const verificationHandler = async () => {
      setInvalidError(true);
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
    <div>
      <h1 className={`${styles.title}`}>Verify your email</h1>
      <br />
      <div className={`w-full flex items-center justify-center mt-2`}>
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="w-full m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center justify-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${invalidError ? "shake border-red-500" : "dark:border-white border[#497DF2]"}`}
            placeholder=""
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex items-center justify-center">
        <button onClick={verificationHandler} className={`${styles.button}`}>
          Verify OTP
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Didn&apos;t receive the OTP?{" "}
        <span className="text-[16px] text-blue-500 cursor-pointer">Resend</span>
      </h5>
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        {" "}
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

      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white"></h5>
    </div>
  );
};

export default Verification;
