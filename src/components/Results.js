import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleMapEmbed from './GoogleMapEmbed';
import StarIcon from '@mui/icons-material/Star';
import './Results.css';

const Results = ({ results, searchParams }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const { type, guests } = searchParams;

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

  return (
    <div className="results-container">
      <div className="results-list">
        {type === 'flight' && filteredFlights.map((flight) => (
          <Link to={`/details?id=${flight.id}&type=flight`} key={flight.id} className="result-card-link">
            <Card
              className="result-card"
              onMouseEnter={() => setHoveredLocation(flight.coordinates)}
            >
              <CardContent>
                <Typography variant="h5">{flight.to}</Typography>
                <Typography>Departure: {new Date(flight.departure).toLocaleString()}</Typography>
                <Typography>Arrival: {new Date(flight.arrival).toLocaleString()}</Typography>
                <Typography>Price: ${flight.price}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
        {type === 'hotel' && filteredHotels.map((hotel) => (
          <Link to={`/details?id=${hotel.id}&type=hotel`} key={hotel.id} className="result-card-link">
            <Card
              className="result-card"
              onMouseEnter={() => setHoveredLocation(hotel.coordinates)}
            >
              <CardMedia
                component="img"
                alt={hotel.name}
                height="140"
                image={hotel.image}
                className="result-image"
              />
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
                <button class="btn">
    <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" class="bi bi-airplane-fill" viewBox="0 0 16 16">
  <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"></path>
</svg>
    </span>
    <span class="text">Book Now</span>
</button>
                </Box>
              </CardContent>
            </Card>
          </Link>
        ))}
        {type === 'hotel+flight' && filteredFlights.map((flight) => {
          const matchingHotel = filteredHotels.find(hotel => hotel.location === flight.to);
          return matchingHotel ? (
            <Link to={`/details?id=${flight.id}&type=hotel+flight`} key={flight.id} className="result-card-link">
              <Card
                className="result-card"
                onMouseEnter={() => setHoveredLocation(matchingHotel.coordinates)}
              >
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
