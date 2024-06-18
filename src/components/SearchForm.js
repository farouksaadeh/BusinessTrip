import React, { useState, useEffect } from 'react';
import { Container, FormControl, InputLabel, MenuItem, Select, TextField, Button, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const SearchForm = ({ onSearch }) => {
  const [type, setType] = useState('flight');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchHotelsAndFlights = async () => {
      const hotelsResponse = await axios.get('http://localhost:3001/hotels');
      const flightsResponse = await axios.get('http://localhost:3001/flights');
      setHotels(hotelsResponse.data);
      setFlights(flightsResponse.data);

      const hotelLocations = hotelsResponse.data.map(hotel => hotel.location);
      const flightDestinations = flightsResponse.data.map(flight => flight.to);
      const uniqueDestinations = [...new Set([...hotelLocations, ...flightDestinations])];
      setDestinations(uniqueDestinations);
    };
    fetchHotelsAndFlights();
  }, []);

  const handleSearch = () => {
    const results = [];
    if (type === 'flight' || type === 'hotel+flight') {
      const matchingFlights = flights.filter(flight => flight.to.toLowerCase().includes(destination.toLowerCase()));
      results.push(...matchingFlights);
    }
    if (type === 'hotel' || type === 'hotel+flight') {
      const matchingHotels = hotels.filter(hotel => hotel.location.toLowerCase().includes(destination.toLowerCase()));
      results.push(...matchingHotels);
    }
    onSearch({ type, destination, guests, nights, results });
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Reisetyp</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="flight">Flug</MenuItem>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="hotel+flight">Hotel + Flug</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            freeSolo
            options={destinations}
            renderInput={(params) => <TextField {...params} label="Reiseziel" fullWidth />}
            value={destination}
            onInputChange={(e, newValue) => setDestination(newValue)}
          />
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Abreisedatum"
              value={departureDate}
              onChange={(newValue) => setDepartureDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Rückreisedatum"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        {type !== 'flight' && (
          <>
            <Grid item xs={6}>
              <TextField
                label="Gäste"
                type="number"
                fullWidth
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Nächte"
                type="number"
                fullWidth
                value={nights}
                onChange={(e) => setNights(e.target.value)}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Suchen
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchForm;
