// components/Results.js
import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleMapEmbed from './GoogleMapEmbed';
import './Results.css';

const Results = ({ results, searchParams }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const { type, destination, guests } = searchParams;

  const calculateTotalPrice = (flight, hotel, guests) => {
    const hotelPrice = hotel.price_per_night * guests;
    return hotelPrice + flight.price;
  };

  const filteredFlights = Array.isArray(results.flights) ? results.flights : [];
  const filteredHotels = Array.isArray(results.hotels) ? results.hotels : [];

  return (
    <div className="results-container">
      <div className="results-list">
        {type === 'flight' && filteredFlights.map((flight) => (
          <Link to={`/details?id=${flight.id}&type=flight`} key={flight.id} className="result-card-link">
            <Card
              className="result-card"
              onMouseEnter={() => setHoveredLocation({ lat: flight.latitude, lng: flight.longitude })}
              onMouseLeave={() => setHoveredLocation(null)}
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
              onMouseEnter={() => setHoveredLocation({ lat: hotel.latitude, lng: hotel.longitude })}
              onMouseLeave={() => setHoveredLocation(null)}
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
                  <Typography>{hotel.distance_to_city_center} km vom Stadtzentrum</Typography>
                  <Typography className="rating">{hotel.rating} {hotel.reviews} Bewertungen</Typography>
                  <Typography>{hotel.price_per_night} CHF / Nacht</Typography>
                </Box>
                <Box className="result-price">
                  <Button variant="contained" color="primary">Zum Angebot</Button>
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
                onMouseEnter={() => setHoveredLocation({ lat: matchingHotel.latitude, lng: matchingHotel.longitude })}
                onMouseLeave={() => setHoveredLocation(null)}
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
                    <Button variant="contained" color="primary">Zum Angebot</Button>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ) : null;
        })}
      </div>
      <div className="map-container">
        {hoveredLocation && <GoogleMapEmbed lat={hoveredLocation.lat} lng={hoveredLocation.lng} />}
      </div>
    </div>
  );
};

export default Results;
