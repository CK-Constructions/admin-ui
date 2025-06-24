import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface AnimatedRouteAdvancedProps {
  children: React.ReactNode;
  animationType?: "fade" | "slide" | "scale";
}

const AnimatedRouteAdvanced: React.FC<AnimatedRouteAdvancedProps> = ({ children, animationType = "fade" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-500 ease-in-out";

    switch (animationType) {
      case "slide":
        return `${baseClasses} transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`;
      case "scale":
        return `${baseClasses} transform ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`;
      default: // fade
        return `${baseClasses} transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;
    }
  };

  return <div className={getAnimationClasses()}>{children}</div>;
};

export default AnimatedRouteAdvanced;
