import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./editarServidor.module.css";

// Componente reutilizable para los campos del formulario
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className={styles.formGroup}>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={styles.input}
    />
    <div className={styles.label}>{label}</div>
  </div>
);

const EditarServer = () => {
  // Estado único para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    processor: "",
    cpu_cores: "",
    ram: "",
    total_disk_size: "",
    os_type: "",
    os_version: "",
    status: "",
    role: "",
    environment: "",
    serial: "",
    rack_id: "",
    unit: "",
    ip_address: "",
    city: "",
    location: "",
    asset_id: "",
    service_owner: "",
    warranty_start_date: "",
    warranty_end_date: "",
    application_code: "",
    responsible_evc: "",
    domain: "",
    subsidiary: "",
    responsible_organization: "",
    billable: "",
    oc_provisioning: "",
    oc_deletion: "",
    oc_modification: "",
    maintenance_period: "",
    maintenance_organization: "",
    cost_center: "",
    billing_type: "",
  });

  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();
  const { serverId } = useParams();
  const token = localStorage.getItem("authenticationToken");

  // Configuración de SweetAlert2 para notificaciones Toast
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

  // Función para mostrar notificaciones de éxito
  const showSuccessToast = () => {
    Toast.fire({ icon: "success", title: "Servidor actualizado exitosamente" });
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Efecto para cargar los datos del servidor al montar el componente
  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/servers/physical/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();
        if (data.status === "success" && data.data && data.data.server_info) {
          setFormData(data.data.server_info); // Actualiza el estado con los datos del servidor
        } else {
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener datos del servidor:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId, token]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos obligatorios
    if (!formData.name || !formData.serial || !formData.brand || !formData.model) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail
          ? errorData.detail.map((e) => e.msg).join(", ")
          : errorData.message || "Error en la solicitud";
        throw new Error(errorMessage);
      }

      showSuccessToast(); // Mostrar notificación de éxito
      navigate("/servidoresf"); // Redirigir después de la actualización
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
  if (loading) {
    return <div>Cargando datos del servidor...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.containtTit}>
        <h2 className={styles.tittle}>
          <MdEdit />
          Editar Servidores
        </h2>
        <Link to="/servidoresf" className={styles.botonRegresar}>
          Regresar
        </Link>
      </div>

      <div className={styles.container}>
        {/* COLUMNA 1 */}
        <div className={styles.columnUno}>
          <InputField
            label="Nombre del servidor*"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <InputField
            label="Marca*"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
          <InputField
            label="Modelo*"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
          />
          <InputField
            label="Procesador*"
            name="processor"
            value={formData.processor}
            onChange={handleInputChange}
          />
          <InputField
            label="Cpu Cores*"
            name="cpu_cores"
            value={formData.cpu_cores}
            onChange={handleInputChange}
          />
          <hr className={styles.lines} />
          <InputField
            label="Ram*"
            name="ram"
            value={formData.ram}
            onChange={handleInputChange}
          />
          <hr className={styles.lines} />
          <InputField
            label="Tamaño del disco*"
            name="total_disk_size"
            value={formData.total_disk_size}
            onChange={handleInputChange}
          />
          <InputField
            label="Sistema Operativo*"
            name="os_type"
            value={formData.os_type}
            onChange={handleInputChange}
          />
          <InputField
            label="Versión sistema operativo*"
            name="os_version"
            value={formData.os_version}
            onChange={handleInputChange}
          />
          <InputField
            label="Estado*"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />
          <hr className={styles.lines} />
          <InputField
            label="Rol*"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          />
          <InputField
            label="Ambiente*"
            name="environment"
            value={formData.environment}
            onChange={handleInputChange}
          />
          <InputField
            label="Serial*"
            name="serial"
            value={formData.serial}
            onChange={handleInputChange}
          />
          <InputField
            label="Id del rack*"
            name="rack_id"
            value={formData.rack_id}
            onChange={handleInputChange}
          />
          <InputField
            label="Unidad*"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
          />
          <hr className={styles.lines} />
          <InputField
            label="Dirección IP*"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleInputChange}
          />
        </div>

        {/* COLUMNA 2 */}
        <div className={styles.columnDos}>
          <InputField
            label="Ciudad*"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          <InputField
            label="Ubicación*"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
          <InputField
            label="Id del activo*"
            name="asset_id"
            value={formData.asset_id}
            onChange={handleInputChange}
          />
          <hr className={styles.lines} />
          <InputField
            label="Propietario*"
            name="service_owner"
            value={formData.service_owner}
            onChange={handleInputChange}
          />
          <InputField
            label="Fecha inicio garantía*"
            name="warranty_start_date"
            value={formData.warranty_start_date}
            onChange={handleInputChange}
            type="date"
          />
          <hr className={styles.lines} />
          <InputField
            label="Fecha fin garantía*"
            name="warranty_end_date"
            value={formData.warranty_end_date}
            onChange={handleInputChange}
            type="date"
          />
          <hr className={styles.lines} />
          <InputField
            label="Código de aplicación*"
            name="application_code"
            value={formData.application_code}
            onChange={handleInputChange}
          />
          <InputField
            label="EVC responsable*"
            name="responsible_evc"
            value={formData.responsible_evc}
            onChange={handleInputChange}
          />
          <InputField
            label="Dominio*"
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
          />
          <InputField
            label="Filial*"
            name="subsidiary"
            value={formData.subsidiary}
            onChange={handleInputChange}
          />
          <InputField
            label="Organización responsable"
            name="responsible_organization"
            value={formData.responsible_organization}
            onChange={handleInputChange}
          />
          <InputField
            label="Facturable*"
            name="billable"
            value={formData.billable}
            onChange={handleInputChange}
          />
          <InputField
            label="OC de aprovisionamiento*"
            name="oc_provisioning"
            value={formData.oc_provisioning}
            onChange={handleInputChange}
          />
          <InputField
            label="OC de eliminación*"
            name="oc_deletion"
            value={formData.oc_deletion}
            onChange={handleInputChange}
          />
          <InputField
            label="OC de modificación*"
            name="oc_modification"
            value={formData.oc_modification}
            onChange={handleInputChange}
          />
          <InputField
            label="Periodo de mantenimiento*"
            name="maintenance_period"
            value={formData.maintenance_period}
            onChange={handleInputChange}
          />
          <InputField
            label="Organización de mantenimiento*"
            name="maintenance_organization"
            value={formData.maintenance_organization}
            onChange={handleInputChange}
          />
          <InputField
            label="Centro de costos*"
            name="cost_center"
            value={formData.cost_center}
            onChange={handleInputChange}
          />
          <InputField
            label="Tipo de cobro*"
            name="billing_type"
            value={formData.billing_type}
            onChange={handleInputChange}
          />
          <button type="submit" className={styles.button}>
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditarServer;