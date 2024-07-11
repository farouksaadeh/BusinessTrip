import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import Header from './components/Header';
import ManageUsers from './components/ManageUsers';
import ManageHotels from './components/ManageHotels';
import ManageFlights from './components/ManageFlights';
import HotelDetailView from './components/HotelDetailView';
import FlightDetailView from './components/FlightDetailView';
import HotelFlightDetailView from './components/HotelFlightDetailView';
import ProtectedRoute from './components/ProtectedRoute';
import InactivityPopup from './components/InactivityPopup';
import Favorites from './components/Favorites';

import './App.css';

const DetailView = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get('type');
  const flightId = query.get('flightId');
  const hotelId = query.get('hotelId');

  switch (type) {
    case 'hotel':
      return <HotelDetailView />;
    case 'flight':
      return <FlightDetailView />;
    case 'hotel-flight':
      if (flightId && hotelId) {
        return <HotelFlightDetailView />;
      }
      return <div>Ungültiger Typ oder fehlende IDs</div>;
    default:
      return <div>Ungültiger Typ</div>;
  }
};

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
  const [showInactivityPopup, setShowInactivityPopup] = useState(false);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let flightsResponse;
        let hotelsResponse;

        if (searchParams.type === 'flight' || searchParams.type === 'hotel-flight') {
          flightsResponse = await axios.get('http://localhost:3001/flights');
        }
        if (searchParams.type === 'hotel' || searchParams.type === 'hotel-flight') {
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
    }
  };

  const handleLogout = useCallback(() => {
    setUser({ firstName: '', lastName: '' });
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    setShowInactivityPopup(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');

    if (storedIsLoggedIn === 'true' && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    let inactivityTimer;
    let logoutTimer;

    const resetTimers = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(logoutTimer);

      if (isLoggedIn && !disableSessionExpiration) {
        inactivityTimer = setTimeout(() => {
          setShowInactivityPopup(true);
        }, 300000); // 5 minutes

        logoutTimer = setTimeout(() => {
          handleLogout();
        }, 360000); // 6 minutes
      }
    };

    const handleActivity = () => {
      if (showInactivityPopup) {
        setShowInactivityPopup(false);
      }
      resetTimers();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isLoggedIn, disableSessionExpiration, handleLogout, showInactivityPopup]);

  return (
    <div className="app">
      <Router>
        <Header isLoggedIn={isLoggedIn} user={user} onLogin={handleLogin} onLogout={handleLogout} />
        {showInactivityPopup && <InactivityPopup />}
        <div className="content">
          <Routes>
            <Route path="/" element={<SearchForm onSearch={handleSearch} />} />
            <Route path="/results" element={<Results results={results} searchParams={searchParams} user={user} isLoggedIn={isLoggedIn} />} />
            <Route path="/details" element={<DetailView />} />
            <Route path="/favorites" element={<Favorites user={user} />} />
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
