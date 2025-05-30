// ✅ Be sure to include this in your global CSS (e.g., styles/globals.css):
// @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, BarChart2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const FadeUpAnimation = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate("/login");
    }
  };
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(to bottom right, #001F54, #003566)",
      }}
    >
      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        <FadeUpAnimation delay={0.1}>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-300 tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            SCHEDULA
          </h1>
        </FadeUpAnimation>

        <FadeUpAnimation delay={0.3}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Smart Scheduling System for Campus Rooms & Facilities
          </h2>
        </FadeUpAnimation>

        <FadeUpAnimation delay={0.6}>
          <div className="mt-10 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="text-lg px-10 py-3 h-auto font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                GET STARTED
              </Button>
            </motion.div>
          </div>
        </FadeUpAnimation>

        <FadeUpAnimation delay={0.8}>
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Admin Access
              </h3>
              <p className="text-gray-600 text-center">
                Full administrative control over room management
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                System Management
              </h3>
              <p className="text-gray-600 text-center">
                Configure rooms, manage bookings, and generate reports
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Resource Control
              </h3>
              <p className="text-gray-600 text-center">
                Comprehensive control over campus facilities and resources
              </p>
            </div>
          </div>
        </FadeUpAnimation>

        <FadeUpAnimation delay={1.0}>
          <div className="mt-12 text-white/70 text-sm">
            Administrator Portal - Room Schedule Pro
          </div>
        </FadeUpAnimation>
      </div>
    </div>
  );
};

export default HeroSection;
