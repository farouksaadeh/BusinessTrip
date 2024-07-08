import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, user, onLogin, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleLogin = (user) => {
    onLogin(user);
    setShowLogin(false);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <header>
      <div className="logo-block">
        <div className="logo-section">
          <img className="logo" src="./images/Logo.png" alt="Logo" onClick={() => window.location.href = "/"} />
        </div>
        <div className="title-section">
          Business Trip
        </div>
        <div className="button-section">
          {isLoggedIn ? (
            <>
              <span className="user-name">{user.firstName} {user.lastName}</span>
              {user.role === 'admin' && (
                <div className="menu">
                  <div className="item">
                    <a href="#" className="link">
                      <span>Admin Menu</span>
                      <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_iconCarrier">
                          <path
                            id="XMLID_225_"
                            d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 
                            c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 
                            s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                          ></path>
                        </g>
                      </svg>
                    </a>
                    <div className="submenu">
                      <div className="submenu-item">
                        <Link to="/manage-users" className="submenu-link">Manage Users</Link>
                      </div>
                      <div className="submenu-item">
                        <Link to="/manage-hotels" className="submenu-link">Manage Hotels</Link>
                      </div>
                      <div className="submenu-item">
                        <Link to="/manage-flights" className="submenu-link">Manage Flights</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <button className="Btn" onClick={handleLogoutClick}>
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32z"></path>
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </>
          ) : (
            <button className="Btn" onClick={handleLoginClick}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
                </svg>
              </div>
              <div className="text">Login</div>
            </button>
          )}
        </div>
      </div>
      {showLogin && <Login onClose={() => setShowLogin(false)} onSignUp={handleRegisterClick} onLogin={handleLogin} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} onSignIn={handleLoginClick} />}
    </header>
  );
}

export default Header;
