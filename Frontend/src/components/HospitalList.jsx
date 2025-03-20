import React from 'react';

const HospitalList = ({ hospitals, userLocation, selectedHospital, onHospitalSelect }) => {
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Generate hospital type badge
  const getBadge = (types) => {
    if (types && types.includes('hospital')) {
      return <span className="hospital-badge">Hospital</span>;
    } else if (types && types.includes('doctor')) {
      return <span className="doctor-badge">Doctor</span>;
    } else {
      return <span className="medical-badge">Medical</span>;
    }
  };

  return (
    <div className="hospital-list">
      <h2>Nearest Hospitals</h2>
      {hospitals.length === 0 ? (
        <div className="no-results">
          <i className="no-results-icon">📍</i>
          <p>No hospitals found nearby.</p>
          <p className="no-results-subtitle">Try expanding your search area or checking your location settings.</p>
        </div>
      ) : (
        <ul>
          {hospitals.map((hospital) => {
            const distance = userLocation ?
              calculateDistance(
                userLocation.lat, 
                userLocation.lng,
                hospital.geometry.location.lat,
                hospital.geometry.location.lng
              ) : 'N/A';
              
            const isSelected = selectedHospital && selectedHospital.place_id === hospital.place_id;
              
            return (
              <li 
                key={hospital.place_id} 
                className={`hospital-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onHospitalSelect(hospital)}
              >
                <h3>{hospital.name}</h3>
                <p className="hospital-address">{hospital.vicinity}</p>
                <div className="hospital-details">
                  <span className="hospital-distance">
                    <i className="distance-icon">📍</i> {distance} km away
                  </span>
                  <span className="hospital-rating">
                    {hospital.rating ? (
                      <>
                        <i className="rating-icon">★</i> {hospital.rating}
                      </>
                    ) : 'Rating: N/A'}
                  </span>
                </div>
                {hospital.types && getBadge(hospital.types)}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.geometry.location.lat},${hospital.geometry.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-button"
                >
                  Get Directions
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HospitalList;