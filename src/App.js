import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import DetailView from './components/DetailView';
import Header from './components/Header';
import ManageUsers from './components/ManageUsers';
import ManageHotels from './components/ManageHotels';
import ManageFlights from './components/ManageFlights';
import ProtectedRoute from './components/ProtectedRoute';
import SessionTimer from './components/SessionTimer';
import './App.css';

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ firstName: 'John', lastName: 'Doe' });
  const [rememberMe, setRememberMe] = useState(false);
  const [disableSessionExpiration, setDisableSessionExpiration] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

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

  const handleLogin = (user, rememberMe, disableSessionExpiration) => {
    setUser(user);
    setIsLoggedIn(true);
    setRememberMe(rememberMe);
    setDisableSessionExpiration(disableSessionExpiration);

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('isLoggedIn', 'true');
      setTimeLeft(300); // Reset the timer for 5 minutes
    }
  };

  const handleLogout = useCallback(() => {
    setUser({ firstName: '', lastName: '' });
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');

    if (storedIsLoggedIn === 'true' && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const setLogoutTimer = () => {
    setTimeout(handleLogout, 300000); // 5 minutes
  };

  useEffect(() => {
    if (isLoggedIn && !rememberMe && !disableSessionExpiration) {
      setLogoutTimer();
    }
  }, [isLoggedIn, rememberMe, disableSessionExpiration, handleLogout]);

  return (
    <div className="app">
      <Router>
        <Header isLoggedIn={isLoggedIn} user={user} onLogin={handleLogin} onLogout={handleLogout} />
        {isLoggedIn && !rememberMe && !disableSessionExpiration && <SessionTimer initialTime={timeLeft} onTimeout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route path="/" element={<SearchForm onSearch={handleSearch} />} />
            <Route path="/results" element={<Results results={results} searchParams={searchParams} />} />
            <Route path="/details" element={<DetailView />} />
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute isAdmin={isLoggedIn && user.role === 'admin'}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-hotels"
              element={
                <ProtectedRoute isAdmin={isLoggedIn && user.role === 'admin'}>
                  <ManageHotels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-flights"
              element={
                <ProtectedRoute isAdmin={isLoggedIn && user.role === 'admin'}>
                  <ManageFlights />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
