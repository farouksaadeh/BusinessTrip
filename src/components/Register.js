import React from 'react';
import './Register.css'; 

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log('Registrierungsformular abgeschickt!');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registrieren</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Benutzername:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="email">E-Mail:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Passwort:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Passwort bestätigen:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required />
          </div>
          <button type="submit" className="submit-button">
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
