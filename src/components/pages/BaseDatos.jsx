/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./fisicos.module.css";
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";

const BaseDatos = () => {
  const [searchValue, setSearchValue] = useState("");
  const [base_datos, setBaseDatos] = useState([]);
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
          { name: "instance_id", required: true, type: "string" },
          { name: "cost_center", required: true, type: "string" },
          { name: "category", required: true, type: "string" },
          { name: "type", required: false, type: "string" },
          { name: "item", required: false, type: "integer" },
          { name: "ram", required: false, type: "integer" },
          { name: "owner_contact", required: false, type: "string" },
          { name: "name", required: true, type: "string" },
          { name: "application_code", required: true, type: "string" },
          { name: "inactive", required: false, type: "string" },
          { name: "asset_life_cycle_status", required: false, type: "string" },
          { name: "system_environment", required: true, type: "string" },
          { name: "cloud", required: true, type: "string" },
          { name: "version_number", required: true, type: "string" },
          { name: "serial", required: true, type: "string" },
          { name: "ci_tag", required: true, type: "string" },
          { name: "instance_name", required: true, type: "string" },
          { name: "model", required: true, type: "string" },
          { name: "ha", required: false, type: "string" },
          { name: "port", required: false, type: "string" },
          { name: "owner_name", required: false, type: "string" },
          { name: "department", required: false, type: "string" },
          { name: "company", required: false, type: "string" },
          { name: "manufacturer_name", required: false, type: "string" },
          { name: "supplier_name", required: false, type: "string" },
          { name: "supported", required: false, type: "string" },
          { name: "account_id", required: false, type: "string" },
          { name: "create_date", required: false, type: "string" },
          { name: "modified_date", required: false, type: "string" },
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
      title: "Base de datos eliminada exitosamente",
    });
  };

  const handleImportComplete = (importedData) => {
    console.log("datos importados:", importedData); // Aqui tendrias tu data
    Swal.close();
  };

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
    navigate("/crear-servidores-f");
  };
  const irEditar = (BaseDatosId) => {
    navigate(`/editar/${BaseDatosId}/servidores`);
  };
  const handleError = (error) => {
    setError(error);
    console.error("Error al obtener servidores:", error);
  };
  const token = localStorage.getItem("authenticationToken");
  const fetchBasesDatos = async (page, limit, search = "") => {
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
        setUnfilteredBaseDatos(data.data.base_datos);
        setBaseDatos(data.data.base_datos);
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
        setBaseDatos(data.data.base_datos);
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
    fetchBasesDatos(currentPage, rowsPerPage);
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

  const BaseDatosDataMapper = (base_datos) => {
    return {
      "Id Instancia": base_datos.instance_id || "",
      "Centro de Costo": base_datos.cost_center || "",
      "Categoría": base_datos.category || "",
      "Tipo": base_datos.type || "",
      "ítem": base_datos.item || "",
      "Contacto": base_datos.owner_contact || "",
      "Nombre": base_datos.name || "",
      "Código de aplicación": base_datos.application_code || "",
      "Inactivo": base_datos.inactive || "",
      "Rol": base_datos.asset_life_cycle_status || "",
      "Entorno": base_datos.system_environment || "",
      "Serial": base_datos.cloud || "",
      "Número de versión": base_datos.version_number || "",
      "Serial": base_datos.serial || "",
      "Dirección IP": base_datos.ci_tag || "",
      "Nombre de Instancia": base_datos.instance_name || "",
      "Modelo": base_datos.model || "",
      "Habilitador": base_datos.ha || "",
      "Puerto": base_datos.port || "",
      "Propietario": base_datos.owner_name || "",
      "Departamento": base_datos.department || "",
      "Comentarios": base_datos.company || "",
      "Comentarios": base_datos.manufacturer_name || "",
      "Comentarios": base_datos.supplier_name || "",
      "Comentarios": base_datos.supported || "",
      "Id cuenta": base_datos.account_id || "",
      "Fecha de Creacion": base_datos.create_date || "",
      "Fecha de Modificacion": base_datos.modified_date || "",
      // Agrega aquí otros campos que necesites
    };
  };

  const handleExport = () => {
    exportToExcel(bases_datos, "base_datos", BaseDatosDataMapper); //AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
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
      setSelectedBaseDatos(
        new Set(bases_datos.map((base_datos) => base_datos.id))
      );
    }
  };

  const toggleSelectBaseDatos = (BaseDatosId) => {
    const newSelectedBaseDatos = new Set(selectedBaseDatos);
    if (newSelectedBaseDatos.has(BaseDatosId)) {
      newSelectedBaseDatos.delete(BaseDatosId);
    } else {
      newSelectedBaseDatos.add(BaseDatosId);
    }
    setSelectedBaseDatos(newSelectedBaseDatos);
  };
  const filteredServers = base_datos.filter((BaseDatos) =>
    BaseDatos.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;
  const handleDeleteServer = async (BaseDatosId) => {
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
            `http://localhost:8000/base_datos/delete/${Id}`,
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
            setBaseDatos(
              base_datos.filter((BaseDatos) => BaseDatos.id !== BaseDatosId)
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
                    base_datos.length > 0 &&
                    selectedBaseDatos.size === base_datos.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Servidor</th>
              <th>Estado</th>
              <th>Serial</th>
              <th>IP</th>
              <th className={style.contBtns}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {base_datos.map((BaseDatos) => (
              <tr
                key={BaseDatos.id}
                className={
                  selectedBaseDatos.has(BaseDatos.id) ? style.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedBaseDatos.has(BaseDatos.id)}
                    onChange={() => toggleSelectBaseDatos(BaseDatos.id)}
                  />
                </td>
                <td>{BaseDatos.name}</td>
                <td>
                  <div className={style.serverStatus}>
                    <span
                      className={
                        BaseDatos.status.toLowerCase() === "encendido"
                          ? style.online
                          : BaseDatos.status.toLowerCase() === "mantenimiento"
                          ? style.maintenance
                          : style.offline
                      }
                    ></span>
                    {BaseDatos.status}
                  </div>
                </td>
                <td>{BaseDatos.serial}</td>
                <td>{BaseDatos.ip_address}</td>
                <td>
                  <button className={style.btnVer} onClick={() => {}}>
                    <GrFormViewHide />
                  </button>
                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(BaseDatos.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => {
                      handleDeleteServer(BaseDatos.id);
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
                    filteredServers.length
                  )} de ${filteredServers.length}`}</span>
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
