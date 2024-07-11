import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleMapEmbed from './GoogleMapEmbed';
import StarIcon from '@mui/icons-material/Star';
import PexelsImageGallery from './PexelsImageGallery';
import './Results.css';

const Results = ({ results, searchParams, user, isLoggedIn }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { type, guests } = searchParams;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/favorites?userId=${user.id}`);
          setFavorites(response.data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [isLoggedIn, user.id]);

  const handleFavoriteClick = async (item) => {
    if (!isLoggedIn) {
      alert('Bitte melden Sie sich an, um Favoriten hinzuzufügen.');
      return;
    }

    const isFavorite = favorites.some(fav => fav.itemId === item.id && fav.itemType === type);

    if (isFavorite) {
      const favorite = favorites.find(fav => fav.itemId === item.id && fav.itemType === type);
      await axios.delete(`http://localhost:3001/favorites/${favorite.id}`);
      setFavorites(favorites.filter(fav => fav.id !== favorite.id));
    } else {
      const newFavorite = {
        userId: user.id,
        itemId: item.id,
        itemType: type,
        name: type === 'flight' ? item.to : item.name,
        price: type === 'flight' ? item.price : item.price_per_night
      };
      const response = await axios.post('http://localhost:3001/favorites', newFavorite);
      setFavorites([...favorites, response.data]);
    }
  };

  const calculateTotalPrice = (flight, hotel, guests) => {
    const hotelPrice = hotel.price_per_night * guests;
    return hotelPrice + flight.price;
  };

  const filteredFlights = Array.isArray(results.flights) ? results.flights : [];
  const filteredHotels = Array.isArray(results.hotels) ? results.hotels : [];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          style={{
            fontSize: '16px', // Smaller star size
            color:
              rating >= i + 1
                ? rating >= 4
                  ? 'green'
                  : 'orange'
                : '#e0e0e0',
          }}
        />
      );
    }
    return stars;
  };

  const renderRating = (rating) => (
    <span style={{ 
      fontWeight: rating >= 4 ? 'bold' : 'normal', 
      color: rating >= 4 ? 'green' : 'orange' 
    }}>
      {rating}
    </span>
  );

  const isItemFavorite = (item) => {
    return favorites.some(fav => fav.itemId === item.id && fav.itemType === type);
  };

  return (
    <div className="results-container">
      <div className="results-list">
        {type === 'flight' && filteredFlights.map((flight) => (
          <div key={flight.id} className="result-card-container">
            <Link to={`/details?id=${flight.id}&type=flight`} className="result-card-link">
              <Card
                className="result-card"
                onMouseEnter={() => setHoveredLocation(flight.coordinates)}
              >
                <PexelsImageGallery query={`${flight.from} to ${flight.to} flight`} alt={`${flight.from} to ${flight.to} flight`} />
                <CardContent>
                  <Typography variant="h5">{flight.to}</Typography>
                  <Typography>Departure: {new Date(flight.departure).toLocaleString()}</Typography>
                  <Typography>Arrival: {new Date(flight.arrival).toLocaleString()}</Typography>
                  <Typography>Price: ${flight.price}</Typography>
                  <Box className="result-price">
                    <button className="btn">
                      <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 16 16">
                          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"></path>
                        </svg>
                      </span>
                      <span className="text">Book Now</span>
                    </button>
                  </Box>
                </CardContent>
              </Card>
            </Link>
            <button
              className={`favorite-btn ${isItemFavorite(flight) ? 'favorite' : ''}`}
              onClick={() => handleFavoriteClick(flight)}
            >
              {isItemFavorite(flight) ? '❤️ ' : '♡ '}
            </button>
          </div>
        ))}
        {type === 'hotel' && filteredHotels.map((hotel) => (
          <div key={hotel.id} className="result-card-container">
            <Link to={`/details?id=${hotel.id}&type=hotel`} className="result-card-link">
              <Card
                className="result-card"
                onMouseEnter={() => setHoveredLocation(hotel.coordinates)}
              >
                <PexelsImageGallery query={hotel.name} alt={hotel.name} />
                <CardContent className="result-content">
                  <Box className="result-details">
                    <Typography variant="h5">{hotel.name}</Typography>
                    <Typography>{hotel.location}</Typography>
                    <Typography className="rating">
                      {renderRating(hotel.rating)} {renderStars(hotel.rating)}
                    </Typography>
                    <Typography>{hotel.reviews} Bewertungen</Typography>
                    <Typography>{hotel.price_per_night} CHF / Nacht</Typography>
                  </Box>
                  <Box className="result-price">
                    <button className="btn">
                      <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 16 16">
                          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"></path>
                      </svg>
                      </span>
                      <span className="text">Book Now</span>
                    </button>
                  </Box>
                </CardContent>
              </Card>
            </Link>
            <button
              className={`favorite-btn ${isItemFavorite(hotel) ? 'favorite' : ''}`}
              onClick={() => handleFavoriteClick(hotel)}
            >
              {isItemFavorite(hotel) ? '❤️ ' : '♡ '}
            </button>
          </div>
        ))}
        {type === 'hotel-flight' && filteredFlights.map((flight) => {
          const matchingHotel = filteredHotels.find(hotel => hotel.location === flight.to);
          return matchingHotel ? (
            <div key={flight.id} className="result-card-container">
              <Link to={`/details?flightId=${flight.id}&hotelId=${matchingHotel.id}&type=hotel-flight`} className="result-card-link">
                <Card
                  className="result-card"
                  onMouseEnter={() => setHoveredLocation(matchingHotel.coordinates)}
                >
                  <PexelsImageGallery query={`${flight.from} to ${flight.to} flight`} alt={`${flight.from} to ${flight.to} flight`} />
                  <CardContent className="result-content">
                    <Box className="result-details">
                      <Typography variant="h5">{flight.to}</Typography>
                      <Typography>Departure: {new Date(flight.departure).toLocaleString()}</Typography>
                      <Typography>Arrival: {new Date(flight.arrival).toLocaleString()}</Typography>
                      <Typography>Flight Price: ${flight.price}</Typography>
                      <Typography>Hotel: {matchingHotel.name}</Typography>
                      <Typography>Hotel Price per night: ${matchingHotel.price_per_night}</Typography>
                      <Typography>Total Price for {guests} guests: ${calculateTotalPrice(flight, matchingHotel, guests)}</Typography>
                    </Box>
                    <Box className="result-price">
                      <button className="btn" variant="contained">
                        <span className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 16 16">
                            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"></path>
                          </svg>
                        </span>
                        <span className="text">Book Now</span>
                      </button>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
              <button
                className={`favorite-btn ${isItemFavorite(flight) ? 'favorite' : ''}`}
                onClick={() => handleFavoriteClick(flight)}
              >
                {isItemFavorite(flight) ? '❤️ ' : '♡ '}
              </button>
            </div>
          ) : null;
        })}
      </div>
      <div className="map-container">
        {hoveredLocation && <GoogleMapEmbed lat={hoveredLocation.latitude} lng={hoveredLocation.longitude} />}
      </div>
    </div>
  );
};

export default Results;
