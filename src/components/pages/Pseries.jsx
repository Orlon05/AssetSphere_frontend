/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./Pseries.module.css";
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";
import { MdVisibility } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

const Pseries = () => {
  const [searchValue, setSearchValue] = useState("");
  const [pseries, setPseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPseries, setSelectedPseries] = useState(new Set());
  const navigate = useNavigate();
  const { exportToExcel } = useExport();

  //USO DEL IMPORT
  const handleImport = () => {
    Swal.fire({
      title: "Importar desde Excel",
      html: '<div id="excel-importer-container"></div>',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      width: "80%",
      height: "80%",
      /*
        customClass: {
           container: 'swal-custom-container',
           popup: 'swal-custom-popup',
           content: 'swal-custom-content'
        },
        grow:false,
      */
      didOpen: () => {
        const container = document.getElementById("excel-importer-container");
        const tableMetadata = [
          { name: "name", required: true, type: "string" },
          { name: "application", required: true, type: "string" },
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
          { name: "act_cpu", required: true, type: "string" },
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
      title: "servidor eliminado exitosamente",
    });
  };

  const handleImportComplete = async (importedData) => {
    console.log("Datos importados listos para enviar:", importedData);

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

      // Mapeo de datos para Pseries (convertir campos numéricos a string)
      const formattedData = importedData.map((row) => ({
        name: String(row.name || ""),
        application: String(row.application || ""),
        hostname: String(row.hostname || ""),
        ip_address: String(row.ip_address || ""),
        environment: String(row.environment || ""),
        slot: String(row.slot || ""),
        lpar_id: String(row.lpar_id || ""), // Convertir a string
        status: String(row.status || ""),
        os: String(row.os || ""),
        version: String(row.version || ""),
        subsidiary: String(row.subsidiary || ""),
        min_cpu: String(row.min_cpu || ""), // Convertir a string
        act_cpu: String(row.act_cpu || ""), // Convertir a string
        max_cpu: String(row.max_cpu || ""), // Convertir a string
        min_v_cpu: String(row.min_v_cpu || ""), // Convertir a string
        act_v_cpu: String(row.act_v_cpu || ""), // Convertir a string
        max_v_cpu: String(row.max_v_cpu || ""), // Convertir a string
        min_memory: String(row.min_memory || ""), // Convertir a string
        act_memory: String(row.act_memory || ""), // Convertir a string
        max_memory: String(row.max_memory || ""), // Convertir a string
        expansion_factor: String(row.expansion_factor || ""), // Convertir a string
        memory_per_factor: String(row.memory_per_factor || ""), // Convertir a string
        processor_compatibility: String(row.processor_compatibility || ""), // Convertir a string
      }));

      // Envío al backend
      const response = await fetch(
        "http://localhost:8000/pseries/add_from_excel",
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
        const errorDetail = await response.text(); // O `response.json()` si el backend devuelve JSON
        throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
      }

      Swal.fire("Éxito", "Datos importados correctamente", "success");
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire("Error", error.message || "Error al importar datos", "error");
    }
  };

  const selectedCount = selectedPseries.size;

  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredPseries, setUnfilteredPseries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);

  const irCrear = () => {
    navigate("/inveplus/crear-pseries");
  };

  const irVer = (pseriesId) => {
    navigate(`/inveplus/ver/${pseriesId}/pseries`);
  };

  const irEditar = (pseriesId) => {
    navigate(`/inveplus/editar/${pseriesId}/pseries`);
  };
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener servidores:", error);
  };
  const token = localStorage.getItem("authenticationToken");
  const fetchPseries = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/pseries/pseries?page=${page}&limit=${limit}&name=${search}`,
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
  const fetchSearch = async (search) => {
    if (isSearching) return;
    setIsSearching(true);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/pseries/pseries/search?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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

  useEffect(() => {
    fetchPseries(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
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
  }, [isSearchButtonClicked, searchValue, unfilteredPseries, rowsPerPage]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch("http://localhost:8000/pseries/export", {
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
      a.download = "pseries.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    searchInputRef.current.focus();
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true); // Activa la busqueda
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedPseries(new Set());
    } else {
      setSelectedPseries(new Set(pseries.map((pseries) => pseries.id)));
    }
  };

  const toggleSelectPseries = (pseriesId) => {
    const newSelectedPseries = new Set(selectedPseries);
    if (newSelectedPseries.has(pseriesId)) {
      newSelectedPseries.delete(pseriesId);
    } else {
      newSelectedPseries.add(pseriesId);
    }
    setSelectedPseries(newSelectedPseries);
  };
  const filteredPseries = pseries.filter((pseries) =>
    pseries.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastPseries = currentPage * rowsPerPage;
  const indexOfFirstPseries = indexOfLastPseries - rowsPerPage;
  const handleDeletePseries = async (pseriesId) => {
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
            `http://localhost:8000/pseries/pseries/${pseriesId}`,
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
            setPseries(pseries.filter((pseries) => pseries.id !== pseriesId));
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaServer /> Lista de Servidores
        </h1>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} /> Crear
        </button>
        <button className={style.btnImport} onClick={handleImport}>
          <CiImport className={style.icon} /> Importar
        </button>
        <button className={style.btnExport} onClick={handleExport}>
          <CiExport className={style.icon} /> Exportar
        </button>
      </div>
      <div
        className={`${style.searchContainer} ${
          selectedCount > 0 ? style.searchContainerSelected : ""
        }`}
      >
        {showSearch && (
          <>
            <input
              className={style.searchInput}
              type="search"
              placeholder="Buscar servidor..."
              value={searchValue}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <button
              className={style.searchIcon}
              onClick={handleSearchButtonClick}
            >
              <CiSearch className={style.iconS} />
            </button>
          </>
        )}
        {selectedCount > 0 && (
          <span className={style.selectedCount}>
            <span>{selectedCount}</span>
            <span>
              Servidor{selectedCount !== 1 ? "es" : ""} Seleccionado
              {selectedCount !== 1 ? "s" : ""}
            </span>
          </span>
        )}
      </div>

      <Table className={`${style.table} ${style.customTable}`}>
        <thead>
          <tr>
            <th className={style.contChek}>
              <input
                type="checkbox"
                className={style.customCheckbox}
                checked={
                  pseries.length > 0 && selectedPseries.size === pseries.length
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th>Nombre almacenamiento</th>
            <th>Modelo</th>
            <th>Cajón</th>
            <th>Status</th>
            <th className={style.contBtns}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pseries.map((pseries) => (
            <tr
              key={pseries.id}
              className={
                selectedPseries.has(pseries.id) ? style.selectedRow : ""
              }
            >
              <td>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={selectedPseries.has(pseries.id)}
                  onChange={() => toggleSelectPseries(pseries.id)}
                />
              </td>
              <td>{pseries.name}</td>
              <td>{pseries.environment}</td>
              <td>{pseries.slot}</td>
              <td>{pseries.status}</td>
              <td>
                <button
                  className={style.btnVer}
                  onClick={() => irVer(pseries.id)}
                >
                  <MdVisibility />
                </button>

                <button
                  className={style.btnEdit}
                  onClick={() => irEditar(pseries.id)}
                >
                  <MdEdit />
                </button>
                <button
                  className={style.btnDelete}
                  onClick={() => {
                    handleDeletePseries(pseries.id);
                  }}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className={style.contFil} colSpan="2">
              <div
                className={`d-flex justify-content-start align-items-center ${style.tfootSmall}`}
              >
                <span className={style.textfoot}>Filas por página:</span>
                <Form.Select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                  className={style.selectLine}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Form.Select>
              </div>
            </td>
            <td colSpan="1">
              <div
                className={`d-flex justify-content-center align-items-center ${style.tfootSmall}`}
              >
                <span>{`${indexOfFirstPseries + 1}-${Math.min(
                  indexOfLastPseries,
                  filteredPseries.length
                )} de ${filteredPseries.length}`}</span>
              </div>
            </td>
            <td className={style.contFilDos} colSpan="3">
              <div
                className={`d-flex justify-content-end align-items-center ${style.tfootSmall}`}
              >
                <Pagination className={style.pestanas}>
                  <Pagination.Prev
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                  <Pagination.Item>{currentPage}</Pagination.Item>
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                  />
                </Pagination>
              </div>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default Pseries;
