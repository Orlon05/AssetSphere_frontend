/**
 * COMPONENTE: VerServidorFisico
 *
 * PROPÓSITO:
 * Componente de solo lectura para visualizar todos los detalles
 * de un servidor físico específico de manera organizada y clara.
 * Muestra información completa en secciones temáticas bien estructuradas.
 *
 * FUNCIONALIDADES:
 * - Visualización de datos del servidor físico organizados en 7 secciones temáticas
 * - Carga de datos desde la API usando el ID del servidor de la URL
 * - Estados visuales diferenciados para el estado del servidor (colores específicos)
 * - Manejo de estados de carga y error con pantallas específicas
 * - Navegación de regreso a la lista o página anterior
 * - Manejo robusto de la estructura de respuesta de la API
 * - Formateo especial para campos de estado con colores distintivos
 *
 * ESTRUCTURA DE VISUALIZACIÓN:
 * 1. Información Básica: hostname, serial, fabricante, modelo, tipo, estado
 * 2. Configuración de Red: IP servidor, IP iLO/IPMI
 * 3. Especificaciones Técnicas: núcleos, memoria, capacidad disco
 * 4. Ubicación Física: ubicación, ubicación específica, rack, gabinete
 * 5. Información de Servicio: tipo servicio, aplicación, propietario, acción
 * 6. Garantía y Soporte: fechas garantía, EOS, número PO
 * 7. Observaciones: comentarios adicionales
 */

import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerServidorFisico = () => {
  const { serverId } = useParams(); // ID del servidor desde la URL
  const navigate = useNavigate();
  const [serverData, setServerData] = useState({}); // Datos del servidor
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Configuración de las secciones del formulario y sus campos correspondientes
  // Esta estructura permite organizar la información de manera lógica y mantenible
  const formSections = [
    {
      title: "Información Básica",
      fields: [
        "hostname",
        "serial_number",
        "manufacturer",
        "server_model",
        "server_type",
        "service_status",
      ],
    },
    {
      title: "Configuración de Red",
      fields: ["ip_server", "ip_ilo"],
    },
    {
      title: "Especificaciones Técnicas",
      fields: ["core_count", "installed_memory", "total_disk_capacity"],
    },
    {
      title: "Ubicación Física",
      fields: ["location", "ubication", "unit", "enclosure"],
    },
    {
      title: "Información de Servicio",
      fields: ["service_type", "application", "owner", "action"],
    },
    {
      title: "Garantía y Soporte",
      fields: ["warranty_start_date", "warranty_end_date", "eos", "po_number"],
    },
    {
      title: "Observaciones",
      fields: ["comments"],
    },
  ];

  // Mapeo de nombres de campos a etiquetas legibles para el usuario
  const fieldLabels = {
    hostname: "Hostname",
    serial_number: "Número de Serie",
    manufacturer: "Fabricante",
    server_model: "Modelo del Servidor",
    server_type: "Tipo de Servidor",
    service_status: "Estado del Servicio",
    ip_server: "IP del Servidor",
    ip_ilo: "IP iLO/IPMI",
    core_count: "Número de Núcleos",
    installed_memory: "Memoria Instalada",
    total_disk_capacity: "Capacidad Total de Disco",
    location: "Ubicación",
    ubication: "Ubicación Específica",
    unit: "Unidad/Rack",
    enclosure: "Gabinete/Enclosure",
    service_type: "Tipo de Servicio",
    application: "Aplicación",
    owner: "Propietario/Responsable",
    action: "Acción",
    warranty_start_date: "Inicio Garantía",
    warranty_end_date: "Fin Garantía",
    eos: "End of Support (EOS)",
    po_number: "Número de Orden de Compra",
    comments: "Observaciones",
  };

  /**
   * Función para obtener las clases CSS apropiadas según el estado del servidor
   * Proporciona colores diferenciados para cada tipo de estado de servidor físico
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "decommissioned":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  /**
   * Función para obtener el texto legible del estado
   * Convierte los valores técnicos en texto amigable para el usuario
   */
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "maintenance":
        return "Mantenimiento";
      case "decommissioned":
        return "Descomisionado";
      default:
        return status;
    }
  };

  /**
   * Efecto para obtener los datos del servidor al montar el componente
   * Se ejecuta cuando cambia el serverId
   */
  useEffect(() => {
    const fetchServerData = async () => {
      if (!serverId) return;

      try {
        setLoading(true);
        setError(null);

        // Verificar que existe el token de autorización
        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `https://10.8.150.90/api/inveplus/servers/physical/${serverId}`,
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
        // Verificar que la respuesta tenga la estructura esperada
        if (data?.status === "success" && data.data?.server_info) {
          setServerData(data.data.server_info);
        } else {
          throw new Error(
            "Datos del servidor no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [serverId]);

  // Pantalla de carga con spinner animado
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando datos del servidor...
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error con opción de volver
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <strong>Error:</strong> {error}
          <button
            onClick={() => navigate("/inveplus/servidoresf")}
            className="mt-3 block text-blue-600 hover:text-blue-800 transition-colors"
          >
            <MdArrowBack className="inline mr-1" /> Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header con título y botón de regreso */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualizar Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del servidor
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

      {/* Contenido principal con los datos del servidor */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Renderizado dinámico de todas las secciones */}
            {formSections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Renderizado de cada campo en la sección */}
                  {section.fields.map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {fieldLabels[field]}
                      </label>
                      {/* Renderizado especial para el campo de estado con colores */}
                      {field === "service_status" ? (
                        <div
                          className={`
                            border rounded-lg block w-full p-2.5 font-medium text-center
                            ${
                              serverData.service_status?.toLowerCase() ===
                              "active"
                                ? "bg-green-100 border-green-300 text-green-800"
                                : serverData.service_status?.toLowerCase() ===
                                  "maintenance"
                                ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                : serverData.service_status?.toLowerCase() ===
                                  "decommissioned"
                                ? "bg-gray-100 border-gray-300 text-gray-800"
                                : "bg-red-100 border-red-300 text-red-800"
                            }
                          `}
                        >
                          {getStatusText(serverData.service_status)}
                        </div>
                      ) : (
                        /* Renderizado estándar para otros campos */
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
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

export default VerServidorFisico;
