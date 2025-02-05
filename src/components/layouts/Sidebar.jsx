import Style from "./sidebar.module.css";
import Logo from "./Logo";
import { NavLink, useNavigate } from "react-router-dom"; // Importamos useNavigate para el error 
import { VscServerEnvironment } from "react-icons/vsc";
import { GrHomeRounded } from "react-icons/gr";
import { FaServer } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { GiDatabase } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../routes/AuthContext";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Obtenemos la función navigate usando useNavigate

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("autenticacionToken");
        logout();
        navigate("/login"); // Usamos navigate para redireccionar
      }
    });
  };

  return (
    <div className={`${Style.sidebar} ${isOpen ? "" : Style.closed}`}>
      <ul>
        <Logo />
        <hr />
        <div className={Style.container}>
          <li className={Style.opcionUno}>
            <NavLink
              to="/analitica"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <GrHomeRounded className={Style.icon} />
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/servidoresf"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <FaServer className={Style.icon} />
              Fisicos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/servidoresv"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <VscServerEnvironment className={Style.icon} />
              Sucursales
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Base-De-Datos"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <GiDatabase className={Style.icon} />
              Base de datos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/storage"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <FaDatabase className={Style.icon} />
              Storage
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                isActive ? `${Style.links} active` : Style.links
              }
            >
              <FiUsers className={Style.icon} />
              Usuarios
            </NavLink>
          </li>
          <li>
            <hr className={Style.line} />
            <NavLink
              onClick={handleLogout}
              className={({ isActive }) =>
                isActive ? `${Style.btnLogout} active` : Style.links
              }
            >
              <CiLogout className={Style.icon} />
              Cerrar sesión
            </NavLink>
          </li>
        </div>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;