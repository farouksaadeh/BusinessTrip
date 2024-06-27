// components/GoogleMapEmbed.js
import React from 'react';

const GoogleMapEmbed = ({ lat, lng }) => {
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      src={mapSrc}
      allowFullScreen
      title="Google Map"
    ></iframe>
  );
};

export default GoogleMapEmbed;
