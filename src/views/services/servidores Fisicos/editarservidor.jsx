/**
 * @file editarservidor.jsx
 * @description COMPONENTE: EditarServidorFisico
 *
 * PROPÓSITO:
 * Permite editar la información de un servidor físico existente.
 * Carga los datos actuales del servidor desde la API y permite modificarlos
 * a través de un formulario completo con múltiples secciones organizadas.
 *
 * FUNCIONALIDADES:
 * - Carga automática de datos del servidor usando el ID de la URL
 * - Formulario pre-poblado con la información existente del servidor físico
 * - Actualización de datos mediante petición PUT a la API
 * - Estados de carga mientras obtiene y actualiza datos
 * - Manejo de errores específicos (404, 401, validación)
 * - Notificaciones toast para mejor experiencia de usuario
 * - Componente reutilizable InputField para campos del formulario
 * - Campos de selección con opciones predefinidas
 * - Validación de campos requeridos
 *
 * CARACTERÍSTICAS ESPECIALES:
 * - Uso de componente InputField reutilizable para reducir código duplicado
 * - Manejo de múltiples tipos de campos (text, number, date, select, textarea)
 * - Estructura organizada en 7 secciones temáticas
 * - Estados de carga y error con pantallas específicas
 */

import { useState, useEffect } from "react";
import { MdEdit, MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "../../../config/api";

/**
 * Componente reutilizable para los campos del formulario
 * Reduce la duplicación de código y mantiene consistencia visual
 *
 * @param {Object} props - Propiedades del componente InputField.
 * @param {string} props.label - Etiqueta a mostrar para el input.
 * @param {string} props.name - Nombre del input, usado para el id y name.
 * @param {string|number} props.value - Valor actual del input.
 * @param {Function} props.onChange - Callback que se ejecuta cuando el valor cambia.
 * @param {string} [props.type="text"] - Tipo de input HTML.
 * @param {boolean} [props.required=false] - Indica si el campo es obligatorio.
 * @returns {JSX.Element} Campo de formulario.
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
 * Componente EditarServidorFisico.
 * Renderiza un formulario para editar un servidor físico existente.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.serverId] - ID del servidor a editar, opcional si se pasa por URL.
 * @param {Function} [props.onClose] - Función callback para cerrar el modal.
 * @returns {JSX.Element} Formulario de edición de servidor físico.
 */
const EditarServidorFisico = ({ serverId: propServerId, onClose }) => {
  const { serverId: urlServerId } = useParams(); // ID del servidor desde la URL
  const serverId = propServerId || urlServerId;
  const isModal = !!propServerId;

  // Estado consolidado del formulario con los campos requeridos del servidor físico
  const [formData, setFormData] = useState({
    serial_number: "",
    hostname: "",
    ip_server: "",
    service_status: "",
    server_model: "",
    core_count: "",
    manufacturer: "",
    installed_memory: "",
    total_disk_capacity: "",
    location: "",
    unit: "",
    warranty_start_date: "",
    warranty_end_date: "",
    processor: "",
    environment: "",
    os_type: "",
  });

  // Opciones predefinidas para campos de selección
  const serviceStatusOptions = [
    "active",
    "inactive",
    "maintenance",
    "decommissioned",
  ];
  const manufacturerOptions = [
    "Dell",
    "HP",
    "IBM",
    "Cisco",
    "Lenovo",
    "Supermicro",
  ];

  // Estados de control del componente
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate();
  const token = localStorage.getItem("authenticationToken");

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

  // Función para mostrar notificación de éxito
  const showSuccessToast = () => {
    Toast.fire({ icon: "success", title: "Servidor actualizado exitosamente" });
  };

  /**
   * Maneja cambios en todos los campos del formulario
   * Actualiza el estado formData con el nuevo valor
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} e - Evento de cambio del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Efecto para cargar los datos del servidor al montar el componente
   * Se ejecuta cuando cambia el serverId o el token
   */
  useEffect(() => {
    const fetchServerData = async () => {
      if (!serverId) return;

      setLoading(true);
      setError(null);

      try {
        // Petición GET para obtener los datos del servidor específico
        const response = await fetch(
          `${API_URL}/servers/physical/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Manejo de errores HTTP
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();
        // Verificar que la respuesta tenga la estructura esperada
        if (data.status === "success" && data.data && data.data.server_info) {
          setFormData(data.data.server_info);
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

    fetchServerData();
  }, [serverId, token]);

  /**
   * Maneja el envío del formulario para actualizar el servidor
   * - Envía petición PUT a la API
   * - Maneja errores y muestra notificaciones apropiadas
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento submit del formulario.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Petición PUT para actualizar el servidor
      const response = await fetch(
        `${API_URL}/servers/physical/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // Manejo detallado de errores HTTP
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail
          ? errorData.detail.map((e) => e.msg).join(", ")
          : errorData.message || "Error en la solicitud";
        throw new Error(errorMessage);
      }

      // Éxito: mostrar toast y navegar de vuelta
      showSuccessToast();
      if (onClose) onClose();
      else navigate("/AssetSphere/servidoresf");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  // Pantalla de carga mientras se obtienen los datos del servidor
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full text-gray-800 dark:text-slate-100 transition-colors duration-300">
        <div className="text-xl font-semibold">
          Cargando datos del servidor...
        </div>
      </div>
    );
  }

  // Pantalla de error si no se pudieron cargar los datos
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full text-gray-800 dark:text-slate-100 transition-colors duration-300">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-gray-800 dark:text-slate-100">
      {/* Header con información del servidor que se está editando */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            Editar Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Modifica la información del servidor
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      {/* Formulario de edición */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Hostname"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Número de Serie"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  required
                />
                {/* Campo: Fabricante (select) */}
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
                  label="Modelo del Servidor"
                  name="server_model"
                  value={formData.server_model}
                  onChange={handleInputChange}
                />
                {/* Campo: Estado del servicio (select requerido) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Estado del Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_status"
                    value={formData.service_status}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {serviceStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Ambiente / Entorno"
                  name="environment"
                  value={formData.environment || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Configuración de Red */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Configuración de Red
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="IP del Servidor"
                  name="ip_server"
                  value={formData.ip_server}
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
                <InputField
                  label="Procesador / CPU"
                  name="processor"
                  value={formData.processor || ""}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de Núcleos"
                  name="core_count"
                  value={formData.core_count}
                  onChange={handleInputChange}
                  type="number"
                />
                <InputField
                  label="Memoria Instalada"
                  name="installed_memory"
                  value={formData.installed_memory}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Capacidad Total de Disco"
                  name="total_disk_capacity"
                  value={formData.total_disk_capacity}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Sistema Operativo"
                  name="os_type"
                  value={formData.os_type || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Ubicación y Organización */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Ubicación y Organización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Unidad/Rack"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Garantía y Soporte */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Garantía y Soporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Fecha Inicio Garantía"
                  name="warranty_start_date"
                  value={formData.warranty_start_date}
                  onChange={handleInputChange}
                  type="date"
                />
                <InputField
                  label="Fecha Fin Garantía"
                  name="warranty_end_date"
                  value={formData.warranty_end_date}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              {/* Botón Cancelar */}
              <button
                type="button"
                onClick={onClose || (() => navigate("/AssetSphere/servidoresf"))}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors"
              >
                <MdArrowBack size={18} className="mr-2" />
                Cancelar
              </button>
              {/* Botón Guardar */}
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default EditarServidorFisico;






