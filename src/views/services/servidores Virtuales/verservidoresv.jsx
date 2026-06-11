import { API_URL } from "../../../config/api";
/**
 * @file verservidoresv.jsx
 * @description Componente de solo lectura para visualizar todos los detalles
 * de un servidor virtual específico de manera organizada.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Visualización de datos del servidor en secciones organizadas
 * - Carga de datos desde la API usando el ID del servidor
 * - Estados visuales diferenciados para el estado del servidor
 * - Manejo de estados de carga y error
 * - Navegación de regreso
 *
 * ESTRUCTURA DE DATOS:
 * - Información Básica: servidor, ID VM, plataforma, aliado, estado
 * - Configuración Técnica: memoria, núcleos, disco, SO
 * - Configuración de Red: IP, cluster
 * - Información Adicional: fecha de modificación
 *
 * OPTIMIZACIONES REALIZADAS:
 * - Configuración declarativa de secciones y campos
 * - Función utilitaria para colores de estado
 * - Mejor manejo de diferentes estructuras de respuesta API
 * - Eliminación de imports no utilizados (MdArrowBack)
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Componente para visualizar la información detallada de un servidor virtual.
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.serverId] - ID del servidor (opcional si se pasa por ruta)
 * @param {Function} [props.onClose] - Función para cerrar el modal o regresar
 */
const VerServidorVirtual = ({ serverId: propServerId, onClose }) => {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serverId: urlServerId } = useParams();
  const serverId = propServerId || urlServerId;
  const isModal = !!propServerId;

  // Configuración declarativa de las secciones del formulario
  // OPTIMIZACIÓN: Estructura de datos centralizada para fácil mantenimiento
  const formSections = [
    {
      title: "Información Básica",
      fields: ["server", "id_vm", "platform", "strategic_ally", "status"],
    },
    {
      title: "Configuración Técnica",
      fields: ["memory", "cores", "hdd", "so"],
    },
    {
      title: "Configuración de Red",
      fields: ["ip", "cluster"],
    },
    {
      title: "Información Adicional",
      fields: ["modified"],
    },
  ];

  // Mapeo de etiquetas para los campos
  // OPTIMIZACIÓN: Centralización de labels para consistencia
  const fieldLabels = {
    server: "Nombre del Servidor",
    id_vm: "ID de la VM",
    platform: "Plataforma",
    strategic_ally: "Aliado estratégico",
    status: "Estado",
    memory: "Memoria (GB)",
    cores: "Núcleos",
    hdd: "Disco Duro",
    so: "Sistema Operativo",
    ip: "Dirección IP",
    cluster: "Cluster",
    modified: "Última Modificación",
  };

  /**
   * Función utilitaria para obtener clases CSS según el estado
   * OPTIMIZACIÓN: Centralización de lógica de estilos de estado
   */
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 border-gray-300";

    const statusLower = status.toLowerCase();
    const statusMap = {
      activo: "bg-green-100 text-green-800 border-green-300",
      encendido: "bg-green-100 text-green-800 border-green-300",
      inactivo: "bg-red-100 text-red-800 border-red-300",
      apagado: "bg-red-100 text-red-800 border-red-300",
      mantenimiento: "bg-yellow-100 text-yellow-800 border-yellow-300",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };

    return (
      statusMap[statusLower] || "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 border-gray-300"
    );
  };

  /**
   * Carga los datos del servidor desde la API
   * OPTIMIZACIÓN: Mejor manejo de diferentes estructuras de respuesta
   */
  useEffect(() => {
    const fetchServerData = async () => {
      if (!serverId) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        if (!token) {
          throw new Error("Token de autorización no encontrado");
        }

        const response = await fetch(
          `${API_URL}/vservers/virtual/get/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        // OPTIMIZACIÓN: Manejo robusto de diferentes estructuras de respuesta
        let serverInfo = null;

        // Intentar diferentes estructuras de respuesta posibles
        if (data?.status === "success" && data.data?.server_info) {
          serverInfo = data.data.server_info;
        } else if (data?.data?.server_info) {
          serverInfo = data.data.server_info;
        } else if (data?.data) {
          serverInfo = data.data;
        } else if (data && typeof data === "object" && !data.error) {
          serverInfo = data;
        }

        if (serverInfo) {
          setServerData(serverInfo);
        } else {
          console.error("Estructura no reconocida:", data);
          throw new Error(
            "Datos del servidor no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [serverId]);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-slate-300">
            Cargando datos del servidor virtual...
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center p-12 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <strong>Error:</strong> {error}
          <button
            onClick={onClose || (() => navigate("/servidoresv"))}
            className="mt-3 block text-blue-600 hover:text-blue-800 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? "p-6" : "min-h-screen"} bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100`}>
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm rounded-t-xl mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visualizar Servidor Virtual
          </h1>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Detalles completos del servidor virtual
          </p>
        </div>
        <button
          onClick={onClose || (() => window.history.back())}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          {isModal ? "Cerrar" : "Regresar"}
        </button>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700">
          <div className="space-y-6">
            {/* Renderizado dinámico de secciones */}
            {formSections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                        {fieldLabels[field]}
                      </label>

                      {/* Renderizado especial para el campo de estado */}
                      {field === "status" ? (
                        <div
                          className={`border rounded-lg block w-full p-2.5 font-medium text-center ${getStatusColor(
                            serverData.status
                          )}`}
                        >
                          {serverData.status || "N/A"}
                        </div>
                      ) : (
                        /* Renderizado estándar para otros campos */
                        <div className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5">
                          {serverData[field] || "N/A"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerServidorVirtual;






