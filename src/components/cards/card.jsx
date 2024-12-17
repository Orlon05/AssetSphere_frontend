import React from "react";
import styles from "./card.module.css";

function Card({ title, value, icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardIcon}>{icon}</div>
      </div>
      <p className={styles.cardValue}>{value}</p>
    </div>
  );
}

export default Card;
