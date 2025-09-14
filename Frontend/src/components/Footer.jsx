import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    const footerStyle = {
        backgroundColor: '#1a202c',
        color: '#e2e8f0'
    };

    const linkStyle = {
        color: '#a0aec0',
        transition: 'color 0.2s'
    };

    return (
        <footer className="relative">
        {/* Wavy background */}
        <div className="bg-blue-100 pt-10 md:pt-16 pb-6 md:pb-8">
          {/* Content container */}
          <div className="container mx-auto px-4 md:px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Column 1 - Brand */}
              <div>
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
                  </a>
                  <a href="#" aria-label="LinkedIn">
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
                    </div>
                  </a>
                </div>
              </div>

              {/* Column 2 - Useful Pages */}
              <div className="mt-6 sm:mt-0">
                <h3 className="font-semibold text-gray-800 mb-4 md:mb-6">Useful Pages</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-gray-800">Shop</a></li>
                  <li><a href="#" className="hover:text-gray-800">Gift Cards</a></li>
                  <li><a href="#" className="hover:text-gray-800">All Services</a></li>
                  <li><a href="#" className="hover:text-gray-800">About Us</a></li>
                  <li><a href="#" className="hover:text-gray-800">Contacts</a></li>
                </ul>
              </div>

              {/* Column 3 - Contacts */}
              <div className="mt-6 lg:mt-0">
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
              </div>

              {/* Column 4 - Newsletter */}
              <div className="mt-6 lg:mt-0">
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
        </div>

        {/* Copyright Bar */}
        <div className="bg-blue-800 py-3 md:py-4 text-white text-center text-xs md:text-sm">
          <div className="container mx-auto px-4 md:px-6">
            ©️ 2025 CureConnect
          </div>
        </div>
      </footer>
    );
}

export default Footer;