import React from "react";
import styles from "./analitica.module.css";
import analiticaImage from "../../../public/imagenes/analitica.png"
 
 
const AnaliticaForm = () => {
  return (
   <div className={styles.analiticaContainer}>
   <img src={analiticaImage} alt="Analítica" className={styles.fullImage} />
   </div>
  )
};
export default AnaliticaForm;