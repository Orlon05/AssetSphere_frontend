import { API_URL } from "../../../config/api";
/**
 * @file editarStorage.jsx
 * @description Componente para editar dispositivos de Storage existentes
 *
 * Este componente permite:
 * - Cargar datos existentes del dispositivo desde la API
 * - Editar todos los campos del dispositivo de storage
 * - Validar y enviar cambios al servidor
 * - Manejar errores de carga y actualización
 *
 * @component
 * @example
 * return (
 *   <EditarStorage />
 * )
 */

import { useState, useEffect } from "react";
import { MdEdit, MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";

/**
 * Componente reutilizable para campos de entrada
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.value - Valor actual del campo
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {string} props.type - Tipo de input
 * @param {boolean} props.required - Si el campo es requerido
 */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

/**
 * Componente principal para la edición de un dispositivo de Storage.
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.storageId] - ID del dispositivo de storage
 * @param {Function} [props.onClose] - Función para cerrar el modal/vista
 * @param {Function} [props.onSuccess] - Función a ejecutar en caso de éxito
 * @param {boolean} [props.isModal] - Indica si el componente es un modal
 */
const EditarStorage = ({ storageId: propStorageId, onClose, onSuccess, isModal }) => {
  // Estado del formulario con todos los campos de storage
  const [formData, setFormData] = useState({
    cod_item_configuracion: "",
    name: "",
    application_code: "",
    cost_center: "",
    active: "Sí",
    category: "",
    type: "",
    item: "",
    company: "",
    organization_responsible: "",
    host_name: "",
    manufacturer: "",
    status: "Aplicado",
    owner: "",
    model: "",
    serial: "",
    org_maintenance: "",
    ip_address: "",
    disk_size: "",
    location: "",
  });

  // Opciones predefinidas para campos de selección
  const statusOptions = ["Aplicado", "No Aplicado"];
  const activeOptions = ["Sí", "No"];
  const typeOptions = ["SAN", "NAS", "DAS", "Local Storage", "Cloud Storage"];
  const manufacturerOptions = [
    "Dell",
    "HP",
    "IBM",
    "NetApp",
    "EMC",
    "Hitachi",
    "Pure Storage",
  ];

  // Estados del componente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authenticationToken");
  const BASE_PATH = "/AssetSphere";
  const { storageId: routeStorageId } = useParams();
  const storageId = propStorageId || routeStorageId;

  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(`${BASE_PATH}/storage`);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`${BASE_PATH}/storage`);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleClose();
      }
    });
  };

  // Configuración de notificaciones toast
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

  /**
   * Muestra notificación de éxito
   */
  const showSuccessToast = () => {
    Toast.fire({ icon: "success", title: "Storage actualizado exitosamente" });
  };

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Carga los datos del storage desde la API
   */
  useEffect(() => {
    const fetchStorageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/storage/get_by_id/${storageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();

        // Manejo flexible de diferentes estructuras de respuesta
        if (data && data.data && data.data.storage_info) {
          setFormData(data.data.storage_info);
        } else if (data && data.storage_info) {
          setFormData(data.storage_info);
        } else if (data && data.data) {
          setFormData(data.data);
        } else if (data && typeof data === "object") {
          setFormData(data);
        } else {
          console.error("Estructura de respuesta no reconocida:", data);
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener datos del storage:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId) {
      fetchStorageData();
    }
  }, [storageId, token]);

  /**
   * Maneja el envío del formulario de edición
   * @param {Event} event - Evento del formulario
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/storage/edit/${storageId}`,
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

      showSuccessToast();
      handleDone();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Cargando datos del storage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-slate-700 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-800 dark:text-slate-100 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100" : "as-page"}>
      {/* Header */}
      {!isModal && (
        <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              Editar Storage
            </h1>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Modifica la información del dispositivo de almacenamiento
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Regresar
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className={isModal ? "" : "container mx-auto p-6"}>
        <div className={isModal ? "bg-white dark:bg-slate-800" : "bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700"}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Código Item Configuración"
                  name="cod_item_configuracion"
                  value={formData.cod_item_configuracion}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de Serie"
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Nombre del Host"
                  name="host_name"
                  value={formData.host_name}
                  onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Activo
                  </label>
                  <select
                    name="active"
                    value={formData.active}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {activeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Configuración de Red */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Configuración de Red
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Dirección IP"
                  name="ip_address"
                  value={formData.ip_address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Especificaciones Técnicas */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Fabricante
                  </label>
                  <select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar fabricante</option>
                    {manufacturerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Modelo"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tamaño de Disco"
                  name="disk_size"
                  value={formData.disk_size}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Item"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Información Organizacional */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Información Organizacional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Empresa"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización Responsable"
                  name="organization_responsible"
                  value={formData.organization_responsible}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Propietario"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización de Mantenimiento"
                  name="org_maintenance"
                  value={formData.org_maintenance}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Centro de Costo"
                  name="cost_center"
                  value={formData.cost_center}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Código de Aplicación"
                  name="application_code"
                  value={formData.application_code}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50"
              >
                <MdArrowBack size={18} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MdEdit size={18} className="mr-2" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarStorage;







