import React, { useState } from "react";
import styles from "./crearPseries.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const PseriesForm = () => {
  const initialFormState = {
    name: "",
    application: "",
    hostname: "",
    ip_address: "",
    environment: "",
    slot: "",
    lpar_id: "",
    status: "",
    os: "",
    version: "",
    subsidiary: "",
    min_cpu: "",
    act_cpu: "",
    max_cpu: "",
    min_v_cpu: "",
    act_v_cpu: "",
    max_v_cpu: "",
    min_memory: "",
    act_memory: "",
    max_memory: "",
    expansion_factor: "",
    memory_per_factor: "",
    processor_compatibility: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Configuración de Toast reusable
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const showToast = (icon, title) => {
    Toast.fire({ icon, title });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({ icon: "error", title, text });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch("http://localhost:8000/pseries/pseries/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        if (response.status === 422) {
          const errorData = await response.json();
          errorMessage = errorData.detail.map(e => e.msg).join(", ");
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
        } else {
          try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
          } catch (e) {}
        }
        showErrorAlert("Error al crear el servidor", errorMessage);
      } else {
        showToast("success", "Servidor creado exitosamente");
        navigate("/inveplus/pseries");
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorAlert("Error", error.message || "Ocurrió un error inesperado.");
    }
  };

  // Componente reutilizable para inputs
  const FormInput = ({ name, label, required = true }) => (
    <div className={styles.formGroup}>
      <input
        type="text"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={styles.input}
      />
      <div className={styles.label}>{label}{required && "*"}</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.containtTit}>
        <h2 className={styles.tittle}>
          <IoIosAdd />
          Crear Campos
        </h2>
        <Link to="/inveplus/pseries" className={styles.botonRegresar}>
          Regresar
        </Link>
      </div>
      
      <div className={styles.container}>
        {/* COLUMNA 1 */}
        <div className={styles.columnUno}>
          <FormInput name="name" label="Nombre Lpar en la HMC" />
          <FormInput name="application" label="Aplicación" />
          <FormInput name="hostname" label="Hostname" />
          <FormInput name="ip_address" label="Ip" />
          <FormInput name="environment" label="Ambiente" />
          <FormInput name="slot" label="Cajón" />
          <FormInput name="lpar_id" label="Id Lpar" />
          <FormInput name="status" label="Estado" />
          <FormInput name="os" label="Sistema Operativo" />
          <FormInput name="version" label="Versión" />
          <FormInput name="subsidiary" label="Filial" />
          <FormInput name="min_cpu" label="CPU MIN" />
          
          <button type="submit" className={styles.button}>
            Guardar
          </button>
        </div>

        {/* COLUMNA 2 */}
        <div className={styles.columnDos}>
          <FormInput name="act_cpu" label="CPU ACT" />
          <FormInput name="max_cpu" label="CPU MAX" />
          <FormInput name="min_v_cpu" label="CPU V MIN" />
          
          <hr className={styles.lines} />

          <FormInput name="act_v_cpu" label="CPU V ACT" />
          <FormInput name="max_v_cpu" label="CPU V MAX" />
          <FormInput name="min_memory" label="Memoria MIN" />
          
          <hr className={styles.lines} />

          <FormInput name="act_memory" label="Memoria ACT" />
          <FormInput name="max_memory" label="Memoria Max" />
          <FormInput name="expansion_factor" label="Factor de expansión" />
          <FormInput name="memory_per_factor" label="Memoria por factor" />
          <FormInput name="processor_compatibility" label="Procesador compatible" />
        </div>
      </div>
    </form>
  );
};

export default PseriesForm;