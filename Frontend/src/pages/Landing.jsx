import React, { useState } from "react";
import Cards from "../components/Hero";
import Navbar from "../components/Navbar";
import HealthcareCards from "../components/HealthCareCard";
import Footer from "../components/Foooter";
import ServicesCard from "../components/ServicesCard";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-white text-gray-900 w-full">
      {/* Responsive Navigation */}
      <nav className="flex justify-between  items-center p-4 md:p-5 bg-white shadow-md">
        <img
          src="\src\assets\logo.png"
          alt="Logo"
          className="w-20 md:w-24 ml-16  cursor-pointer "
        />
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden gap-9 md:flex space-x-6">
          <a href="/"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Home</li></a>
          <a href="/https://video-call-final-git-main-orthodox-64s-projects.vercel.app/"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">TeleMedicine</li></a>
          <a href="/consult"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Consult</li></a>
          {/* <a href="/health"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Health</li></a> */}
          {/* <a href="/appointment"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Appointment</li></a> */}
          <a href="/analysis"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Analysis</li></a>
          <a href="/emergency"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Emergency</li></a>
        </ul>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-4 items-center space-x-3 md:mr-2">
          <a href="/login">
            <button className="bg-blue-950 text-white px-4 py-2 rounded-lg text-base" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>Sign Up</button>
          </a>
          <a href="/account">
            <img className="w-8 h-8 rounded-full " src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile" />
          </a>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="block md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-3 p-4">
            <li className="hover:text-blue-800 cursor-pointer font-bold">Home</li>
            <li className="hover:text-blue-800 cursor-pointer font-bold">About Us</li>
            <li className="hover:text-blue-800 cursor-pointer font-bold">Doctors</li>
            <li className="hover:text-blue-800 cursor-pointer font-bold">Services</li>
            <li className="hover:text-blue-800 cursor-pointer font-bold">Blog</li>
          </ul>
          <div className="flex p-4 space-x-2">
            <button className="bg-blue-950 text-white px-3 py-1 rounded-lg text-sm w-full" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>Sign Up</button>
          </div>
        </div>
      )}

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
            <button className="mt-4 md:mt-6 bg-blue-950 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>Learn More</button>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <img src=".\src\assets\doctors.png" alt="Doctors" className="w-full" />
          </div>
        </header>
      </div>

      {/* Appointment Section */}
      <div className="flex flex-col md:flex-row gap-12 md:justify-center md:px-10 mb-16">
        <div className="bg-blue-100 p-4 md:p-9 rounded-md shadow-sm w-full md:max-w-md">
          <h2 className="text-gray-700 font-medium text-base md:text-lg">Lorem ipsum dolor sit amet,</h2>
          <p className="text-gray-500 mb-3 md:mb-4 text-sm md:text-base">consectetuer adipiscing elit, sed</p>
          <button className="bg-blue-800 text-white font-medium py-2 md:py-3 px-3 md:px-4 rounded-md w-full text-sm md:text-base" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>MAKE AN APPOINTMENT</button>
        </div>

        {/* Emergency */}
        <div className="bg-blue-100 p-4 md:p-8 rounded-md shadow-sm w-full md:max-w-md mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <h2 className="text-gray-600 text-lg md:text-xl font-medium">Emergency Call</h2>
          </div>
          <p className="text-gray-800 text-xl md:text-3xl font-bold mt-1 md:mt-2">+91 7314623166</p>
        </div>
      </div>

      {/* Healthcare Cards */}
      <div className="px-4 md:px-10 lg:m-6 xl:m-32">
        <HealthcareCards />
      </div>

      {/* Services Section */}
      <ServicesCard />
      
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Landing;
