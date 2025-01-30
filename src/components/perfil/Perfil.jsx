import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./perfil.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from 'sweetalert2';

const ServerForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [nivelEducativo, setNivelEducativo] = useState("");
  const [carrera, setCarrera] = useState("");
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  // Crea la instancia de Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000, // Duración del Toast (3 segundos)
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Función para mostrar un Toast de éxito después de crear una receta
  const showSuccessToast = () => {
    Toast.fire({
      icon: 'success',
      title: 'Empleado creado exitosamente'
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    
    const nuevoEmpleado = {
      nombre,
      apellido,
      edad: parseInt(edad, 10),
      email,
      nivelEducativo,
      carrera,
    };

    // Validación del formulario
    if (!nombre || !apellido || !edad || !email || !nivelEducativo || !carrera) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Obtener el token JWT de localStorage
    const token = localStorage.getItem("autenticacionToken");

    try {
      const response = await fetch("http://localhost:5000/api/empleados/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEmpleado),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Empleado creado:", data);
        // Limpiar los campos y mostrar Toast
        setNombre("");
        setApellido("");
        setEdad("");
        setEmail("");
        setNivelEducativo("");
        setCarrera("");
        showSuccessToast();
        navigate("/gestion-empleados");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'Error al crear el empleado: ' + errorData.message,
        });
      }
    } catch (error) {
      console.log("Error creando empleado:", error);
      setError("Error al crear el empleado.");
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Error al crear el empleado.',
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <IoIosAdd /> Crear Empleado</h2>
      <div className={styles.container}>
        {/*INICIO DE LA COLUMNA 1*/}
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nombre*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="edad"
              name="edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Edad*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="nivelEducativo"
              name="nivelEducativo"
              value={nivelEducativo}
              onChange={(e) => setNivelEducativo(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nivel Educativo*</div>
          </div>
        </div>

        {/*INICIO DE LA COLUMNA 2*/}
        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Apellido*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Email*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="carrera"
              name="carrera"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Carrera*</div>
          </div>
        </div>

        <button type="submit"  className={styles.button}>
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ServerForm;
