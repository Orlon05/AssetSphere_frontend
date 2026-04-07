import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";
import {Database, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Download, Upload, Plus, ArrowUpRight, Activity, Layers} from "lucide-react";
import ExcelImporter from "../../../hooks/Excelimporter";

/**
 * Componente principal para la gestión de bases de datos
 *
 * Funcionalidades principales:
 * - Listado paginado de bases de datos
 * - Búsqueda por nombre
 * - Selección múltiple de registros
 * - Operaciones CRUD (Crear, Ver, Editar, Eliminar)
 * - Importación masiva desde Excel con validación
 * - Exportación a Excel
 * - Manejo de estados de carga y error
 */
const BaseDeDatos = () => {
  const navigate = useNavigate();

  // Estados para la gestión de datos
  const [searchValue, setSearchValue] = useState("");
  const [base_datos, setBasesDeDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Estados para selección múltiple
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBasesDeDatos, setSelectedBasesDeDatos] = useState(new Set());

  // Estados para búsqueda
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredBasesDeDatos, setUnfilteredBasesDeDatos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);

  // Referencias
  const searchInputRef = useRef(null);

  // Constantes
  const selectedCount = selectedBasesDeDatos.size;
  const BASE_PATH = "/AssetSphere";

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
   * Muestra notificación de éxito al eliminar
   */
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Base de datos eliminada exitosamente",
    });
  };

  /**
   * Maneja la importación desde Excel
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

        // Definición de metadatos para mapeo de columnas Excel
        const tableMetadata = [
          { name: "instance_id", required: false, type: "string" },
          { name: "cost_center", required: false, type: "string" },
          { name: "category", required: false, type: "string" },
          { name: "type", required: false, type: "string" },
          { name: "item", required: false, type: "string" },
          { name: "owner_contact", required: false, type: "string" },
          { name: "name", required: false, type: "string" },
          { name: "application_code", required: false, type: "string" },
          { name: "inactive", required: false, type: "string" },
          { name: "asset_life_cycle_status", required: false, type: "string" },
          { name: "system_environment", required: false, type: "string" },
          { name: "cloud", required: false, type: "string" },
          { name: "version_number", required: false, type: "string" },
          { name: "serial", required: false, type: "string" },
          { name: "ci_tag", required: false, type: "string" },
          { name: "instance_name", required: false, type: "string" },
          { name: "model", required: false, type: "string" },
          { name: "ha", required: false, type: "string" },
          { name: "port", required: false, type: "string" },
          { name: "owner_name", required: false, type: "string" },
          { name: "department", required: false, type: "string" },
          { name: "company", required: false, type: "string" },
          { name: "manufacturer_name", required: false, type: "string" },
          { name: "supplier_name", required: false, type: "string" },
          { name: "supported", required: false, type: "string" },
          { name: "account_id", required: false, type: "string" },
          { name: "create_date", required: false, type: "Date" },
          { name: "modified_date", required: false, type: "Date" },
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
   * @param {Array} importedData - Datos importados desde Excel
   */
  const handleImportComplete = async (importedData) => {
    // Validación inicial de datos
    if (!Array.isArray(importedData) || importedData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron datos válidos en el archivo",
        "error"
      );
      return;
    }

    // Filtrar registros válidos (que tengan nombre o ID de instancia)
    const validData = importedData.filter((row) => row.name || row.instance_id);
    if (validData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron registros válidos con nombre o ID de instancia",
        "error"
      );
      return;
    }

    // Confirmación del usuario
    const result = await Swal.fire({
      title: `Importar ${validData.length} registros`,
      text: `¿Deseas continuar con la importación de ${validData.length} registros?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, importar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      // Mostrar indicador de carga
      Swal.fire({
        title: "Importando datos",
        text: "Por favor espera...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Formatear datos para la API
      const formattedData = formatDataForAPI(validData);

      // Procesar en lotes para evitar sobrecarga del servidor
      const batchSize = 500;
      const totalBatches = Math.ceil(formattedData.length / batchSize);

      for (let i = 0; i < totalBatches; i++) {
        const batch = formattedData.slice(i * batchSize, (i + 1) * batchSize);

        const response = await fetch(
          `${API_URL}/base_datos/add_from_excel`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batch),
          }
        );

        if (!response.ok) {
          let errorMessage = `Error HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            console.error("Error detallado:", errorData);

            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail
                  .map((err) => {
                    if (typeof err === "object" && err.msg) {
                      return `${err.loc ? err.loc.join(".") + ": " : ""}${
                        err.msg
                      }`;
                    }
                    return JSON.stringify(err);
                  })
                  .join("; ");
              } else {
                errorMessage = errorData.detail;
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.error("Error parseando respuesta:", parseError);
          }

          throw new Error(errorMessage);
        }

        await response.json();
      }

      // Mostrar éxito
      Swal.fire({
        title: "¡Importación completada exitosamente!",
        text: `Se importaron correctamente ${validData.length} registros.`,
        icon: "success",
      });

      // Recargar datos
      fetchBasesDeDatos(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire("Error", error.message || "Error al importar datos", "error");
    }
  };

  /**
   * Formatea los datos importados para envío a la API
   * @param {Array} data - Datos sin formatear
   * @returns {Array} Datos formateados
   */
  const formatDataForAPI = (data) => {
    return data.map((row) => {
      /**
       * Formatea fechas al formato YYYY-MM-DD
       * @param {string} date - Fecha en formato string
       * @returns {string|null} Fecha formateada o null
       */
      const formatDate = (date) => {
        if (!date) return null;
        const dateParts = date.split("-").map((part) => part.trim());
        if (dateParts.length !== 3) return null;
        const [year, month, day] = dateParts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      };

      return {
        instance_id: row.instance_id || null,
        cost_center: row.cost_center || null,
        category: row.category || null,
        type: row.type || null,
        item: row.item || null,
        owner_contact: row.owner_contact || null,
        name: row.name || null,
        application_code: row.application_code || null,
        inactive: row.inactive || null,
        asset_life_cycle_status: row.asset_life_cycle_status || null,
        system_environment: row.system_environment || null,
        cloud: row.cloud || null,
        version_number: row.version_number || null,
        serial: row.serial || null,
        ci_tag: row.ci_tag || null,
        instance_name: row.instance_name || null,
        model: row.model || null,
        ha: row.ha || null,
        port: row.port || null,
        owner_name: row.owner_name || null,
        department: row.department || null,
        company: row.company || null,
        manufacturer_name: row.manufacturer_name || null,
        supplier_name: row.supplier_name || null,
        supported: row.supported || null,
        account_id: row.account_id || null,
        create_date: formatDate(row.create_date) || null,
        modified_date: formatDate(row.modified_date) || null,
      };
    });
  };

  /**
   * Maneja errores de la aplicación
   * @param {Error} error - Error a manejar
   */
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener las bases de datos:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  /**
   * Obtiene la lista de bases de datos desde la API
   * @param {number} page - Página actual
   * @param {number} limit - Registros por página
   * @param {string} search - Término de búsqueda
   */
  const fetchBasesDeDatos = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/base_datos/get_all?page=${page}&limit=${limit}&name=${search}`,
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
        setUnfilteredBasesDeDatos(data.data.base_datos);
        setBasesDeDatos(data.data.base_datos);
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
   * Realiza búsqueda específica por nombre
   * @param {string} search - Término de búsqueda
   */
  const fetchSearch = async (search) => {
    if (isSearching) return;
    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/base_datos/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setBasesDeDatos(data.data.base_datos);
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

  // Efecto para cargar datos iniciales y al cambiar paginación
  useEffect(() => {
    fetchBasesDeDatos(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  // Efecto para manejar búsquedas
  useEffect(() => {
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setBasesDeDatos(unfilteredBasesDeDatos);
        setTotalPages(
          unfilteredBasesDeDatos.length > 0
            ? Math.ceil(unfilteredBasesDeDatos.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredBasesDeDatos, rowsPerPage]);

  /**
   * Maneja la exportación a Excel
   */
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch(
        `${API_URL}/base_datos/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Error al exportar las bases de datos: ${errorDetail}`);
      }

      // Crear y descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bases_de_datos.xlsx";
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
   * Maneja el clic del botón de búsqueda
   */
  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
  };

  /**
   * Alterna la selección de todos los registros
   */
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedBasesDeDatos(new Set());
    } else {
      setSelectedBasesDeDatos(
        new Set(base_datos.map((baseDeDatos) => baseDeDatos.id))
      );
    }
  };

  /**
   * Alterna la selección de un registro específico
   * @param {string} baseDeDatosId - ID de la base de datos
   */
  const toggleSelectBasesDeDatos = (baseDeDatosId) => {
    const newSelectedBasesDeDatos = new Set(selectedBasesDeDatos);
    if (newSelectedBasesDeDatos.has(baseDeDatosId)) {
      newSelectedBasesDeDatos.delete(baseDeDatosId);
    } else {
      newSelectedBasesDeDatos.add(baseDeDatosId);
    }
    setSelectedBasesDeDatos(newSelectedBasesDeDatos);
  };

  // Filtrado local de datos
  const filteredBasesDeDatos =
    searchValue.trim() === ""
      ? base_datos
      : base_datos.filter((baseDeDatos) =>
          baseDeDatos.name?.toLowerCase().includes(searchValue.toLowerCase())
        );

  // Cálculos de paginación
  const indexOfLastBaseDatos = currentPage * rowsPerPage;
  const indexOfFirstBaseDatos = indexOfLastBaseDatos - rowsPerPage;

  /**
   * Navega al formulario de creación
   */
  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-base-de-datos`);
  };

  /**
   * Maneja la eliminación de una base de datos
   * @param {string} baseDeDatosId - ID de la base de datos a eliminar
   */
  const handleDeleteStorage = async (baseDeDatosId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta base de datos?",
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
            `${API_URL}/base_datos/delete/${baseDeDatosId}`,
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
                errorMessage = "La base de datos no existe.";
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
              title: "Error al eliminar la base de datos",
              text: errorMessage,
            });
          } else {
            // Actualizar estado local
            setBasesDeDatos(
              base_datos.filter(
                (baseDeDatos) => baseDeDatos.id !== baseDeDatosId
              )
            );
            showSuccessToast();
          }
        } catch (error) {
          console.error("Error al eliminar la base de datos:", error);
          handleError(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar la base de datos.",
          });
        }
      }
    });
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-as-brand-600 mb-4"></div>
          <p className="text-as-muted">Cargando bases de datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-page flex items-center justify-center p-6">
        <div className="as-card max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <Activity className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Error de carga</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {error.message || "Ha ocurrido un error al cargar las bases de datos"}
          </p>
          <button
            onClick={() => fetchBasesDeDatos(currentPage, rowsPerPage)}
            className="as-btn-primary mt-5"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cálculos de estadísticas para las tarjetas
  const totalBases = base_datos.length;
  const uniqueCategories = new Set(base_datos.map(bd => bd.category).filter(Boolean)).size;
  const activeBases = base_datos.filter(bd => bd.inactive === "False" || bd.inactive === false || bd.inactive === "0" || !bd.inactive).length;

  return (
    <div className="as-page">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-as-text flex items-center">
            <Database className="mr-2 text-as-brand-600" />
            Lista de Bases de datos
          </h1>
          <p className="text-sm text-as-muted">
            Gestión y monitoreo de bases de datos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="as-container">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-as-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-as-brand-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Bases de Datos</span>
              <Database size={16} className="text-slate-400 group-hover:text-as-brand-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-as-brand-600 transition-colors duration-300">{totalBases}</div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-emerald-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bases Activas</span>
              <Activity size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">{activeBases}</div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-indigo-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Categorías</span>
              <Layers size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{uniqueCategories}</div>
          </div>
        </div>

        <div className="as-card p-6">
          {/* Search and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar base de datos..."
                  className="as-input pl-10"
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
              <div className="flex items-center bg-as-brand-50 text-as-brand-700 px-4 py-2 rounded-lg border border-as-brand-100">
                <span className="font-medium mr-2">{selectedCount}</span>
                <span>
                  Base de datos{selectedCount !== 1 ? "es" : ""} seleccionada
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={irCrear}
                className="as-btn-primary"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Crear</span>
              </button>
              <button
                onClick={handleImport}
                className="as-btn-success"
                title="Importar desde Excel"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="as-btn-purple"
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
                        base_datos.length > 0 &&
                        selectedBasesDeDatos.size === base_datos.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="as-th">
                    Nombre
                  </th>
                  <th scope="col" className="as-th">
                    ID de Instancia
                  </th>
                  <th scope="col" className="as-th">
                    Puerto
                  </th>
                  <th scope="col" className="as-th">
                    Categoría
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
                {filteredBasesDeDatos.length > 0 ? (
                  filteredBasesDeDatos.map((baseDeDatos, index) => (
                    <tr
                      key={baseDeDatos.id}
                      className={`group border-b border-slate-100 transition-colors ${
                        selectedBasesDeDatos.has(baseDeDatos.id)
                          ? "bg-as-brand-50/50"
                          : "bg-white hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="as-td">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                          checked={selectedBasesDeDatos.has(baseDeDatos.id)}
                          onChange={() =>
                            toggleSelectBasesDeDatos(baseDeDatos.id)
                          }
                        />
                      </td>
                      <td className="as-td font-semibold text-slate-900">
                        {baseDeDatos.name}
                      </td>
                      <td className="as-td">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {baseDeDatos.instance_id}
                        </span>
                      </td>
                      <td className="as-td font-mono text-slate-600">
                        {baseDeDatos.port}
                      </td>
                      <td className="as-td">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                          <Database size={12} />
                          {baseDeDatos.category}
                        </span>
                      </td>
                      <td className="as-td text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/ver/${baseDeDatos.id}/base-de-datos`
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
                                `${BASE_PATH}/editar/${baseDeDatos.id}/base-de-datos`
                              )
                            }
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteStorage(baseDeDatos.id)}
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
                        <Database className="h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">No se encontraron bases de datos</p>
                        <p className="text-sm mt-1">Ajusta tu búsqueda o intenta agregar una nueva.</p>
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
              Mostrando <span className="text-slate-900">{(currentPage - 1) * rowsPerPage + 1}</span> a{" "}
              <span className="text-slate-900">{Math.min(currentPage * rowsPerPage, filteredBasesDeDatos.length)}</span>{" "}
              de <span className="text-slate-900">{filteredBasesDeDatos.length}</span>
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
};

export default BaseDeDatos;
