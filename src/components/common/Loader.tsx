import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Loading2.json";

interface LoadingProps {
  width?: number;
  height?: number;
}

const Loading: React.FC<LoadingProps> = () => {
  return (
    // <div className="flex items-center w-screen h-screen">
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      style={{
        width: "90%",
        height: "90%",
      }}
    />
    // </div>
  );
};

export default Loading;
