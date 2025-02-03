/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./fisicos.module.css";
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";

const BaseDatos = () => {
  const [searchValue, setSearchValue] = useState("");
  const [baseDatos, setBaseDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBaseDatos, setSelectedBaseDatos] = useState(new Set());
  const navigate = useNavigate();
  const { exportToExcel } = useExport();
  
  //USO DEL IMPORT
  const handleImport = () => {
    Swal.fire({
        title: 'Importar desde Excel',
        html: '<div id="excel-importer-container"></div>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
         width: '80%',
         height: '80%',
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
              const tableMetadata =  [
                { name: "instance_id", required: true, type:"string"},
                  { name: "cost_center", required: true, type:"string"},
                  { name: "category", required: true, type:"string"},
                 { name: "type", required: false, type:"string"},
                  { name: "item", required: false, type:"string"},
                  { name: "owner_contact", required: false, type:"string"},
                 { name: "name", required: false, type:"string"},
                 { name: "application_code", required: true, type:"string"},
                  { name: "inactive", required: true, type:"string"},
                { name: "asset_life_cycle_status", required: false, type:"string"},
                { name: "system_environment", required: false, type:"string"},
                 { name: "cloud", required: true, type:"string"},
                 { name: "version_number", required: true, type:"string"},
                { name: "serial", required: true, type:"string"},
                   { name: "ci_tag", required: true, type:"string"},
                 { name: "instance_name", required: true, type:"string"},
                   { name: "model", required: true, type:"string"},
                 { name: "ha", required: true, type:"string"},
                  { name: "port", required: false, type:"string"},
                  { name: "owner_name", required: false, type:"string"},
                   { name: "department", required: false, type:"string"},
                   { name: "company", required: false, type:"string"},
                   { name: "manufacturer_name", required: false, type:"string"},
                   { name: "supplier_name", required: false, type:"string"},
                   { name: "supported", required: false, type:"string"},
                   { name: "account_id", required: false, type:"string"},
                   { name: "create_date", required: false, type:"DateTime"},
                   { name: "modified_date", required: false, type:"DateTime"}
               ]
            const importer = <ExcelImporter onImportComplete={handleImportComplete} tableMetadata={tableMetadata} />;
            if (container) {
            
               const root = createRoot(container)
                  root.render(importer)
              }
      },
      willClose: () => {
         const container = document.getElementById("excel-importer-container");
           if(container){
         
               const root = createRoot(container)
                 root.unmount()
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
      title: "Base datos eliminada exitosamente",
    });
  };

    const handleImportComplete = (importedData) => {
        console.log("datos importados:", importedData); // Aqui tendrias tu data
        Swal.close();
    }

  const selectedCount = selectedBaseDatos.size;

  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredBaseDatos, setUnfilteredBaseDatos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);
  const irCrear = () => {
    navigate("/crear-BaseDatos-f");
  };
  const irEditar = (baseDatosId) => {
    navigate(`/editar/${baseDatosId}/BaseDatos`);
  };
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener base de datos:", error);
  };
  const token = localStorage.getItem("authenticationToken");
  const fetchBaseDatos = async (page, limit, search = "") => {
    if (isSearching) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/base_datos/get_all?page=${page}&limit=${limit}&name=${search}`,
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
        setUnfilteredBaseDatos(data.data.baseDatos);
        setBaseDatos(data.data.baseDatos);
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
        `http://localhost:8000/base_datos/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
        setBaseDatos(data.data.baseDatos);
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
    fetchBaseDatos(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    if (isSearchButtonClicked) {
      if (searchValue.trim() === "") {
        setBaseDatos(unfilteredBaseDatos);
        setTotalPages(
            unfilteredBaseDatos.length > 0
            ? Math.ceil(unfilteredBaseDatos.length / rowsPerPage)
            : 0
        );
      } else {
        setCurrentPage(1);
        fetchSearch(searchValue);
      }
      setIsSearchButtonClicked(false);
    }
  }, [isSearchButtonClicked, searchValue, unfilteredBaseDatos, rowsPerPage]);

  const baseDatosMapper = (baseDatos) => {
    return {
      "instance_id": baseDatos.instance_id || "",
      "cost_center": baseDatos.cost_center || "",
      "category": baseDatos.category || "",
      "type": baseDatos.type || "",
      "item": baseDatos.item || "",
      "owner_contact": baseDatos.owner_contact || "",
      "name": baseDatos.name || "",
      "application_code": baseDatos.application_code || "",
      "inactive": baseDatos.inactive || "",
      "asset_life_cycle_status": baseDatos.asset_life_cycle_status || "",
      "system_environment": baseDatos.system_environment || "",
      "cloud": baseDatos.cloud || "",
      "version_number": baseDatos.version_number || "",
      "serial": baseDatos.serial || "",
      "ci_tag": baseDatos.ci_tag || "",
      "instance_name": baseDatos.instance_name || "",
      "model": baseDatos.model || "",
      "ha": baseDatos.ha || "",
      "port": baseDatos.port || "",
      "owner_name": baseDatos.owner_name || "",
      "department": baseDatos.department || "",
      "company": baseDatos.company || "",
      "manufacturer_name": baseDatos.manufacturer_name || "",
      "supplier_name": baseDatos.supplier_name || "",
      "supported": baseDatos.supported || "",
      "account_id": baseDatos.account_id || "",
      "create_date": baseDatos.create_date || "",
      "modified_date": baseDatos.modified_date || ""
      // Agrega aquí otros campos que necesites
    };
  };

   const handleExport = () => {
    exportToExcel(baseDatos, "base_datos", baseDatosMapper);//AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
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
        setSelectedBaseDatos(new Set());
    } else {
        setSelectedBaseDatos(new Set(baseDatos.map((baseDatos) => baseDatos.id)));
    }
  };

  const toggleSelectBaseDatos = (baseDatosId) => {
    const newSelectedBaseDatos = new Set(selectedBaseDatos);
    if (newSelectedBaseDatos.has(baseDatosId)) {
        newSelectedBaseDatos.delete(baseDatosId);
    } else {
        newSelectedBaseDatos.add(baseDatosId);
    }
    setSelectedBaseDatos(newSelectedBaseDatos);
  };
  const filteredBaseDatos = baseDatos.filter((baseDatos) =>
    baseDatos.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastBaseDatos = currentPage * rowsPerPage;
  const indexOfFirstBaseDatos = indexOfLastBaseDatos - rowsPerPage;
  const handleDeleteBaseDatos = async (baseDatosId) => {
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
            `http://localhost:8000/base_datos/delete/${baseDatosId}`,
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
              title: "Error al eliminar la base de datos",
              text: errorMessage,
           });
          } else {
            setBaseDatos(baseDatos.filter((baseDatos) => baseDatos.id !== baseDatosId));
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaServer /> Lista de Base de datos
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
              placeholder="Buscar base de datos..."
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
              Base de datos{selectedCount !== 1 ? "es" : ""} Seleccionada
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
                    baseDatos.length > 0 &&
                    selectedBaseDatos.size === baseDatos.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>instance_id</th>
              <th>cost_center</th>
              <th>category</th>
              <th>type</th>
              <th className={style.contBtns}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {baseDatos.map((baseDatos) => (
              <tr
                key={baseDatos.id}
                className={
                    selectedBaseDatos.has(baseDatos.id) ? style.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedBaseDatos.has(baseDatos.id)}
                    onChange={() => toggleSelectBaseDatos(baseDatos.id)}
                  />
                </td>
                <td>{baseDatos.instance_id}</td>
                <td>
                  {/* <div className={style.serverStatus}>
                    <span
                      className={
                        baseDatos.status.toLowerCase() === "encendido"
                          ? style.online
                          : baseDatos.status.toLowerCase() === "mantenimiento"
                          ? style.maintenance
                          : style.offline
                      }
                    ></span>
                    {baseDatos.status}
                  </div> */}
                </td>
                <td>{baseDatos.cost_center}</td>
                <td>{baseDatos.category}</td>
                <td>{baseDatos.type}</td>
                <td>
                  <button className={style.btnVer} onClick={() => {}}>
                    <GrFormViewHide />
                  </button>
                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(baseDatos.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => {
                      handleDeleteBaseDatos(baseDatos.id);
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
                  <span>{`${indexOfFirstBaseDatos + 1}-${Math.min(
                    indexOfLastServer,
                    filteredBaseDatos.length
                  )} de ${filteredBaseDatos.length}`}</span>
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

export default BaseDatos;
