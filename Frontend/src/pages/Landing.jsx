import React, { useState } from "react";
import HealthcareCards from "../components/HealthCareCard";
import ServicesCard from "../components/ServicesCard";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-white text-gray-900 w-full">
      {/* Hero Section */}
      <div className="px-4 md:px-10 lg:mt-16 lg:-translate-y-11">
        <header className="flex flex-col md:flex-row items-center justify-between py-6 md:p-10">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
              Get Better Care For{" "}
              <span className="text-blue-800">Your Health</span>
            </h2>
            <p className="text-gray-600 mt-3 md:mt-4 text-lg md:text-xl">
              Connecting Rural lives with quality Care{" "}
            </p>
            <a href="/health">
            <button className="mt-4 md:mt-6 bg-blue-950 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>Learn More</button>
            </a>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <img src="/doctors.png" alt="Doctors" className="w-full" />
          </div>
        </header>
      </div>

      {/* Services Section */}
      <div className="flex flex-col md:flex-row gap-12 md:justify-center md:px-10 mb-16">
        {/* Watch Insights Card (Appointment Card UI) */}
        <div className="bg-blue-100 p-4 md:p-9 rounded-md shadow-sm w-full md:max-w-md">
          <h2 className="text-gray-700 font-medium text-base md:text-lg">Watch Insights</h2>
          <p className="text-gray-500 mb-3 md:mb-4 text-sm md:text-base">Get your live health data from your smartwatch</p>
          <button 
            onClick={() => navigate('/account')}
            className="bg-blue-800 text-white font-medium py-2 md:py-3 px-3 md:px-4 rounded-md w-full text-sm md:text-base"
            style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}
          >
            VIEW WATCH INSIGHTS
          </button>
        </div>

      </div>

      {/* Healthcare Cards */}
      <div className="px-4 md:px-10 lg:m-6 xl:m-32">
        <HealthcareCards />
      </div>

      {/* Services Section */}
      <ServicesCard />
    </div>
  );
};

export default Landing;
