import React, { useState, useEffect } from 'react';
import styles from './sessionTimerNotification.module.css'; // Crea este archivo CSS

const SessionTimerNotification = ({ remainingTime, onClose }) => {
  const [timeLeftString, setTimeLeftString] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (remainingTime) {
        const secondsLeft = Math.floor(remainingTime / 1000);
        const minutesLeft = Math.floor(secondsLeft / 60);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const daysLeft = Math.floor(hoursLeft / 24);
        setTimeLeftString(`${daysLeft} días, ${hoursLeft % 24} horas, ${minutesLeft % 60} minutos`);
      }
    };

    calculateTimeLeft();
  }, [remainingTime]);

  return (
    <div className={styles.notification}>
      <div className={styles.notificationContent}>
          <p>Tiempo de sesión restante:</p>
          <p>{timeLeftString}</p>
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default SessionTimerNotification;