import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Results = ({ results, searchParams }) => {
  const { type, guests } = searchParams;

  const calculateTotalPrice = (flight, hotel, guests) => {
    const hotelPrice = hotel.price_per_night * guests;
    return hotelPrice + flight.price;
  };

  const filteredFlights = Array.isArray(results.flights) ? results.flights : [];
  const filteredHotels = Array.isArray(results.hotels) ? results.hotels : [];

  return (
    <div>
      {type === 'flight' && filteredFlights.map((flight) => (
        <Card key={flight.id} style={{ margin: '1em' }}>
          <CardContent>
            <Typography variant="h5">{flight.to}</Typography>
            <Typography>Departure: {new Date(flight.departure).toLocaleString()}</Typography>
            <Typography>Arrival: {new Date(flight.arrival).toLocaleString()}</Typography>
            <Typography>Price: ${flight.price}</Typography>
            <Link to={`/details?id=${flight.id}`}>Details</Link>
          </CardContent>
        </Card>
      ))}
      {type === 'hotel' && filteredHotels.map((hotel) => (
        <Card key={hotel.id} style={{ margin: '1em' }}>
          <CardMedia
            component="img"
            alt={hotel.name}
            height="140"
            image={hotel.image}
          />
          <CardContent>
            <Typography variant="h5">{hotel.name}</Typography>
            <Typography>Location: {hotel.location}</Typography>
            <Typography>Price per night: ${hotel.price_per_night}</Typography>
            <Link to={`/details?id=${hotel.id}`}>Details</Link>
          </CardContent>
        </Card>
      ))}
      {type === 'hotel+flight' && filteredFlights.map((flight) => {
        const matchingHotel = filteredHotels.find(hotel => hotel.location === flight.to);
        return matchingHotel ? (
          <Card key={flight.id} style={{ margin: '1em' }}>
            <CardContent>
              <Typography variant="h5">{flight.to}</Typography>
              <Typography>Departure: {new Date(flight.departure).toLocaleString()}</Typography>
              <Typography>Arrival: {new Date(flight.arrival).toLocaleString()}</Typography>
              <Typography>Flight Price: ${flight.price}</Typography>
              <Typography>Hotel: {matchingHotel.name}</Typography>
              <Typography>Hotel Price per night: ${matchingHotel.price_per_night}</Typography>
              <Typography>Total Price for {guests} guests: ${calculateTotalPrice(flight, matchingHotel, guests)}</Typography>
              <Link to={`/details?flightId=${flight.id}&hotelId=${matchingHotel.id}`}>Details</Link>
            </CardContent>
          </Card>
        ) : null;
      })}
    </div>
  );
};

export default Results;
