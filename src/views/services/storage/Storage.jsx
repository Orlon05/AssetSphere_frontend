import { API_URL } from "../../../config/api";
import Logo from "../../../IMG/Tata_Logo.png";
/**
 * Componente principal para la gestión de dispositivos de Storage
 *
 * Este componente proporciona una interfaz completa para:
 * - Listar dispositivos de storage con paginación
 * - Buscar dispositivos por nombre
 * - Selección múltiple de dispositivos
 * - Operaciones CRUD (Crear, Ver, Editar, Eliminar)
 * - Importación/Exportación desde/hacia Excel
 * - Visualización de estados con badges
 *
 * @component
 * @example
 * return (
 *   <Storage />
 * )
 */

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Search,
  HardDrive,
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

export default function Storage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados principales del componente
  const [searchValue, setSearchValue] = useState("");
  const [storageList, setStorageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState("");
  const [invHeaders, setInvHeaders] = useState([]);
  const [invRows, setInvRows] = useState([]);
  const [invSearchValue, setInvSearchValue] = useState("");
  const [invCurrentPage, setInvCurrentPage] = useState(1);
  const [invRowsPerPage, setInvRowsPerPage] = useState(25);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Estados para selección múltiple
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(new Set());

  // Estados para búsqueda
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredStorage, setUnfilteredStorage] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const selectedCount = selectedStorage.size;
  const BASE_PATH = "/AssetSphere";
  const isInv = location.pathname.includes("storage-inv");

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

  /**
   * Muestra una notificación de éxito
   */
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Storage eliminado exitosamente",
    });
  };

  /**
   * Maneja errores y los registra en consola
   * @param {Error} error - Error a manejar
   */
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener storage:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  /**
   * Maneja la importación de datos desde Excel
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

        // Metadatos específicos para Storage
        const tableMetadata = [
          { name: "cod_item_configuracion", required: false, type: "string" },
          { name: "name", required: true, type: "string" },
          { name: "application_code", required: false, type: "string" },
          { name: "cost_center", required: false, type: "string" },
          { name: "active", required: false, type: "string" },
          { name: "category", required: false, type: "string" },
          { name: "type", required: false, type: "string" },
          { name: "item", required: false, type: "string" },
          { name: "company", required: false, type: "string" },
          { name: "organization_responsible", required: false, type: "string" },
          { name: "host_name", required: false, type: "string" },
          { name: "manufacturer", required: false, type: "string" },
          { name: "status", required: false, type: "string" },
          { name: "owner", required: false, type: "string" },
          { name: "model", required: false, type: "string" },
          { name: "serial", required: false, type: "string" },
          { name: "org_maintenance", required: false, type: "string" },
          { name: "ip_address", required: false, type: "string" },
          { name: "disk_size", required: false, type: "string" },
          { name: "location", required: false, type: "string" },
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
   * @param {Array} importedData - Datos importados
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

    // Mostrar mensaje de carga
    Swal.fire({
      title: "Procesando datos...",
      text: `Estamos guardando ${importedData.length} dispositivos de storage importados`,
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

      // Formatear datos para envío
      const formattedData = importedData.map((row) => {
        const formattedRow = {};

        // Asegurar que todos los campos sean strings
        formattedRow.cod_item_configuracion = String(
          row.cod_item_configuracion || ""
        );
        formattedRow.name = String(row.name || "");
        formattedRow.application_code = String(row.application_code || "");
        formattedRow.cost_center = String(row.cost_center || "");
        formattedRow.active = String(row.active || "");
        formattedRow.category = String(row.category || "");
        formattedRow.type = String(row.type || "");
        formattedRow.item = String(row.item || "");
        formattedRow.company = String(row.company || "");
        formattedRow.organization_responsible = String(
          row.organization_responsible || ""
        );
        formattedRow.host_name = String(row.host_name || "");
        formattedRow.manufacturer = String(row.manufacturer || "");
        formattedRow.status = String(row.status || "");
        formattedRow.owner = String(row.owner || "");
        formattedRow.model = String(row.model || "");
        formattedRow.serial = String(row.serial || "");
        formattedRow.org_maintenance = String(row.org_maintenance || "");
        formattedRow.ip_address = String(row.ip_address || "");
        formattedRow.disk_size = String(row.disk_size || "");
        formattedRow.location = String(row.location || "");

        return formattedRow;
      });

      // Enviar datos al servidor
      const response = await fetch(
        `${API_URL}/storage/add_from_excel`,
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
        text: `Se han importado ${importedData.length} dispositivos de storage correctamente.`,
      });

      // Actualizar la lista
      fetchStorage(currentPage, rowsPerPage);
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
   * Maneja la exportación de datos a Excel
   */
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch(
        `${API_URL}/storage/export`,
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
      a.download = "storage.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
    }
  };

  /**
   * Obtiene la lista de dispositivos de storage desde la API
   * @param {number} page - Página actual
   * @param {number} limit - Límite de elementos por página
   * @param {string} search - Término de búsqueda
   */
  const fetchStorage = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);

    try {
      let url = `${API_URL}/storage/get_all?page=${page}&limit=${limit}`;

      if (search.trim()) {
        url = `${API_URL}/storage/search_by_name?name=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`;
      }

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
        setUnfilteredStorage(data.data.storages || []);
        setStorageList(data.data.storages || []);
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
   * Realiza búsqueda específica de dispositivos
   * @param {string} search - Término de búsqueda
   */
  const fetchSearch = async (search) => {
    if (isSearching) return;
    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/storage/search_by_name?name=${encodeURIComponent(
          search
        )}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setStorageList(data.data.storages || []);
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

  // Efectos para cargar datos y manejar búsquedas
  useEffect(() => {
    if (!isInv) fetchStorage(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  useEffect(() => {
    if (isInv) return;
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setStorageList(unfilteredStorage);
        setTotalPages(
          unfilteredStorage.length > 0
            ? Math.ceil(unfilteredStorage.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredStorage, rowsPerPage]);

  const loadInventory = async () => {
    setInvLoading(true);
    setInvError("");
    try {
      const token = localStorage.getItem("authenticationToken");
      const response = await fetch(`${API_URL}/inv/storage`, {
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
    loadInventory();
  }, [isInv]);

  const handleInvImportComplete = async (importedData) => {
    if (!importedData) {
      Swal.fire("Error", "No se importaron datos.", "error");
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Importación exitosa",
      text: `Se importaron ${importedData.storage_rows ?? 0} filas de storage.`,
    });

    await loadInventory();
  };

  const handleInvImport = () => {
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
            onImportComplete={handleInvImportComplete}
            tableMetadata={[]}
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
   * Maneja el clic en el botón de búsqueda
   */
  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
  };

  /**
   * Alterna la selección de todos los elementos
   */
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedStorage(new Set());
    } else {
      setSelectedStorage(new Set(storageList.map((storage) => storage.id)));
    }
  };

  /**
   * Alterna la selección de un dispositivo específico
   * @param {string} storageId - ID del dispositivo
   */
  const toggleSelectStorage = (storageId) => {
    const newSelectedStorage = new Set(selectedStorage);
    if (newSelectedStorage.has(storageId)) {
      newSelectedStorage.delete(storageId);
    } else {
      newSelectedStorage.add(storageId);
    }
    setSelectedStorage(newSelectedStorage);
  };

  // Filtrado de dispositivos basado en búsqueda
  const filteredStorage = storageList.filter((storage) =>
    storage.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastStorage = currentPage * rowsPerPage;
  const indexOfFirstStorage = indexOfLastStorage - rowsPerPage;

  /**
   * Maneja la eliminación de un dispositivo de storage
   * @param {string} storageId - ID del dispositivo a eliminar
   */
  const handleDeleteStorage = async (storageId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este dispositivo de storage?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${API_URL}/storage/delete/${storageId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            let errorMessage = `Error HTTP ${response.status}`;
            let errorData;

            try {
              errorData = await response.json();
              if (response.status === 422 && errorData && errorData.detail) {
                errorMessage = errorData.detail.map((e) => e.msg).join(", ");
              } else if (response.status === 401 || response.status === 403) {
                errorMessage =
                  "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
              } else if (response.status === 404) {
                errorMessage = "El dispositivo de storage no existe.";
              } else if (errorData && errorData.message) {
                errorMessage = errorData.message;
              }
            } catch (errorParse) {
              console.error("Error parsing error response:", errorParse);
              errorMessage = `Error al procesar la respuesta del servidor.`;
              handleError(errorParse);
            }

            Swal.fire({
              icon: "error",
              title: "Error al eliminar el storage",
              text: errorMessage,
            });
          } else {
            setStorageList(
              storageList.filter((storage) => storage.id !== storageId)
            );
            showSuccessToast();
          }
        } catch (error) {
          console.error("Error al eliminar el storage:", error);
          handleError(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar el storage.",
          });
        }
      }
    });
  };

  /**
   * Navega a la página de creación
   */
  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-storages`);
  };

  /**
   * Genera un badge visual para el estado del dispositivo
   * @param {string} status - Estado del dispositivo
   * @returns {JSX.Element} Badge del estado
   */
  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle size={12} className="mr-1" />
          Sin estado
        </span>
      );
    }

    const statusLower = status.toLowerCase();

    if (statusLower === "aplicado") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Aplicado
        </span>
      );
    } else if (statusLower === "no aplicado") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" />
          No aplicado
        </span>
      );
    } else if (
      statusLower === "maintenance" ||
      statusLower === "mantenimiento"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          Mantenimiento
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

    const invStatusIndex = invHeaders.findIndex((h) => {
      const headerStr = String(h || "").trim().toLowerCase();
      return (
        headerStr === "warrantystatus" ||
        headerStr === "warranty status" ||
        headerStr === "status" ||
        headerStr === "estado" ||
        headerStr.includes("warranty")
      );
    });

    console.log("DIAGNOSTIC - STORAGE INV:", {
      invHeaders,
      invStatusIndex,
      rowsCount: filteredRows.length,
      sampleRow: filteredRows[0] || null
    });

    const invStatusCounts = filteredRows.reduce(
      (acc, row) => {
        const statusValue =
          invStatusIndex >= 0 && row[invStatusIndex] != null
            ? String(row[invStatusIndex]).trim().toLowerCase()
            : "";

        if (statusValue === "with support" || statusValue === "con soporte") {
          acc.withSupport += 1;
        } else if (
          statusValue === "expired" ||
          statusValue === "vencido" ||
          statusValue.includes("expired")
        ) {
          acc.expired += 1;
        }

        acc.total += 1;
        return acc;
      },
      { total: 0, withSupport: 0, expired: 0 }
    );

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
      a.download = `storage_inv_${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="as-page">
        <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-as-text flex items-center gap-2">
              <HardDrive className="text-as-brand-600" size={24} />
              storage_inv
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

                  <button
                    onClick={handleInvImport}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0 bg-gray-700 text-white hover:bg-gray-600"
                    title="Importar desde Excel"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Importar</span>
                  </button>
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
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Mostrando {pageRows.length} de {filteredRows.length} registro
                  {filteredRows.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">With Support</span>
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{invStatusCounts.withSupport}</div>
                  <div className="text-xs text-slate-500 mt-1">Filas con estado With Support</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">Expired</span>
                    <AlertCircle size={18} className="text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{invStatusCounts.expired}</div>
                  <div className="text-xs text-slate-500 mt-1">Filas con estado Expired</div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm custom-scrollbar bg-white">
                <table className="as-table">
                  <thead>
                    <tr>
                      {invHeaders.map((h) => (
                        <th key={h} className="as-th whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length > 0 ? (
                      pageRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          {row.map((cell, cidx) => (
                            <td key={cidx} className="as-td whitespace-nowrap">
                              {cell || "—"}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={invHeaders.length || 1}
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
          <p className="text-as-muted">Cargando dispositivos de storage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="as-card p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-as-text">
            {error.message ||
              "Ha ocurrido un error al cargar los dispositivos de storage"}
          </p>
          <button
            onClick={() => fetchStorage(currentPage, rowsPerPage)}
            className="as-btn-primary mt-4"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cálculos de estadísticas para las tarjetas
  const totalStorage = storageList.length;
  const uniqueCategories = new Set(storageList.map(s => s.category).filter(Boolean)).size;
  const activeStorage = storageList.filter(s => {
    const status = s.status?.toLowerCase();
    return status === "aplicado" || status === "active" || status === "activo";
  }).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dispositivos de Storage
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Total Storage</span>
              <HardDrive size={16} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalStorage}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Storage Activos</span>
              <Activity size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeStorage}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase">Categorías</span>
              <Layers size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{uniqueCategories}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          {/* Search and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
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
                  <Search
                    size={18}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg">
                <span className="font-medium mr-2">
                  {selectedCount}
                </span>
                <span>
                  Storage{selectedCount !== 1 ? "s" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={irCrear}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Crear</span>
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition flex items-center gap-2"
                title="Importar desde Excel"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition flex items-center gap-2"
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
                        storageList.length > 0 &&
                        selectedStorage.size === storageList.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="as-th">
                    Nombre
                  </th>
                  <th scope="col" className="as-th">
                    Estado
                  </th>
                  <th scope="col" className="as-th">
                    Serial
                  </th>
                  <th scope="col" className="as-th">
                    Fabricante
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
                {filteredStorage.length > 0 ? (
                  filteredStorage.map((storage, index) => {
                    return (
                      <tr
                        key={storage.id}
                        className={`group border-b border-slate-100 transition-colors ${
                          selectedStorage.has(storage.id)
                            ? "bg-as-brand-50/50"
                            : "bg-white hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="as-td">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                            checked={selectedStorage.has(storage.id)}
                            onChange={() => toggleSelectStorage(storage.id)}
                          />
                        </td>
                        <td className="as-td font-semibold text-slate-900">
                          {storage.name}
                        </td>
                        <td className="as-td">
                          {getStatusBadge(storage.status)}
                        </td>
                        <td className="as-td font-mono text-slate-600">
                          {storage.serial || "N/A"}
                        </td>
                        <td className="as-td text-slate-600">
                          {storage.manufacturer || "N/A"}
                        </td>
                        <td className="as-td text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() =>
                                navigate(
                                  `${BASE_PATH}/ver/${storage.id}/storages`
                                )
                              }
                              className="p-2 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-all"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `${BASE_PATH}/editar/${storage.id}/storages`
                                )
                              }
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteStorage(storage.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 bg-white"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <HardDrive className="h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">No se encontraron dispositivos</p>
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
              Mostrando <span className="text-slate-900">{indexOfFirstStorage + 1}</span> a{" "}
              <span className="text-slate-900">{Math.min(indexOfLastStorage, filteredStorage.length)}</span> de{" "}
              <span className="text-slate-900">{filteredStorage.length}</span>
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
      </main>
    </div>
  );
}
