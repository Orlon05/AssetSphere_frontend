import { API_URL } from "../../../config/api";
/**
 * COMPONENTE: CrearServidorFisico
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import Swal from "sweetalert2";

// Ruta base para la navegación del sistema
const BASE_PATH = "/AssetSphere";

const CrearServidorFisico = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado del botón de envío

  // Estado inicial del formulario con todos los campos de la estructura de servidores físicos
  const [formData, setFormData] = useState({
    serial_number: "", // Número de serie del servidor (requerido)
    hostname: "", // Nombre del host (requerido)
    ip_server: "", // Dirección IP del servidor
    ip_ilo: "", // Dirección IP del iLO/IPMI para gestión remota
    service_status: "active", // Estado del servicio (valor por defecto: activo)
    server_type: "", // Tipo de servidor (Physical, Virtual, Blade, Rack)
    total_disk_capacity: "", // Capacidad total de almacenamiento
    action: "", // Acción o propósito del servidor
    server_model: "", // Modelo específico del servidor
    service_type: "", // Tipo de servicio (Production, Development, etc.)
    core_count: "", // Número de núcleos de CPU
    manufacturer: "", // Fabricante del servidor
    installed_memory: "", // Memoria RAM instalada
    warranty_start_date: "", // Fecha de inicio de garantía
    warranty_end_date: "", // Fecha de fin de garantía
    eos: "", // End of Support (fin de soporte)
    enclosure: "", // Gabinete o enclosure donde está ubicado
    application: "", // Aplicación principal que ejecuta
    owner: "", // Propietario o responsable del servidor
    location: "", // Ubicación física general
    unit: "", // Unidad o rack específico
    ubication: "", // Ubicación específica detallada
    comments: "", // Comentarios u observaciones adicionales
    po_number: "", // Número de orden de compra
  });

  // Opciones predefinidas para campos de selección
  const serviceStatusOptions = [
    "active",
    "inactive",
    "maintenance",
    "decommissioned",
  ];
  const serverTypeOptions = ["Physical", "Virtual", "Blade", "Rack"];
  const serviceTypeOptions = [
    "Production",
    "Development",
    "Testing",
    "Staging",
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
        navigate(`${BASE_PATH}/servidoresf`);
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
        navigate(`${BASE_PATH}/servidoresf`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header con título y botón de regreso */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Crear Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Ingresa la información del nuevo servidor
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

      {/* Contenido principal del formulario */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica del Servidor */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Hostname (requerido) */}
                <div className="space-y-2">
                  <label
                    htmlFor="hostname"
                    className="block text-sm font-medium text-gray-700"
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
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Número de serie (requerido) */}
                <div className="space-y-2">
                  <label
                    htmlFor="serial_number"
                    className="block text-sm font-medium text-gray-700"
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
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Fabricante (select con opciones predefinidas) */}
                <div className="space-y-2">
                  <label
                    htmlFor="manufacturer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fabricante
                  </label>
                  <select
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modelo del Servidor
                  </label>
                  <input
                    type="text"
                    id="server_model"
                    name="server_model"
                    value={formData.server_model}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Tipo de servidor (select) */}
                <div className="space-y-2">
                  <label
                    htmlFor="server_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de Servidor
                  </label>
                  <select
                    id="server_type"
                    name="server_type"
                    value={formData.server_type}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {serverTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo: Estado del servicio (requerido, select) */}
                <div className="space-y-2">
                  <label
                    htmlFor="service_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado del Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service_status"
                    name="service_status"
                    required
                    value={formData.service_status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {serviceStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección 2: Configuración de Red */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Configuración de Red
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: IP del servidor */}
                <div className="space-y-2">
                  <label
                    htmlFor="ip_server"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IP del Servidor
                  </label>
                  <input
                    type="text"
                    id="ip_server"
                    name="ip_server"
                    value={formData.ip_server}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: IP iLO/IPMI para gestión remota */}
                <div className="space-y-2">
                  <label
                    htmlFor="ip_ilo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IP iLO/IPMI
                  </label>
                  <input
                    type="text"
                    id="ip_ilo"
                    name="ip_ilo"
                    value={formData.ip_ilo}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Especificaciones Técnicas */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Número de núcleos (tipo number para validación) */}
                <div className="space-y-2">
                  <label
                    htmlFor="core_count"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de Núcleos
                  </label>
                  <input
                    type="number"
                    id="core_count"
                    name="core_count"
                    value={formData.core_count}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Memoria instalada */}
                <div className="space-y-2">
                  <label
                    htmlFor="installed_memory"
                    className="block text-sm font-medium text-gray-700"
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
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Capacidad total de disco */}
                <div className="space-y-2">
                  <label
                    htmlFor="total_disk_capacity"
                    className="block text-sm font-medium text-gray-700"
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
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Ubicación y Organización */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Ubicación y Organización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Ubicación general */}
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ubicación
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Ubicación específica */}
                <div className="space-y-2">
                  <label
                    htmlFor="ubication"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ubicación Específica
                  </label>
                  <input
                    type="text"
                    id="ubication"
                    name="ubication"
                    value={formData.ubication}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Unidad o rack */}
                <div className="space-y-2">
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unidad/Rack
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Gabinete o enclosure */}
                <div className="space-y-2">
                  <label
                    htmlFor="enclosure"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gabinete/Enclosure
                  </label>
                  <input
                    type="text"
                    id="enclosure"
                    name="enclosure"
                    value={formData.enclosure}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 5: Información de Servicio */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información de Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Tipo de servicio (select) */}
                <div className="space-y-2">
                  <label
                    htmlFor="service_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de Servicio
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo de servicio</option>
                    {serviceTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo: Aplicación principal */}
                <div className="space-y-2">
                  <label
                    htmlFor="application"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Aplicación
                  </label>
                  <input
                    type="text"
                    id="application"
                    name="application"
                    value={formData.application}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Propietario o responsable */}
                <div className="space-y-2">
                  <label
                    htmlFor="owner"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Propietario/Responsable
                  </label>
                  <input
                    type="text"
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Acción o propósito */}
                <div className="space-y-2">
                  <label
                    htmlFor="action"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Acción
                  </label>
                  <input
                    type="text"
                    id="action"
                    name="action"
                    value={formData.action}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 6: Garantía y Soporte */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Garantía y Soporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Fecha inicio garantía (tipo date) */}
                <div className="space-y-2">
                  <label
                    htmlFor="warranty_start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Inicio Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_start_date"
                    name="warranty_start_date"
                    value={formData.warranty_start_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Fecha fin garantía (tipo date) */}
                <div className="space-y-2">
                  <label
                    htmlFor="warranty_end_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Fin Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_end_date"
                    name="warranty_end_date"
                    value={formData.warranty_end_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: End of Support */}
                <div className="space-y-2">
                  <label
                    htmlFor="eos"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End of Support (EOS)
                  </label>
                  <input
                    type="text"
                    id="eos"
                    name="eos"
                    value={formData.eos}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Número de orden de compra */}
                <div className="space-y-2">
                  <label
                    htmlFor="po_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de Orden de Compra
                  </label>
                  <input
                    type="text"
                    id="po_number"
                    name="po_number"
                    value={formData.po_number}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 7: Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Adicional
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {/* Campo: Comentarios (textarea para texto largo) */}
                <div className="space-y-2">
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comentarios
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows="3"
                    value={formData.comments}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botones de acción del formulario */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              {/* Botón Cancelar - llama a handleCancel */}
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
