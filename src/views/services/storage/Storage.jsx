import { API_URL } from "../../../config/api";
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
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import ExcelImporter from "../../../hooks/Excelimporter";
import { createRoot } from "react-dom/client";

export default function Storage() {
  const navigate = useNavigate();

  // Estados principales del componente
  const [searchValue, setSearchValue] = useState("");
  const [storageList, setStorageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchStorage(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  useEffect(() => {
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando dispositivos de storage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>
            {error.message ||
              "Ha ocurrido un error al cargar los dispositivos de storage"}
          </p>
          <button
            onClick={() => fetchStorage(currentPage, rowsPerPage)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full p-8 flex items-center border-b border-gray-200 bg-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <HardDrive className="mr-2 text-blue-600" />
            Dispositivos de Storage
          </h1>
          <p className="text-sm text-gray-500">
            Gestión y monitoreo de dispositivos de almacenamiento
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <span className="font-medium text-blue-600 mr-2">
                  {selectedCount}
                </span>
                <span className="text-gray-700">
                  Storage{selectedCount !== 1 ? "s" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={irCrear}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Crear</span>
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                title="Importar desde Excel"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Exportar a Excel"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-tl-lg">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-blue-600"
                      checked={
                        storageList.length > 0 &&
                        selectedStorage.size === storageList.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Serial
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Fabricante
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 rounded-tr-lg text-right font-semibold"
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
                        className={`border-b border-gray-200 ${
                          selectedStorage.has(storage.id)
                            ? "bg-blue-50"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
                        } hover:bg-gray-100`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-blue-600"
                            checked={selectedStorage.has(storage.id)}
                            onChange={() => toggleSelectStorage(storage.id)}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {storage.name}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(storage.status)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {storage.serial || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {storage.manufacturer || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `${BASE_PATH}/ver/${storage.id}/storages`
                                )
                              }
                              className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `${BASE_PATH}/editar/${storage.id}/storages`
                                )
                              }
                              className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteStorage(storage.id)}
                              className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron dispositivos de storage que coincidan
                      con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                className="bg-white border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Mostrando {indexOfFirstStorage + 1} a{" "}
              {Math.min(indexOfLastStorage, filteredStorage.length)} de{" "}
              {filteredStorage.length} dispositivos
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <span className="px-3 py-1 rounded-md bg-blue-600 text-white">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
