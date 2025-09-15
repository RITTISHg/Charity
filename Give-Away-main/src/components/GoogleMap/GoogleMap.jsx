import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ location, isLoaded, loadError }) => {
  const [coordinates, setCoordinates] = React.useState(null);

  React.useEffect(() => {
    if (location) {
      // Convert address to coordinates using Geocoding service
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK') {
          setCoordinates({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    }
  }, [location]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  const defaultCenter = {
    lat: 51.509865,  // Default to London coordinates
    lng: -0.118092
  };

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={coordinates || defaultCenter}
    >
      {coordinates && <Marker position={coordinates} />}
    </GoogleMap>
  );
};

export default function WrappedMap({ location }) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <MapComponent location={location} />
    </LoadScript>
  );
}
