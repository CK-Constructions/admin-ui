import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface AnimatedRouteProps {
  children: React.ReactNode;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset animation state when route changes
    setIsVisible(false);

    // Small delay to ensure the component has unmounted/mounted
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <div className={`transition-all duration-500 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{children}</div>;
};

export default AnimatedRoute;
