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
  ArrowUpRight,
  Activity,
  MapPin
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
      <div className="as-page flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-as-brand-500 border-t-transparent mb-4"></div>
          <p className="text-as-text font-medium">Cargando sucursales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-page flex items-center justify-center p-6">
        <div className="as-card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold text-as-text mb-2">Error de carga</h2>
          <p className="text-as-muted mb-6">
            {error.message || "Ha ocurrido un error al cargar las sucursales"}
          </p>
          <button
            onClick={() => fetchSucursales(currentPage, rowsPerPage)}
            className="as-btn-primary w-full justify-center"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cálculos de estadísticas para las tarjetas
  const totalSucursales = sucursalesList.length;
  const activeSucursales = sucursalesList.filter(s => {
    const status = s.status?.toLowerCase();
    return status === 'active' || status === 'activo';
  }).length;
  const uniqueRegions = new Set(sucursalesList.map(s => s.region).filter(Boolean)).size;

  return (
    <div className="as-page">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-as-text flex items-center">
            <Building className="mr-2 text-as-brand-600" />
            Sucursales
          </h1>
          <p className="text-sm text-as-muted">
            Gestión y monitoreo de sucursales
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="as-container">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-as-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-as-brand-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Sucursales</span>
              <Building size={16} className="text-slate-400 group-hover:text-as-brand-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-as-brand-600 transition-colors duration-300">{totalSucursales}</div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-emerald-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sucursales Activas</span>
              <Activity size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">{activeSucursales}</div>
          </div>

          <div className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-indigo-500 transition-colors duration-300"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Regiones</span>
              <MapPin size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <div className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{uniqueRegions}</div>
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
                  placeholder="Buscar por nombre o código..."
                  className="as-input pl-10"
                  value={searchValue}
                  onChange={handleSearchChange}
                  ref={searchInputRef}
                />
                <button
                  onClick={handleSearchButtonClick}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-as-brand-50 px-4 py-2 rounded-lg border border-as-brand-100">
                <span className="font-medium text-as-brand-700 mr-2">
                  {selectedCount}
                </span>
                <span className="text-as-brand-800">
                  Sucursal{selectedCount !== 1 ? "es" : ""} seleccionada
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
                        sucursalesList.length > 0 &&
                        selectedSucursales.size === sucursalesList.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="as-th">
                    Nombre
                  </th>
                  <th scope="col" className="as-th">
                    Código
                  </th>
                  <th scope="col" className="as-th">
                    Estado
                  </th>
                  <th scope="col" className="as-th">
                    Ciudad
                  </th>
                  <th scope="col" className="as-th">
                    Región
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
                {filteredSucursales.length > 0 ? (
                  filteredSucursales.map((sucursal, index) => (
                    <tr
                      key={sucursal.id}
                      className={`group border-b border-slate-100 transition-colors ${
                        selectedSucursales.has(sucursal.id)
                          ? "bg-as-brand-50/50"
                          : "bg-white hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="as-td">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 bg-white checked:bg-as-brand-600 text-as-brand-600 focus:ring-as-brand-500 cursor-pointer transition-colors"
                          checked={selectedSucursales.has(sucursal.id)}
                          onChange={() => toggleSelectSucursal(sucursal.id)}
                        />
                      </td>
                      <td className="as-td font-medium text-slate-800">
                        {sucursal.branch_name || sucursal.name || "N/A"}
                      </td>
                      <td className="as-td text-slate-600">
                        {sucursal.branch_code || "N/A"}
                      </td>
                      <td className="as-td">
                        {getStatusBadge(sucursal.status)}
                      </td>
                      <td className="as-td text-slate-600">
                        {sucursal.city || "N/A"}
                      </td>
                      <td className="as-td text-slate-600">
                        {sucursal.region || "N/A"}
                      </td>
                      <td className="as-td text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/ver/${sucursal.id}/sucursal`
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-as-brand-600 hover:bg-as-brand-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `${BASE_PATH}/editar/${sucursal.id}/sucursal`
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteSucursal(sucursal.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500 bg-slate-50/50"
                    >
                      No se encontraron sucursales que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number.parseInt(e.target.value, 10))
                }
                className="as-input py-1.5 pl-3 pr-8 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Mostrando <span className="text-slate-900">{indexOfFirstSucursal + 1}</span> a{" "}
              <span className="text-slate-900">{Math.min(indexOfLastSucursal, filteredSucursales.length)}</span> de{" "}
              <span className="text-slate-900">{filteredSucursales.length}</span> sucursales
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
