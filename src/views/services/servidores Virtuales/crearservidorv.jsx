/**
 * COMPONENTE: CrearServidorVirtual
 *
 * PROPÓSITO:
 * Formulario para crear nuevos servidores virtuales en el sistema.
 * Permite ingresar información básica y configuración técnica del servidor.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Formulario con validación de campos requeridos
 * - Envío de datos a la API para crear servidor
 * - Manejo de errores con mensajes específicos
 * - Confirmación antes de cancelar (evita pérdida de datos)
 * - Navegación automática después del éxito
 *
 * ESTRUCTURA DEL FORMULARIO:
 * - Información Básica: plataforma, aliado estratégico, ID VM, servidor, SO, IP, estado
 * - Configuración Técnica: cluster, almacenamiento, núcleos, memoria, fecha modificación
 *
 * DEPENDENCIAS:
 * - React Router para navegación
 * - SweetAlert2 para notificaciones
 * - Lucide React para iconos
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Server } from "lucide-react";
import Swal from "sweetalert2";

// Constante para rutas base del sistema
const BASE_PATH = "/inveplus";

const CrearServidorVirtual = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del formulario - estructura de datos del servidor virtual
  const [formData, setFormData] = useState({
    platform: "",
    strategic_ally: "",
    id_vm: "",
    server: "",
    memory: "",
    so: "",
    status: "",
    cluster: "",
    hdd: "",
    cores: "",
    ip: "",
    modified: "",
  });

  /**
   * Maneja los cambios en los campos del formulario
   * Actualiza el estado correspondiente al campo modificado
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Procesa el envío del formulario
   * - Valida token de autorización
   * - Envía datos a la API
   * - Maneja diferentes tipos de errores HTTP
   * - Muestra notificaciones de éxito/error
   * - Navega de vuelta a la lista en caso de éxito
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verificación de token de autorización
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      // Petición POST a la API
      const response = await fetch(
        "https://10.8.150.90/api/inveplus/vservers/virtual/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // Manejo de errores HTTP específicos
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;

        if (response.status === 422) {
          // Error de validación - mostrar detalles específicos
          const errorData = await response.json();
          errorMessage = errorData.detail.map((e) => e.msg).join(", ");
        } else if (response.status === 401 || response.status === 403) {
          // Error de autorización
          errorMessage =
            "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
        } else {
          // Otros errores - intentar obtener mensaje del servidor
          try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
          } catch (e) {
            // Si no se puede parsear el error, usar mensaje genérico
          }
        }
        throw new Error(errorMessage);
      }

      // Éxito - mostrar notificación y navegar
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servidor virtual creado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate(`${BASE_PATH}/servidoresv`);
      });
    } catch (error) {
      console.error("Error al crear servidor virtual:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "Ha ocurrido un error al crear el servidor virtual",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la cancelación del formulario
   * Muestra confirmación para evitar pérdida accidental de datos
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
        navigate(`${BASE_PATH}/servidoresv`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header con título y botón de regreso */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div className="flex items-center">
          <Server className="mr-2 text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">
            Crear Servidor Virtual
          </h1>
        </div>
        <button
          onClick={handleCancel}
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
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Plataforma */}
                <div className="space-y-2">
                  <label
                    htmlFor="platform"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Plataforma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    required
                    value={formData.platform}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Aliado estratégico */}
                <div className="space-y-2">
                  <label
                    htmlFor="strategic_ally"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Aliado estratégico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="strategic_ally"
                    name="strategic_ally"
                    required
                    value={formData.strategic_ally}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: ID VM */}
                <div className="space-y-2">
                  <label
                    htmlFor="id_vm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID VM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="id_vm"
                    name="id_vm"
                    required
                    value={formData.id_vm}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Nombre del Servidor */}
                <div className="space-y-2">
                  <label
                    htmlFor="server"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del Servidor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="server"
                    name="server"
                    required
                    value={formData.server}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Sistema Operativo */}
                <div className="space-y-2">
                  <label
                    htmlFor="so"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sistema Operativo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="so"
                    name="so"
                    required
                    value={formData.so}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Dirección IP */}
                <div className="space-y-2">
                  <label
                    htmlFor="ip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección IP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ip"
                    name="ip"
                    required
                    value={formData.ip}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Estado (Select) */}
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Configuración Técnica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Configuración Técnica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campo: Cluster */}
                <div className="space-y-2">
                  <label
                    htmlFor="cluster"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cluster
                  </label>
                  <input
                    type="text"
                    id="cluster"
                    name="cluster"
                    value={formData.cluster}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Almacenamiento */}
                <div className="space-y-2">
                  <label
                    htmlFor="hdd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Almacenamiento (GB)
                  </label>
                  <input
                    type="text"
                    id="hdd"
                    name="hdd"
                    value={formData.hdd}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Núcleos */}
                <div className="space-y-2">
                  <label
                    htmlFor="cores"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Núcleos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="cores"
                    name="cores"
                    required
                    value={formData.cores}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Memoria */}
                <div className="space-y-2">
                  <label
                    htmlFor="memory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria (GB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="memory"
                    name="memory"
                    required
                    value={formData.memory}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Campo: Fecha de Modificación */}
                <div className="space-y-2">
                  <label
                    htmlFor="modified"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Modificación
                  </label>
                  <input
                    type="date"
                    id="modified"
                    name="modified"
                    value={formData.modified.substring(0, 16)}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <X size={18} className="mr-2" />
                Cancelar
              </button>
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

export default CrearServidorVirtual;
