"use client";

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
} from "lucide-react";
import ExcelImporter from "../../../hooks/Excelimporter";
import { createRoot } from "react-dom/client";

// Configuraciones centralizadas
const BASE_PATH = "/inveplus";
const API_BASE_URL = "https://10.8.150.90/api/inveplus/servers/physical";

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
        "https://10.8.150.90/api/inveplus/servers/export",
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

  return (
    <div className="min-h-screen bg-white text-gray-100">
      {/* Header */}
      <header className="w-full p-8 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Server className="mr-2 text-blue-400" />
            Servidores Físicos
          </h1>
          <p className="text-sm text-gray-900">
            Gestión y monitoreo de servidores físicos
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-300/30 border rounded-lg shadow-lg p-6">
          {/* Barra de búsqueda y botones de acción */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por hostname..."
                  className="bg-white border-gray-400 text-gray-900 rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex items-center bg-blue-600 px-4 py-2 rounded-lg">
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                title="Crear nuevo servidor"
              >
                <Plus size={16} className="text-white" />
                <span className="hidden text-white font-medium sm:inline">
                  Crear
                </span>
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Importar desde Excel"
              >
                <Download size={16} className="text-white" />
                <span className="hidden text-white font-medium sm:inline">
                  Importar
                </span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-300/20 text-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-tl-lg">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-blue-600"
                      checked={
                        servers.length > 0 &&
                        selectedServers.size === servers.length
                      }
                      onChange={toggleSelectAll}
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hostname
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Serial
                  </th>
                  <th scope="col" className="px-6 py-3">
                    IP
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 rounded-tr-lg text-right"
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
                      className={`border-b border-gray-200 ${
                        selectedServers.has(server.id)
                          ? "bg-blue-50"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-blue-600"
                          checked={selectedServers.has(server.id)}
                          onChange={() => toggleSelectServer(server.id)}
                          aria-label={`Seleccionar servidor ${server.hostname}`}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {server.hostname}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(server.service_status)}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {server.serial_number}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {server.ip_server}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              navigate(`${BASE_PATH}/ver/${server.id}/servers`)
                            }
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${server.hostname}`}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/editar/${server.id}/servers`
                              )
                            }
                            className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                            title="Editar"
                            aria-label={`Editar ${server.hostname}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteServer(server.id)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Eliminar"
                            aria-label={`Eliminar ${server.hostname}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron servidores que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number.parseInt(e.target.value, 10))
                }
                className="bg-white border border-gray-500 text-gray-900 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-sm text-gray-900">
              Mostrando {indexOfFirstServer + 1} a{" "}
              {Math.min(indexOfLastServer, filteredServers.length)} de{" "}
              {filteredServers.length} servidores
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 rounded-md bg-blue-600 text-white">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
