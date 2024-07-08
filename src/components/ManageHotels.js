import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageHotels.css';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', price_per_night: '', rating: '', reviews: '' });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:3001/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHotel) {
      setEditingHotel({ ...editingHotel, [name]: value });
    } else {
      setNewHotel({ ...newHotel, [name]: value });
    }
  };

  const handleAddHotel = async () => {
    try {
      await axios.post('http://localhost:3001/hotels', newHotel);
      setNewHotel({ name: '', location: '', price_per_night: '', rating: '', reviews: '' });
      fetchHotels();
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleDeleteHotel = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/hotels/${id}`);
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
  };

  const handleUpdateHotel = async () => {
    try {
      await axios.put(`http://localhost:3001/hotels/${editingHotel.id}`, editingHotel);
      setEditingHotel(null);
      fetchHotels();
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  return (
    <div className="manage-hotels">
      <h2>Manage Hotels</h2>
      <div className="add-hotel">
        <h3>Add New Hotel</h3>
        <input type="text" name="name" placeholder="Name" value={newHotel.name} onChange={handleInputChange} />
        <input type="text" name="location" placeholder="Location" value={newHotel.location} onChange={handleInputChange} />
        <input type="number" name="price_per_night" placeholder="Price per Night" value={newHotel.price_per_night} onChange={handleInputChange} />
        <input type="number" name="rating" placeholder="Rating" value={newHotel.rating} onChange={handleInputChange} />
        <input type="number" name="reviews" placeholder="Reviews" value={newHotel.reviews} onChange={handleInputChange} />
        <button onClick={handleAddHotel}>Add Hotel</button>
      </div>
      <div className="hotel-list">
        {hotels.map(hotel => (
          <div key={hotel.id} className="hotel-item">
            <div className="hotel-details">
              <span>{hotel.name} - {hotel.location} - Price: {hotel.price_per_night} CHF/night - Rating: {hotel.rating} - Reviews: {hotel.reviews}</span>
              <div className="hotel-actions">
                <button className="edit-button" onClick={() => handleEditHotel(hotel)}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button onClick={() => handleDeleteHotel(hotel.id)}>Delete</button>
              </div>
            </div>
            {editingHotel && editingHotel.id === hotel.id && (
              <div className="edit-hotel">
                <h3>Edit Hotel</h3>
                <input type="text" name="name" placeholder="Name" value={editingHotel.name} onChange={handleInputChange} />
                <input type="text" name="location" placeholder="Location" value={editingHotel.location} onChange={handleInputChange} />
                <input type="number" name="price_per_night" placeholder="Price per Night" value={editingHotel.price_per_night} onChange={handleInputChange} />
                <input type="number" name="rating" placeholder="Rating" value={editingHotel.rating} onChange={handleInputChange} />
                <input type="number" name="reviews" placeholder="Reviews" value={editingHotel.reviews} onChange={handleInputChange} />
                <button onClick={handleUpdateHotel}>Update Hotel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageHotels;
