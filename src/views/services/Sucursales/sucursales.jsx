import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Search,
  Building,
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

export default function Sucursales() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [sucursalesList, setSucursalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSucursales, setSelectedSucursales] = useState(new Set());
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredSucursales, setUnfilteredSucursales] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const selectedCount = selectedSucursales.size;

  const BASE_PATH = "/AssetSphere";

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
      title: "Sucursal eliminada exitosamente",
    });
  };

  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener sucursales:", error);
  };

  const token = localStorage.getItem("authenticationToken");

  const fetchSucursales = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/sucursales/get_all?page=${page}&limit=${limit}&name=${search}`,
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
        setUnfilteredSucursales(data.data.branches || []);
        setSucursalesList(data.data.branches || []);
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
        `http://localhost:8000/sucursales/search?name=${encodeURIComponent(
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
        setSucursalesList(data.data.branches || []);
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
    fetchSucursales(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setSucursalesList(unfilteredSucursales);
        setTotalPages(
          unfilteredSucursales.length > 0
            ? Math.ceil(unfilteredSucursales.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredSucursales, rowsPerPage]);

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
          { name: "name", required: true, type: "string" },
          { name: "brand", required: false, type: "string" },
          { name: "model", required: false, type: "string" },
          { name: "processor", required: false, type: "string" },
          { name: "cpu_cores", required: false, type: "number" },
          { name: "ram", required: false, type: "number" },
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
          { name: "responsible_organization", required: false, type: "string" },
          { name: "billable", required: false, type: "string" },
          { name: "oc_provisioning", required: false, type: "string" },
          { name: "oc_deletion", required: false, type: "string" },
          { name: "oc_modification", required: false, type: "string" },
          { name: "maintenance_period", required: false, type: "string" },
          { name: "maintenance_organization", required: false, type: "string" },
          { name: "cost_center", required: false, type: "string" },
          { name: "billing_type", required: false, type: "string" },
          { name: "branch_code", required: false, type: "string" },
          { name: "branch_name", required: false, type: "string" },
          { name: "region", required: false, type: "string" },
          { name: "department", required: false, type: "string" },
          { name: "comments", required: false, type: "string" },
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
    console.log("Datos importados (cantidad):", importedData.length);
    console.log("Datos importados (muestra):", importedData.slice(0, 3));

    if (!Array.isArray(importedData) || importedData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron datos válidos en el archivo",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "Procesando datos...",
      text: `Estamos guardando ${importedData.length} sucursales importadas`,
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

      const formattedData = importedData.map((row) => {
        const formattedRow = {};

        formattedRow.name = String(row.name || "");
        formattedRow.brand = String(row.brand || "");
        formattedRow.model = String(row.model || "");
        formattedRow.processor = String(row.processor || "");
        formattedRow.cpu_cores = row.cpu_cores
          ? Number.parseInt(row.cpu_cores)
          : null;
        formattedRow.ram = row.ram ? Number.parseInt(row.ram) : null;
        formattedRow.total_disk_size = String(row.total_disk_size || "");
        formattedRow.os_type = String(row.os_type || "");
        formattedRow.os_version = String(row.os_version || "");
        formattedRow.status = String(row.status || "");
        formattedRow.role = String(row.role || "");
        formattedRow.environment = String(row.environment || "");
        formattedRow.serial = String(row.serial || "");
        formattedRow.rack_id = String(row.rack_id || "");
        formattedRow.unit = String(row.unit || "");
        formattedRow.ip_address = String(row.ip_address || "");
        formattedRow.city = String(row.city || "");
        formattedRow.location = String(row.location || "");
        formattedRow.asset_id = String(row.asset_id || "");
        formattedRow.service_owner = String(row.service_owner || "");
        formattedRow.warranty_start_date = row.warranty_start_date || null;
        formattedRow.warranty_end_date = row.warranty_end_date || null;
        formattedRow.application_code = String(row.application_code || "");
        formattedRow.responsible_evc = String(row.responsible_evc || "");
        formattedRow.domain = String(row.domain || "");
        formattedRow.subsidiary = String(row.subsidiary || "");
        formattedRow.responsible_organization = String(
          row.responsible_organization || ""
        );
        formattedRow.billable = String(row.billable || "");
        formattedRow.oc_provisioning = String(row.oc_provisioning || "");
        formattedRow.oc_deletion = String(row.oc_deletion || "");
        formattedRow.oc_modification = String(row.oc_modification || "");
        formattedRow.maintenance_period = String(row.maintenance_period || "");
        formattedRow.maintenance_organization = String(
          row.maintenance_organization || ""
        );
        formattedRow.cost_center = String(row.cost_center || "");
        formattedRow.billing_type = String(row.billing_type || "");
        formattedRow.branch_code = String(row.branch_code || "");
        formattedRow.branch_name = String(row.branch_name || "");
        formattedRow.region = String(row.region || "");
        formattedRow.department = String(row.department || "");
        formattedRow.comments = String(row.comments || "");

        return formattedRow;
      });

      const response = await fetch(
        "http://localhost:8000/sucursales/add_from_excel",
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

      Swal.fire({
        icon: "success",
        title: "Importación exitosa",
        text: `Se han importado ${importedData.length} sucursales correctamente.`,
      });

      fetchSucursales(currentPage, rowsPerPage);
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

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch("http://localhost:8000/sucursales/export", {
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
      a.download = "sucursales.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
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
      setSelectedSucursales(new Set());
    } else {
      setSelectedSucursales(
        new Set(sucursalesList.map((sucursal) => sucursal.id))
      );
    }
  };

  const toggleSelectSucursal = (sucursalId) => {
    const newSelectedSucursales = new Set(selectedSucursales);
    if (newSelectedSucursales.has(sucursalId)) {
      newSelectedSucursales.delete(sucursalId);
    } else {
      newSelectedSucursales.add(sucursalId);
    }
    setSelectedSucursales(newSelectedSucursales);
  };

  const filteredSucursales = sucursalesList.filter(
    (sucursal) =>
      sucursal.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      sucursal.branch_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      sucursal.branch_code?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastSucursal = currentPage * rowsPerPage;
  const indexOfFirstSucursal = indexOfLastSucursal - rowsPerPage;

  const handleDeleteSucursal = async (sucursalId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta sucursal?",
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
            `http://localhost:8000/sucursales/delete/${sucursalId}`,
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
                errorMessage = "La sucursal no existe.";
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
              title: "Error al eliminar la sucursal",
              text: errorMessage,
            });
          } else {
            setSucursalesList(
              sucursalesList.filter((sucursal) => sucursal.id !== sucursalId)
            );
            showSuccessToast();
          }
        } catch (error) {
          console.error("Error al eliminar la sucursal:", error);
          handleError(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar la sucursal.",
          });
        }
      }
    });
  };

  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-sucursales`);
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();

    if (statusLower === "active" || statusLower === "activo") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Activo
        </span>
      );
    } else if (statusLower === "inactive" || statusLower === "inactivo") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" />
          Inactivo
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando sucursales...</p>
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
            {error.message || "Ha ocurrido un error al cargar las sucursales"}
          </p>
          <button
            onClick={() => fetchSucursales(currentPage, rowsPerPage)}
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
            <Building className="mr-2 text-blue-600" />
            Sucursales
          </h1>
          <p className="text-sm text-gray-500">
            Gestión y monitoreo de sucursales
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
                  placeholder="Buscar por nombre o código..."
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
                  Sucursal{selectedCount !== 1 ? "es" : ""} seleccionada
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
                        sucursalesList.length > 0 &&
                        selectedSucursales.size === sucursalesList.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Ciudad
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Región
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
                {filteredSucursales.length > 0 ? (
                  filteredSucursales.map((sucursal, index) => (
                    <tr
                      key={sucursal.id}
                      className={`border-b border-gray-200 ${
                        selectedSucursales.has(sucursal.id)
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
                          checked={selectedSucursales.has(sucursal.id)}
                          onChange={() => toggleSelectSucursal(sucursal.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {sucursal.branch_name || sucursal.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {sucursal.branch_code || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(sucursal.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {sucursal.city || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {sucursal.region || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/ver/${sucursal.id}/sucursal`
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
                                `${BASE_PATH}/editar/${sucursal.id}/sucursal`
                              )
                            }
                            className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSucursal(sucursal.id)}
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
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron sucursales que coincidan con la búsqueda
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
              Mostrando {indexOfFirstSucursal + 1} a{" "}
              {Math.min(indexOfLastSucursal, filteredSucursales.length)} de{" "}
              {filteredSucursales.length} sucursales
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
