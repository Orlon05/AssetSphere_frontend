import React, { useState } from "react";
import styles from "./crearBaseDatos.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const BaseDatosForm = () => {
  const navigate = useNavigate();
  
  // Estado inicial del formulario
  const initialFormState = {
    instance_id: "",
    cost_center: "",
    category: "",
    type: "",
    item: "",
    owner_contact: "",
    name: "",
    application_code: "",
    inactive: "",
    asset_life_cycle_status: "",
    system_environment: "",
    cloud: "",
    version_number: "",
    serial: "",
    ci_tag: "",
    instance_name: "",
    model: "",
    ha: "",
    port: "",
    owner_name: "",
    department: "",
    company: "",
    manufacturer_name: "",
    supplier_name: "",
    supported: "",
    account_id: "",
    create_date: "",
    modified_date: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  // Configuración de Toast
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

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mostrar mensaje de éxito
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Base de datos creada exitosamente",
    });
  };

  // Enviar formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch("http://localhost:8000/base_datos/add", {
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
        throw new Error(errorMessage);
      }

      showSuccessToast();
      navigate("/inveplus/Base-De-Datos");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  // Campos del formulario organizados por columnas
  const formFields = {
    column1: [
      { id: "instance_id", label: "ID de instancia*" },
      { id: "cost_center", label: "Centro de costos*" },
      { id: "category", label: "Categoría*" },
      { id: "type", label: "Tipo*" },
      { id: "item", label: "Ítem*" },
      { id: "owner_contact", label: "Contacto del propietario*" },
      { id: "name", label: "Nombre*" },
      { id: "application_code", label: "Código de aplicación*" },
      { id: "inactive", label: "Inactivo*" },
      { id: "asset_life_cycle_status", label: "Estado del ciclo de vida del activo*" },
      { id: "system_environment", label: "Entorno del sistema*" },
      { id: "cloud", label: "Nube*" },
      { id: "version_number", label: "Número de versión*" },
      { id: "serial", label: "Serie*" }
    ],
    column2: [
      { id: "ci_tag", label: "Etiqueta CI*" },
      { id: "instance_name", label: "Nombre de instancia*" },
      { id: "model", label: "Modelo*" },
      { id: "ha", label: "HA*" },
      { id: "port", label: "Puerto*" },
      { id: "owner_name", label: "Nombre del propietario*" },
      { id: "department", label: "Departamento*" },
      { id: "company", label: "Compañía*" },
      { id: "manufacturer_name", label: "Nombre del fabricante*" },
      { id: "supplier_name", label: "Nombre del proveedor*" },
      { id: "supported", label: "Soporte*" },
      { id: "account_id", label: "ID de cuenta*" },
      { id: "create_date", type: "date", label: "Fecha de creación*" },
      { id: "modified_date", type: "date", label: "Fecha de modificación*" }
    ]
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.containtTit}>
        <h2 className={styles.tittle}>
          <IoIosAdd />
          Crear Base de Datos
        </h2>
        <Link to="/inveplus/Base-De-Datos" className={styles.botonRegresar}>
          Regresar
        </Link>
      </div>
      
      <div className={styles.container}>
        {/* Columna 1 */}
        <div className={styles.columnUno}>
          {formFields.column1.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className={styles.formGroup}>
                <input
                  type={field.type || "text"}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <div className={styles.label}>{field.label}</div>
              </div>
              {/* Líneas divisorias estratégicas */}
              {[3, 7, 11].includes(index) && <hr className={styles.lines} />}
            </React.Fragment>
          ))}
          <button type="submit" className={styles.button}>
            Guardar
          </button>
        </div>

        {/* Columna 2 */}
        <div className={styles.columnDos}>
          {formFields.column2.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className={styles.formGroup}>
                <input
                  type={field.type || "text"}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <div className={styles.label}>{field.label}</div>
              </div>
              {/* Líneas divisorias estratégicas */}
              {[3, 7, 11].includes(index) && <hr className={styles.lines} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </form>
  );
};

export default BaseDatosForm;