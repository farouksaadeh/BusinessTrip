import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import './Favorites.css';

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/favorites?userId=${user.id}`);
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user.id]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost:3001/favorites/${favoriteId}`);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favoriten</h2>
      <div className="favorites-list">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="favorite-card">
            <CardContent>
              <Typography variant="h5">{favorite.name}</Typography>
              <Typography>Typ: {favorite.itemType}</Typography>
              <Typography>Preis: ${favorite.price}</Typography>
              <button className="remove-favorite-btn" onClick={() => handleRemoveFavorite(favorite.id)}>Remove Favorite</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
