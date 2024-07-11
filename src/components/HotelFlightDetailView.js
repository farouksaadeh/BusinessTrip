import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './HotelFlightDetailView.css';

const HotelFlightDetailView = ({ flightId, hotelId }) => {
  const [flight, setFlight] = useState(null);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const flightResponse = await axios.get(`http://localhost:3001/flights/${flightId}`);
        setFlight(flightResponse.data);
        const hotelResponse = await axios.get(`http://localhost:3001/hotels/${hotelId}`);
        setHotel(hotelResponse.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    if (flightId && hotelId) {
      fetchDetails();
    }
  }, [flightId, hotelId]);

  if (!flight || !hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hotel-flight-detail-container">
      <h1>Hotel und Flug Details</h1>
      <div className="details">
        <div className="flight-details">
          <h2>Flugdaten</h2>
          <p>Ziel: {flight.to}</p>
          <p>Abflug: {new Date(flight.departure).toLocaleString()}</p>
          <p>Ankunft: {new Date(flight.arrival).toLocaleString()}</p>
          <p>Preis: €{flight.price}</p>
        </div>
        <div className="hotel-details">
          <h2>Hoteldaten</h2>
          <p>Hotel: {hotel.name}</p>
          <p>Standort: {hotel.location}</p>
          <p>Preis pro Nacht: CHF {hotel.price_per_night}</p>
        </div>
      </div>
    </div>
  );
};

export default HotelFlightDetailView;
