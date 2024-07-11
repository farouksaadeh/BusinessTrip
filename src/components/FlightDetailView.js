import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import './FlightDetailView.css';

const FlightDetailView = () => {
  const [flight, setFlight] = useState(null);
  const [step, setStep] = useState(0);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [numHandBaggage, setNumHandBaggage] = useState(1);
  const [numCheckedBaggage, setNumCheckedBaggage] = useState(1);
  const [fare, setFare] = useState('Economy Light');
  const [paymentInfo, setPaymentInfo] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [confirmation, setConfirmation] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const flightId = query.get('id');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/flights/${flightId}`);
        setFlight(response.data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };

    fetchFlight();
  }, [flightId]);

  const calculateTotalPrice = () => {
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

  const handleNextStep = () => {
    if (step < 3) {
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

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flight-detail-container">
      {!confirmation ? (
        <>
          <div className="flight-header">
            <h1>{flight.to}</h1>
            <p>Abflug: {new Date(flight.departure).toLocaleString()}</p>
            <p>Ankunft: {new Date(flight.arrival).toLocaleString()}</p>
          </div>

          <div className="total-price">
            <h2>Gesamtpreis: €{calculateTotalPrice()}</h2>
          </div>

          <ProgressBar
            percent={step * 33.33}
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
            <Step transition="scale">
              {({ accomplished }) => (
                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                  4
                </div>
              )}
            </Step>
          </ProgressBar>

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
                  <p>Gesamtpreis: €{(calculateTotalPrice() * 1.15).toFixed(2)}</p>
                </div>
                <div className={`tariff ${fare === 'Economy Standard' ? 'selected' : ''}`} onClick={() => setFare('Economy Standard')}>
                  <h3>Economy Standard</h3>
                  <p>1 Handgepäck (12 kg)</p>
                  <p>1 Aufgabegepäck (23 kg)</p>
                  <p>Basissitzplatzwahl gegen Gebühr</p>
                  <p>Nicht erstattungsfähig</p>
                  <p>Gesamtpreis: €{(calculateTotalPrice() * 1.3).toFixed(2)}</p>
                </div>
                <div className={`tariff ${fare === 'Economy Flex' ? 'selected' : ''}`} onClick={() => setFare('Economy Flex')}>
                  <h3>Economy Flex</h3>
                  <p>1 Handgepäck (12 kg)</p>
                  <p>1 Aufgabegepäck (23 kg)</p>
                  <p>Flugänderungen erlaubt</p>
                  <p>Erstattungsfähig</p>
                  <p>Gesamtpreis: €{(calculateTotalPrice() * 1.45).toFixed(2)}</p>
                </div>
              </div>
              <div className="btn-container">
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
                <div className="btn-container">
                  <button className="btn-content" onClick={handlePrevStep}>
                    <span className="btn-title">Zurück</span>
                  </button>
                  <button className="btn-content" onClick={handleNextStep}>
                    <span className="btn-title">Weiter</span>
                  </button>
                </div>
              </form>
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
                <div className="btn-container">
                  <button className="btn-content" onClick={handlePrevStep}>
                    <span className="btn-title">Zurück</span>
                  </button>
                  <button className="btn-content" onClick={handleNextStep}>
                    <span className="btn-title">Weiter</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="flight-payment">
              <h2>Überprüfen und Bezahlen</h2>
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
                    <input id="expiryDate" type="text" name="expiryDate" value={paymentInfo.expiryDate} onChange={handlePaymentChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" type="password" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} />
                  </div>
                </div>
                <div className="btn-container">
                  <button className="btn-content" onClick={handlePrevStep}>
                    <span className="btn-title">Zurück</span>
                  </button>
                  <button className="btn-content" onClick={handleNextStep}>
                    <span className="btn-title">Bestätigen</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="flight-confirmation">
          <h2>Buchungsbestätigung</h2>
          <p>Vielen Dank für Ihre Buchung!</p>
          <p>Ihre Buchungsnummer lautet: <strong>{Math.floor(Math.random() * 1000000)}</strong></p>
          <div className="payment-info">
            <h3>Zahlungsdetails</h3>
            <p>Karteninhaber: {paymentInfo.cardHolder}</p>
            <p>Kartennummer: {paymentInfo.cardNumber.slice(0, 4)} **** **** ****</p>
            <p>CVV: ***</p>
            <p>Ablaufdatum: {paymentInfo.expiryDate}</p>
          </div>
          <div className="flight-details">
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
            <p>Gesamtpreis: €{calculateTotalPrice()}</p>
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

export default FlightDetailView;
