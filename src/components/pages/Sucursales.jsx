/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
// Iconos
import { MdCloud } from "react-icons/md";
// Iconos
import { IoIosAdd } from "react-icons/io";
//
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
// Iconos
import { MdVisibility } from "react-icons/md";
//
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
// Estilos
import style from "./sucursal.module.css";
//
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";
import React from "react";

const Sucursales = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSucursales, setSelectedSucursales] = useState(new Set());
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
          { name: "brand", required: true, type: "string" },
          { name: "model", required: true, type: "string" },
          { name: "processor", required: true, type: "string" },
          { name: "cpu_cores", required: true, type: "string" },
          { name: "ram", required: true, type: "string" },
          { name: "total_disk_size", required: true, type: "string" },
          { name: "os_type", required: true, type: "string" },
          { name: "os_version", required: true, type: "string" },
          { name: "status", required: true, type: "string" },
          { name: "role", required: true, type: "string" },
          { name: "environment", required: true, type: "string" },
          { name: "serial", required: true, type: "string" },
          { name: "rack_id", required: true, type: "string" },
          { name: "unit", required: true, type: "string" },
          { name: "ip_address", required: true, type: "string" },
          { name: "city", required: true, type: "string" },
          { name: "location", required: true, type: "string" },
          { name: "asset_id", required: true, type: "string" },
          { name: "service_owner", required: true, type: "string" },
          { name: "warranty_start_date", required: true, type: "string" },
          { name: "warranty_end_date", required: true, type: "string" },
          { name: "application_code", required: true, type: "string" },
          { name: "responsible_evc", required: true, type: "string" },
          { name: "domain", required: true, type: "string" },
          { name: "subsidiary", required: true, type: "string" },
          { name: "responsible_organization", required: true, type: "string" },
          { name: "billable", required: true, type: "string" },
          { name: "oc_provisioning", required: true, type: "string" },
          { name: "oc_deletion", required: true, type: "string" },
          { name: "oc_modification", required: true, type: "string" },
          { name: "maintenance_period", required: true, type: "string" },
          { name: "maintenance_organization", required: true, type: "string" },
          { name: "cost_center", required: true, type: "string" },
          { name: "billing_type", required: true, type: "string" },
          { name: "branch_code", required: true, type: "string" },
          { name: "branch_name", required: true, type: "string" },
          { name: "region", required: true, type: "string" },
          { name: "department", required: true, type: "string" },
          { name: "comments", required: true, type: "string" },
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
      title: "Sucursal eliminado exitosamente",
    });
  };

  //La variable handleImportComplete es la que se encarga de tomar/mapear la información al importar el archivo de excel.
  const handleImportComplete = async (importedData) => {
    console.log("Datos importados listos para enviar:", importedData);

    if (!Array.isArray(importedData) || importedData.length === 0) {
      Swal.fire("Error", "No se encontraron datos válidos en el archivo", "error");
      return;
    }

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }
      // Se deben colocar todas las propiedades/campos de la tabla a la cual se le este haciendo la vista a excepción de la clave prinaria, dicho campo no debe ir aquí
      const formattedData = importedData.map(row => ({
        name: row.name || "",
        brand: row.brand || "",
        model: row.model || "",
        processor: row.processor || "",
        cpu_cores: row.cpu_cores || "",
        ram: row.ram || "",
        total_disk_size: row.total_disk_size || "",
        os_type: row.os_type || "",
        os_version: row.os_version || "",
        status: row.status || "",
        role: row.role || "",
        environment: row.environment || "",
        serial: row.serial || "",
        rack_id: row.rack_id || "",
        unit: row.unit || "",
        ip_address: row.ip_address || "",
        city: row.city || "",
        location: row.location || "",
        asset_id: row.asset_id || "",
        service_owner: row.service_owner || "",
        warranty_start_date: row.warranty_start_date || "",
        warranty_end_date: row.warranty_end_date || "",
        application_code: row.application_code || "",
        responsible_evc: row.responsible_evc || "",
        domain: row.domain || "",
        subsidiary: row.subsidiary || "",
        responsible_organization: row.responsible_organization || "",
        billable: row.billable || "",
        oc_provisioning: row.oc_provisioning || "",
        oc_deletion: row.oc_deletion || "",
        oc_modification: row.oc_modification || "",
        cost_center: row.cost_center || "",
        billing_type: row.billing_type || "",
        branch_code: row.branch_code || "",
        branch_name: row.branch_name || "",
        region: row.region || "",
        department: row.department || "",
        comments: row.comments || ""
      }));
      // Aquí se debe colocar la ruta del back-end que recibe la información del excel y la inserta en la BD
      const response = await fetch("http://localhost:8000/sucursales/add_from_excel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      Swal.fire("Éxito", "Datos importados correctamente", "success");
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire("Error", error.message || "Error al importar datos", "error");
    }
  };


  const selectedCount = selectedSucursales.size;

  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredSucursales, setUnfilteredSucursales] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);
  const irCrear = () => {
    navigate("/crear-sucursales");
  };
  const irVer = (sucursalId) => {
    navigate(`/ver/${sucursalId}/sucursales`);
  };
  const irEditar = (sucursalId) => {
    navigate(`/editar/${sucursalId}/sucursales`);
  };
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener los sucursales:", error);
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
        setUnfilteredSucursales(data.data.sucursales);
        setSucursales(data.data.sucursales);
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
        `http://localhost:8000/sucursales/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setSucursales(data.data.sucursales);
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
        setSucursales(unfilteredSucursales);
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

  const SucursalDataMapper = (sucursal) => {
    return {
      "name": sucursal.name || "",
      "brand": sucursal.brand || "",
      "model": sucursal.model || "",
      "processor": sucursal.processor || "",
      "cpu_cores": sucursal.cpu_cores || "",
      "ram": sucursal.ram || "",
      "total_disk_size": sucursal.total_disk_size || "",
      "os_type": sucursal.os_type || "",
      "os_version": sucursal.os_version || "",
      "status": sucursal.status || "",
      "role": sucursal.role || "",
      "environment": sucursal.environment || "",
      "serial": sucursal.serial || "",
      "rack_id": sucursal.rack_id || "",
      "unit": sucursal.unit || "",
      "ip_address": sucursal.ip_address || "",
      "city": sucursal.city || "",
      "location": sucursal.location || "",
      "asset_id": sucursal.asset_id || "",
      "service_owner": sucursal.service_owner || "",
      "warranty_start_date": sucursal.warranty_start_date || "",
      "warranty_end_date": sucursal.warranty_end_date || "",
      "application_code": sucursal.application_code || "",
      "responsible_evc": sucursal.responsible_evc || "",
      "domain": sucursal.domain || "",
      "subsidiary": sucursal.subsidiary || "",
      "responsible_organization": sucursal.responsible_organization || "",
      "billable": sucursal.billable || "",
      "oc_deletion": sucursal.oc_deletion || "",
      "oc_modification": sucursal.oc_modification || "",
      "maintenance_period": sucursal.maintenance_period || "",
      "maintenance_organization": sucursal.maintenance_organization || "",
      "cost_center": sucursal.cost_center || "",
      "billing_type": sucursal.billing_type || "",
      "branch_code": sucursal.branch_code || "",
      "branch_name": sucursal.branch_name || "",
      "region": sucursal.region || "",
      "department": sucursal.department || "",
      "comments": sucursal.comments || "",
      // Agrega aquí otros campos que necesites
    };
  };
  // Esta variable genera un archivo de excel con la información que se muestra en la vista principal
  const handleExport = () => {
    exportToExcel(sucursales, "sucursales", SucursalDataMapper); //AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
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
        setSelectedSucursales(new Set());
    } else {
        setSelectedSucursales(new Set(sucursales.map((sucursal) => sucursal.id)));
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
  const filteredSucursales = sucursales.filter((sucursal) =>
    sucursal.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;
  const handleDeleteStorage = async (sucursalId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este sucursal?",
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
            setSucursales(sucursales.filter((sucursal) => sucursal.id !== sucursalId));
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
          <MdCloud /> Lista de sucursales
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
        className={`${style.searchContainer} ${selectedCount > 0 ? style.searchContainerSelected : ""
          }`}
      >
        {showSearch && (
          <>
            <input
              className={style.searchInput}
              type="search"
              placeholder="Buscar sucursal..."
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
              sucursal{selectedCount !== 1 ? "es" : ""} Seleccionado
              {selectedCount !== 1 ? "s" : ""}
            </span>
          </span>
        )}
      </div>
      <div className={style.container}>
        <Table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th className={style.contChek}>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={
                    sucursales.length > 0 &&
                    selectedSucursales.size === sucursales.length
                  }
                  onChange={toggleSelectAll}
                />
                {/* Modificar hacia abajo */}
              </th>
              <th>Name</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Processor</th>
              <th className={style.contBtns}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.map((sucursal) => (
              <tr
                key={sucursal.id}
                className={
                    selectedSucursales.has(sucursal.id) ? style.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedSucursales.has(sucursal.id)}
                    onChange={() => toggleSelectSucursal(sucursal.id)}
                  />
                </td>
                <td>{sucursal.name}</td>
                <td>{sucursal.brand}</td>
                <td>{sucursal.model}</td>
                <td>{sucursal.processor}</td>
                <td>
                  <button
                    className={style.btnVer}
                    onClick={() => irVer(sucursal.id)}>
                    <MdVisibility />
                  </button>

                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(sucursal.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => {
                      handleDeleteStorage(sucursal.id);
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
                    filteredSucursales.length
                  )} de ${filteredSucursales.length}`}</span>
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
    </div>
  );
};

export default Sucursales;
