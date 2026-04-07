/**
 * COMPONENTE: ServidoresFisicos
 *
 * PROPÓSITO:
 * Componente principal para la gestión completa de servidores físicos.
 * Proporciona una interfaz de administración con operaciones CRUD,
 * funcionalidades de búsqueda, filtrado, paginación, y operaciones masivas.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Listado paginado de servidores físicos con tabla responsive
 * - Sistema de búsqueda por hostname (local y API)
 * - Selección múltiple de servidores con checkbox
 * - Operaciones CRUD completas (Crear, Ver, Editar, Eliminar)
 * - Importación masiva desde archivos Excel con mapeo complejo de columnas
 * - Exportación de datos a Excel
 * - Estados visuales diferenciados para servidores (activo/inactivo/mantenimiento/retirado)
 * - Manejo robusto de errores y estados de carga
 * - Procesamiento avanzado de fechas y datos durante importación
 * - Confirmaciones para acciones destructivas
 * - Notificaciones toast para feedback del usuario
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
import { API_URL } from "../../../config/api";

// Configuraciones centralizadas
const BASE_PATH = "/AssetSphere";
const API_BASE_URL = API_URL + "/servers/physical";

export default function ServidoresFisicos() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Estados principales de la aplicación
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [servers, setServers] = useState([]); // Lista de servidores mostrados
  const [loading, setLoading] = useState(true); // Estado de carga general
  const [error, setError] = useState(null); // Estado de error

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página
  const [totalPages, setTotalPages] = useState(0); // Total de páginas disponibles

  // Estados de selección múltiple
  const [selectAll, setSelectAll] = useState(false); // Estado del checkbox "seleccionar todo"
  const [selectedServers, setSelectedServers] = useState(new Set()); // Set de IDs seleccionados

  // Estados de interfaz de usuario
  const [showSearch, setShowSearch] = useState(true); // Mostrar/ocultar barra de búsqueda
  const [unfilteredServers, setUnfilteredServers] = useState([]); // Lista completa sin filtrar
  const [isSearching, setIsSearching] = useState(false); // Estado de búsqueda activa
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false); // Control de búsqueda

  const selectedCount = selectedServers.size; // Contador de elementos seleccionados

  /**
   * Configuración de metadatos para importación Excel
   * Define el mapeo entre columnas de Excel y campos del backend
   * Incluye validación de tipos y campos requeridos
   */
  const tableMetadata = [
    [
      {
        name: "serial_number",
        required: true,
        type: "string",
        excelColumn: "Serial",
      },
      {
        name: "hostname",
        required: true,
        type: "string",
        excelColumn: "NombredeHost",
      },
      {
        name: "ip_server",
        required: false,
        type: "string",
        excelColumn: "IP SERVER",
      },
      {
        name: "ip_ilo",
        required: false,
        type: "string",
        excelColumn: "IP ILO",
      },
      {
        name: "service_status",
        required: true,
        type: "string",
        excelColumn: "EstadodelServicio",
      },
      {
        name: "server_type",
        required: false,
        type: "string",
        excelColumn: "TipodeServidor",
      },
      {
        name: "total_disk_capacity",
        required: false,
        type: "string",
        excelColumn: "Capacidadtotaldedisco",
      },
      {
        name: "action",
        required: false,
        type: "string",
        excelColumn: "Accion",
      },
      {
        name: "server_model",
        required: false,
        type: "string",
        excelColumn: "ModelodelServidor",
      },
      {
        name: "service_type",
        required: false,
        type: "string",
        excelColumn: "Service Type",
      },
      {
        name: "core_count",
        required: false,
        type: "integer",
        excelColumn: "NúmerodeCore",
      },
      {
        name: "manufacturer",
        required: false,
        type: "string",
        excelColumn: "Fabricante",
      },
      {
        name: "installed_memory",
        required: false,
        type: "string",
        excelColumn: "Memoriainstalada",
      },
      {
        name: "warranty_start_date",
        required: false,
        type: "date",
        excelColumn: "FechaInicioGarantía",
      },
      {
        name: "warranty_end_date",
        required: false,
        type: "date",
        excelColumn: "FechaFinGarantía",
      },
      { name: "eos", required: false, type: "string", excelColumn: "EOS" },
      {
        name: "enclosure",
        required: false,
        type: "string",
        excelColumn: "Enclosure",
      },
      {
        name: "application",
        required: false,
        type: "string",
        excelColumn: "Aplicacion",
      },
      {
        name: "owner",
        required: false,
        type: "string",
        excelColumn: "Propietario",
      },
      {
        name: "location",
        required: false,
        type: "string",
        excelColumn: "Ubicación",
      },
      { name: "unit", required: false, type: "string", excelColumn: "Unidad" },
      {
        name: "ubication",
        required: false,
        type: "string",
        excelColumn: "Ubicación",
      },
      {
        name: "comments",
        required: false,
        type: "string",
        excelColumn: "Observaciones",
      },
      { name: "po_number", required: false, type: "string", excelColumn: "PO" },
    ],
  ];

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
      title: "Servidor eliminado exitosamente",
    });
  }, [Toast]);

  /**
   * Función utilitaria para obtener el token de autorización
   */
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("authenticationToken");
    if (!token) {
      throw new Error("Token de autorización no encontrado.");
    }
    return token;
  }, []);

  /**
   * Maneja la importación de datos desde Excel
   * Abre un modal con el componente ExcelImporter integrado
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
            tableMetadata={tableMetadata}
          />
        );
        if (container) {
          const root = createRoot(container);
          root.render(importer);
        }
      },
      willClose: () => {
        // Limpiar el componente React al cerrar el modal
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
   * Incluye lógica compleja de formateo de fechas y limpieza de datos
   * Envía cada servidor individualmente a la API
   */
  const handleImportComplete = useCallback(
    async (importedData) => {
      Swal.fire({
        title: "Procesando datos...",
        text: "Estamos guardando los servidores importados",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const token = getAuthToken();

        /**
         * Función avanzada para formatear fechas desde Excel
         * Maneja múltiples formatos: dd-mmm-yy, dd/mm/yyyy, yyyy-mm-dd, etc.
         */
        const formatDate = (dateStr) => {
          // Verificar si el valor está vacío o es inválido
          if (
            !dateStr ||
            dateStr === null ||
            dateStr === undefined ||
            dateStr === "N/A" ||
            dateStr === "n/a" ||
            dateStr === "" ||
            String(dateStr).trim() === "" ||
            String(dateStr).toLowerCase() === "n/a"
          ) {
            return null;
          }

          const cleanDateStr = String(dateStr).trim();

          if (cleanDateStr === "") {
            return null;
          }

          try {
            // Patrones de fecha soportados
            const formats = [
              /(\d{1,2})-(\w{3})-(\d{2,4})/, // dd-mmm-yy o dd-mmm-yyyy (29-dic-17)
              /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, // dd/mm/yy o mm/dd/yy
              /(\d{4})-(\d{1,2})-(\d{1,2})/, // yyyy-mm-dd
              /(\d{1,2})-(\d{1,2})-(\d{2,4})/, // dd-mm-yy o dd-mm-yyyy
            ];

            // Mapeo de meses en español e inglés
            const monthMap = {
              ene: "01",
              jan: "01",
              feb: "02",
              mar: "03",
              abr: "04",
              apr: "04",
              may: "05",
              jun: "06",
              jul: "07",
              ago: "08",
              aug: "08",
              sep: "09",
              oct: "10",
              nov: "11",
              dic: "12",
              dec: "12",
            };

            // Procesar formato dd-mmm-yy (como 29-dic-17)
            const match1 = cleanDateStr.match(formats[0]);
            if (match1) {
              const [, day, month, year] = match1;
              const monthNum = monthMap[month.toLowerCase()];
              if (monthNum) {
                const fullYear = year.length === 2 ? `20${year}` : year;
                return `${fullYear}-${monthNum}-${day.padStart(2, "0")}`;
              }
            }

            // Procesar formato dd/mm/yyyy o mm/dd/yyyy
            const match2 = cleanDateStr.match(formats[1]);
            if (match2) {
              const [, part1, part2, year] = match2;
              const fullYear = year.length === 2 ? `20${year}` : year;
              // Asumir formato dd/mm/yyyy
              return `${fullYear}-${part2.padStart(2, "0")}-${part1.padStart(
                2,
                "0"
              )}`;
            }

            // Procesar formato yyyy-mm-dd (ya está correcto)
            const match3 = cleanDateStr.match(formats[2]);
            if (match3) {
              return cleanDateStr;
            }

            // Procesar formato dd-mm-yyyy
            const match4 = cleanDateStr.match(formats[3]);
            if (match4) {
              const [, day, month, year] = match4;
              const fullYear = year.length === 2 ? `20${year}` : year;
              return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
            }

            // Si no coincide con ningún formato, retornar null
            console.warn(`Formato de fecha no reconocido: ${cleanDateStr}`);
            return null;
          } catch (error) {
            console.warn(`Error al procesar fecha: ${cleanDateStr}`, error);
            return null;
          }
        };

        /**
         * Función para limpiar y validar números
         */
        const cleanNumber = (numStr) => {
          if (
            !numStr ||
            numStr === null ||
            numStr === undefined ||
            numStr === "N/A" ||
            numStr === "n/a" ||
            String(numStr).trim() === ""
          ) {
            return null;
          }

          const cleaned = String(numStr).replace(/[^\d]/g, "");
          return cleaned ? Number.parseInt(cleaned) : null;
        };

        /**
         * Función para normalizar estados de servicio
         */
        const normalizeStatus = (status) => {
          if (
            !status ||
            status === null ||
            status === undefined ||
            String(status).trim() === ""
          ) {
            return "inactive";
          }

          const statusLower = String(status).toLowerCase().trim();
          if (statusLower === "activo") return "active";
          if (statusLower === "inactivo") return "inactive";
          if (statusLower === "mantenimiento") return "maintenance";
          if (statusLower === "retirado" || statusLower === "retired")
            return "decommissioned";
          return statusLower;
        };

        /**
         * Función para limpiar strings
         */
        const cleanString = (str) => {
          if (
            !str ||
            str === null ||
            str === undefined ||
            str === "N/A" ||
            str === "n/a"
          ) {
            return "";
          }
          return String(str).trim();
        };

        // Formatear todos los datos importados
        const formattedData = importedData.map((row, index) => {
          try {
            const result = {
              serial_number: cleanString(row.serial_number),
              hostname: cleanString(row.hostname),
              ip_server: cleanString(row.ip_server),
              ip_ilo: cleanString(row.ip_ilo),
              service_status: normalizeStatus(row.service_status),
              server_type: cleanString(row.server_type),
              total_disk_capacity: cleanString(row.total_disk_capacity),
              action: cleanString(row.action),
              server_model: cleanString(row.server_model),
              service_type: cleanString(row.service_type),
              manufacturer: cleanString(row.manufacturer),
              installed_memory: cleanString(row.installed_memory),
              eos: cleanString(row.eos),
              enclosure: cleanString(row.enclosure),
              application: cleanString(row.application),
              owner: cleanString(row.owner),
              location: cleanString(row.location),
              unit: cleanString(row.unit),
              ubication: cleanString(row.ubication),
              comments: cleanString(row.comments),
              po_number: cleanString(row.po_number),
            };

            // Manejar fechas con valores por defecto si están vacías
            const startDate = formatDate(row.warranty_start_date);
            result.warranty_start_date = startDate || "1900-01-01";

            const endDate = formatDate(row.warranty_end_date);
            result.warranty_end_date = endDate || "1900-01-01";

            // Manejar core_count con valor por defecto
            const coreCount = cleanNumber(row.core_count);
            result.core_count = coreCount !== null ? coreCount : 0;

            return result;
          } catch (error) {
            console.error(`Error procesando fila ${index + 1}:`, error, row);
            throw new Error(`Error en la fila ${index + 1}: ${error.message}`);
          }
        });

        // Enviar servidores uno por uno para mejor control de errores
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < formattedData.length; i++) {
          try {
            const response = await fetch(`${API_BASE_URL}/add`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formattedData[i]),
            });

            if (!response.ok) {
              const errorDetail = await response.text();
              console.error(`Error en servidor ${i + 1}:`, errorDetail);
              errors.push(`Servidor ${i + 1}: ${errorDetail}`);
              errorCount++;
            } else {
              successCount++;
            }
          } catch (error) {
            console.error(`Error procesando servidor ${i + 1}:`, error);
            errors.push(`Servidor ${i + 1}: ${error.message}`);
            errorCount++;
          }
        }

        // Mostrar resultado final con detalles
        if (errorCount === 0) {
          Swal.fire({
            icon: "success",
            title: "Importación exitosa",
            text: `Se han importado ${successCount} servidores correctamente.`,
          });
        } else if (successCount > 0) {
          Swal.fire({
            icon: "warning",
            title: "Importación parcial",
            html: `
              <p>Importación completada con algunos errores:</p>
              <p><strong>Exitosos:</strong> ${successCount}</p>
              <p><strong>Errores:</strong> ${errorCount}</p>
              <details>
                <summary>Ver errores</summary>
                <pre style="text-align: left; max-height: 200px; overflow-y: auto;">${errors.join(
                  "\n"
                )}</pre>
              </details>
            `,
            width: "600px",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error en la importación",
            html: `
              <p>No se pudo importar ningún servidor:</p>
              <details>
                <summary>Ver errores</summary>
                <pre style="text-align: left; max-height: 200px; overflow-y: auto;">${errors.join(
                  "\n"
                )}</pre>
              </details>
            `,
            width: "600px",
          });
        }

        // Recargar la lista de servidores
        fetchServers(currentPage, rowsPerPage);
      } catch (error) {
        console.error("Error al procesar los datos importados:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la importación",
          text:
            error.message ||
            "Ha ocurrido un error al procesar los datos importados.",
          width: "600px",
        });
      }
    },
    [currentPage, rowsPerPage, getAuthToken]
  );

  /**
   * Maneja la exportación a Excel
   */
  const handleExport = useCallback(async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `${API_URL}/servers/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Error al exportar la lista: ${errorDetail}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "servers.xlsx";
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
   */
  const fetchServers = useCallback(
    async (page, limit, search = "") => {
      if (isSearching) return;

      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const url = `${API_BASE_URL}?page=${page}&limit=${limit}&hostname=${search}`;

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
        console.error("Error al obtener servidores:", error);
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
   */
  const fetchSearch = useCallback(
    async (search) => {
      if (isSearching) return;

      setIsSearching(true);
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const url = `${API_BASE_URL}/search?hostname=${search}&page=${currentPage}&limit=${rowsPerPage}`;

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
   */
  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  /**
   * Ejecuta la búsqueda
   */
  const handleSearchButtonClick = useCallback(() => {
    setIsSearchButtonClicked(true);
  }, []);

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
   * Elimina un servidor físico
   */
  const handleDeleteServer = useCallback(
    async (serverId) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas eliminar este servidor?",
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
          const response = await fetch(`${API_BASE_URL}/${serverId}`, {
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
                errorMessage = "El servidor no existe.";
              } else if (errorData?.message) {
                errorMessage = errorData.message;
              }
            } catch (errorParse) {
              console.error("Error parsing error response:", errorParse);
              errorMessage = "Error al procesar la respuesta del servidor.";
            }

            Swal.fire({
              icon: "error",
              title: "Error al eliminar el servidor",
              text: errorMessage,
            });
          } else {
            setServers((prev) =>
              prev.filter((server) => server.id !== serverId)
            );
            showSuccessToast();
          }
        } catch (error) {
          console.error("Error al eliminar el servidor:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar el servidor.",
          });
        }
      }
    },
    [getAuthToken, showSuccessToast]
  );

  /**
   * Función utilitaria para obtener el badge de estado
   * Maneja los diferentes estados de servidores físicos
   */
  const getStatusBadge = useCallback((status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle size={12} className="mr-1" />
          Sin estado
        </span>
      );
    }

    const statusLower = status.toLowerCase();

    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Activo",
      },
      activo: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Activo",
      },
      inactive: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Inactivo",
      },
      inactivo: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Inactivo",
      },
      maintenance: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Mantenimiento",
      },
      mantenimiento: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Mantenimiento",
      },
      decommissioned: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        label: "Retirado",
      },
      retirado: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        label: "Retirado",
      },
      retired: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        label: "Retirado",
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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {status}
      </span>
    );
  }, []);

  // Efectos
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  useEffect(() => {
    fetchServers(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchServers]);

  useEffect(() => {
    if (isSearchButtonClicked) {
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
      setIsSearchButtonClicked(false);
    }
  }, [
    isSearchButtonClicked,
    searchValue,
    unfilteredServers,
    rowsPerPage,
    fetchSearch,
  ]);

  // Filtrado de servidores para la tabla
  const filteredServers = servers.filter((server) =>
    server.hostname?.toLowerCase().includes(searchValue.toLowerCase())
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
          <p>Cargando servidores...</p>
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
            {error.message || "Ha ocurrido un error al cargar los servidores"}
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
    const status = s.service_status?.toLowerCase();
    return status === 'activo' || status === 'active';
  }).length;
  const uniqueModels = new Set(servers.map(s => s.server_model).filter(Boolean)).size;

  return (
    <div className="as-page">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-as-text flex items-center">
            <Server className="mr-2 text-as-brand-600" />
            Servidores Físicos
          </h1>
          <p className="text-sm text-as-muted">
            Gestión y monitoreo de servidores físicos
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
              <h3 className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{uniqueModels}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Modelos Distintos</p>
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
                  placeholder="Buscar por hostname..."
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
                  Servidor{selectedCount !== 1 ? "es" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate(`${BASE_PATH}/crear-servidores-f`)}
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
                  <th scope="col" className="as-th">
                    Hostname
                  </th>
                  <th scope="col" className="as-th">
                    Estado
                  </th>
                  <th scope="col" className="as-th">
                    Serial
                  </th>
                  <th scope="col" className="as-th">
                    IP
                  </th>
                  <th
                    scope="col"
                    className="as-th text-right"
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
                          aria-label={`Seleccionar servidor ${server.hostname}`}
                        />
                      </td>
                      <td className="as-td font-semibold text-slate-900">
                        {server.hostname}
                      </td>
                      <td className="as-td">
                        {getStatusBadge(server.service_status)}
                      </td>
                      <td className="as-td text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {server.serial_number}
                        </span>
                      </td>
                      <td className="as-td font-mono text-slate-600">
                        {server.ip_server}
                      </td>
                      <td className="as-td text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              navigate(`${BASE_PATH}/ver/${server.id}/servers`)
                            }
                            className="p-2 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-all"
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${server.hostname}`}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/editar/${server.id}/servers`
                              )
                            }
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Editar"
                            aria-label={`Editar ${server.hostname}`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteServer(server.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                            aria-label={`Eliminar ${server.hostname}`}
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
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 bg-white"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Server className="h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">No se encontraron servidores físicos</p>
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
