import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Loading3.json";

interface LoadingProps {
  width?: number;
  height?: number;
}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        style={{
          width: "100vh",
          height: "100vh",
        }}
      />
    </div>
  );
};

export default Loading;
