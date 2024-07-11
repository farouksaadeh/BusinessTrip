import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelDetailView.css';

const HotelDetailView = () => {
  const [hotel, setHotel] = useState(null);
  const [step, setStep] = useState(0);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [numRooms, setNumRooms] = useState(1);
  const [roomType, setRoomType] = useState('Standard');
  const [paymentInfo, setPaymentInfo] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: new Date(),
    cvv: ''
  });
  const [confirmation, setConfirmation] = useState(false);
  const [images, setImages] = useState([]);
  const [showMoreImages, setShowMoreImages] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const hotelId = query.get('id');

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/hotels/${hotelId}`);
        setHotel(response.data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://api.pexels.com/v1/search?query=hotel+room&per_page=15`, {
          headers: {
            Authorization: 'g2nYiD2jz1NZFyNJi4EgSrTBLlptInmmOggC8HDInHNF4nuMRWnjYAHM'
          }
        });
        setImages(response.data.photos);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchHotel();
    fetchImages();
  }, [hotelId]);

  const calculateTotalPrice = () => {
    let basePrice = hotel.price_per_night;
    let roomMultiplier = 1;
    switch (roomType) {
      case 'Standard':
        roomMultiplier = 1;
        break;
      case 'Suite':
        roomMultiplier = 2;
        break;
      case 'Extra Large':
        roomMultiplier = 1.5;
        break;
      default:
        roomMultiplier = 1;
    }

    const totalPrice = (
      basePrice * roomMultiplier * numRooms +
      numAdults * 50 +
      numChildren * 30 +
      numInfants * 10
    );

    return totalPrice.toFixed(2);
  };

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setConfirmation(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      expiryDate: date
    }));
  };

  const toggleShowMoreImages = () => {
    setShowMoreImages(!showMoreImages);
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hotel-detail-container">
      {!confirmation ? (
        <>
          <div className="hotel-header">
            <h1>{hotel.name}</h1>
            <p>Standort: {hotel.location}</p>
          </div>

          <div className="image-gallery">
            {images.slice(0, showMoreImages ? images.length : 5).map((image) => (
              <img key={image.id} src={image.src.large} alt={image.alt} />
            ))}
          </div>
          {images.length > 5 && (
            <button className="show-more-btn" onClick={toggleShowMoreImages}>
              {showMoreImages ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </button>
          )}

          <div className="total-price">
            <h2>Gesamtpreis: CHF {calculateTotalPrice()}</h2>
          </div>

          <div className="hotel-amenities">
            <h3>Ausstattungen</h3>
            <ul>
              <li>Kostenloses WLAN</li>
              <li>Frühstück inklusive</li>
              <li>Schwimmbad</li>
              <li>Fitnessstudio</li>
              <li>Flughafenshuttle</li>
              <li>24-Stunden-Rezeption</li>
              <li>Raucherfreie Zimmer</li>
              <li>Restaurant</li>
              <li>Zimmerservice</li>
              <li>Spa- und Wellnesscenter</li>
            </ul>
          </div>

          <ProgressBar
            percent={(step / 2) * 100}
            filledBackground="linear-gradient(to right, rgb(108, 146, 202), rgb(5, 29, 64))"
          >
            <Step transition="scale">
              {({ accomplished }) => (
                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                  1
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished }) => (
                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                  2
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished }) => (
                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                  3
                </div>
              )}
            </Step>
          </ProgressBar>

          <div className="booking-steps">
            <div className="step-header">
              <h2>Buchungsinformationen</h2>
            </div>
            <div className="step-content">
              {step === 0 && (
                <div className="hotel-room-selection">
                  <h3>Zimmerauswahl</h3>
                  <div className="form-group">
                    <label>Anzahl der Erwachsenen</label>
                    <input type="number" value={numAdults} onChange={(e) => setNumAdults(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Anzahl der Kinder</label>
                    <input type="number" value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Anzahl der Kleinkinder</label>
                    <input type="number" value={numInfants} onChange={(e) => setNumInfants(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Anzahl der Zimmer</label>
                    <input type="number" value={numRooms} onChange={(e) => setNumRooms(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Zimmertyp</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                      <option value="Standard">Standard</option>
                      <option value="Suite">Suite</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="payment-info">
                  <h3>Zahlungsinformationen</h3>
                  <form>
                    <div className="form-group">
                      <label htmlFor="cardHolder">Karteninhaber</label>
                      <input id="cardHolder" type="text" name="cardHolder" value={paymentInfo.cardHolder} onChange={handlePaymentChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Kartennummer</label>
                      <input id="cardNumber" type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} />
                    </div>
                    <div className="input-group">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Ablaufdatum</label>
                        <DatePicker
                          id="expiryDate"
                          selected={paymentInfo.expiryDate}
                          onChange={handleDateChange}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          className="date-picker"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input id="cvv" type="password" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="btn-container">
              {step > 0 && (
                <button className="btn-content" onClick={handlePrevStep}>
                  <span className="btn-title">Zurück</span>
                </button>
              )}
              <button className="btn-content" onClick={handleNextStep}>
                <span className="btn-title">{step === 2 ? 'Bestätigen' : 'Weiter'}</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="hotel-confirmation">
          <h2>Buchungsbestätigung</h2>
          <p>Vielen Dank für Ihre Buchung!</p>
          <p>Ihre Buchungsnummer lautet: <strong>{Math.floor(Math.random() * 1000000)}</strong></p>
          <div className="payment-info">
            <h3>Zahlungsinformationen</h3>
            <p>Karteninhaber: {paymentInfo.cardHolder}</p>
            <p>Kartennummer: {paymentInfo.cardNumber.slice(0, 4)} **** **** ****</p>
            <p>CVV: ***</p>
            <p>Ablaufdatum: {paymentInfo.expiryDate.toLocaleDateString()}</p>
          </div>
          <div className="hotel-details" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>Hoteldetails</h3>
            <p>Hotel: {hotel.name}</p>
            <p>Standort: {hotel.location}</p>
            <p>Preis pro Nacht: CHF {hotel.price_per_night}</p>
            <p>Anzahl der Erwachsenen: {numAdults}</p>
            <p>Anzahl der Kinder: {numChildren}</p>
            <p>Anzahl der Kleinkinder: {numInfants}</p>
            <p>Anzahl der Zimmer: {numRooms}</p>
            <p>Zimmertyp: {roomType}</p>
            <p>Gesamtpreis: CHF {calculateTotalPrice()}</p>
          </div>
          <div className="btn-container">
            <a className="btn-content" href="/">
              <span className="btn-title">Zurück zur Startseite</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailView;
