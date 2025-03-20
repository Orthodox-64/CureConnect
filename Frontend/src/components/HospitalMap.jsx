import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const HospitalMap = ({ userLocation, hospitals, selectedHospital, onLocationUpdate }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isLocationUpdateMode, setIsLocationUpdateMode] = useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };
  
  const center = userLocation || { lat: 40.7128, lng: -74.0060 }; // Default to NYC if no location
  
  // Initialize Google Maps objects once the map is loaded
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    
    // Create InfoWindow instance
    const infoWindowInstance = new window.google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
    
    // Add click listener for updating location
    mapInstance.addListener('click', (event) => {
      if (isLocationUpdateMode) {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        // Show confirmation before updating
        if (infoWindowInstance) {
          infoWindowInstance.setContent(`
            <div class="info-window update-location">
              <h3>Update your location?</h3>
              <p>Do you want to set this as your current location?</p>
              <button id="confirm-location-update" class="location-confirm-button">Yes, Update</button>
              <button id="cancel-location-update" class="location-cancel-button">Cancel</button>
            </div>
          `);
          
          infoWindowInstance.setPosition(newLocation);
          infoWindowInstance.open(mapInstance);
          
          // We need to add event listeners after the InfoWindow is opened
          window.google.maps.event.addListenerOnce(infoWindowInstance, 'domready', () => {
            document.getElementById('confirm-location-update').addEventListener('click', () => {
              if (onLocationUpdate) {
                onLocationUpdate(newLocation);
              }
              infoWindowInstance.close();
              setIsLocationUpdateMode(false);
            });
            
            document.getElementById('cancel-location-update').addEventListener('click', () => {
              infoWindowInstance.close();
              setIsLocationUpdateMode(false);
            });
          });
        }
      }
    });
  };
  
  // Clean up markers on component unmount
  useEffect(() => {
    return () => {
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
      }
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [markers, infoWindow]);
  
  // Create or update markers when map, userLocation, or hospitals change
  useEffect(() => {
    if (!map || !window.google) return;
    
    // Clear any existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];
    
    // Add user location marker
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        map,
        position: userLocation,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#2196F3',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        },
        draggable: true // Make user location marker draggable
      });
      
      // Add drag end listener for updating location
      userMarker.addListener('dragend', () => {
        const newPosition = userMarker.getPosition();
        const newLocation = {
          lat: newPosition.lat(),
          lng: newPosition.lng()
        };
        
        if (infoWindow) {
          infoWindow.setContent(`
            <div class="info-window update-location">
              <h3>Update your location?</h3>
              <p>Do you want to set this as your current location?</p>
              <button id="confirm-location-update" class="location-confirm-button">Yes, Update</button>
              <button id="cancel-location-update" class="location-cancel-button">Cancel</button>
            </div>
          `);
          
          infoWindow.open({
            anchor: userMarker,
            map
          });
          
          // We need to add event listeners after the InfoWindow is opened
          window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            document.getElementById('confirm-location-update').addEventListener('click', () => {
              if (onLocationUpdate) {
                onLocationUpdate(newLocation);
              }
              infoWindow.close();
            });
            
            document.getElementById('cancel-location-update').addEventListener('click', () => {
              // Reset marker position to original location
              userMarker.setPosition(userLocation);
              infoWindow.close();
            });
          });
        }
      });
      
      newMarkers.push(userMarker);
    }
    
    // Add hospital markers
    hospitals.forEach((hospital) => {
      const position = {
        lat: hospital.geometry.location.lat,
        lng: hospital.geometry.location.lng
      };
      
      const hospitalMarker = new window.google.maps.Marker({
        map,
        position,
        title: hospital.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#F44336',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 7
        }
      });
      
      // Add click listener
      hospitalMarker.addListener("click", () => {
        // Set info window content
        infoWindow.setContent(`
          <div class="info-window">
            <h3>${hospital.name}</h3>
            <p>${hospital.vicinity}</p>
            <p>Rating: ${hospital.rating || 'N/A'}</p>
          </div>
        `);
        
        infoWindow.open({
          anchor: hospitalMarker,
          map
        });
      });
      
      newMarkers.push(hospitalMarker);
    });
    
    setMarkers(newMarkers);
    
    // Center map on user location if available
    if (userLocation && map) {
      map.setCenter(userLocation);
      map.setZoom(13);
    }
  }, [map, userLocation, hospitals, infoWindow, onLocationUpdate]);
  
  // Handle changes to selectedHospital
  useEffect(() => {
    if (!map || !selectedHospital || !markers.length) return;
    
    // Find the marker for the selected hospital
    const selectedPosition = {
      lat: selectedHospital.geometry.location.lat,
      lng: selectedHospital.geometry.location.lng
    };
    
    // Center map on selected hospital
    map.panTo(selectedPosition);
    
    // Open info window for selected hospital
    if (infoWindow) {
      // Find the marker for the selected hospital
      const selectedMarker = markers.find(marker => 
        marker.getPosition().lat() === selectedPosition.lat &&
        marker.getPosition().lng() === selectedPosition.lng
      );
      
      if (selectedMarker) {
        infoWindow.setContent(`
          <div class="info-window">
            <h3>${selectedHospital.name}</h3>
            <p>${selectedHospital.vicinity}</p>
            <p>Rating: ${selectedHospital.rating || 'N/A'}</p>
          </div>
        `);
        
        infoWindow.open({
          anchor: selectedMarker,
          map
        });
      }
    }
  }, [selectedHospital, map, markers, infoWindow]);
  
  const toggleLocationUpdateMode = () => {
    setIsLocationUpdateMode(!isLocationUpdateMode);
    
    if (map && infoWindow) {
      if (!isLocationUpdateMode) {
        // Show instruction when entering location update mode
        infoWindow.setContent(`
          <div class="info-window">
            <p>Click anywhere on the map to set your location</p>
          </div>
        `);
        
        infoWindow.setPosition(map.getCenter());
        infoWindow.open(map);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          if (infoWindow) {
            infoWindow.close();
          }
        }, 3000);
      } else {
        // Close any open info window when exiting location update mode
        infoWindow.close();
      }
    }
  };
  
  return (
    <div className="map-container">
      {mapError ? (
        <div className="error-message">{mapError}</div>
      ) : (
        <>
          <div className="map-controls">
            <button 
              className={`update-location-button ${isLocationUpdateMode ? 'active' : ''}`} 
              onClick={toggleLocationUpdateMode}
              title="Click to set location on map"
            >
              {isLocationUpdateMode ? 'Cancel' : 'Set Location on Map'}
            </button>
          </div>
          <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
            onError={(error) => {
              console.error("Google Maps loading error:", error);
              setMapError("Failed to load Google Maps. Please try again later.");
            }}
            loadingElement={<div className="loading-map">Loading Maps...</div>}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={onMapLoad}
              options={{
                styles: [
                  {
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }]
                  },
                  {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#c9e8ff" }]
                  },
                  {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#e5f5e0" }]
                  },
                  {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                  },
                  {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [{ color: "#e3e3e3" }]
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#dadada" }]
                  }
                ],
                fullscreenControl: false,
                mapTypeControl: true,  // Enable map type control
                streetViewControl: true,  // Enable street view for better location verification
                zoomControl: true,
              }}
            />
          </LoadScript>
        </>
      )}
    </div>
  );
};

export default HospitalMap;