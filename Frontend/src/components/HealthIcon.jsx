import React from 'react';

export const HealthIcon = () => {
  return (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="health-icon"
    >
      <circle cx="32" cy="32" r="30" fill="#33C3F0" fillOpacity="0.2" />
      <circle cx="32" cy="32" r="24" stroke="#0077B6" strokeWidth="2" />
      <path d="M32 20V44" stroke="#0077B6" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 32H44" stroke="#0077B6" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export default HealthIcon;