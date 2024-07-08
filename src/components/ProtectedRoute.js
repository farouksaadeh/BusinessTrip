import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, children }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isAdmin) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAdmin]);

  if (isAdmin) {
    return children;
  }

  if (countdown <= 0) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Du hast keine Berechtigungen für diese Seite</h1>
      <p>Weiterleitung in {countdown} Sekunden...</p>
    </div>
  );
};

export default ProtectedRoute;
