/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { MdCloud } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./storage.module.css";
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Storage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStorages, setSelectedStorages] = useState(new Set());
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
      //height: "80%",
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
          { name: "cod_item_configuracion", required: false, type: "string" },
          { name: "name", required: false, type: "string" },
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

  //La variable handleImportComplete es la que se encarga de tomar/mapear la información al importar el archivo de excel.
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
      // Se deben colocar todas las propiedades/campos de la tabla a la cual se le este haciendo la vista a excepción de la clave prinaria, dicho campo no debe ir aquí
      const formattedData = importedData.map(row => ({
        cod_item_configuracion: String(row.cod_item_configuracion || ""),
        name: row.name || "",
        application_code: row.application_code || "",
        cost_center: row.cost_center || "",
        active: row.active || "",
        category: row.category || "",
        type: row.type || "",
        item: row.item || "",
        company: row.company || "",
        organization_responsible: row.organization_responsible || "",
        host_name: row.host_name || "",
        manufacturer: row.manufacturer || "",
        status: row.status || "",
        owner: row.owner || "",
        model: row.model || "",
        serial: row.serial || "",
        org_maintenance: row.org_maintenance || "",
        ip_address: row.ip_address || "",
        disk_size: row.disk_size || "",
        location: row.location || "",
      }));
      // Aquí se debe colocar la ruta del back-end que recibe la información del excel y la inserta en la BD
      const response = await fetch(
        "http://localhost:8000/storage/add_from_excel",
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
        const errorDetail = await response.text();  // O `response.json()` si el backend devuelve JSON
        throw new Error(`Error HTTP ${response.status}: ${errorDetail}`);
      }

      Swal.fire("Éxito", "Datos importados correctamente", "success");
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire("Error", error.message || "Error al importar datos", "error");
    }
  };

  const selectedCount = selectedStorages.size;

  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredStorages, setUnfilteredStorages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);
  const irCrear = () => {
    navigate("/crear-storages");
  };
  const irVer = (storageId) => {
    navigate(`/ver/${storageId}/storages`);
  };
  const irEditar = (storageId) => {
    navigate(`/editar/${storageId}/storages`);
  };
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener los storages:", error);
  };
  const token = localStorage.getItem("authenticationToken");
  const fetchStorages = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/storage/get_all?page=${page}&limit=${limit}&name=${search}`,
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
        setUnfilteredStorages(data.data.storages);
        setStorages(data.data.storages);
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
        `http://localhost:8000/storage/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setStorages(data.data.storages);
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
    fetchStorages(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setStorages(unfilteredStorages);
        setTotalPages(
          unfilteredStorages.length > 0
            ? Math.ceil(unfilteredStorages.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredStorages, rowsPerPage]);

  const StorageDataMapper = (storage) => {
    return {
      CodItemConfiguracion: storage.cod_item_configuracion || "",
      Nombre: storage.name || "",
      ApplicationCode: storage.application_code || "",
      CostCenter: storage.cost_center || "",
      Activo: storage.active || "",
      Category: storage.category || "",
      Type: storage.type || "",
      Item: storage.item || "",
      Compañia: storage.company || "",
      OrganizacionResponsable: storage.organization_responsible || "",
      NombreHost: storage.host_name || "",
      Fabricante: storage.manufacturer || "",
      Estado: storage.status || "",
      Responsable: storage.owner || "",
      Modelo: storage.model || "",
      Serial: storage.serial || "",
      OrgMantenimiento: storage.org_maintenance || "",
      DireccionIP: storage.ip_address || "",
      CapacidadDiscoBytes: storage.disk_size || "",
      Sitio: storage.location || "",
      // Agrega aquí otros campos que necesites
    };
  };
  // Esta variable genera un archivo de excel con la información que se muestra en la vista principal
  const handleExport = () => {
    exportToExcel(storages, "storages", StorageDataMapper); //AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
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
      setSelectedStorages(new Set());
    } else {
      setSelectedStorages(new Set(storages.map((storage) => storage.id)));
    }
  };

  const toggleSelectStorages = (storageId) => {
    const newSelectedStorages = new Set(selectedStorages);
    if (newSelectedStorages.has(storageId)) {
      newSelectedStorages.delete(storageId);
    } else {
      newSelectedStorages.add(storageId);
    }
    setSelectedStorages(newSelectedStorages);
  };
  const filteredStorages = storages.filter((storage) =>
    storage.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;
  const handleDeleteStorage = async (storageId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este storage?",
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
                errorMessage = "El Storage no existe.";
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
            setStorages(storages.filter((storage) => storage.id !== storageId));
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
          <MdCloud /> Lista de Storages
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
              placeholder="Buscar storage..."
              value={searchValue}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <button
              className={style.searchIcon}
              onClick={handleSearchButtonClick}
            >
              <FaSearch className={style.iconS} />
            </button>
          </>
        )}
        {selectedCount > 0 && (
          <span className={style.selectedCount}>
            <span>{selectedCount}</span>
            <span>
              Storage{selectedCount !== 1 ? "es" : ""} Seleccionado
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
                    storages.length > 0 &&
                    selectedStorages.size === storages.length
                  }
                  onChange={toggleSelectAll}
                />
                {/* Modificar hacia abajo */}
              </th>
              <th>Nombre almacenamiento</th>
              <th>Nombre del host</th>
              <th>Modelo</th>
              <th>Dirección IP</th>
              <th className={style.contBtns}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredStorages.map((storage) => (
              <tr
                key={storage.id}
                className={
                  selectedStorages.has(storage.id) ? style.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedStorages.has(storage.id)}
                    onChange={() => toggleSelectStorages(storage.id)}
                  />
                </td>
                <td>{storage.name}</td>
                <td>{storage.host_name}</td>
                <td>{storage.model}</td>
                <td>{storage.ip_address}</td>
                <td>
                  <button
                    className={style.btnVer}
                    onClick={() => irVer(storage.id)}
                  >
                    <MdVisibility />
                  </button>

                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(storage.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => {
                      handleDeleteStorage(storage.id);
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
                    onChange={(e) =>
                      setRowsPerPage(parseInt(e.target.value, 10))
                    }
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
                  <span>{`${indexOfFirstServer + 1}-${Math.min(
                    indexOfLastServer,
                    filteredStorages.length
                  )} de ${filteredStorages.length}`}</span>
                </div>
              </td>
              <td className={style.contFilDos} colSpan="3">
                <div
                  className={`d-flex justify-content-end align-items-center ${style.tfootSmall}`}
                >
                  <Pagination className={style.pestanas}>
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
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

export default Storage;
