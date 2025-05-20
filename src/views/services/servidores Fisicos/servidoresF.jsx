import { useState, useEffect, useRef } from "react";
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

export default function ServidoresFisicos() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServers, setSelectedServers] = useState(new Set());
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredServers, setUnfilteredServers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const selectedCount = selectedServers.size;

  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  const BASE_PATH = "/inveplus";

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
      title: "Servidor eliminado exitosamente",
    });
  };

  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener servidores:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  const fetchServers = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical?page=${page}&limit=${limit}&name=${search}`,
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
        setUnfilteredServers(data.data.servers);
        setServers(data.data.servers);
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
        `http://localhost:8000/servers/physical/search?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setServers(data.data.servers);
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
    fetchServers(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

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
  }, [isSearchButtonClicked, searchValue, unfilteredServers, rowsPerPage]);

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
          [
            { name: "name", required: false, type: "string" },
            { name: "brand", required: false, type: "string" },
            { name: "model", required: false, type: "string" },
            { name: "processor", required: false, type: "string" },
            { name: "cpu_cores", required: false, type: "string" },
            { name: "ram", required: false, type: "string" },
            { name: "total_disk_size", required: false, type: "string" },
            { name: "os_type", required: false, type: "string" },
            { name: "os_version", required: false, type: "string" },
            { name: "status", required: false, type: "string" },
            { name: "role", required: false, type: "string" },
            { name: "environment", required: false, type: "string" },
            { name: "serial", required: false, type: "string" },
            { name: "rack_id", required: false, type: "string" },
            { name: "unit", required: false, type: "string" },
            { name: "ip_address", required: false, type: "string" },
            { name: "city", required: false, type: "string" },
            { name: "location", required: false, type: "string" },
            { name: "asset_id", required: false, type: "string" },
            { name: "service_owner", required: false, type: "string" },
            { name: "warranty_start_date", required: false, type: "date" },
            { name: "warranty_end_date", required: false, type: "date" },
            { name: "application_code", required: false, type: "string" },
            { name: "responsible_evc", required: false, type: "string" },
            { name: "domain", required: false, type: "string" },
            { name: "subsidiary", required: false, type: "string" },
            {
              name: "responsible_organization",
              required: false,
              type: "string",
            },
            { name: "billable", required: false, type: "string" },
            { name: "oc_provisioning", required: false, type: "string" },
            { name: "oc_deletion", required: false, type: "string" },
            { name: "oc_modification", required: false, type: "string" },
            { name: "maintenance_period", required: false, type: "string" },
            {
              name: "maintenance_organization",
              required: false,
              type: "string",
            },
            { name: "cost_center", required: false, type: "string" },
            { name: "billing_type", required: false, type: "string" },
            { name: "comments", required: false, type: "string" },
          ],
        ];

        if (container) {
          container.innerHTML = "Componente de importación de Excel";
        }
      },
      willClose: () => {
        const container = document.getElementById("excel-importer-container");
        if (container) {
          container.innerHTML = "";
        }
      },
    });
  };

  const handleImportComplete = (importedData) => {
    console.log("datos importados:", importedData);
    Swal.close();
  };

  const handleExport = () => {
    // Simulamos la exportación ya que no tenemos acceso al hook useExport
    alert("Exportando datos a Excel...");
    // En una implementación real, llamaríamos a:
    // exportToExcel(servers, "servidores_fisicos", serverDataMapper)
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
      setSelectedServers(new Set());
    } else {
      setSelectedServers(new Set(servers.map((server) => server.id)));
    }
  };

  const toggleSelectServer = (serverId) => {
    const newSelectedServers = new Set(selectedServers);
    if (newSelectedServers.has(serverId)) {
      newSelectedServers.delete(serverId);
    } else {
      newSelectedServers.add(serverId);
    }
    setSelectedServers(newSelectedServers);
  };

  const filteredServers = servers.filter((server) =>
    server.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;

  const handleDeleteServer = async (serverId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este servidor?",
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
            `http://localhost:8000/servers/physical/${serverId}`,
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
                errorMessage = "El servidor no existe.";
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
              title: "Error al eliminar el servidor",
              text: errorMessage,
            });
          } else {
            setServers(servers.filter((server) => server.id !== serverId));
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
    });
  };

  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-servidores-f`);
  };

  const irVer = (serverId) => {
    router.push(`${BASE_PATH}/ver/${serverId}/servidores`);
  };

  const irEditar = (serverId) => {
    router.push(`${BASE_PATH}/editar/${serverId}/servidores`);
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();

    if (statusLower === "active" || statusLower === "activo") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-600 text-green-200">
          <CheckCircle size={12} className="mr-1" />
          Activo
        </span>
      );
    } else if (statusLower === "inactive" || statusLower === "inactivo") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-red-200">
          <AlertCircle size={12} className="mr-1" />
          Inactivo
        </span>
      );
    } else if (
      statusLower === "maintenance" ||
      statusLower === "mantenimiento"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-yellow-200">
          <Clock size={12} className="mr-1" />
          Mantenimiento
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {status}
        </span>
      );
    }
  };

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

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-300/30 border rounded-lg shadow-lg p-6">
          {/* Search and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="bg-white border-gray-400 text-gray-900 rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex items-center bg-blue-600 px-4 py-2 rounded-lg">
                <span className="font-medium text-white-400 mr-2">
                  {selectedCount}
                </span>
                <span>
                  Servidor{selectedCount !== 1 ? "es" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={irCrear}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={16} lassName="text-white" />
                <span className="hidden text-white fond-medium sm:inline">
                  Crear
                </span>
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Importar desde Excel"
              >
                <Download size={16} lassName="text-white" />
                <span className="hidden text-white fond-medium sm:inline">
                  Importar
                </span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                title="Exportar a Excel"
              >
                <Upload size={16} className="text-white" />
                <span className="hidden text-white fond-medium sm:inline">
                  Exportar
                </span>
              </button>
            </div>
          </div>

          {/* Table */}
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
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nombre
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
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-blue-600"
                          checked={selectedServers.has(server.id)}
                          onChange={() => toggleSelectServer(server.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {server.name}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(server.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {server.serial}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {server.ip_address}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              navigate(`${BASE_PATH}/ver/${server.id}/servers`)
                            }
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Ver detalles"
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
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteServer(server.id)}
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
                      className="px-6 py-4 text-center text-gray-200"
                    >
                      No se encontraron servidores que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-200 mr-2">
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
                className="p-2 rounded-md bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 rounded-md bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
