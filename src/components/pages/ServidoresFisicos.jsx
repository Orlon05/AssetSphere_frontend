import React, { useState, useEffect } from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./fisicos.module.css";

const ServidoresFisicos = () => {
  const [searchValue, setSearchValue] = useState(""); // Valor de búsqueda
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Por defecto, 10 servidores por página
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServers, setSelectedServers] = useState(new Set());

  const navigate = useNavigate();

  const irCrear = () => {
    navigate("/crear-servidores-f");
  };

  const irEditar = (id) => {
    navigate(`/editar-servidores-f/${id}`);
  };

  const fetchServers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical/search?name=${searchValue}&page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authenticationToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al obtener servidores";
        if (errorData.detail) {
          errorMessage = Array.isArray(errorData.detail)
            ? errorData.detail.map((e) => e.msg).join(", ")
            : errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = `Error HTTP: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        setServers(data.data.servers || []);
        setTotalPages(data.data.total_pages || 0); // Usamos total_pages para calcular el total de páginas
      } else {
        setServers([]);
        setTotalPages(0);
        setError(new Error("Respuesta inesperada de la API"));
        console.error("Respuesta de la API inesperada:", data);
      }
    } catch (error) {
      setError(error);
      console.error("Error al obtener servidores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [currentPage, rowsPerPage, searchValue]); // Dependemos de currentPage, rowsPerPage y searchValue para volver a cargar los datos

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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastServer = currentPage * rowsPerPage;
  const indexOfFirstServer = indexOfLastServer - rowsPerPage;
  const currentServers = filteredServers.slice(indexOfFirstServer, indexOfLastServer);

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
        <button className={style.btnImport}>
          <CiImport className={style.icon} /> Importar
        </button>
        <button className={style.btnExport}>
          <CiExport className={style.icon} /> Exportar
        </button>
      </div>
      <form className={style.searchContainer}>
        <input
          className={style.searchInput}
          type="search"
          placeholder="Buscar servidor..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        <span className={style.searchIcon}>
          <CiSearch className={style.iconS} />
        </span>
      </form>
      <div className={style.container}>
        <Table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={servers.length > 0 && selectedServers.size === servers.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Servidor</th>
              <th>Estado</th>
              <th>Serial</th>
              <th>IP</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentServers.map((server) => (
              <tr key={server.id}>
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedServers.has(server.id)}
                    onChange={() => toggleSelectServer(server.id)}
                  />
                </td>
                <td>{server.name}</td>
                <td>{server.status}</td>
                <td>{server.serial}</td>
                <td>{server.ip_address}</td>
                <td>
                  <button className={style.btnVer} onClick={() => {}}>
                    <GrFormViewHide />
                  </button>
                  <button className={style.btnEdit} onClick={() => irEditar(server.id)}>
                    <MdEdit />
                  </button>
                  <button className={style.btnDelete} onClick={() => {}}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <div className={`d-flex justify-content-start align-items-center ${style.tfootSmall}`}>
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
                <div className={`d-flex justify-content-center align-items-center ${style.tfootSmall}`}>
                  <span>{`${indexOfFirstServer + 1}-${Math.min(indexOfLastServer, filteredServers.length)} de ${filteredServers.length}`}</span>
                </div>
              </td>
              <td colSpan="3">
                <div className={`d-flex justify-content-end align-items-center ${style.tfootSmall}`}>
                  <Pagination className={style.pestanas}>
                    <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
                    <Pagination.Item>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
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
