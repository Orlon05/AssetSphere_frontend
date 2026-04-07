import { API_URL } from "../../../config/api";
/**
 * COMPONENTE: ServidoresVirtuales
 *
 * PROPÓSITO:
 * Componente principal para la gestión de servidores virtuales.
 * Proporciona una interfaz completa para listar, buscar, filtrar,
 * y realizar operaciones CRUD sobre servidores virtuales.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Listado paginado de servidores virtuales
 * - Búsqueda por nombre de servidor
 * - Selección múltiple de servidores
 * - Operaciones CRUD (Crear, Ver, Editar, Eliminar)
 * - Importación desde Excel
 * - Exportación a Excel
 * - Estados visuales para diferentes estados de servidor
 * - Manejo de errores y estados de carga
 *
 * OPTIMIZACIONES REALIZADAS:
 * - Consolidación de lógica de búsqueda
 * - Mejora en el manejo de estados de carga
 * - Optimización de renderizado de tabla
 * - Centralización de configuraciones
 * - Eliminación de código duplicado
 * - Mejora en la gestión de memoria con useCallback
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Search,
  Server,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Plus,
  ArrowUpRight,
  Activity,
  Layers,
} from "lucide-react";
import ExcelImporter from "../../../hooks/Excelimporter";
import { createRoot } from "react-dom/client";

// Configuraciones centralizadas
const BASE_PATH = "/AssetSphere";
const API_BASE_URL = `${API_URL}/vservers/virtual`;

// Configuración de metadatos para importación Excel
const TABLE_METADATA = [
  [
    { name: "platform", required: false, type: "string" },
    { name: "strategic_ally", required: false, type: "string" },
    { name: "id_vm", required: false, type: "string" },
    { name: "server", required: false, type: "string" },
    { name: "memory", required: false, type: "int" },
    { name: "so", required: false, type: "string" },
    { name: "status", required: false, type: "string" },
    { name: "cluster", required: false, type: "string" },
    { name: "hdd", required: false, type: "string" },
    { name: "cores", required: false, type: "int" },
    { name: "ip", required: false, type: "string" },
    { name: "modified", required: false, type: "string" },
  ],
];

export default function ServidoresVirtuales() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Estados principales
  const [searchValue, setSearchValue] = useState("");
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Estados de selección
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServers, setSelectedServers] = useState(new Set());

  // Estados de UI
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredServers, setUnfilteredServers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const selectedCount = selectedServers.size;

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

  const showSuccessToast = useCallback(() => {
    Toast.fire({
      icon: "success",
      title: "Servidor virtual eliminado exitosamente",
    });
  }, [Toast]);

  /**
   * Función utilitaria para obtener el token de autorización
   * OPTIMIZACIÓN: Centralización de lógica de token
   */
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("authenticationToken");
    if (!token) {
      throw new Error("Token de autorización no encontrado.");
    }
    return token;
  }, []);

  /**
   * Maneja la importación desde Excel
   * OPTIMIZACIÓN: Mejor estructura y manejo de errores
   */
  const handleImport = useCallback(() => {
    Swal.fire({
      title: "Importar desde Excel",
      html: '<div id="excel-importer-container"></div>',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      width: "80%",
      height: "80%",
      didOpen: () => {
        const container = document.getElementById("excel-importer-container");
        const importer = (
          <ExcelImporter
            onImportComplete={handleImportComplete}
            tableMetadata={TABLE_METADATA}
          />
        );
        if (container) {
          const root = createRoot(container);
          root.render(importer);
        }
      },
      willClose: () => {
        const container = document.getElementById("excel-importer-container");
        if (container) {
          const root = createRoot(container);
          root.unmount();
        }
      },
    });
  }, []);

  /**
   * Procesa los datos importados desde Excel
   * OPTIMIZACIÓN: Mejor formateo de datos y manejo de errores
   */
  const handleImportComplete = useCallback(
    async (importedData) => {
      Swal.fire({
        title: "Procesando datos...",
        text: "Estamos guardando los servidores virtuales importados",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const token = getAuthToken();

        // OPTIMIZACIÓN: Formateo más robusto de datos
        const formattedData = importedData.map((row) => ({
          platform: String(row.platform || ""),
          strategic_ally: String(row.strategic_ally || ""),
          id_vm: String(row.id_vm || ""),
          server: String(row.server || ""),
          memory: Number(row.memory) || 0,
          so: String(row.so || ""),
          status: String(row.status) || "",
          cluster: String(row.cluster || ""),
          hdd: String(row.hdd || ""),
          cores: Number(row.cores) || 0,
          ip: String(row.ip || ""),
          modified: String(row.modified) || "",
        }));

        const response = await fetch(`${API_BASE_URL}/add_from_excel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: formattedData }),
        });

        if (!response.ok) {
          let errorDetail = "";
          try {
            const errorResponse = await response.json();
            errorDetail = JSON.stringify(errorResponse);
          } catch (e) {
            errorDetail = await response.text();
          }
          throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
        }

        // Simular tiempo de procesamiento para mejor UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        Swal.fire({
          icon: "success",
          title: "Importación exitosa",
          text: `Se han importado ${importedData.length} servidores virtuales correctamente.`,
        });

        // Recargar datos
        fetchServers(currentPage, rowsPerPage);
      } catch (error) {
        console.error("Error al procesar los datos importados:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la importación",
          text:
            error.message ||
            "Ha ocurrido un error al procesar los datos importados.",
        });
      }
    },
    [currentPage, rowsPerPage, getAuthToken]
  );

  /**
   * Maneja la exportación a Excel
   * OPTIMIZACIÓN: Mejor manejo de errores y UX
   */
  const handleExport = useCallback(async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Error al exportar la lista: ${errorDetail}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "virtual_servers.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Error de exportación",
        text: error.message,
      });
    }
  }, [getAuthToken]);

  /**
   * Carga los servidores desde la API
   * OPTIMIZACIÓN: Mejor manejo de parámetros y errores
   */
  const fetchServers = useCallback(
    async (page, limit, search = "") => {
      if (isSearching) return;

      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const url = `${API_BASE_URL}?page=${page}&limit=${limit}&server=${search}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw await response.json();
        }

        const data = await response.json();
        if (data && data.status === "success" && data.data) {
          setUnfilteredServers(data.data.servers);
          setServers(data.data.servers);
          setTotalPages(data.data.total_pages || 0);
        } else {
          throw new Error("Respuesta inesperada de la API");
        }
      } catch (error) {
        setError(error);
        console.error("Error al obtener servidores virtuales:", error);
        Swal.fire({
          icon: "error",
          title: "Error de carga",
          text: error.msg || error.message || "Ha ocurrido un error.",
        });
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [isSearching, getAuthToken]
  );

  /**
   * Realiza búsqueda específica de servidores
   * OPTIMIZACIÓN: Función separada para búsquedas
   */
  const fetchSearch = useCallback(
    async (search) => {
      if (isSearching) return;

      setIsSearching(true);
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const url = `${API_BASE_URL}/search?server=${search}&page=${currentPage}&limit=${rowsPerPage}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw await response.json();
        }

        const data = await response.json();
        if (data && data.status === "success" && data.data) {
          setServers(data.data.servers);
          setTotalPages(data.data.total_pages || 0);
        } else {
          throw new Error("Respuesta inesperada de la API");
        }
      } catch (error) {
        setError(error);
        console.error("Error en búsqueda:", error);
        Swal.fire({
          icon: "error",
          title: "Error de búsqueda",
          text: error.msg || error.message || "Ha ocurrido un error.",
        });
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [isSearching, currentPage, rowsPerPage, getAuthToken]
  );

  /**
   * Maneja los cambios en el campo de búsqueda
   * OPTIMIZACIÓN: Mejor manejo del foco
   */
  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  /**
   * Ejecuta la búsqueda
   * OPTIMIZACIÓN: Lógica de búsqueda simplificada
   */
  const handleSearchButtonClick = useCallback(() => {
    if (searchValue.trim() === "") {
      setServers(unfilteredServers);
      setTotalPages(
        unfilteredServers.length > 0
          ? Math.ceil(unfilteredServers.length / rowsPerPage)
          : 0
      );
    } else {
      setCurrentPage(1);
      fetchSearch(searchValue);
    }
  }, [searchValue, unfilteredServers, rowsPerPage, fetchSearch]);

  /**
   * Maneja la selección de todos los servidores
   */
  const toggleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedServers(new Set());
    } else {
      setSelectedServers(new Set(servers.map((server) => server.id)));
    }
  }, [selectAll, servers]);

  /**
   * Maneja la selección individual de servidores
   */
  const toggleSelectServer = useCallback((serverId) => {
    setSelectedServers((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(serverId)) {
        newSelected.delete(serverId);
      } else {
        newSelected.add(serverId);
      }
      return newSelected;
    });
  }, []);

  /**
   * Elimina un servidor virtual
   * OPTIMIZACIÓN: Mejor manejo de errores específicos
   */
  const handleDeleteServer = useCallback(
    async (serverId) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas eliminar este servidor virtual?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          const token = getAuthToken();
          const response = await fetch(`${API_BASE_URL}/delete/${serverId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            let errorMessage = `Error HTTP ${response.status}`;

            try {
              const errorData = await response.json();
              if (response.status === 422 && errorData?.detail) {
                errorMessage = errorData.detail.map((e) => e.msg).join(", ");
              } else if (response.status === 401 || response.status === 403) {
                errorMessage =
                  "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
              } else if (response.status === 404) {
                errorMessage = "El servidor virtual no existe.";
              } else if (errorData?.message) {
                errorMessage = errorData.message;
              }
            } catch (errorParse) {
              console.error("Error parsing error response:", errorParse);
              errorMessage = "Error al procesar la respuesta del servidor.";
            }

            Swal.fire({
              icon: "error",
              title: "Error al eliminar el servidor virtual",
              text: errorMessage,
            });
          } else {
            setServers((prev) =>
              prev.filter((server) => server.id !== serverId)
            );
            showSuccessToast();
          }
        } catch (error) {
          console.error("Error al eliminar el servidor virtual:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar el servidor virtual.",
          });
        }
      }
    },
    [getAuthToken, showSuccessToast]
  );

  /**
   * Función utilitaria para obtener el badge de estado
   * OPTIMIZACIÓN: Centralización de lógica de estados visuales
   */
  const getStatusBadge = useCallback((status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    const statusConfig = {
      encendido: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Encendido",
      },
      activo: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Activo",
      },
      apagado: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Apagado",
      },
      inactivo: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Inactivo",
      },
      paused: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Paused",
      },
      mantenimiento: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Mantenimiento",
      },
    };

    const config = statusConfig[statusLower];
    if (config) {
      const IconComponent = config.icon;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
        >
          <IconComponent size={12} className="mr-1" />
          {config.label}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  }, []);

  /**
   * Función utilitaria para truncar texto
   * OPTIMIZACIÓN: Función reutilizable para texto largo
   */
  const truncateText = useCallback((text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  }, []);

  // Efectos
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  useEffect(() => {
    fetchServers(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchServers]);

  // Filtrado de servidores para la tabla
  const filteredServers = servers.filter((server) =>
    server.server?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Cálculos de paginación
  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando servidores virtuales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 text-gray-100 flex items-center justify-center">
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p>
            {error.message ||
              "Ha ocurrido un error al cargar los servidores virtuales"}
          </p>
          <button
            onClick={() => fetchServers(currentPage, rowsPerPage)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cálculos de estadísticas para las tarjetas
  const totalServers = servers.length;
  const activeServers = servers.filter(s => {
    const status = s.status?.toLowerCase();
    return status === 'encendido' || status === 'activo';
  }).length;
  const uniqueOS = new Set(servers.map(s => s.so).filter(Boolean)).size;

  return (
    <div className="as-page">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-as-text flex items-center">
            <Server className="mr-2 text-as-brand-600" />
            Servidores Virtuales
          </h1>
          <p className="text-sm text-as-muted">
            Gestión y monitoreo de servidores virtuales
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="as-container">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-as-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-as-brand-500 transition-colors duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-as-brand-50 group-hover:border-as-brand-100 transition-colors duration-300">
                <Server size={24} className="text-slate-500 group-hover:text-as-brand-600 transition-colors duration-300" />
              </div>
              <ArrowUpRight size={20} className="text-slate-300 group-hover:text-as-brand-500 group-hover:scale-110 transition-all duration-300" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 group-hover:text-as-brand-600 transition-colors duration-300">{totalServers}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Total Servidores</p>
            </div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-emerald-500 transition-colors duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors duration-300">
                <Activity size={24} className="text-slate-500 group-hover:text-emerald-600 transition-colors duration-300" />
              </div>
              <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">{activeServers}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Servidores Activos</p>
            </div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-indigo-500 transition-colors duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-300">
                <Layers size={24} className="text-slate-500 group-hover:text-indigo-600 transition-colors duration-300" />
              </div>
              <ArrowUpRight size={20} className="text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{uniqueOS}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Sistemas Operativos</p>
            </div>
          </div>
        </div>

        <div className="as-card p-6">
          {/* Barra de búsqueda y botones de acción */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="as-input pl-10"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearchButtonClick()
                  }
                  ref={searchInputRef}
                />
                <button
                  onClick={handleSearchButtonClick}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Buscar"
                >
                  <Search size={16} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-as-brand-600 px-4 py-2 rounded-lg shadow-sm">
                <span className="font-medium text-white mr-2">
                  {selectedCount}
                </span>
                <span className="text-white">
                  Servidor{selectedCount !== 1 ? "es" : ""} virtual
                  {selectedCount !== 1 ? "es" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate(`${BASE_PATH}/crear-servidores-v`)}
                className="as-btn-primary"
                title="Crear nuevo servidor"
              >
                <Plus size={16} className="text-white" />
                <span className="hidden text-white font-medium sm:inline">
                  Crear
                </span>
              </button>
              <button
                onClick={handleImport}
                className="as-btn-success"
                title="Importar desde Excel"
              >
                <Download size={16} className="text-white" />
                <span className="hidden text-white font-medium sm:inline">
                  Importar
                </span>
              </button>
              <button
                onClick={handleExport}
                className="as-btn-purple"
                title="Exportar a Excel"
              >
                <Upload size={16} className="text-white" />
                <span className="hidden text-white font-medium sm:inline">
                  Exportar
                </span>
              </button>
            </div>
          </div>

          {/* Tabla de servidores */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm custom-scrollbar">
            <table className="as-table">
              <thead>
                <tr>
                  <th scope="col" className="as-th w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                      checked={
                        servers.length > 0 &&
                        selectedServers.size === servers.length
                      }
                      onChange={toggleSelectAll}
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th scope="col" className="as-th w-1/4">
                    Server
                  </th>
                  <th scope="col" className="as-th w-1/6">
                    Estado
                  </th>
                  <th scope="col" className="as-th w-1/6">
                    IP
                  </th>
                  <th
                    scope="col"
                    className="as-th w-32 text-right"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServers.length > 0 ? (
                  filteredServers.map((server, index) => (
                    <tr
                      key={server.id}
                      className={`group border-b border-slate-100 transition-colors ${
                        selectedServers.has(server.id)
                          ? "bg-as-brand-50/50"
                          : "bg-white hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="as-td">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                          checked={selectedServers.has(server.id)}
                          onChange={() => toggleSelectServer(server.id)}
                          aria-label={`Seleccionar servidor ${server.server}`}
                        />
                      </td>
                      <td className="as-td font-semibold text-slate-900">
                        <div className="truncate" title={server.server}>
                          {truncateText(server.server, 25)}
                        </div>
                      </td>
                      <td className="as-td">
                        {getStatusBadge(server.status)}
                      </td>
                      <td className="as-td font-mono text-slate-600">
                        <div className="truncate" title={server.ip}>
                          {truncateText(server.ip, 15)}
                        </div>
                      </td>
                      <td className="as-td text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              navigate(`${BASE_PATH}/ver/${server.id}/vservers`)
                            }
                            className="p-2 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-all"
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${server.server}`}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/editar/${server.id}/vservers`
                              )
                            }
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Editar"
                            aria-label={`Editar ${server.server}`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteServer(server.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                            aria-label={`Eliminar ${server.server}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500 bg-white"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Server className="h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">No se encontraron servidores virtuales</p>
                        <p className="text-sm mt-1">Ajusta tu búsqueda o intenta agregar uno nuevo.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 px-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-500 mr-3">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number.parseInt(e.target.value, 10))
                }
                className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-as-brand-500/20 focus:border-as-brand-500 outline-none transition-all shadow-sm cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Mostrando <span className="text-slate-900">{indexOfFirstServer + 1}</span> a{" "}
              <span className="text-slate-900">{Math.min(indexOfLastServer, filteredServers.length)}</span> de{" "}
              <span className="text-slate-900">{filteredServers.length}</span> servidores
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-as-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center justify-center min-w-[2rem] h-9 rounded-lg bg-as-brand-50 text-as-brand-700 font-semibold border border-as-brand-100">
                {currentPage}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-as-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Página siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
