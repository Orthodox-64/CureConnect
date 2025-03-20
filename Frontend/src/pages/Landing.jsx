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
    <div className="bg-white text-gray-900 w-[100vw] -translate-x-46">
      {/* Responsive Navigation */}
      <nav className="flex justify-between items-center p-4 md:p-5 bg-white shadow-md h-auto md:h-20">
        <img src="\src\assets\logo.png" alt="" className="w-20 md:w-24 pt-2 md:pt-3 cursor-pointer" />
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          

          <button 
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
              
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 lg:space-x-14">
          <a href="/"><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Home</li></a>
          <a href=""><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">About Us</li></a>
          <a href=""><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Doctors</li></a>
          <a href=""><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Services</li></a>
          <a href=""><li className="hover:text-blue-800 cursor-pointer text-xl font-bold">Blog</li></a>
        </ul>
        
        {/* Desktop buttons */}
        <div className="hidden md:block">
            <a href="/login" className="flex">
          <button className="bg-blue-950 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg mr-2 md:mr-3 text-sm md:text-base" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>
            signup
          </button></a>
          <a href="/account">
            <img className="w-8 h-8 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile" />
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
            <button className="bg-blue-950 text-white px-3 py-1 rounded-lg text-sm flex-1" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>
             <LoginSignup/>
            </button>
            <button className="bg-blue-950 text-white px-3 py-1 rounded-lg text-sm flex-1" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>
            </button>
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
            <button className="mt-4 md:mt-6 bg-blue-950 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>
              Learn More
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <img src=".\src\assets\doctors.png" alt="Doctors" className="w-full" />
          </div>
        </header>
      </div>

      {/* Appointment Section */}
      <div className="flex flex-col md:flex-row gap-12 md:justify-center   md:px-10  md:mb-16">
        <div className="bg-blue-100 p-4 md:p-9 rounded-md shadow-sm w-full md:max-w-md">
          <h2 className="text-gray-700 font-medium text-base md:text-lg">
            Lorem ipsum dolor sit amet,
          </h2>
          <p className="text-gray-500 mb-3 md:mb-4 text-sm md:text-base">
            consectetuer adipiscing elit, sed
          </p>
          <button className="bg-blue-800 text-white font-medium py-2 md:py-3 px-3 md:px-4 rounded-md w-full tracking-wide text-sm md:text-base" style={{backgroundColor:"oklch(0.424 0.199 265.638)"}}>
            MAKE AN APPOINTMENT
          </button>
        </div>

        {/* Emergency */}
        <div className="bg-blue-100 p-4 md:p-8 content-center  rounded-md shadow-sm w-full md:max-w-md mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5 text-blue-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <h2 className="text-gray-600 text-lg md:text-xl font-medium">
              Emergency Call
            </h2>
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
      {/* <footer className="relative">
        {/* Wavy background */}
        {/* <div className="bg-blue-100 pt-10 md:pt-16 pb-6 md:pb-8"> */}
          {/* Content container */}
          {/* <div className="container mx-auto px-4 md:px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> */}
              {/* Column 1 - Brand */}
              {/* <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-1 mr-2">
                    <span className="text-white text-xs">+</span>
                  </div>
                  <span className="font-bold text-gray-800">CureCunnect</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  If you're in need of medicines –<br />
                  we're here by your side.<br />
                  Stay safe and buy online!
                </p>
                <div className="flex space-x-3">
                  <a href="#" aria-label="Instagram">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                      </svg>
                    </div>
                  </a> */}
                  {/* <a href="#" aria-label="LinkedIn">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                  </a>
                  <a href="#" aria-label="WhatsApp">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </div> */}
                  {/* </a>
                </div>
              </div> */}

              {/* Column 2 - Useful Pages */}
              {/* <div className="mt-6 sm:mt-0">
                <h3 className="font-semibold text-gray-800 mb-4 md:mb-6">Useful Pages</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-gray-800">Shop</a></li>
                  <li><a href="#" className="hover:text-gray-800">Gift Cards</a></li>
                  <li><a href="#" className="hover:text-gray-800">All Services</a></li>
                  <li><a href="#" className="hover:text-gray-800">About Us</a></li>
                  <li><a href="#" className="hover:text-gray-800">Contacts</a></li>
                </ul>
              </div> */}

              {/* Column 3 - Contacts */}
              {/* <div className="mt-6 lg:mt-0">
                <h3 className="font-semibold text-gray-800 mb-4 md:mb-6">Contacts</h3>
                <div className="text-gray-600 space-y-1">
                  <p>176 W Street Name, New York,</p>
                  <p>NY 10014</p>
                  <p className="mt-2">(123) 456-78-90</p>
                  <p>(123) 456-78-91</p>
                  <p className="mt-2">
                    <a href="mailto:sales@example.com" className="hover:text-gray-800">
                      sales@example.com
                    </a>
                  </p>
                </div>
              </div> */}

              {/* Column 4 - Newsletter */}
              {/* <div className="mt-6 lg:mt-0">
                <h3 className="font-semibold text-gray-800 mb-4 md:mb-6">Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Join our newsletter and receive<br />
                  10% off your first purchase
                </p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-white px-3 py-2 rounded-l-md flex-grow border border-gray-200"
                  />
                  <button
                    type="submit"
                    className="bg-white text-gray-800 px-4 py-2 rounded-r-md font-medium border border-l-0 border-gray-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Copyright Bar */}
        {/* <div className="bg-blue-800 py-3 md:py-4 text-white text-center text-xs md:text-sm">
          <div className="container mx-auto px-4 md:px-6">
            ©️ 2025 CureConnect
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Landing;