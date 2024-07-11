// FavoriteButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FavoriteButton.css';

const FavoriteButton = ({ userId, itemId, itemType }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/favorites?userId=${userId}&itemId=${itemId}&itemType=${itemType}`);
        setIsFavorite(response.data.length > 0);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (userId) {
      checkFavorite();
    }
  }, [userId, itemId, itemType]);

  const handleFavoriteToggle = async () => {
    if (!userId) {
      setShowPopup(true);
      return;
    }

    try {
      if (isFavorite) {
        const favorite = await axios.get(`http://localhost:3001/favorites?userId=${userId}&itemId=${itemId}&itemType=${itemType}`);
        await axios.delete(`http://localhost:3001/favorites/${favorite.data[0].id}`);
      } else {
        await axios.post('http://localhost:3001/favorites', { userId, itemId, itemType });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <div>
      <div className="heart-container" title="Like" onClick={handleFavoriteToggle}>
        <input type="checkbox" className="checkbox" checked={isFavorite} readOnly />
        <div className="svg-container">
          <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
            </path>
          </svg>
          <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
            </path>
          </svg>
          <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,10 20,20"></polygon>
            <polygon points="10,50 20,50"></polygon>
            <polygon points="20,80 30,70"></polygon>
            <polygon points="90,10 80,20"></polygon>
            <polygon points="90,50 80,50"></polygon>
            <polygon points="80,80 70,70"></polygon>
          </svg>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Du bist noch nicht eingeloggt, um zu favorisieren.</p>
            <button onClick={() => navigate('/login')}>Anmelden</button>
            <button onClick={() => navigate('/register')}>Registrieren</button>
            <button onClick={() => setShowPopup(false)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;
