import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import HospitalMap from './HospitalMap';
import HospitalList from './HospitalList';

function HospitalFinal() {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationMethod, setLocationMethod] = useState('');
  
  // CSS Variables
  const styles = {
    variables: {
      primaryBlue: '#1a73e8',
      secondaryBlue: '#4285f4',
      lightBlue: '#e8f0fe',
      darkBlue: '#174ea6',
      accentBlue: '#8ab4f8',
      textDark: '#202124',
      textLight: '#5f6368',
      white: '#ffffff',
      errorRed: '#d93025',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    appContainer: {
      maxWidth: '100%',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    header: {
      background: 'linear-gradient(135deg, #1a73e8, #174ea6)',
      color: '#ffffff',
      padding: '15px 20px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
      width: '100%',
    },
    headerTitle: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    locationAccuracy: {
      fontSize: '0.8rem',
      padding: '4px 10px',
      borderRadius: '12px',
      marginTop: '6px',
      display: 'inline-block',
    },
    locationAccuracyHigh: {
      backgroundColor: '#e6f4ea',
      color: '#137333',
    },
    locationAccuracyMedium: {
      backgroundColor: '#feefc3',
      color: '#976900',
    },
    locationAccuracyLow: {
      backgroundColor: '#fde7e9',
      color: '#d93025',
    },
    mainContent: {
      display: 'flex',
      width: '100%',
      height: 'calc(100vh - 60px)',
    },
    sidebar: {
      width: '25%',
      backgroundColor: '#ffffff',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
      padding: '20px',
      zIndex: 5,
    },
    mapSection: {
      width: '75%',
      height: '100%',
    },
    locationControls: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '15px',
      gap: '8px',
    },
    refreshLocationButton: {
      backgroundColor: '#1a73e8',
      color: '#ffffff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    refreshIcon: {
      fontSize: '14px',
    },
    manualLocationForm: {
      display: 'flex',
      gap: '8px',
    },
    locationInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #dadce0',
      borderRadius: '4px',
      fontSize: '14px',
    },
    miniSubmitButton: {
      backgroundColor: '#1a73e8',
      color: '#ffffff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 500,
    },
    errorContainer: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '20px',
      textAlign: 'center',
    },
    errorMessage: {
      backgroundColor: '#fde7e9',
      border: '1px solid #d93025',
      color: '#d93025',
      padding: '15px',
      borderRadius: '8px',
      margin: '20px auto',
      textAlign: 'center',
      maxWidth: '500px',
    },
    locationManualEntry: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    locationManualEntryText: {
      marginBottom: '10px',
      color: '#5f6368',
    },
    submitLocationButton: {
      backgroundColor: '#1a73e8',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 500,
      marginLeft: '8px',
      transition: 'background-color 0.2s',
    },
  };

  // Fetch hospitals based on location
  const fetchNearbyHospitals = useCallback(async (lat, lng) => {
    try {
      setLoading(true);
      // In development, this uses the Vite proxy configured in vite.config.js
      const response = await fetch(`/api/hospitals?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch nearby hospitals");
      }
      
      const data = await response.json();
      
      if (data.status === "REQUEST_DENIED") {
        throw new Error(`Google API error: ${data.error_message}`);
      }
      
      if (!data.results || data.results.length === 0) {
        setHospitals([]);
        setLoading(false);
        return;
      }
      
      setHospitals(data.results.slice(0, 10)); // Increased to top 10 results
      setLoading(false);
    } catch (error) {
      console.error("Hospital fetch error:", error);
      setError(error.message || "Failed to fetch nearby hospitals.");
      setLoading(false);
    }
  }, []);

  // Function to get precise location using Google Maps Geocoding API
  const refinePreciseLocation = useCallback(async (latitude, longitude) => {
    try {
      // This requires setting up a proxy endpoint on your server that forwards to Google's geocoding API
      const response = await fetch(`/api/geocode?latlng=${latitude},${longitude}`);
      
      if (!response.ok) {
        throw new Error('Failed to refine location');
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Get the most precise result (usually the first one)
        const location = data.results[0].geometry.location;
        return { 
          lat: location.lat, 
          lng: location.lng, 
          accuracy: 'high',
          method: 'geocode-api'
        };
      }
      
      return { lat: latitude, lng: longitude, accuracy: 'medium', method: 'geolocation-api' };
    } catch (error) {
      console.warn('Location refinement failed:', error);
      return { lat: latitude, lng: longitude, accuracy: 'medium', method: 'geolocation-api' };
    }
  }, []);

  // Get user location with multiple strategies
  const getUserLocation = useCallback(async () => {
    setLocationLoading(true);
    
    // Check if Google Maps API key is available
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key is missing. Please check your environment variables.");
      setLocationLoading(false);
      setLoading(false);
      return;
    }
    
    const locationOptions = { 
      enableHighAccuracy: true,
      timeout: 15000,  // Extended timeout
      maximumAge: 0    // Always get fresh position
    };
    
    try {
      // Try to get high accuracy location first
      if (navigator.geolocation) {
        const getPositionPromise = new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, locationOptions);
        });
        
        // Set a timeout in case getting high accuracy takes too long
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Location request timed out')), 15000);
        });
        
        // Race between getting position and timeout
        const position = await Promise.race([getPositionPromise, timeoutPromise]);
        
        const { latitude, longitude, accuracy } = position.coords;
        console.log("Location obtained:", latitude, longitude, "Accuracy:", accuracy, "meters");
        
        // Refine location using Google's geocoding for better accuracy
        const refinedLocation = await refinePreciseLocation(latitude, longitude);
        
        setUserLocation({ 
          lat: refinedLocation.lat, 
          lng: refinedLocation.lng 
        });
        setLocationAccuracy(refinedLocation.accuracy);
        setLocationMethod(refinedLocation.method);
        
        await fetchNearbyHospitals(refinedLocation.lat, refinedLocation.lng);
        setLocationLoading(false);
      } else {
        throw new Error("Geolocation is not supported by your browser.");
      }
    } catch (geoError) {
      console.error("Geolocation high-accuracy error:", geoError);
      
      // Fallback to IP-based geolocation
      try {
        console.log("Falling back to IP-based geolocation...");
        const response = await fetch('/api/ip-location');
        
        if (!response.ok) {
          throw new Error("IP location service failed");
        }
        
        const ipLocation = await response.json();
        
        if (ipLocation && ipLocation.latitude && ipLocation.longitude) {
          setUserLocation({ 
            lat: ipLocation.latitude, 
            lng: ipLocation.longitude 
          });
          setLocationAccuracy('low');
          setLocationMethod('ip-based');
          
          await fetchNearbyHospitals(ipLocation.latitude, ipLocation.longitude);
        } else {
          throw new Error("Could not determine location from IP");
        }
      } catch (ipError) {
        console.error("IP geolocation error:", ipError);
        setError("Unable to determine your location. Please allow location access or enter your location manually.");
      } finally {
        setLocationLoading(false);
      }
    }
  }, [fetchNearbyHospitals, refinePreciseLocation]);

  // Update location manually
  const updateLocationManually = useCallback(async (address) => {
    try {
      setLocationLoading(true);
      
      // Geocode the address to coordinates
      const response = await fetch(`/api/geocode-address?address=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        
        setUserLocation({ 
          lat: location.lat, 
          lng: location.lng 
        });
        setLocationAccuracy('high');
        setLocationMethod('manual-input');
        
        await fetchNearbyHospitals(location.lat, location.lng);
      } else {
        throw new Error('Could not find location from address');
      }
    } catch (error) {
      console.error("Manual location update error:", error);
      setError("Could not find the location you entered. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  }, [fetchNearbyHospitals]);

  // Refresh user's location
  const refreshLocation = () => {
    setError(null);
    getUserLocation();
  };

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  // Location accuracy banner message
  const getLocationAccuracyMessage = () => {
    if (!locationAccuracy) return null;
    
    switch (locationAccuracy) {
      case 'high':
        return 'Your location is highly accurate';
      case 'medium':
        return 'Your location is moderately accurate';
      case 'low':
        return 'Your location may not be precise';
      default:
        return null;
    }
  };

  // Get location accuracy style based on current accuracy
  const getLocationAccuracyStyle = () => {
    const baseStyle = styles.locationAccuracy;
    
    switch(locationAccuracy) {
      case 'high':
        return { ...baseStyle, ...styles.locationAccuracyHigh };
      case 'medium':
        return { ...baseStyle, ...styles.locationAccuracyMedium };
      case 'low':
        return { ...baseStyle, ...styles.locationAccuracyLow };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Nearby Hospitals</h1>
        {locationAccuracy && !locationLoading && (
          <div style={getLocationAccuracyStyle()}>
            {getLocationAccuracyMessage()}
          </div>
        )}
      </header>
      
      {locationLoading || loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>{error}</div>
          <button 
            style={styles.refreshLocationButton} 
            onClick={refreshLocation}
          >
            Retry with Location Services
          </button>
          <div style={styles.locationManualEntry}>
            <p style={styles.locationManualEntryText}>Or enter your location manually:</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const address = e.target.elements.address.value;
              if (address) updateLocationManually(address);
            }}>
              <input 
                type="text" 
                name="address" 
                placeholder="Enter address, city, or postal code"
                style={styles.locationInput}
              />
              <button 
                type="submit" 
                style={styles.submitLocationButton}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={styles.mainContent}>
          <div style={styles.sidebar}>
            <div style={styles.locationControls}>
              <button 
                style={styles.refreshLocationButton} 
                onClick={refreshLocation}
              >
                <span style={styles.refreshIcon}>↻</span> Refresh My Location
              </button>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const address = e.target.elements.address.value;
                  if (address) updateLocationManually(address);
                }} 
                style={styles.manualLocationForm}
              >
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Search different location"
                  style={styles.locationInput}
                />
                <button 
                  type="submit" 
                  style={styles.miniSubmitButton}
                >
                  Go
                </button>
              </form>
            </div>
            <HospitalList 
              hospitals={hospitals} 
              userLocation={userLocation} 
              selectedHospital={selectedHospital}
              onHospitalSelect={handleHospitalSelect}
            />
          </div>
          <div style={styles.mapSection}>
            <HospitalMap 
              userLocation={userLocation} 
              hospitals={hospitals} 
              selectedHospital={selectedHospital}
              onLocationUpdate={(newLocation) => {
                setUserLocation(newLocation);
                fetchNearbyHospitals(newLocation.lat, newLocation.lng);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalFinal;