import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";
import {
  Database,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import ExcelImporter from "../../../hooks/Excelimporter";
// hola
const BaseDeDatos = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [base_datos, setBasesDeDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBasesDeDatos, setSelectedBasesDeDatos] = useState(new Set());
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredBasesDeDatos, setUnfilteredBasesDeDatos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const selectedCount = selectedBasesDeDatos.size;

  const BASE_PATH = "/inveplus";

  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

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
      title: "Base de datos eliminada exitosamente",
    });
  };

  // IMPORTAR
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

  const handleImportComplete = async (importedData) => {

    if (!Array.isArray(importedData) || importedData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron datos válidos en el archivo",
        "error"
      );
      return;
    }

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const formattedData = importedData.map((row) => ({
        instance_id: row.instance_id || "",
        cost_center: row.cost_center || "",
        category: row.category || "",
        type: row.type || "",
        item: row.item || "",
        owner_contact: row.owner_contact || "",
        name: row.name || "",
        application_code: row.application_code || "",
        inactive: row.inactive || "",
        asset_life_cycle_status: row.asset_life_cycle_status || "",
        system_environment: row.system_environment || "",
        cloud: row.cloud || "",
        version_number: row.version_number || "",
        serial: row.serial || "",
        ci_tag: row.ci_tag || "",
        instance_name: row.instance_name || "",
        model: row.model || "",
        ha: row.ha || "",
        port: row.port || "",
        owner_name: row.owner_name || "",
        department: row.department || "",
        company: row.company || "",
        manufacturer_name: row.manufacturer_name || "",
        supplier_name: row.supplier_name || "",
        supported: row.supported || "",
        account_id: row.account_id || "",
        create_date: new Date(row.CreateDate || row.create_date)
          .toISOString()
          .split("T")[0],
        modified_date: new Date(row.ModifiedDate || row.modified_date)
          .toISOString()
          .split("T")[0],
      }));

      const response = await fetch(
        "https://10.8.150.90/api/inveplus/base_datos/add_from_excel",
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
        throw new Error(`Error HTTP ${response.status}`);
      }

      Swal.fire("Éxito", "Datos importados correctamente", "success");
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire("Error", error.message || "Error al importar datos", "error");
    }
  };

  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener las bases de datos:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  const fetchBasesDeDatos = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://10.8.150.90/api/inveplus/base_datos/get_all?page=${page}&limit=${limit}&name=${search}`,
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

  const fetchSearch = async (search) => {
    if (isSearching) return;
    setIsSearching(true);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://10.8.150.90/api/inveplus/base_datos/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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

  useEffect(() => {
    fetchBasesDeDatos(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

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

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch(
        "https://10.8.150.90/api/inveplus/base_datos/export",
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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
  };

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

  const toggleSelectBasesDeDatos = (baseDeDatosId) => {
    const newSelectedBasesDeDatos = new Set(selectedBasesDeDatos);
    if (newSelectedBasesDeDatos.has(baseDeDatosId)) {
      newSelectedBasesDeDatos.delete(baseDeDatosId);
    } else {
      newSelectedBasesDeDatos.add(baseDeDatosId);
    }
    setSelectedBasesDeDatos(newSelectedBasesDeDatos);
  };

  const filteredBasesDeDatos = base_datos.filter((baseDeDatos) =>
    baseDeDatos.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastBaseDatos = currentPage * rowsPerPage;
  const indexOfFirstBaseDatos = indexOfLastBaseDatos - rowsPerPage;

  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-base-de-datos`);
  };

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
            `https://10.8.150.90/api/inveplus/base_datos/delete/${baseDeDatosId}`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando bases de datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-800">
            {error.message ||
              "Ha ocurrido un error al cargar las bases de datos"}
          </p>
          <button
            onClick={() => fetchBasesDeDatos(currentPage, rowsPerPage)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full p-8 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="mr-2 text-blue-500" />
            Lista de Bases de datos
          </h1>
          <p className="text-sm text-gray-600">
            Gestión y monitoreo de bases de datos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-50 border rounded-lg shadow-lg p-6">
          {/* Search and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar base de datos..."
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  value={searchValue}
                  onChange={handleSearchChange}
                  ref={searchInputRef}
                />
                <button
                  onClick={handleSearchButtonClick}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                ></button>
              </div>
            ) : (
              <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Crear</span>
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-tl-lg">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-blue-600"
                      checked={
                        base_datos.length > 0 &&
                        selectedBasesDeDatos.size === base_datos.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    ID de Instancia
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Puerto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Categoría
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
                {filteredBasesDeDatos.length > 0 ? (
                  filteredBasesDeDatos.map((baseDeDatos, index) => (
                    <tr
                      key={baseDeDatos.id}
                      className={`border-b border-gray-200 ${
                        selectedBasesDeDatos.has(baseDeDatos.id)
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
                          checked={selectedBasesDeDatos.has(baseDeDatos.id)}
                          onChange={() =>
                            toggleSelectBasesDeDatos(baseDeDatos.id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {baseDeDatos.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {baseDeDatos.instance_id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {baseDeDatos.port}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {baseDeDatos.category}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/ver/${baseDeDatos.id}/base-de-datos`
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
                                `${BASE_PATH}/editar/${baseDeDatos.id}/base-de-datos`
                              )
                            }
                            className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStorage(baseDeDatos.id)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Eliminar"
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
                      No se encontraron bases de datos que coincidan con la
                      búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number.parseInt(e.target.value, 10))
                }
                className="bg-white border border-gray-300 text-gray-900 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstBaseDatos + 1} a{" "}
              {Math.min(indexOfLastBaseDatos, filteredBasesDeDatos.length)} de{" "}
              {filteredBasesDeDatos.length} bases de datos
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaseDeDatos;
