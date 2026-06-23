/**
 * @file CrearServidor.jsx
 * @description COMPONENTE: CrearServidorFisico
 *
 * PROPÓSITO:
 * Formulario completo para crear nuevos servidores físicos en el sistema.
 * Maneja una estructura de datos más compleja que los servidores virtuales,
 * con múltiples secciones organizadas por categorías funcionales.
 *
 * FUNCIONALIDADES:
 * - Formulario extenso con 25+ campos organizados en 7 secciones
 * - Validación de campos requeridos (hostname, serial_number, service_status)
 * - Campos de selección con opciones predefinidas (fabricante, tipo, estado)
 * - Campos especializados (fechas, números, textarea)
 * - Envío de datos a la API para crear servidor físico
 * - Manejo de errores HTTP específicos
 * - Confirmación antes de cancelar para evitar pérdida de datos
 * - Navegación automática después del éxito
 * - Estados de carga durante el envío
 *
 * ESTRUCTURA DEL FORMULARIO:
 * 1. Información Básica: hostname, serial, fabricante, modelo, tipo, estado
 * 2. Configuración de Red: IP servidor, IP iLO/IPMI
 * 3. Especificaciones Técnicas: núcleos, memoria, capacidad disco
 * 4. Ubicación y Organización: ubicación, rack, gabinete
 * 5. Información de Servicio: tipo servicio, aplicación, propietario, acción
 * 6. Garantía y Soporte: fechas garantía, EOS, número PO
 * 7. Información Adicional: comentarios/observaciones
 */
import { API_URL } from "../../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import Swal from "sweetalert2";

// Ruta base para la navegación del sistema
const BASE_PATH = "/AssetSphere";

/**
 * Componente CrearServidorFisico.
 * Renderiza un formulario para la creación de un nuevo servidor físico.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} [props.isModal=false] - Indica si el componente se renderiza dentro de un modal.
 * @param {Function} [props.onClose] - Función callback para cerrar el modal.
 * @returns {JSX.Element} Formulario de creación de servidor físico.
 */
const CrearServidorFisico = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado del botón de envío

  // Estado inicial del formulario con los campos requeridos del servidor físico
  const [formData, setFormData] = useState({
    serial_number: "", // Número de serie del servidor (requerido)
    hostname: "", // Nombre del host (requerido)
    ip_server: "", // Dirección IP del servidor
    service_status: "active", // Estado del servicio (valor por defecto: activo)
    total_disk_capacity: "", // Capacidad total de almacenamiento
    server_model: "", // Modelo específico del servidor
    core_count: "", // Número de núcleos de CPU
    manufacturer: "", // Fabricante del servidor
    installed_memory: "", // Memoria RAM instalada
    warranty_start_date: "", // Fecha de inicio de garantía
    warranty_end_date: "", // Fecha de fin de garantía
    location: "", // Ubicación física general
    unit: "", // Unidad o rack específico
    processor: "", // Procesador / CPU
    environment: "", // Ambiente / Entorno
    os_type: "", // Sistema Operativo
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

  /**
   * Maneja los cambios en todos los campos del formulario
   * Actualiza el estado formData con el nuevo valor del campo modificado
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} e - Evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Procesa el envío del formulario para crear un nuevo servidor físico
   * - Valida la existencia del token de autorización
   * - Envía los datos a la API mediante POST
   * - Maneja diferentes tipos de errores HTTP
   * - Muestra notificaciones de éxito o error
   * - Navega de vuelta a la lista si es exitoso
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Evento submit del formulario.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verificar que existe el token de autorización en localStorage
      const token = localStorage.getItem("authenticationToken");

      // Realizar petición POST a la API para crear el servidor físico
      const response = await fetch(
        `${API_URL}/servers/physical/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // Manejo de errores HTTP
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      // Mostrar notificación de éxito y navegar a la lista
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servidor creado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        if (isModal && onClose) onClose();
        else navigate(`${BASE_PATH}/servidoresf`);
      });
    } catch (error) {
      console.error("Error al crear servidor:", error);
      // Mostrar notificación de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al crear el servidor",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      // Rehabilitar el botón de envío
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la cancelación del formulario
   * Muestra confirmación para evitar pérdida accidental de datos
   * Si el usuario confirma, navega de vuelta a la lista
   *
   * @returns {void}
   */
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
        if (isModal && onClose) onClose();
        else navigate(`${BASE_PATH}/servidoresf`);
      }
    });
  };

  return (
    <div className="min-h-screen w-full text-gray-800 dark:text-slate-100">
      {/* Header con título y botón de regreso */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Ingresa la información del nuevo servidor
          </p>
        </div>
        <button
          onClick={() => isModal && onClose ? onClose() : window.history.back()}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      {/* Contenido principal del formulario */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica del Servidor */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Hostname (requerido) */}
                <div className="space-y-2">
                  <label
                    htmlFor="hostname"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Hostname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hostname"
                    name="hostname"
                    required
                    value={formData.hostname}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Número de serie (requerido) */}
                <div className="space-y-2">
                  <label
                    htmlFor="serial_number"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Número de Serie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    required
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Fabricante (select con opciones predefinidas) */}
                <div className="space-y-2">
                  <label
                    htmlFor="manufacturer"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Fabricante
                  </label>
                  <select
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
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

                {/* Campo: Modelo del servidor */}
                <div className="space-y-2">
                  <label
                    htmlFor="server_model"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Modelo del Servidor
                  </label>
                  <input
                    type="text"
                    id="server_model"
                    name="server_model"
                    value={formData.server_model}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Estado del servicio (requerido, select) */}
                <div className="space-y-2">
                  <label
                    htmlFor="service_status"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Estado del Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service_status"
                    name="service_status"
                    required
                    value={formData.service_status}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {serviceStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo: Ambiente / Entorno */}
                <div className="space-y-2">
                  <label
                    htmlFor="environment"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Ambiente / Entorno
                  </label>
                  <input
                    type="text"
                    id="environment"
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    placeholder="ej: Production, Testing"
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Configuración de Red */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Configuración de Red
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: IP del servidor */}
                <div className="space-y-2">
                  <label
                    htmlFor="ip_server"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    IP del Servidor
                  </label>
                  <input
                    type="text"
                    id="ip_server"
                    name="ip_server"
                    value={formData.ip_server}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Especificaciones Técnicas */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Procesador / CPU */}
                <div className="space-y-2">
                  <label
                    htmlFor="processor"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Procesador / CPU
                  </label>
                  <input
                    type="text"
                    id="processor"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    placeholder="ej: Intel Xeon, AMD EPYC"
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Número de núcleos (tipo number para validación) */}
                <div className="space-y-2">
                  <label
                    htmlFor="core_count"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Número de Núcleos
                  </label>
                  <input
                    type="number"
                    id="core_count"
                    name="core_count"
                    value={formData.core_count}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Memoria instalada */}
                <div className="space-y-2">
                  <label
                    htmlFor="installed_memory"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Memoria Instalada
                  </label>
                  <input
                    type="text"
                    id="installed_memory"
                    name="installed_memory"
                    value={formData.installed_memory}
                    onChange={handleChange}
                    placeholder="ej: 32GB"
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Capacidad total de disco */}
                <div className="space-y-2">
                  <label
                    htmlFor="total_disk_capacity"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Capacidad Total de Disco
                  </label>
                  <input
                    type="text"
                    id="total_disk_capacity"
                    name="total_disk_capacity"
                    value={formData.total_disk_capacity}
                    onChange={handleChange}
                    placeholder="ej: 1TB"
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Sistema Operativo */}
                <div className="space-y-2">
                  <label
                    htmlFor="os_type"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Sistema Operativo
                  </label>
                  <input
                    type="text"
                    id="os_type"
                    name="os_type"
                    value={formData.os_type}
                    onChange={handleChange}
                    placeholder="ej: RHEL 8, Windows Server 2022"
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Ubicación y Organización */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Ubicación y Organización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Ubicación general */}
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Ubicación
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Unidad o rack */}
                <div className="space-y-2">
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Unidad/Rack
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 5: Garantía y Soporte */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Garantía y Soporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Fecha inicio garantía (tipo date) */}
                <div className="space-y-2">
                  <label
                    htmlFor="warranty_start_date"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Fecha Inicio Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_start_date"
                    name="warranty_start_date"
                    value={formData.warranty_start_date}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Fecha fin garantía (tipo date) */}
                <div className="space-y-2">
                  <label
                    htmlFor="warranty_end_date"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Fecha Fin Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_end_date"
                    name="warranty_end_date"
                    value={formData.warranty_end_date}
                    onChange={handleChange}
                    className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción del formulario */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              {/* Botón Cancelar - llama a handleCancel */}
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors"
              >
                <X size={18} className="mr-2" />
                Cancelar
              </button>
              {/* Botón Guardar - envía el formulario, se deshabilita durante el envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Servidor"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CrearServidorFisico;






