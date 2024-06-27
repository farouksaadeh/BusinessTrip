import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import DetailView from './components/DetailView'; // New import for the detail view
import Header from './components/Header';
import './App.css'; // Ensure you have the App.css imported

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
          console.log('Fetched Flights:', flightsResponse.data);
        }
        if (searchParams.type === 'hotel' || searchParams.type === 'hotel+flight') {
          hotelsResponse = await axios.get('http://localhost:3001/hotels');
          console.log('Fetched Hotels:', hotelsResponse.data);
        }

        const filteredFlights = flightsResponse ? flightsResponse.data.filter(flight =>
          flight.to.toLowerCase().includes(searchParams.destination.toLowerCase())) : [];
        const filteredHotels = hotelsResponse ? hotelsResponse.data.filter(hotel =>
          hotel.location.toLowerCase().includes(searchParams.destination.toLowerCase())) : [];

        console.log('Filtered Flights:', filteredFlights);
        console.log('Filtered Hotels:', filteredHotels);

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
    <div className="app">
      <Router>
        <Header />
        <Container className="content">
          <Routes>
            <Route path="/" element={<SearchForm onSearch={handleSearch} />} />
            <Route path="/results" element={<Results results={results} searchParams={searchParams} />} />
            <Route path="/details" element={<DetailView />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
