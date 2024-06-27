// components/DetailView.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './DetailView.css'; // Import the correct CSS file

const DetailView = () => {
  const [data, setData] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for ID:', id, 'Type:', type);
        let response;
        if (type === 'flight') {
          response = await axios.get(`http://localhost:3001/flights/${id}`);
        } else if (type === 'hotel') {
          response = await axios.get(`http://localhost:3001/hotels/${id}`);
        } else if (type === 'hotel+flight') {
          const flightResponse = await axios.get(`http://localhost:3001/flights/${id}`);
          const hotelResponse = await axios.get(`http://localhost:3001/hotels/${id}`);
          response = { data: { flight: flightResponse.data, hotel: hotelResponse.data } };
        }
        console.log('Data fetched:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id, type]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-container">
      {type === 'hotel+flight' ? (
        <>
          <h1>{data.hotel.name}</h1>
          <img src={data.hotel.image} alt={data.hotel.name} />
          <p>{data.hotel.description}</p>
          <h2>Flight Details</h2>
          <p>Flight to: {data.flight.to}</p>
          <p>Departure: {new Date(data.flight.departure).toLocaleString()}</p>
          <p>Arrival: {new Date(data.flight.arrival).toLocaleString()}</p>
        </>
      ) : type === 'hotel' ? (
        <>
          <h1>{data.name}</h1>
          <img src={data.image} alt={data.name} />
          <p>{data.description}</p>
        </>
      ) : (
        <>
          <h1>Flight to {data.to}</h1>
          <p>Departure: {new Date(data.departure).toLocaleString()}</p>
          <p>Arrival: {new Date(data.arrival).toLocaleString()}</p>
        </>
      )}
    </div>
  );
};

export default DetailView;
