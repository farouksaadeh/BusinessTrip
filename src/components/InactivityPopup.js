// src/components/InactivityPopup.js
import React from 'react';
import './InactivityPopup.css';

const InactivityPopup = () => {
  return (
    <div className="inactivity-overlay">
      <div className="inactivity-popup">
      <div class="🤚">
	    <div class="👉"></div>
	    <div class="👉"></div>
	    <div class="👉"></div>
	    <div class="👉"></div>
	    <div class="🌴"></div>		
	    <div class="👍"></div>
      </div>
        <h2>Bist du noch am Überlegen?</h2>
        <p>Die Session läuft bald ab.</p>
      </div>
    </div>
  );
};

export default InactivityPopup;
