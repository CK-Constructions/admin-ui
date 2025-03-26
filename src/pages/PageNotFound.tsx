import Lottie from "lottie-react";
import NotFound from "../components/assets/404.json";

const PageNotFound = () => {
    return (
        <div className="w-full h-screen">
            <Lottie animationData={NotFound} loop={true} />
        </div>
    );
};

export default PageNotFound;
