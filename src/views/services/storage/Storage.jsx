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
  const [searchValue, setSearchValue] = useState("");
  const [storageList, setStorageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(new Set());
  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredStorage, setUnfilteredStorage] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const selectedCount = selectedStorage.size;

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
            {
              name: "cod_item_configuracion",
              required: false,
              type: "string",
              excelColumn: "Código Item Config.",
            },
            {
              name: "name",
              required: true,
              type: "string",
              excelColumn: "Nombre",
            },
            {
              name: "application_code",
              required: false,
              type: "string",
              excelColumn: "Código Aplicación",
            },
            {
              name: "cost_center",
              required: false,
              type: "string",
              excelColumn: "Centro de Costo",
            },
            {
              name: "active",
              required: false,
              type: "string",
              excelColumn: "Activo",
            },
            {
              name: "category",
              required: false,
              type: "string",
              excelColumn: "Categoría",
            },
            {
              name: "type",
              required: false,
              type: "string",
              excelColumn: "Tipo",
            },
            {
              name: "item",
              required: false,
              type: "string",
              excelColumn: "Item",
            },
            {
              name: "company",
              required: false,
              type: "string",
              excelColumn: "Empresa",
            },
            {
              name: "organization_responsible",
              required: false,
              type: "string",
              excelColumn: "Organización Responsable",
            },
            {
              name: "host_name",
              required: false,
              type: "string",
              excelColumn: "Nombre Host",
            },
            {
              name: "manufacturer",
              required: false,
              type: "string",
              excelColumn: "Fabricante",
            },
            {
              name: "status",
              required: false,
              type: "string",
              excelColumn: "Estado",
            },
            {
              name: "owner",
              required: false,
              type: "string",
              excelColumn: "Propietario",
            },
            {
              name: "model",
              required: false,
              type: "string",
              excelColumn: "Modelo",
            },
            {
              name: "serial",
              required: false,
              type: "string",
              excelColumn: "Serial",
            },
            {
              name: "org_maintenance",
              required: false,
              type: "string",
              excelColumn: "Org. Mantenimiento",
            },
            {
              name: "ip_address",
              required: false,
              type: "string",
              excelColumn: "Dirección IP",
            },
            {
              name: "disk_size",
              required: false,
              type: "string",
              excelColumn: "Tamaño Disco",
            },
            {
              name: "location",
              required: false,
              type: "string",
              excelColumn: "Ubicación",
            },
          ],
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
    console.log("Datos importados:", importedData);

    Swal.fire({
      title: "Procesando datos...",
      text: "Estamos guardando los dispositivos de storage importados",
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

      const normalizeStatus = (status) => {
        if (!status) return "Inactivo";
        const statusStr = String(status).toLowerCase().trim();
        if (
          statusStr === "activo" ||
          statusStr === "active" ||
          statusStr === "1" ||
          statusStr === "true"
        ) {
          return "Activo";
        }
        return "Inactivo";
      };

      const formattedData = importedData.map((row, index) => {
        try {
          return {
            cod_item_configuracion: cleanString(row.cod_item_configuracion),
            name: cleanString(row.name),
            application_code: cleanString(row.application_code),
            cost_center: cleanString(row.cost_center),
            active: normalizeStatus(row.active),
            category: cleanString(row.category),
            type: cleanString(row.type),
            item: cleanString(row.item),
            company: cleanString(row.company),
            organization_responsible: cleanString(row.organization_responsible),
            host_name: cleanString(row.host_name),
            manufacturer: cleanString(row.manufacturer),
            status: normalizeStatus(row.status),
            owner: cleanString(row.owner),
            model: cleanString(row.model),
            serial: cleanString(row.serial),
            org_maintenance: cleanString(row.org_maintenance),
            ip_address: cleanString(row.ip_address),
            disk_size: cleanString(row.disk_size),
            location: cleanString(row.location),
          };
        } catch (error) {
          console.error(`Error procesando fila ${index + 1}:`, error, row);
          throw new Error(`Error en la fila ${index + 1}: ${error.message}`);
        }
      });

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 0; i < formattedData.length; i++) {
        try {
          const response = await fetch("http://localhost:8000/storage/add", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData[i]),
          });

          if (!response.ok) {
            const errorDetail = await response.text();
            console.error(`Error en storage ${i + 1}:`, errorDetail);
            errors.push(`Storage ${i + 1}: ${errorDetail}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Error procesando storage ${i + 1}:`, error);
          errors.push(`Storage ${i + 1}: ${error.message}`);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        Swal.fire({
          icon: "success",
          title: "Importación exitosa",
          text: `Se han importado ${successCount} dispositivos de storage correctamente.`,
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
            <p>No se pudo importar ningún dispositivo de storage:</p>
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

      fetchStorage(currentPage, rowsPerPage);
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
  };

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
      title: "Storage eliminado exitosamente",
    });
  };

  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener storage:", error);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch("http://localhost:8000/storage/export", {
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
      a.download = "storage.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const token = localStorage.getItem("authenticationToken");

  const fetchStorage = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:8000/storage/get_all?page=${page}&limit=${limit}`;

      if (search.trim()) {
        url = `http://localhost:8000/storage/search_by_name?name=${encodeURIComponent(
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
      console.log("Respuesta completa del servidor:", data);

      if (data && data.status === "success" && data.data) {
        console.log("Storage recibido:", data.data.storages);
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

  const fetchSearch = async (search) => {
    if (isSearching) return;
    setIsSearching(true);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/storage/search_by_name?name=${encodeURIComponent(
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

  useEffect(() => {
    fetchStorage(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

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
      setSelectedStorage(new Set());
    } else {
      setSelectedStorage(new Set(storageList.map((storage) => storage.id)));
    }
  };

  const toggleSelectStorage = (storageId) => {
    const newSelectedStorage = new Set(selectedStorage);
    if (newSelectedStorage.has(storageId)) {
      newSelectedStorage.delete(storageId);
    } else {
      newSelectedStorage.add(storageId);
    }
    setSelectedStorage(newSelectedStorage);
  };

  const filteredStorage = storageList.filter((storage) =>
    storage.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastStorage = currentPage * rowsPerPage;
  const indexOfFirstStorage = indexOfLastStorage - rowsPerPage;

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
            `http://localhost:8000/storage/delete/${storageId}`,
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

  const irCrear = () => {
    navigate(`${BASE_PATH}/crear-storages`);
  };

  const getStatusBadge = (status) => {
    console.log("Estado recibido en getStatusBadge:", status);

    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle size={12} className="mr-1" />
          Sin estado
        </span>
      );
    }

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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
          <p>Cargando dispositivos de storage...</p>
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
            {error.message ||
              "Ha ocurrido un error al cargar los dispositivos de storage"}
          </p>
          <button
            onClick={() => fetchStorage(currentPage, rowsPerPage)}
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
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HardDrive className="mr-2 text-blue-400" />
            Dispositivos de Storage
          </h1>
          <p className="text-sm text-gray-900">
            Gestión y monitoreo de dispositivos de almacenamiento
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
                  Storage{selectedCount !== 1 ? "s" : ""} seleccionado
                  {selectedCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={irCrear}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={16} className="text-white" />
                <span className="hidden text-white fond-medium sm:inline">
                  Crear
                </span>
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Importar desde Excel"
              >
                <Download size={16} className="text-white" />
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
                        storageList.length > 0 &&
                        selectedStorage.size === storageList.length
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
                    Fabricante
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Modelo
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
                {filteredStorage.length > 0 ? (
                  filteredStorage.map((storage, index) => {
                    console.log("Storage en tabla:", storage);
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
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {storage.name}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(storage.status)}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {storage.serial || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {storage.manufacturer || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {storage.model || "N/A"}
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
              Mostrando {indexOfFirstStorage + 1} a{" "}
              {Math.min(indexOfLastStorage, filteredStorage.length)} de{" "}
              {filteredStorage.length} dispositivos
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
