import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia } from '@mui/material';

const DetailView = () => {
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('flightId');
  const hotelId = searchParams.get('hotelId');
  const id = searchParams.get('id');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let flightDetails, hotelDetails, itemDetails;
        if (flightId) {
          const flightResponse = await axios.get(`http://localhost:3001/flights/${flightId}`);
          flightDetails = flightResponse.data;
        }
        if (hotelId) {
          const hotelResponse = await axios.get(`http://localhost:3001/hotels/${hotelId}`);
          hotelDetails = hotelResponse.data;
        }
        if (id) {
          try {
            const flightResponse = await axios.get(`http://localhost:3001/flights/${id}`);
            itemDetails = { flight: flightResponse.data };
          } catch (error) {
            const hotelResponse = await axios.get(`http://localhost:3001/hotels/${id}`);
            itemDetails = { hotel: hotelResponse.data };
          }
        }
        setDetails({ flight: flightDetails, hotel: hotelDetails, item: itemDetails });
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
  }, [flightId, hotelId, id]);

  if (!details) return <div>Loading...</div>;

  return (
    <Container>
      {details.flight && (
        <Card style={{ margin: '1em' }}>
          <CardContent>
            <Typography variant="h5">Flight to {details.flight.to}</Typography>
            <Typography>Departure: {new Date(details.flight.departure).toLocaleString()}</Typography>
            <Typography>Arrival: {new Date(details.flight.arrival).toLocaleString()}</Typography>
            <Typography>Price: ${details.flight.price}</Typography>
          </CardContent>
        </Card>
      )}
      {details.hotel && (
        <Card style={{ margin: '1em' }}>
          <CardMedia
            component="img"
            alt={details.hotel.name}
            height="140"
            image={details.hotel.image}
          />
          <CardContent>
            <Typography variant="h5">{details.hotel.name}</Typography>
            <Typography>Location: {details.hotel.location}</Typography>
            <Typography>Price per night: ${details.hotel.price_per_night}</Typography>
          </CardContent>
        </Card>
      )}
      {details.item && details.item.flight && (
        <Card style={{ margin: '1em' }}>
          <CardContent>
            <Typography variant="h5">Flight to {details.item.flight.to}</Typography>
            <Typography>Departure: {new Date(details.item.flight.departure).toLocaleString()}</Typography>
            <Typography>Arrival: {new Date(details.item.flight.arrival).toLocaleString()}</Typography>
            <Typography>Price: ${details.item.flight.price}</Typography>
          </CardContent>
        </Card>
      )}
      {details.item && details.item.hotel && (
        <Card style={{ margin: '1em' }}>
          <CardMedia
            component="img"
            alt={details.item.hotel.name}
            height="140"
            image={details.item.hotel.image}
          />
          <CardContent>
            <Typography variant="h5">{details.item.hotel.name}</Typography>
            <Typography>Location: {details.item.hotel.location}</Typography>
            <Typography>Price per night: ${details.item.hotel.price_per_night}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default DetailView;
