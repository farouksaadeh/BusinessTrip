import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom'; // useNavigate importieren

function Header() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // useNavigate verwenden

  const handleLoginClick = () => {
    setShowPopup(true);
  };

  const handleLogin = () => {
    setShowPopup(false);
    // Hier nach dem Login die Navigation zur Startseite durchführen
    navigate('/');
  };

  const handleRegister = () => {
    setShowPopup(false);
    // Hier nach der Registrierung die Navigation zur Startseite durchführen
    navigate('/');
  };

  return (
    <header className="App-header">
      <h1>Meine Moderne Website</h1>
      <button className="login-button" onClick={handleLoginClick}>
        Anmelden
      </button>

      {showPopup && (
        <div className="popup">
          <h2>Haben Sie schon ein Konto?</h2>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Registrieren</button>
        </div>
      )}
    </header>
  );
}

export default Header;
