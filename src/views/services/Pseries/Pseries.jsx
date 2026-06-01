import { API_URL } from "../../../config/api";
import Logo from "../../../IMG/Tata_Logo.png";
/**
 * Componente principal para la gestión de servidores PSeries
 *
 * Funcionalidades principales:
 * - Listado paginado de servidores PSeries
 * - Búsqueda por nombre
 * - Selección múltiple de servidores
 * - Operaciones CRUD (Crear, Ver, Editar, Eliminar)
 * - Importación desde Excel con validación
 * - Exportación a Excel
 * - Estados visuales con badges (Running, Not Activated, Maintenance)
 *
 * @component
 * @example
 * return <Pseries />
 */

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReportesPseries from "./ReportesPseries";
import {
  Search,
  Server,
  Activity,
  RefreshCcw,
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
} from "lucide-react";
import { createRoot } from "react-dom/client";
import ExcelImporter from "../../../hooks/Excelimporter";

const Pseries = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados principales del componente
  const [searchValue, setSearchValue] = useState("");
  const [pseries, setPseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState("");
  const [invHeaders, setInvHeaders] = useState([]);
  const [invRows, setInvRows] = useState([]);
  const [invSearchValue, setInvSearchValue] = useState("");
  const [invCurrentPage, setInvCurrentPage] = useState(1);
  const [invRowsPerPage, setInvRowsPerPage] = useState(25);
  const [selectedInvRows, setSelectedInvRows] = useState(new Set());
  const [bulkDeletingInv, setBulkDeletingInv] = useState(false);
  const selectedInvCount = selectedInvRows.size;

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Estados para selección múltiple
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPseries, setSelectedPseries] = useState(new Set());

  // Estados para búsqueda
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredPseries, setUnfilteredPseries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);

  const searchInputRef = useRef(null);
  const selectedCount = selectedPseries.size;
  const BASE_PATH = "/AssetSphere";
  const isInv = location.pathname.includes("pseries-inv");
  const tab = new URLSearchParams(location.search).get("tab") || "servidores";
  const isReportes = tab === "reportes";

  // Efecto para mostrar/ocultar barra de búsqueda según selección
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  /**
   * Configuración de notificaciones toast
   */
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

  /**
   * Muestra notificación de éxito al eliminar servidor
   */
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Servidor eliminado exitosamente",
    });
  };

  /**
   * Maneja errores de la aplicación
   * @param {Error} error - Error a manejar
   */
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener servidores PSeries:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  /**
   * Obtiene la lista de servidores PSeries desde la API
   * @param {number} page - Página actual
   * @param {number} limit - Elementos por página
   * @param {string} search - Término de búsqueda
   */
  const fetchPseries = async (page, limit, search = "") => {
    if (isSearching) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/pseries/pseries?page=${page}&limit=${limit}&name=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      if (data && data.status === "success" && data.data) {
        setUnfilteredPseries(data.data.pseries);
        setPseries(data.data.pseries);
        setTotalPages(data.data.total_pages || 0);
      } else {
        throw new Error("Respuesta inesperada de la API");
      }
    } catch (error) {
      handleError(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.msg || error.message || "Ha ocurrido un error.",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  /**
   * Realiza búsqueda específica de servidores
   * @param {string} search - Término de búsqueda
   */
  const fetchSearch = async (search) => {
    if (isSearching) return;

    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/pseries/pseries/search?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      if (data && data.status === "success" && data.data) {
        setPseries(data.data.pseries);
        setTotalPages(data.data.total_pages || 0);
      } else {
        throw new Error("Respuesta inesperada de la API");
      }
    } catch (error) {
      handleError(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.msg || error.message || "Ha ocurrido un error.",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (!isInv && !isReportes) fetchPseries(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, isInv, isReportes]);

  // Efecto para manejar búsquedas
  useEffect(() => {
    if (isInv || isReportes) return;
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setPseries(unfilteredPseries);
        setTotalPages(
          unfilteredPseries.length > 0
            ? Math.ceil(unfilteredPseries.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredPseries, rowsPerPage, isInv, isReportes]);

  const loadInvData = async () => {
    setInvLoading(true);
    setInvError("");
    try {
      const response = await fetch(`${API_URL}/inv/pseries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || data?.msg || "No se pudo cargar el inventario");
      }
      setInvHeaders(data?.data?.headers || []);
      setInvRows(data?.data?.rows || []);
      setInvSearchValue("");
      setInvCurrentPage(1);
    } catch (e) {
      setInvError(e?.message || "No se pudo cargar el inventario");
    } finally {
      setInvLoading(false);
    }
  };

  useEffect(() => {
    if (!isInv) return;
    loadInvData();
  }, [isInv]);

  const handleLoadExcelInventory = () => {
    let root;

    Swal.fire({
      title: "Cargar inventario desde Excel",
      html: '<div id="excel-importer-container"></div>',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      width: "80%",
      height: "80%",
      didOpen: () => {
        const container = document.getElementById("excel-importer-container");
        const tableMetadata = [
          { name: "GPS", required: false, type: "string" },
          { name: "SerialNumber", required: false, type: "string" },
          { name: "ItemsPurchased", required: false, type: "string" },
          { name: "Description", required: false, type: "string" },
          { name: "Provider", required: false, type: "string" },
          { name: "LocalVendor", required: false, type: "string" },
          { name: "Model", required: false, type: "string" },
          { name: "CPU", required: false, type: "string" },
          { name: "Memory", required: false, type: "string" },
          { name: "Location", required: false, type: "string" },
          { name: "Position", required: false, type: "string" },
          { name: "RackUnit", required: false, type: "string" },
          { name: "TCSAssetID", required: false, type: "string" },
          { name: "PONumber", required: false, type: "string" },
          { name: "HWWarrantyStartDate", required: false, type: "string" },
          { name: "HWWarrantyEndDate", required: false, type: "string" },
          { name: "WarrantyStatus", required: false, type: "string" },
          { name: "TypeOfHWSupport", required: false, type: "string" },
        ];

        const importer = (
          <ExcelImporter
            onImportComplete={async (importedData) => {
              try {
                Swal.close();
                Swal.fire({
                  title: "Guardando inventario Pseries...",
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  didOpen: () => Swal.showLoading(),
                });

                const response = await fetch(`${API_URL}/inv/pseries/import`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(importedData),
                });

                if (!response.ok) {
                  const errorDetail = await response.text();
                  throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
                }

                const data = await response.json();
                Swal.fire({
                  icon: "success",
                  title: "Inventario Pseries importado",
                  text: `Se guardaron ${data.data.inserted_rows} filas en pseries_inventory.`,
                });

                if (isInv) {
                  await loadInvData();
                }
              } catch (error) {
                console.error("Error al importar inventario Pseries:", error);
                Swal.fire({
                  icon: "error",
                  title: "Error al importar inventario",
                  text: error.message || "No se pudo importar los datos.",
                });
              }
            }}
            tableMetadata={tableMetadata}
          />
        );

        if (container) {
          root = createRoot(container);
          root.render(importer);
        }
      },
      willClose: () => {
        const container = document.getElementById("excel-importer-container");
        if (container && root) {
          root.unmount();
        }
      },
    });
  };

  /**
   * Maneja la importación de datos desde Excel
   * Abre un modal con el componente ExcelImporter
   */
  const handleImport = () => {
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

        // Metadatos de la tabla para validación de importación
        const tableMetadata = [
          { name: "name", required: true, type: "string" },
          { name: "application", required: true, type: "string" },
          { name: "application_cod", required: true, type: "string" },
          { name: "hostname", required: true, type: "string" },
          { name: "ip_address", required: false, type: "string" },
          { name: "environment", required: false, type: "string" },
          { name: "slot", required: false, type: "string" },
          { name: "lpar_id", required: false, type: "string" },
          { name: "status", required: true, type: "string" },
          { name: "os", required: true, type: "string" },
          { name: "version", required: false, type: "string" },
          { name: "subsidiary", required: false, type: "string" },
          { name: "min_cpu", required: true, type: "string" },
          { name: "act_cpu", required: false, type: "string" },
          { name: "max_cpu", required: true, type: "string" },
          { name: "min_v_cpu", required: true, type: "string" },
          { name: "act_v_cpu", required: true, type: "string" },
          { name: "max_v_cpu", required: true, type: "string" },
          { name: "min_memory", required: true, type: "string" },
          { name: "act_memory", required: false, type: "string" },
          { name: "max_memory", required: false, type: "string" },
          { name: "expansion_factor", required: false, type: "string" },
          { name: "memory_per_factor", required: false, type: "string" },
          { name: "processor_compatibility", required: false, type: "string" },
        ];

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
        const container = document.getElementById("excel-importer-container");
        if (container) {
          const root = createRoot(container);
          root.unmount();
        }
      },
    });
  };

  /**
   * Procesa los datos importados desde Excel
   * @param {Array} importedData - Datos importados del archivo Excel
   */
  const handleImportComplete = async (importedData) => {
    if (!Array.isArray(importedData) || importedData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron datos válidos en el archivo",
        "error"
      );
      return;
    }

    // Mostrar indicador de carga
    Swal.fire({
      title: "Procesando datos...",
      text: `Estamos guardando ${importedData.length} servidores importados`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      // Formatear datos para la API
      const formattedData = importedData.map((row) => {
        const formattedRow = {};

        // Asegurar que todos los campos sean strings
        formattedRow.name = String(row.name || "");
        formattedRow.application = String(row.application || "");
        formattedRow.application_cod = String(row.application_cod || "");
        formattedRow.hostname = String(row.hostname || "");
        formattedRow.ip_address = String(row.ip_address || "");
        formattedRow.environment = String(row.environment || "");
        formattedRow.slot = String(row.slot || "");
        formattedRow.lpar_id = String(row.lpar_id || "");
        formattedRow.status = String(row.status || "");
        formattedRow.os = String(row.os || "");
        formattedRow.version = String(row.version || "");
        formattedRow.subsidiary = String(row.subsidiary || "");
        formattedRow.min_cpu = String(row.min_cpu || "");
        formattedRow.act_cpu = String(row.act_cpu || "");
        formattedRow.max_cpu = String(row.max_cpu || "");
        formattedRow.min_v_cpu = String(row.min_v_cpu || "");
        formattedRow.act_v_cpu = String(row.act_v_cpu || "");
        formattedRow.max_v_cpu = String(row.max_v_cpu || "");
        formattedRow.min_memory = String(row.min_memory || "");
        formattedRow.act_memory = String(row.act_memory || "");
        formattedRow.max_memory = String(row.max_memory || "");
        formattedRow.expansion_factor = String(row.expansion_factor || "");
        formattedRow.memory_per_factor = String(row.memory_per_factor || "");
        formattedRow.processor_compatibility = String(
          row.processor_compatibility || ""
        );

        return formattedRow;
      });

      // Enviar datos al servidor
      const response = await fetch(
        `${API_URL}/pseries/add_from_excel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
      }

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Importación exitosa",
        text: `Se han importado ${importedData.length} servidores correctamente.`,
      });

      // Actualizar la lista
      fetchPseries(currentPage, rowsPerPage);
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
  };

  /**
   * Exporta la lista de servidores a Excel
   */
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch(
        `${API_URL}/pseries/export`,
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
      a.download = "pseries.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Error al exportar",
        text: error.message,
      });
    }
  };

  /**
   * Maneja cambios en el campo de búsqueda
   * @param {Event} e - Evento del input
   */
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  /**
   * Activa la búsqueda cuando se hace clic en el botón
   */
  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
  };

  /**
   * Alterna la selección de todos los servidores
   */
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedPseries(new Set());
    } else {
      setSelectedPseries(new Set(pseries.map((server) => server.id)));
    }
  };

  /**
   * Alterna la selección de un servidor específico
   * @param {string} pseriesId - ID del servidor
   */
  const toggleSelectPseries = (pseriesId) => {
    const newSelectedPseries = new Set(selectedPseries);
    if (newSelectedPseries.has(pseriesId)) {
      newSelectedPseries.delete(pseriesId);
    } else {
      newSelectedPseries.add(pseriesId);
    }
    setSelectedPseries(newSelectedPseries);
  };

  // Filtrar servidores por búsqueda local
  const filteredPseries = pseries.filter((server) =>
    server.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const statusCounts = filteredPseries.reduce(
    (acc, server) => {
      const status = (server?.status || "").toString().trim().toLowerCase();
      if (status === "active" || status === "running") acc.running += 1;
      else if (status === "inactive" || status === "not activated") acc.inactive += 1;
      else if (
        status === "maintenance" ||
        status === "mantenimiento" ||
        status === "warehouse" ||
        status === "bodega" ||
        status === "en bodega"
      )
        acc.maintenance += 1;
      else acc.other += 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, running: 0, inactive: 0, maintenance: 0, other: 0 }
  );

  // Cálculos para paginación
  const indexOfLastPseries = currentPage * rowsPerPage;
  const indexOfFirstPseries = indexOfLastPseries - rowsPerPage;

  /**
   * Elimina un servidor PSeries
   * @param {string} pseriesId - ID del servidor a eliminar
   */
  const handleDeletePseries = async (pseriesId) => {
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
        const response = await fetch(
          `${API_URL}/pseries/pseries/${pseriesId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
            handleError(errorParse);
          }

          Swal.fire({
            icon: "error",
            title: "Error al eliminar el servidor",
            text: errorMessage,
          });
        } else {
          setPseries(pseries.filter((server) => server.id !== pseriesId));
          showSuccessToast();
        }
      } catch (error) {
        console.error("Error al eliminar el servidor:", error);
        handleError(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error inesperado al eliminar el servidor.",
        });
      }
    }
  };

  const handleDeleteSelectedPseries = async () => {
    if (selectedPseries.size === 0 || bulkDeleting) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar ${selectedPseries.size} servidor${selectedPseries.size !== 1 ? "es" : ""}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setBulkDeleting(true);
    const ids = Array.from(selectedPseries);
    const eliminados = [];
    const errores = [];

    try {
      for (const id of ids) {
        try {
          const response = await fetch(`${API_URL}/pseries/pseries/${id}`, {
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
            } catch {
              errorMessage = `Error HTTP ${response.status}`;
            }
            errores.push({ id, mensaje: errorMessage });
          } else {
            eliminados.push(id);
          }
        } catch (e) {
          errores.push({ id, mensaje: e?.message || "Error inesperado" });
        }
      }
    } finally {
      setBulkDeleting(false);
    }

    if (eliminados.length > 0) {
      setPseries((prev) => prev.filter((server) => !eliminados.includes(server.id)));
      setUnfilteredPseries((prev) => prev.filter((server) => !eliminados.includes(server.id)));
      setSelectedPseries(new Set());
      setSelectAll(false);
    }

    if (errores.length > 0) {
      const first = errores[0];
      Swal.fire({
        icon: "warning",
        title: "Eliminación parcial",
        text:
          errores.length === 1
            ? `No se pudo eliminar el servidor ${first.id}: ${first.mensaje}`
            : `Se eliminaron ${eliminados.length} y fallaron ${errores.length}. Ejemplo (${first.id}): ${first.mensaje}`,
      });
      return;
    }

    if (eliminados.length > 0) {
      Toast.fire({
        icon: "success",
        title: `Se eliminaron ${eliminados.length} servidor${eliminados.length !== 1 ? "es" : ""}`,
      });
    }
  };

  /**
   * Navega a la página de creación de servidor
   */
  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-pseries`);
  };

  /**
   * Genera badge de estado visual según el estado del servidor
   * @param {string} status - Estado del servidor
   * @returns {JSX.Element|null} Badge de estado
   */
  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();

    if (statusLower === "active" || statusLower === "running") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Activo
        </span>
      );
    } else if (statusLower === "inactive" || statusLower === "not activated") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" />
          No activo
        </span>
      );
    } else if (
      statusLower === "maintenance" ||
      statusLower === "mantenimiento" ||
      statusLower === "warehouse" ||
      statusLower === "bodega" ||
      statusLower === "en bodega"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          En bodega
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
  };

  // Estados de carga y error
  if (isInv) {
    const query = invSearchValue.trim().toLowerCase();
    const filteredRows =
      query === ""
        ? invRows
        : invRows.filter((row) =>
            row.some((cell) =>
              String(cell ?? "")
                .toLowerCase()
                .includes(query)
            )
          );
    const totalPagesInv =
      filteredRows.length > 0
        ? Math.ceil(filteredRows.length / invRowsPerPage)
        : 0;
    const pageInv =
      totalPagesInv === 0
        ? 1
        : Math.min(Math.max(invCurrentPage, 1), totalPagesInv);
    const indexOfLast = pageInv * invRowsPerPage;
    const indexOfFirst = indexOfLast - invRowsPerPage;
    const pageRows = filteredRows.slice(indexOfFirst, indexOfLast);

    const escapeCSV = (value) => {
      const s = String(value ?? "");
      const escaped = s.replace(/"/g, '""');
      if (/[",\n\r]/.test(escaped)) return `"${escaped}"`;
      return escaped;
    };

    const warrantyHeaderIndex = invHeaders.findIndex((h) => {
      const normalized = String(h || "").toLowerCase().replace(/\s+/g, "");
      return /warranty.*status/.test(normalized) || normalized === "warrantystatus";
    });

    const inventoryIdIndex = invHeaders.findIndex(
      (h) => String(h || "").trim().toLowerCase() === "id"
    );

    const getInventoryRowId = (row) =>
      inventoryIdIndex >= 0 ? String(row[inventoryIdIndex] ?? "").trim() : "";

    const buildInventoryRowObject = (row) =>
      invHeaders.reduce((acc, header, index) => {
        acc[header] = row[index] ?? "";
        return acc;
      }, {});

    const filteredInventoryIds = filteredRows
      .map(getInventoryRowId)
      .filter(Boolean);
    const allFilteredInventorySelected =
      filteredInventoryIds.length > 0 &&
      filteredInventoryIds.every((id) => selectedInvRows.has(id));

    const toggleSelectAllInventoryRows = () => {
      if (allFilteredInventorySelected) {
        setSelectedInvRows(new Set());
      } else {
        setSelectedInvRows(new Set(filteredInventoryIds));
      }
    };

    const toggleSelectInventoryRow = (row) => {
      const rowId = getInventoryRowId(row);
      if (!rowId) return;
      const nextSelection = new Set(selectedInvRows);
      if (nextSelection.has(rowId)) {
        nextSelection.delete(rowId);
      } else {
        nextSelection.add(rowId);
      }
      setSelectedInvRows(nextSelection);
    };

    const handleDeleteSelectedInventoryRows = async () => {
      if (selectedInvCount === 0 || bulkDeletingInv) return;

      const result = await Swal.fire({
        title: "Eliminar registros seleccionados",
        text: `¿Deseas eliminar ${selectedInvCount} registro${selectedInvCount !== 1 ? "s" : ""}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      setBulkDeletingInv(true);
      try {
        Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const ids = Array.from(selectedInvRows);
        const failed = [];

        for (const itemId of ids) {
          const response = await fetch(`${API_URL}/inv/pseries/${itemId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorDetail = await response.text();
            failed.push({ itemId, detail: errorDetail || `HTTP ${response.status}` });
          }
        }

        await loadInvData();
        setSelectedInvRows(new Set());

        if (failed.length > 0) {
          throw new Error(`Fallaron ${failed.length} de ${ids.length} registros.`);
        }

        Swal.fire({
          icon: "success",
          title: "Registros eliminados",
          text: `Se eliminaron ${ids.length} registro${ids.length !== 1 ? "s" : ""}.`,
        });
      } catch (error) {
        console.error("Error al eliminar registros seleccionados de inventario Pseries:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error.message || "No se pudieron eliminar todos los registros seleccionados.",
        });
      } finally {
        setBulkDeletingInv(false);
      }
    };

    const handleViewInventoryRow = (row) => {
      const item = buildInventoryRowObject(row);
      const summaryKeys = [
        "id",
        "GPS",
        "SerialNumber",
        "Model",
        "Location",
        "Description",
      ];

      const summaryHtml = summaryKeys
        .filter((key) => item[key] !== undefined && item[key] !== "")
        .map(
          (key) =>
            `<div style="display:grid;grid-template-columns:140px minmax(0,1fr);gap:10px;align-items:center;padding:12px;border-radius:16px;background:#f8fafc;">` +
            `<div style="font-size:0.95rem;font-weight:700;color:#0f172a;">${key}</div>` +
            `<div style="color:#334155;white-space:pre-wrap;word-break:break-word;">${item[key] || "—"}</div>` +
            `</div>`
        )
        .join("");

      const detailsHtml = Object.entries(item)
        .filter(([key]) => !summaryKeys.includes(key))
        .map(
          ([key, value]) =>
            `<div style="display:grid;grid-template-columns:180px minmax(0,1fr);gap:8px;align-items:start;padding:10px 0;border-bottom:1px solid #e2e8f0;">` +
            `<div style="font-weight:700;color:#0f172a;">${key}</div>` +
            `<div style="color:#334155;white-space:pre-wrap;word-break:break-word;">${value || "—"}</div>` +
            `</div>`
        )
        .join("");

      Swal.fire({
        title: "Ver registro",
        html: `
          <div style="max-height:70vh;overflow-y:auto;padding:0 8px;">
            <div style="display:grid;gap:18px;">
              <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
                ${summaryHtml}
              </div>
              <div style="padding:14px;border-radius:20px;background:#ffffff;box-shadow:0 1px 4px rgba(15,23,42,0.08);">
                ${detailsHtml}
              </div>
            </div>
          </div>
        `,
        width: "760px",
        customClass: {
          popup: "rounded-3xl",
        },
        confirmButtonText: "Cerrar",
      });
    };

    const handleEditInventoryRow = async (row) => {
      const itemId = getInventoryRowId(row);
      if (!itemId) {
        Swal.fire({
          icon: "warning",
          title: "No se puede editar",
          text: "Este registro no tiene un campo 'id' válido.",
        });
        return;
      }

      const item = buildInventoryRowObject(row);
      const result = await Swal.fire({
        title: "Editar registro",
        input: "textarea",
        inputLabel: "Edita los valores en formato JSON",
        inputValue: JSON.stringify(item, null, 2),
        inputAttributes: {
          "aria-label": "Editar valores del inventario",
          style: "width:100%;height:320px;",
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        preConfirm: (value) => {
          try {
            return JSON.parse(value);
          } catch {
            Swal.showValidationMessage("JSON inválido. Corrige la sintaxis.");
          }
        },
      });

      if (!result.isConfirmed || !result.value) return;

      const updatedValues = { ...result.value };
      delete updatedValues.id;

      try {
        Swal.fire({
          title: "Guardando cambios...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const response = await fetch(`${API_URL}/inv/pseries/${itemId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        });

        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
        }
        await loadInvData();
        Swal.fire({
          icon: "success",
          title: "Registro actualizado",
          text: "Los cambios se guardaron correctamente.",
        });
      } catch (error) {
        console.error("Error al actualizar inventario Pseries:", error);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.message || "No se pudieron guardar los cambios.",
        });
      }
    };

    const handleDeleteInventoryRow = async (row) => {
      const itemId = getInventoryRowId(row);
      if (!itemId) {
        Swal.fire({
          icon: "warning",
          title: "No se puede eliminar",
          text: "Este registro no tiene un campo 'id' válido.",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Eliminar registro",
        text: "¿Deseas eliminar este registro del inventario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      try {
        Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const response = await fetch(`${API_URL}/inv/pseries/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
        }
        await loadInvData();
        Swal.fire({
          icon: "success",
          title: "Registro eliminado",
          text: "El registro se eliminó correctamente.",
        });
      } catch (error) {
        console.error("Error al eliminar inventario Pseries:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: error.message || "No se pudo eliminar el registro.",
        });
      }
    };

    const warrantyCounts = invRows.reduce(
      (acc, row) => {
        const value = warrantyHeaderIndex >= 0 ? String(row[warrantyHeaderIndex] ?? "").trim().toLowerCase() : "";
        if (value.includes("support")) {
          acc.withSupport += 1;
        } else if (value.includes("expired")) {
          acc.expired += 1;
        } else if (value) {
          acc.other += 1;
        }
        return acc;
      },
      { withSupport: 0, expired: 0, other: 0 }
    );

    const totalWarrantyCount =
      warrantyCounts.withSupport + warrantyCounts.expired + warrantyCounts.other;

    const getBarWidth = (count) =>
      totalWarrantyCount === 0 ? "0%" : `${Math.round((count / totalWarrantyCount) * 100)}%`;

    const handleDescargarCSVInventario = () => {
      const csvLines = [
        invHeaders.map(escapeCSV).join(","),
        ...filteredRows.map((row) => row.map(escapeCSV).join(",")),
      ];
      const blob = new Blob([csvLines.join("\n")], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `pseries_inv_${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    // Columns to show in the compact inventory table (match Servicios Infraestructura)
    const desiredVisible = ["id", "gps", "serialnumber", "itemspurchased", "description"];
    const visibleHeaderIndices = invHeaders
      .map((h, i) => ({ h: String(h || "").toLowerCase().replace(/\s+/g, ""), i }))
      .filter(({ h }) => desiredVisible.includes(h))
      .map(({ i }) => i);

    const compactHeaderIndices =
      visibleHeaderIndices.length > 0
        ? visibleHeaderIndices
        : Array.from({ length: Math.min(5, invHeaders.length) }, (_, i) => i);
    const compactHeaders = compactHeaderIndices.map((i) => invHeaders[i]);

    return (
      <div className="as-page">
        <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-as-text flex items-center gap-2">
              <Server className="text-as-brand-600" size={24} />
              pseries_inv
            </h1>
          </div>
        </header>

        <main className="as-container">
          {invLoading ? (
            <div className="as-card p-6">Cargando...</div>
          ) : invError ? (
            <div className="as-card p-6 text-red-600">{invError}</div>
          ) : (
            <>
              <div className="as-card p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="relative flex-1 min-w-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por cualquier campo..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 pl-10"
                      value={invSearchValue}
                      onChange={(e) => {
                        setInvSearchValue(e.target.value);
                        setInvCurrentPage(1);
                      }}
                    />
                  </div>

                  {selectedInvCount > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg">
                        {selectedInvCount} seleccionado{selectedInvCount !== 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteSelectedInventoryRows}
                        disabled={bulkDeletingInv}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0 ${
                          bulkDeletingInv
                            ? "bg-red-300 cursor-not-allowed text-white"
                            : "bg-red-600 hover:bg-red-500 text-white"
                        }`}
                        title="Eliminar seleccionados"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">
                          {bulkDeletingInv ? "Eliminando..." : "Eliminar seleccionados"}
                        </span>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleDescargarCSVInventario}
                    disabled={filteredRows.length === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0 ${
                      filteredRows.length === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-as-brand-600 text-white hover:bg-as-brand-700"
                    }`}
                    title="Descargar CSV del inventario"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Descargar CSV</span>
                  </button>
                  <button
                    onClick={handleLoadExcelInventory}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2 shrink-0"
                    title="Cargar inventario desde Excel"
                  >
                    <ArrowUpRight size={16} />
                    <span className="hidden sm:inline">Cargar Excel</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase text-slate-500 mb-2">
                      With Support
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {warrantyCounts.withSupport}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-as-brand-600"
                        style={{ width: getBarWidth(warrantyCounts.withSupport) }}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase text-slate-500 mb-2">
                      Expired
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {warrantyCounts.expired}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-600"
                        style={{ width: getBarWidth(warrantyCounts.expired) }}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase text-slate-500 mb-2">
                      Otros WarrantyStatus
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {warrantyCounts.other}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: getBarWidth(warrantyCounts.other) }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Mostrando {pageRows.length} de {filteredRows.length} registro
                  {filteredRows.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm custom-scrollbar bg-white">
                <table className="as-table">
                  <thead>
                    <tr>
                      <th className="as-th sticky left-0 bg-white z-20 w-12">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                          checked={allFilteredInventorySelected}
                          onChange={toggleSelectAllInventoryRows}
                          title="Seleccionar todo"
                        />
                      </th>
                      <th className="as-th sticky left-12 bg-white z-20">Acciones</th>
                      {compactHeaders.map((h, idx) => (
                        <th key={`${h}-${idx}`} className="as-th whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length > 0 ? (
                      pageRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="as-td sticky left-0 bg-white z-20 border-r border-slate-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                              checked={selectedInvRows.has(getInventoryRowId(row))}
                              onChange={() => toggleSelectInventoryRow(row)}
                              title="Seleccionar fila"
                            />
                          </td>
                          <td className="as-td sticky left-12 bg-white z-10 border-r border-slate-200">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleViewInventoryRow(row)}
                                className="p-2 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-all"
                                title="Ver completo"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditInventoryRow(row)}
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                title="Editar"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInventoryRow(row)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                          {compactHeaderIndices.map((ci) => (
                            <td key={ci} className="as-td whitespace-nowrap">
                              {String(row[ci] ?? "").slice(0, 60) || "—"}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={compactHeaders.length + 1 || 1}
                          className="px-6 py-12 text-center text-slate-500 bg-white"
                        >
                          No hay datos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 px-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-slate-500 mr-3">
                    Filas por página
                  </span>
                  <select
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-as-brand-500/20 focus:border-as-brand-500"
                    value={invRowsPerPage}
                    onChange={(e) => {
                      setInvRowsPerPage(parseInt(e.target.value));
                      setInvCurrentPage(1);
                    }}
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg border border-slate-200 ${
                      pageInv <= 1 || totalPagesInv === 0
                        ? "text-slate-300 cursor-not-allowed bg-white"
                        : "text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                    onClick={() => setInvCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={pageInv <= 1 || totalPagesInv === 0}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center justify-center min-w-[2rem] h-9 rounded-lg bg-as-brand-50 text-as-brand-700 font-semibold border border-as-brand-100">
                    {totalPagesInv === 0 ? 0 : pageInv}
                  </div>
                  <span className="text-sm text-slate-500">
                    / {totalPagesInv}
                  </span>
                  <button
                    className={`p-2 rounded-lg border border-slate-200 ${
                      pageInv >= totalPagesInv || totalPagesInv === 0
                        ? "text-slate-300 cursor-not-allowed bg-white"
                        : "text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                    onClick={() =>
                      setInvCurrentPage((p) =>
                        Math.min(p + 1, totalPagesInv || 1)
                      )
                    }
                    disabled={pageInv >= totalPagesInv || totalPagesInv === 0}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-as-brand-600 mb-4"></div>
          <p className="text-as-muted">Cargando servidores PSeries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="as-card p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No se pudo cargar PSeries</h2>
          </div>
          <p className="text-sm text-gray-600">
            {error.message || "Ha ocurrido un error al cargar los servidores"}
          </p>
          <button
            onClick={() => fetchPseries(currentPage, rowsPerPage)}
            className="as-btn-primary mt-5"
          >
            <RefreshCcw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                Servidores PSeries
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => navigate(`${BASE_PATH}/pseries?tab=servidores`)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                !isReportes
                  ? "bg-as-brand-600 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Servidores
            </button>
            <button
              onClick={() => navigate(`${BASE_PATH}/pseries?tab=reportes`)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isReportes
                  ? "bg-as-brand-600 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Reportes
            </button>
          </div>
        </div>

        {isReportes ? (
          <ReportesPseries embedded />
        ) : (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Total</span>
              <Activity size={16} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Activo</span>
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.running}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">No activo</span>
              <AlertCircle size={16} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.inactive}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">En bodega</span>
              <Clock size={16} className="text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.maintenance}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Otros</span>
              <Server size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{statusCounts.other}</div>
          </div>
        </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
              {showSearch ? (
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 pl-10"
                    value={searchValue}
                    onChange={handleSearchChange}
                    ref={searchInputRef}
                  />
                  <button
                    onClick={handleSearchButtonClick}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Search size={18} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg w-fit shrink-0">
                    <span className="font-medium mr-2">{selectedCount}</span>
                    <span>
                      Pseries seleccionado
                      {selectedCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={handleDeleteSelectedPseries}
                    disabled={bulkDeleting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0 ${
                      bulkDeleting
                        ? "bg-red-300 cursor-not-allowed text-white"
                        : "bg-red-600 hover:bg-red-500 text-white"
                    }`}
                    title="Eliminar seleccionados"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">
                      {bulkDeleting ? "Eliminando..." : "Eliminar"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 justify-end w-full lg:w-auto overflow-x-auto lg:overflow-visible flex-nowrap lg:flex-wrap">
              <button
                onClick={irCrear}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shrink-0"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Crear</span>
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition flex items-center gap-2 shrink-0"
                title="Importar desde Excel"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition flex items-center gap-2 shrink-0"
                title="Exportar a Excel"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm custom-scrollbar">
            <table className="as-table">
              <thead>
                <tr>
                  <th scope="col" className="as-th w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                      checked={
                        pseries.length > 0 &&
                        selectedPseries.size === pseries.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="as-th">
                    Nombre
                  </th>
                  <th scope="col" className="as-th">
                    Ambiente
                  </th>
                  <th scope="col" className="as-th">
                    Cajón
                  </th>
                  <th scope="col" className="as-th">
                    Estado
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
                {filteredPseries.length > 0 ? (
                  filteredPseries.map((pserie, index) => (
                    <tr
                      key={pserie.id}
                      className={`group border-b border-slate-100 transition-colors ${
                        selectedPseries.has(pserie.id)
                          ? "bg-as-brand-50/50"
                          : "bg-white hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="as-td">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                          checked={selectedPseries.has(pserie.id)}
                          onChange={() => toggleSelectPseries(pserie.id)}
                        />
                      </td>
                      <td className="as-td font-semibold text-slate-900">
                        {pserie.name}
                      </td>
                      <td className="as-td text-slate-600">
                        {pserie.environment}
                      </td>
                      <td className="as-td text-slate-600">{pserie.slot}</td>
                      <td className="as-td">
                        {getStatusBadge(pserie.status)}
                      </td>
                      <td className="as-td text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              navigate(`${BASE_PATH}/ver/${pserie.id}/pseries`)
                            }
                            className="p-2 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-all"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/editar/${pserie.id}/pseries`
                              )
                            }
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePseries(pserie.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
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
                        <p className="text-sm font-medium text-slate-900">No se encontraron servidores</p>
                        <p className="text-sm mt-1">Ajusta tu búsqueda o intenta agregar uno nuevo.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 px-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-500 mr-3">
                Filas por página
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
              Mostrando <span className="text-slate-900">{indexOfFirstPseries + 1}</span> a{" "}
              <span className="text-slate-900">{Math.min(indexOfLastPseries, filteredPseries.length)}</span> de{" "}
              <span className="text-slate-900">{filteredPseries.length}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-as-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Pseries;
