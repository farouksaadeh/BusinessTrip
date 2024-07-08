import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageFlights.css';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);
  const [newFlight, setNewFlight] = useState({ from: '', to: '', departure: '', arrival: '', price: '' });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:3001/flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingFlight) {
      setEditingFlight({ ...editingFlight, [name]: value });
    } else {
      setNewFlight({ ...newFlight, [name]: value });
    }
  };

  const handleAddFlight = async () => {
    try {
      await axios.post('http://localhost:3001/flights', newFlight);
      setNewFlight({ from: '', to: '', departure: '', arrival: '', price: '' });
      fetchFlights();
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const handleDeleteFlight = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/flights/${id}`);
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleEditFlight = (flight) => {
    setEditingFlight(flight);
  };

  const handleUpdateFlight = async () => {
    try {
      await axios.put(`http://localhost:3001/flights/${editingFlight.id}`, editingFlight);
      setEditingFlight(null);
      fetchFlights();
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };

  return (
    <div className="manage-flights">
      <h2>Manage Flights</h2>
      <div className="add-flight">
        <h3>Add New Flight</h3>
        <input type="text" name="from" placeholder="From" value={newFlight.from} onChange={handleInputChange} />
        <input type="text" name="to" placeholder="To" value={newFlight.to} onChange={handleInputChange} />
        <input type="datetime-local" name="departure" placeholder="Departure" value={newFlight.departure} onChange={handleInputChange} />
        <input type="datetime-local" name="arrival" placeholder="Arrival" value={newFlight.arrival} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Price" value={newFlight.price} onChange={handleInputChange} />
        <button onClick={handleAddFlight}>Add Flight</button>
      </div>
      <div className="flight-list">
        {flights.map(flight => (
          <div key={flight.id} className="flight-item">
            <div className="flight-details">
              <span>{flight.from} to {flight.to} - Departure: {new Date(flight.departure).toLocaleString()} - Arrival: {new Date(flight.arrival).toLocaleString()} - Price: {flight.price} CHF</span>
              <div className="flight-actions">
                <button className="edit-button" onClick={() => handleEditFlight(flight)}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button onClick={() => handleDeleteFlight(flight.id)}>Delete</button>
              </div>
            </div>
            {editingFlight && editingFlight.id === flight.id && (
              <div className="edit-flight">
                <h3>Edit Flight</h3>
                <input type="text" name="from" placeholder="From" value={editingFlight.from} onChange={handleInputChange} />
                <input type="text" name="to" placeholder="To" value={editingFlight.to} onChange={handleInputChange} />
                <input type="datetime-local" name="departure" placeholder="Departure" value={editingFlight.departure} onChange={handleInputChange} />
                <input type="datetime-local" name="arrival" placeholder="Arrival" value={editingFlight.arrival} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Price" value={editingFlight.price} onChange={handleInputChange} />
                <button onClick={handleUpdateFlight}>Update Flight</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageFlights;
