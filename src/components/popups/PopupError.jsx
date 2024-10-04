import React from "react";
import { MdClose } from "react-icons/md"; // Importando el ícono de cierre desde react-icons
import styles from "./popupError.module.css";

const PopupError = ({ onClose }) => {
  return (
    <div className={`${styles.popup} ${styles.popupVisible}`}>
      <div className={styles.popupBackground} onClick={onClose}></div>
      <div className={styles.popupContent}>
        <MdClose className={styles.popupIcon} onClick={onClose} /> {/* Usando el ícono de cierre */}
        <h3 className={styles.popupTitle}>Correo o contraseña incorrectos</h3>
        <p id="popup-message">
          Por favor, verifica tu correo electrónico o contraseña.
        </p>
        <p id="popup-message">Inténtalo de nuevo.</p>
        <p>
          <button
            className={`${styles.button} ${styles.buttonError}`}
            onClick={onClose}
          >
            OK
          </button>
        </p>
      </div>
    </div>
  );
};

export default PopupError;
