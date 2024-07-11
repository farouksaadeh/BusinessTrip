import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelFlightDetailView.css';

const HotelFlightDetailView = () => {
  const [flight, setFlight] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [step, setStep] = useState(0);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [numHandBaggage, setNumHandBaggage] = useState(1);
  const [numCheckedBaggage, setNumCheckedBaggage] = useState(1);
  const [fare, setFare] = useState('Economy Light');
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
  const flightId = query.get('flightId');
  const hotelId = query.get('hotelId');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/flights/${flightId}`);
        setFlight(response.data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };

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

    fetchFlight();
    fetchHotel();
    fetchImages();
  }, [flightId, hotelId]);

  const calculateFlightTotalPrice = () => {
    let basePrice = flight.price;
    let fareMultiplier = 1;
    switch (fare) {
      case 'Economy Light':
        fareMultiplier = 1.15;
        break;
      case 'Economy Standard':
        fareMultiplier = 1.3;
        break;
      case 'Economy Flex':
        fareMultiplier = 1.45;
        break;
      default:
        fareMultiplier = 1;
    }

    const totalPrice = (
      basePrice +
      numAdults * 50 +
      numChildren * 30 +
      numInfants * 10 +
      numHandBaggage * 20 +
      numCheckedBaggage * 40
    ) * fareMultiplier;

    return totalPrice.toFixed(2);
  };

  const calculateHotelTotalPrice = () => {
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
    if (step === 5) {
      setConfirmation(true);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
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

  if (!flight || !hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hotel-flight-detail-container">
      {!confirmation ? (
        <>
          <div className="flight-header">
            <h1>{flight.to}</h1>
            <p>Abflug: {new Date(flight.departure).toLocaleString()}</p>
            <p>Ankunft: {new Date(flight.arrival).toLocaleString()}</p>
          </div>

          <div className="total-price">
            <h2>Gesamtpreis Flug: €{calculateFlightTotalPrice()}</h2>
          </div>

          <ProgressBar
            percent={(step / 6) * 100}
            filledBackground="linear-gradient(to right, rgb(108, 146, 202), rgb(5, 29, 64))"
          >
            {[...Array(7)].map((_, index) => (
              <Step key={index} transition="scale">
                {({ accomplished }) => (
                  <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                    {index + 1}
                  </div>
                )}
              </Step>
            ))}
          </ProgressBar>

          <div className="booking-steps">
            <div className="step-content">
              {step === 0 && (
                <div className="flight-tariff-selection">
                  <h2>Wählen Sie Ihren Tarif</h2>
                  <div className="tariff-options">
                    <div className={`tariff ${fare === 'Economy Light' ? 'selected' : ''}`} onClick={() => setFare('Economy Light')}>
                      <h3>Economy Light</h3>
                      <p>1 Handgepäck (12 kg)</p>
                      <p>Aufgabegepäck gegen Gebühr</p>
                      <p>Basissitzplatzwahl gegen Gebühr</p>
                      <p>Keine Flugänderungen erlaubt</p>
                      <p>Nicht erstattungsfähig</p>
                      <p>Gesamtpreis: €{(calculateFlightTotalPrice() * 1.15).toFixed(2)}</p>
                    </div>
                    <div className={`tariff ${fare === 'Economy Standard' ? 'selected' : ''}`} onClick={() => setFare('Economy Standard')}>
                      <h3>Economy Standard</h3>
                      <p>1 Handgepäck (12 kg)</p>
                      <p>1 Aufgabegepäck (23 kg)</p>
                      <p>Basissitzplatzwahl gegen Gebühr</p>
                      <p>Nicht erstattungsfähig</p>
                      <p>Gesamtpreis: €{(calculateFlightTotalPrice() * 1.3).toFixed(2)}</p>
                    </div>
                    <div className={`tariff ${fare === 'Economy Flex' ? 'selected' : ''}`} onClick={() => setFare('Economy Flex')}>
                      <h3>Economy Flex</h3>
                      <p>1 Handgepäck (12 kg)</p>
                      <p>1 Aufgabegepäck (23 kg)</p>
                      <p>Flugänderungen erlaubt</p>
                      <p>Erstattungsfähig</p>
                      <p>Gesamtpreis: €{(calculateFlightTotalPrice() * 1.45).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="btn-container">
                    <button className="btn-content" onClick={handlePrevStep}>
                      <span className="btn-title">Zurück</span>
                    </button>
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flight-passenger-info">
                  <h2>Passagierinformationen</h2>
                  <form>
                    <div className="form-group">
                      <label>Erwachsene</label>
                      <input type="number" value={numAdults} onChange={(e) => setNumAdults(parseInt(e.target.value))} />
                    </div>
                    <div className="form-group">
                      <label>Kinder</label>
                      <input type="number" value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))} />
                    </div>
                    <div className="form-group">
                      <label>Kleinkinder</label>
                      <input type="number" value={numInfants} onChange={(e) => setNumInfants(parseInt(e.target.value))} />
                    </div>
                  </form>
                  <div className="btn-container">
                    <button className="btn-content" onClick={handlePrevStep}>
                      <span className="btn-title">Zurück</span>
                    </button>
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flight-baggage-info">
                  <h2>Gepäckinformationen</h2>
                  <form>
                    <div className="form-group">
                      <label>Handgepäck</label>
                      <input type="number" value={numHandBaggage} onChange={(e) => setNumHandBaggage(parseInt(e.target.value))} />
                    </div>
                    <div className="form-group">
                      <label>Aufgabegepäck</label>
                      <input type="number" value={numCheckedBaggage} onChange={(e) => setNumCheckedBaggage(parseInt(e.target.value))} />
                    </div>
                  </form>
                  <div className="btn-container">
                    <button className="btn-content" onClick={handlePrevStep}>
                      <span className="btn-title">Zurück</span>
                    </button>
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="hotel-header">
                    <h1>{hotel.name}</h1>
                    <p>Standort: {hotel.location}</p>
                  </div>

                  <div className="image-gallery">
                    {images.slice(0, showMoreImages ? images.length : 5).map((image) => (
                      <img key={image.id} src={image.src.large} alt={image.alt} />
                    ))}
                    {images.length > 5 && (
                      <button className="show-more-btn" onClick={toggleShowMoreImages}>
                        {showMoreImages ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                      </button>
                    )}
                  </div>
                  <div className="btn-container">
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
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
                  <div className="btn-container">
                    <button className="btn-content" onClick={handlePrevStep}>
                      <span className="btn-title">Zurück</span>
                    </button>
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
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
                  <div className="btn-container">
                    <button className="btn-content" onClick={handlePrevStep}>
                      <span className="btn-title">Zurück</span>
                    </button>
                    <button className="btn-content" onClick={handleNextStep}>
                      <span className="btn-title">Weiter</span>
                    </button>
                  </div>
                </div>
              )}
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
  <h3>Flugdetails</h3>
  <p>Ziel: {flight.to}</p>
  <p>Abflug: {new Date(flight.departure).toLocaleString()}</p>
  <p>Ankunft: {new Date(flight.arrival).toLocaleString()}</p>
  <p>Tarif: {fare}</p>
  <p>Erwachsene: {numAdults}</p>
  <p>Kinder: {numChildren}</p>
  <p>Kleinkinder: {numInfants}</p>
  <p>Handgepäck: {numHandBaggage}</p>
  <p>Aufgabegepäck: {numCheckedBaggage}</p>
  <p>Gesamtpreis Flug: €{calculateFlightTotalPrice()}</p>
  <h3>Hoteldetails</h3>
  <p>Hotel: {hotel.name}</p>
  <p>Standort: {hotel.location}</p>
  <p>Preis pro Nacht: CHF {hotel.price_per_night}</p>
  <p>Anzahl der Erwachsenen: {numAdults}</p>
  <p>Anzahl der Kinder: {numChildren}</p>
  <p>Anzahl der Kleinkinder: {numInfants}</p>
  <p>Anzahl der Zimmer: {numRooms}</p>
  <p>Zimmertyp: {roomType}</p>
  <p>Gesamtpreis Hotel: CHF {calculateHotelTotalPrice()}</p>
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

export default HotelFlightDetailView;
