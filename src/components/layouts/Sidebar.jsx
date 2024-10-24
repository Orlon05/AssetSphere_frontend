import React from "react";
import Style from './sidebar.module.css';
import Logo from "./Logo";
import { NavLink } from 'react-router-dom';
import { VscServerEnvironment } from "react-icons/vsc";
import { GrHomeRounded } from "react-icons/gr";
import { FaServer } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";


const Sidebar = ({ isOpen }) => {

    const handleLogout = () => {
        localStorage.removeItem("authenticationToken");
        if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
          navigate("/login");
        }
      };

    return (
        <div className={`${Style.sidebar} ${isOpen ? '' : Style.closed}`}>
            <ul>
                <Logo />
                <hr />
                <li>
                    <NavLink to="/analitica" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <GrHomeRounded className={Style.icon}/>Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/servidoresf" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <FaServer className={Style.icon}/>Fisicos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/servidoresv" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <VscServerEnvironment className={Style.icon}/>Virtuales
                    </NavLink>
                </li>
                <li>
                    <NavLink onClick={handleLogout} className={({ isActive }) => isActive ? `${Style.btnLogout} active` : Style.links}>
                        <CiLogout className={Style.icon}/>Cerrar sesión
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
