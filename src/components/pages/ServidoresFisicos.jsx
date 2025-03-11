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
import { MdVisibility  } from "react-icons/md";

const ServidoresFisicos = () => {
  const [searchValue, setSearchValue] = useState("");
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServers, setSelectedServers] = useState(new Set());
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
              const tableMetadata =  [
                [
                  { name: "name", required: false, type:"string"},
                  { name: "brand", required: false, type:"string"},
                  { name: "model", required: false, type:"string"},
                  { name: "processor", required: false, type:"string"},
                  { name: "cpu_cores", required: false, type:"integer"},
                  { name: "ram", required: false, type:"integer"},
                  { name: "total_disk_size", required: false, type:"string"},
                  { name: "os_type", required: false, type:"string"},
                  { name: "os_version", required: false, type:"string"},
                  { name: "status", required: false, type:"string"},
                  { name: "role", required: false, type:"string"},
                  { name: "environment", required: false, type:"string"},
                  { name: "serial", required: false, type:"string"},
                  { name: "rack_id", required: false, type:"string"},
                  { name: "unit", required: false, type:"string"},
                  { name: "ip_address", required: false, type:"string"},
                  { name: "city", required: false, type:"string"},
                  { name: "location", required: false, type:"string"},
                  { name: "asset_id", required: false, type:"string"},
                  { name: "service_owner", required: false, type:"string"},
                  { name: "warranty_start_date", required: false, type:"date"},
                  { name: "warranty_end_date", required: false, type:"date"},
                  { name: "application_code", required: false, type:"string"},
                  { name: "responsible_evc", required: false, type:"string"},
                  { name: "domain", required: false, type:"string"},
                  { name: "subsidiary", required: false, type:"string"},
                  { name: "responsible_organization", required: false, type:"string"},
                  { name: "billable", required: false, type:"string"},
                  { name: "oc_provisioning", required: false, type:"string"},
                  { name: "oc_deletion", required: false, type:"string"},
                  { name: "oc_modification", required: false, type:"string"},
                  { name: "maintenance_period", required: false, type:"string"},
                  { name: "maintenance_organization", required: false, type:"string"},
                  { name: "cost_center", required: false, type:"string"},
                  { name: "billing_type", required: false, type:"string"},
                  { name: "comments", required: false, type:"string"}
                ]
                
               ]
            const importer = <ExcelImporter onImportComplete={handleImportComplete} tableMetadata={tableMetadata} />;
            if (container) {
            
               const root = createRoot(container)
                  root.render(importer)
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

  const handleImportComplete = (importedData) => {
    console.log("datos importados:", importedData); // Aqui tendrias tu data
    Swal.close();
  };

  const selectedCount = selectedServers.size;

  const [showSearch, setShowSearch] = useState(true);
  const [unfilteredServers, setUnfilteredServers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setShowSearch(selectedCount === 0);
  }, [selectedCount]);
  const irCrear = () => {
    navigate("/crear-servidores-f");
  };

  const irVer = (serverId) => {
    navigate(`/ver/${serverId}/servers`);
  };

  const irEditar = (serverId) => {
    navigate(`/editar/${serverId}/servidores`);
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

  const serverDataMapper = (server) => {
    return{
      "Nombre": server.name || "",
      "Marca": server.brand || "",
      "Modelo": server.model || "",
      "Procesador": server.processor || "",
      "Núcleos CPU": server.cpu_cores || "",
      "RAM": server.ram || "",
      "Tamaño Disco Total": server.total_disk_size || "",
      "Tipo de OS": server.os_type || "",
      "Versión de OS": server.os_version || "",
      "Estado": server.status || "",
      "Rol": server.role || "",
      "Entorno": server.environment || "",
      "Serial": server.serial || "",
      "Rack ID": server.rack_id || "",
      "Unidad": server.unit || "",
      "Dirección IP": server.ip_address || "",
      "Ciudad": server.city || "",
      "Ubicación": server.location || "",
      "ID de Activo": server.asset_id || "",
      "Propietario del Servicio": server.service_owner || "",
      "Fecha Inicio Garantía": server.warranty_start_date || "",
      "Fecha Fin Garantía": server.warranty_end_date || "",
      "Código de Aplicación": server.application_code || "",
      "Responsable EVC": server.responsible_evc || "",
      "Dominio": server.domain || "",
      "Sucursal": server.subsidiary || "",
      "Organización Responsable": server.responsible_organization || "",
      "Facturable": server.billable || "",
      "Provisionamiento OC": server.oc_provisioning || "",
      "Eliminación OC": server.oc_deletion || "",
      "Modificación OC": server.oc_modification || "",
      "Periodo de Mantenimiento": server.maintenance_period || "",
      "Organización de Mantenimiento": server.maintenance_organization || "",
      "Centro de Costos": server.cost_center || "",
      "Tipo de Facturación": server.billing_type || "",
      "Comentarios": server.comments || "",
  };
  };

  const handleExport = () => {
    exportToExcel(servers, "servidores_fisicos", serverDataMapper); //AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
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
    server.name.toLowerCase().includes(searchValue.toLowerCase())
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
      <div className={style.container}>
        <Table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th className={style.contChek}>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={
                    servers.length > 0 &&
                    selectedServers.size === servers.length
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
            {filteredServers.map((server) => (
              <tr
                key={server.id}
                className={
                  selectedServers.has(server.id) ? style.selectedRow : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedServers.has(server.id)}
                    onChange={() => toggleSelectServer(server.id)}
                  />
                </td>
                <td>{server.name}</td>
                <td>
                  <div className={style.serverStatus}>
                    <span
                      className={
                        server.status.toLowerCase() === "encendido"
                          ? style.online
                          : server.status.toLowerCase() === "mantenimiento"
                          ? style.maintenance
                          : style.offline
                      }
                    ></span>
                    {server.status}
                  </div>
                </td>
                <td>{server.serial}</td>
                <td>{server.ip_address}</td>
                <td>
                  <button 
                    className={style.btnVer}
                     onClick={() => irVer(server.id)}>
                    <MdVisibility  />
                  </button>

                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(server.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => {
                      handleDeleteServer(server.id);
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

export default ServidoresFisicos;
