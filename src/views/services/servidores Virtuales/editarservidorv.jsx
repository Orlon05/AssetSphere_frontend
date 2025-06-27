"use client";

/**
 * COMPONENTE: EditarServidorVirtual
 *
 * PROPÓSITO:
 * Permite editar la información de un servidor virtual existente.
 * Carga los datos actuales del servidor y permite modificarlos.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Carga datos del servidor desde la API usando el ID de la URL
 * - Formulario pre-poblado con datos existentes
 * - Actualización de datos mediante API PUT
 * - Estados de carga y manejo de errores
 * - Validación y conversión de tipos de datos
 * - Notificaciones toast para mejor UX
 *
 * OPTIMIZACIONES REALIZADAS:
 * - Consolidación de estados individuales en un objeto formData
 * - Mejora en el manejo de errores con mensajes específicos
 * - Optimización de la carga de datos con mejor estructura
 * - Eliminación de código duplicado
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save, X, Server } from "lucide-react";

const EditarServidorVirtual = () => {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_PATH = "/inveplus";

  // Estado consolidado del formulario (OPTIMIZACIÓN: antes eran estados separados)
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

  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Servidor actualizado exitosamente",
    });
  };

  /**
   * Maneja cambios en los campos del formulario
   * OPTIMIZACIÓN: Función unificada para todos los campos
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Carga los datos del servidor desde la API
   * OPTIMIZACIÓN: Mejor manejo de errores y estructura de datos
   */
  useEffect(() => {
    const fetchServerData = async () => {
      if (!serverId) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authenticationToken");
        if (!token) {
          throw new Error("Token de autorización no encontrado");
        }

        const response = await fetch(
          `https://10.8.150.90/api/inveplus/vservers/virtual/get/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener datos del servidor:", errorData);

          // Manejo específico de errores HTTP
          if (response.status === 404) {
            throw new Error("Servidor no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.message || errorData.detail
              }`
            );
          }
        }

        const data = await response.json();

        // Validación de estructura de respuesta
        if (data.status === "success" && data.data?.server_info) {
          const server = data.data.server_info;

          // OPTIMIZACIÓN: Actualización consolidada del estado
          setFormData({
            platform: server.platform || "",
            strategic_ally: server.strategic_ally || "",
            id_vm: server.id_vm || "",
            server: server.server || "",
            memory: server.memory || "",
            so: server.so || "",
            status: server.status || "",
            cluster: server.cluster || "",
            hdd: server.hdd || "",
            cores: server.cores || "",
            ip: server.ip || "",
            modified: server.modified || "",
          });
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error en fetchServerData:", error);
        setError(error.message || "Error al obtener los datos del servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [serverId]);

  /**
   * Procesa la actualización del servidor
   * OPTIMIZACIÓN: Mejor preparación de datos y manejo de errores
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Preparación de datos con conversión de tipos
    const serverData = {
      ...formData,
      memory: Number.parseInt(formData.memory) || null,
      cores: Number.parseInt(formData.cores) || null,
    };

    try {
      const token = localStorage.getItem("authenticationToken");
      const response = await fetch(
        `https://10.8.150.90/api/inveplus/vservers/virtual/edit/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serverData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;

        try {
          const errorData = await response.json();
          console.error("Detalles del error (JSON):", errorData);

          // Manejo específico de diferentes tipos de error
          if (errorData && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      } else {
        showSuccessToast();
        navigate(`${BASE_PATH}/servidoresv`);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la cancelación con confirmación
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

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando detalles del servidor...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate(`${BASE_PATH}/servidoresv`)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header con información del servidor */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Server className="mr-2 text-blue-600" size={24} />
            Editar Servidor Virtual
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información del servidor{" "}
            <span className="font-bold">{formData.server}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`${BASE_PATH}/servidoresv`)}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      {/* Formulario de edición */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campos de información básica */}
                {[
                  { name: "platform", label: "Plataforma", type: "text" },
                  {
                    name: "strategic_ally",
                    label: "Aliado estratégico",
                    type: "text",
                  },
                  { name: "id_vm", label: "ID VM", type: "text" },
                  { name: "server", label: "Servidor", type: "text" },
                  { name: "memory", label: "Memoria (MB)", type: "number" },
                  { name: "so", label: "Sistema Operativo", type: "text" },
                  { name: "status", label: "Estado", type: "text" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sección: Configuración */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Configuración
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campos de configuración */}
                {[
                  { name: "cluster", label: "Cluster", type: "text" },
                  { name: "hdd", label: "Disco Duro", type: "text" },
                  { name: "cores", label: "Núcleos", type: "number" },
                  { name: "ip", label: "Dirección IP", type: "text" },
                  {
                    name: "modified",
                    label: "Fecha de Modificación",
                    type: "date",
                  },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
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
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarServidorVirtual;
