import React, { useState, useEffect, useRef } from "react";
import style from "./usuarios.module.css";
import { FiUsers } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { FaFileAlt } from 'react-icons/fa';
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import UserList from "../cards/UserList";


const Usuarios = () => {
  const navigate = useNavigate();

  const [usersData, setUsersData] = useState([]);

  const irCrear = () => {
    navigate("/crear-usuarios");
  };
  const irLogs = () => {
    navigate("/ver-logs");
  };

  //FUNCION PARA EXPORTAR
  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, "usuarios.xlsx");
    } catch (error) {
      console.error("Error al exportar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al exportar",
        text: error.message,
      });
    }
  };

  const token = localStorage.getItem("authenticationToken");
  useEffect(() => {
    try {
      fetch(`http://localhost:8000/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) =>
        res.json().then((data) => setUsersData(data.data.users))
      );
    } catch {
      console.log("Error"); 
    }
  }, [token]);
  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FiUsers /> Lista de Usuarios
        </h1>
        <button className={style.btnIrLogs} onClick={irLogs}>
          <FaFileAlt className={style.icon} /> Logs
        </button>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} /> Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} /> Importar
        </button>
        <button className={style.btnExport} onClick={handleExport}>
          <CiExport className={style.icon} /> Exportar
        </button>
      </div>
      <div className={style.searchContainer}>
        <>
          <input
            className={style.searchInput}
            type="search"
            placeholder="Buscar usuario..."
          />
          <span className={style.searchIcon}>
            <CiSearch className={style.iconS} />
          </span>
        </>
      </div>
      <UserList users={usersData} /> {/* Renderiza la lista de usuarios */}
    </div>
  );
};

export default Usuarios;
