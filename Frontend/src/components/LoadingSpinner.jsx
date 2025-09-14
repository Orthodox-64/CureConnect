import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Finding nearby hospitals...</p>
      <p className="loading-subtitle">Please wait while we locate the closest medical facilities</p>
    </div>
  );
};

export default LoadingSpinner;