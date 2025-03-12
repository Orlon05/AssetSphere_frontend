import React from "react";
import styles from "./analitica.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
 
 
const AnaliticaForm = () => {
  // Crea la instancia de Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
 
  // Función para mostrar un Toast de éxito
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Bienvenido al formulario de creación de servidores",
    });
  };
 
  return (
    <div className={styles.analiticaContainer}>
      <h2 className={styles.tittle}>
        <IoIosAdd /> Crear Campos
      </h2>
      <div>
        <button onClick={showSuccessToast} className={styles.button}>
          Mostrar mensaje
        </button>
      </div>
    </div>
  );
};
 
export default AnaliticaForm;