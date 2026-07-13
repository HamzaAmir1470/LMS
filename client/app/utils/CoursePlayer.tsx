import React, { FC, useEffect, useState } from "react";
import axios from "axios"; 

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/getVdoCipherOTP`, {
        videoId: videoUrl,
      })
      .then((response) => {
        setVideoData(response.data);
      })
      .catch((error) => console.error("Error fetching video OTP:", error));
  }, [videoUrl]);

  return (
    <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
      {videoData.otp && videoData.playbackInfo ? (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=cllovlC2UD3wrx4Y`}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen={true}
          allow="encrypted-media"
          title={title}
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-slate-800 animate-pulse">
          Loading Video...
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;