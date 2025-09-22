import Lottie from "lottie-react";
import NotFound from "../components/assets/404.json";
import Loading from "../components/common/Loader";
import Header from "../components/common/Header";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handlegoHome = () => {
    navigate("/");
  };
  return (
    <div className="w-full h-screen">
      <Header onBackClick={handlegoHome} showReloadButton={false} />
      <Lottie animationData={NotFound} loop={true} />
      {/* <Loading /> */}
    </div>
  );
};

export default PageNotFound;
