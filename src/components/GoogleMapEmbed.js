import React, { useState } from 'react';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';

const GoogleMapEmbed = ({ lat, lng }) => {
  const [mapType, setMapType] = useState('m');

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'm' ? 'k' : 'm'));
  };

  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&t=${mapType}&z=14&output=embed`;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, borderRadius: '20px 0 0 20px' }}
        src={mapSrc}
        allowFullScreen
        title="Google Map"
      ></iframe>
      <button className="map-toggle-button" onClick={toggleMapType}>
        {mapType === 'm' ? (
          <SatelliteIcon style={{ color: 'white' }} />
        ) : (
          <MapIcon style={{ color: 'white' }} />
        )}
      </button>
    </div>
  );
};

export default GoogleMapEmbed;
