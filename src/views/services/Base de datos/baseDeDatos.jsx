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
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    isImporting: false,
  });

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

  const formatDate = (dateValue) => {
    if (!dateValue) return null;

    try {
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return `${dateValue.getFullYear()}-${String(
          dateValue.getMonth() + 1
        ).padStart(2, "0")}-${String(dateValue.getDate()).padStart(2, "0")}`;
      }

      if (typeof dateValue === "string") {
        if (!dateValue.trim()) return null;

        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
          return `${parsedDate.getFullYear()}-${String(
            parsedDate.getMonth() + 1
          ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
        }
      }

      if (typeof dateValue === "number") {
        const excelEpoch = new Date(1900, 0, 1);
        const jsDate = new Date(
          excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000
        );
        if (!isNaN(jsDate.getTime())) {
          return `${jsDate.getFullYear()}-${String(
            jsDate.getMonth() + 1
          ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
        }
      }

      return "0000-00-00";
    } catch (error) {
      console.error("Error al formatear fecha:", error, dateValue);
      return "0000-00-00"; 0
    }
  };

  const formatDataForAPI = (data) => {
    return data.map((row) => {
      const createDate = formatDate(row.create_date) || "0000-00-00";
      const modifiedDate =
        formatDate(row.modified_date) || createDate || "0000-00-00";

      return {
        instance_id: row.instance_id?.toString() || "",
        cost_center: row.cost_center?.toString() || "",
        category: row.category?.toString() || "",
        type: row.type?.toString() || "",
        item: row.item?.toString() || "",
        owner_contact: row.owner_contact?.toString() || "",
        name: row.name?.toString() || "",
        application_code: row.application_code?.toString() || "",
        inactive: row.inactive?.toString() || "",
        asset_life_cycle_status: row.asset_life_cycle_status?.toString() || "",
        system_environment: row.system_environment?.toString() || "",
        cloud: row.cloud?.toString() || "",
        version_number: row.version_number?.toString() || "",
        serial: row.serial?.toString() || "",
        ci_tag: row.ci_tag?.toString() || "",
        instance_name: row.instance_name?.toString() || "",
        model: row.model?.toString() || "",
        ha: row.ha?.toString() || "",
        port: row.port?.toString() || "",
        owner_name: row.owner_name?.toString() || "",
        department: row.department?.toString() || "",
        company: row.company?.toString() || "",
        manufacturer_name: row.manufacturer_name?.toString() || "",
        supplier_name: row.supplier_name?.toString() || "",
        supported: row.supported?.toString() || "",
        account_id: row.account_id?.toString() || "",
        create_date: createDate,
        modified_date: modifiedDate,
      };
    });
  };

  const sendBatch = async (batch, token, batchNumber, totalBatches) => {
    try {
      const formattedBatch = formatDataForAPI(batch);

      console.log(
        `Enviando lote ${batchNumber} con ${formattedBatch.length} registros`
      );
      console.log("Muestra de datos del lote:", formattedBatch.slice(0, 2)); // Mostrar solo los primeros 2 registros

      const response = await fetch(
        "https://10.8.150.90/api/inveplus/base_datos/add_from_excel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedBatch),
        }
      );

      console.log(
        `Respuesta del lote ${batchNumber}:`,
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status} en lote ${batchNumber}`;
        let errorDetails = "";

        try {
          const errorData = await response.json();
          console.error(`Error detallado del lote ${batchNumber}:`, errorData);

          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorDetails = errorData.detail
                .map((err) => {
                  if (typeof err === "object" && err.msg) {
                    return `${err.loc ? err.loc.join(".") + ": " : ""}${
                      err.msg
                    }`;
                  }
                  return JSON.stringify(err);
                })
                .join("; ");
            } else if (typeof errorData.detail === "string") {
              errorDetails = errorData.detail;
            } else {
              errorDetails = JSON.stringify(errorData.detail);
            }
          } else if (errorData.message) {
            errorDetails = errorData.message;
          } else {
            errorDetails = JSON.stringify(errorData);
          }

          errorMessage = `${errorMessage}: ${errorDetails}`;
        } catch (parseError) {
          console.error(
            `Error parseando respuesta del lote ${batchNumber}:`,
            parseError
          );
          const errorText = await response.text();
          console.error(`Texto de error del lote ${batchNumber}:`, errorText);
          errorMessage = `${errorMessage}: ${errorText.substring(0, 200)}...`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`Lote ${batchNumber} procesado exitosamente:`, result);
      return result;
    } catch (error) {
      console.error(`Error en lote ${batchNumber}:`, error);
      throw error;
    }
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

    // Validar que al menos tengan un campo requerido
    const validData = importedData.filter((row) => row.name || row.instance_id);
    if (validData.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron registros válidos con nombre o ID de instancia",
        "error"
      );
      return;
    }

    console.log("Datos válidos encontrados:", validData.length);
    console.log("Muestra de datos:", validData.slice(0, 3));

    // Confirmar importación con el usuario
    const result = await Swal.fire({
      title: `Importar ${validData.length} registros`,
      text: `Se encontraron ${validData.length} registros válidos. Debido al tamaño, se importarán en lotes de 100 registros. ¿Deseas continuar?`,
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

      // Dividir en lotes más pequeños de 100 registros
      const BATCH_SIZE = 100;
      const batches = [];

      for (let i = 0; i < validData.length; i += BATCH_SIZE) {
        batches.push(validData.slice(i, i + BATCH_SIZE));
      }

      console.log(
        `Dividiendo en ${batches.length} lotes de máximo ${BATCH_SIZE} registros`
      );

      // Mostrar progreso
      const progressSwal = Swal.fire({
        title: "Importando datos",
        html: `Procesando lote 0 de ${batches.length}...`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setImportProgress({
        current: 0,
        total: batches.length,
        isImporting: true,
      });

      // Procesar lotes secuencialmente
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 0; i < batches.length; i++) {
        try {
          // Actualizar progreso
          Swal.update({
            html: `Procesando lote ${i + 1} de ${
              batches.length
            }...<br>Registros procesados: ${successCount}`,
          });
          setImportProgress({
            current: i + 1,
            total: batches.length,
            isImporting: true,
          });

          await sendBatch(batches[i], token, i + 1, batches.length);
          successCount += batches[i].length;
          console.log(
            `Lote ${i + 1} completado. Total exitosos: ${successCount}`
          );
        } catch (error) {
          console.error(`Error en lote ${i + 1}:`, error);
          errorCount += batches[i].length;
          errors.push(`Lote ${i + 1}: ${error.message}`);
        }

        // Pequeña pausa entre lotes para no sobrecargar el servidor
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setImportProgress({ current: 0, total: 0, isImporting: false });

      // Cerrar el diálogo de progreso
      progressSwal.close();

      // Mostrar resultado final
      if (errors.length > 0) {
        Swal.fire({
          title: "Importación completada con errores",
          html: `
            <p><strong>Se importaron correctamente ${successCount} registros.</strong></p>
            <p><strong>Fallaron ${errorCount} registros.</strong></p>
            <div style="max-height: 300px; overflow-y: auto; margin-top: 15px; text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px;">
              <p><strong>Errores detallados:</strong></p>
              ${errors
                .map(
                  (err) =>
                    `<div style="margin-bottom: 10px; padding: 5px; background: white; border-left: 3px solid #dc3545;">${err}</div>`
                )
                .join("")}
            </div>
          `,
          icon: "warning",
          width: "80%",
        });
      } else {
        Swal.fire({
          title: "¡Importación completada exitosamente!",
          text: `Se importaron correctamente ${successCount} registros.`,
          icon: "success",
        });
      }

      // Recargar la lista después de importar
      fetchBasesDeDatos(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Error al importar:", error);
      setImportProgress({ current: 0, total: 0, isImporting: false });
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
                disabled={importProgress.isImporting}
              >
                <Download size={16} />
                <span className="hidden sm:inline">
                  {importProgress.isImporting
                    ? `Importando ${importProgress.current}/${importProgress.total}`
                    : "Importar"}
                </span>
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
