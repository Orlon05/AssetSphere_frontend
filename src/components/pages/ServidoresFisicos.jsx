import React, { useState, useEffect } from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { Table, Pagination, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./fisicos.module.css";

// Datos de los usuarios
const users = [
  {
    name: "Alcides Antonio",
    email: "alcides.antonio@devias.io",
    location: "Madrid, Comunidad de Madrid, Spain",
    phone: "908-691-3242",
  },
  {
    name: "Marcus Finn",
    email: "marcus.finn@devias.io",
    location: "Carson City, Nevada, USA",
    phone: "415-907-2647",
  },
  {
    name: "Jie Yan",
    email: "jie.yan.song@devias.io",
    location: "North Canton, Ohio, USA",
    phone: "770-635-2682",
  },
  {
    name: "Nasimiyu Danai",
    email: "nasimiyu.danai@devias.io",
    location: "Salt Lake City, Utah, USA",
    phone: "801-301-7894",
  },
  {
    name: "Iulia Albu",
    email: "iulia.albu@devias.io",
    location: "Murray, Utah, USA",
    phone: "313-812-8947",
  },
];

const ServidoresFisicos = () => {
  const [searchValue, setSearchValue] = useState(""); // Estado para el input de búsqueda
  const [filteredUsers, setFilteredUsers] = useState(users); // Estado para los usuarios filtrados
  const [selectAll, setSelectAll] = useState(false); // Estado para seleccionar todos
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Estado para filas por página
  const [selectedUsers, setSelectedUsers] = useState([]);
  // Función para alternar la selección de todos los usuarios
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]); // Deseleccionar todos
    } else {
      setSelectedUsers(users.map((_, index) => index)); // Seleccionar todos
    }
    setSelectAll(!selectAll); // Cambiar estado de selectAll
  };

  // Función para alternar la selección de un usuario específico
  const toggleSelectUser = (index) => {
    if (selectedUsers.includes(index)) {
      setSelectedUsers(selectedUsers.filter((i) => i !== index)); // Deseleccionar usuario
    } else {
      setSelectedUsers([...selectedUsers, index]); // Seleccionar usuario
    }
  };

  // Función para actualizar el valor de búsqueda
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Función para filtrar los usuarios
  const filterUsers = () => {
    const newFilteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(newFilteredUsers);
  };

  // Efecto para filtrar los usuarios cuando el valor de búsqueda cambia
  useEffect(() => {
    filterUsers();
  }, [searchValue]); // Depende del estado searchValue

  // Calcular los índices para la paginación
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  // const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Quitar esta línea
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className={style.container}>
      {/******************ENCABEZADO***************************/}
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaServer /> Lista de Servidores
        </h1>
        <button className={style.btnAdd}>
          <IoIosAdd className={style.icon} />
          Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} />
          Import
        </button>
        <button className={style.btnExport}>
          <CiExport className={style.icon} />
          Export
        </button>
      </div>
      {/*************************SEARCH*********************************/}
      <form className={style.searchContainer}>
        <input
          className={style.searchInput}
          type="search"
          placeholder="Buscar servidor..."
          aria-label="Buscar"
          value={searchValue} // Vincula al input de búsqueda
          onChange={handleSearchChange} // Actualiza el estado del input
        />
        <span className={style.searchIcon}>
          <CiSearch className={style.iconS} />
        </span>
      </form>
      {/*****************Tabla de Servidores **********************/}
      <div className={style.container}>
        <Table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(
              (
                user,
                index // Usa filteredUsers para la tabla
              ) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      className={style.customCheckbox}
                      checked={selectedUsers.includes(index)}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.location}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button className={style.btnVer}>
                      <GrFormViewHide/>
                    </button>
                    <button className={style.btnEdit}>
                      <MdEdit/>
                    </button>
                    <button className={style.btnDelete}>
                      <MdDelete/>
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <div
                  className={`d-flex justify-content-start align-items-center${style.tfootSmall}`}
                >
                  <span className={style.textfoot}>Filas por página:</span>
                  <Form.Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className={style.selectLine}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </Form.Select>
                </div>
              </td>
              <td colSpan="1">
                <div
                  className={`d-flex justify-content-center align-items-center${style.tfootSmall}`}
                >
                  <span>{`${indexOfFirstUser + 1}-${Math.min(
                    indexOfLastUser,
                    filteredUsers.length
                  )} of ${filteredUsers.length}`}</span>
                </div>
              </td>
              <td colSpan="3">
                <div
                  className={`d-flex justify-content-end align-items-center${style.tfootSmall}`}
                >
                  <Pagination className={style.pestanas}>
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
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
