// src/components/SessionTimer.js
import React, { useEffect, useState } from 'react';
import './SessionTimer.css';


const SessionTimer = ({ initialTime, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeout();
    }
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="session-timer">
      Session expires in: {formatTime(timeLeft)}
    </div>
  );
};

export default SessionTimer;
