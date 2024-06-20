import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Benutzername:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Passwort:</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit" className="submit-button">
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
