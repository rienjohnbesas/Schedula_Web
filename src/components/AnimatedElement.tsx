import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedElementProps {
  children: React.ReactNode;
  type?:
    | "fade"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const AnimatedElement = ({
  children,
  type = "fade",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
}: AnimatedElementProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after component mounts to trigger animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Define animation variants based on type
  const variants = {
    hidden: {
      opacity: type.includes("fade") ? 0 : 1,
      y: type === "slide-up" ? 20 : type === "slide-down" ? -20 : 0,
      x: type === "slide-left" ? 20 : type === "slide-right" ? -20 : 0,
      scale: type === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={`bg-transparent ${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
