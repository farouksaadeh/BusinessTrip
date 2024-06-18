import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import SearchForm from './components/SearchForm';
import Results from './components/Results';

const App = () => {
  const [results, setResults] = useState({ flights: [], hotels: [] });
  const [searchParams, setSearchParams] = useState({
    type: 'flight',
    destination: '',
    fromDate: '',
    toDate: '',
    guests: 1,
    room: 1,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let flightsResponse;
        let hotelsResponse;

        if (searchParams.type === 'flight' || searchParams.type === 'hotel+flight') {
          flightsResponse = await axios.get('http://localhost:3001/flights');
        }
        if (searchParams.type === 'hotel' || searchParams.type === 'hotel+flight') {
          hotelsResponse = await axios.get('http://localhost:3001/hotels');
        }

        const filteredFlights = flightsResponse ? flightsResponse.data.filter(flight =>
          flight.to.toLowerCase().includes(searchParams.destination.toLowerCase())) : [];
        const filteredHotels = hotelsResponse ? hotelsResponse.data.filter(hotel =>
          hotel.location.toLowerCase().includes(searchParams.destination.toLowerCase())) : [];

        setResults({
          flights: filteredFlights,
          hotels: filteredHotels,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (searchParams.destination) {
      fetchData();
    }
  }, [searchParams]);

  return (
    <Container>
      <SearchForm onSearch={handleSearch} />
      <Results results={results} searchParams={searchParams} />
    </Container>
  );
};

export default App;
