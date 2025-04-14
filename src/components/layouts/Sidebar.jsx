import { lazy, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import Style from './sidebar.module.css';
import Logo from './Logo';
import { GrHomeRounded } from 'react-icons/gr';
import { FaServer, FaDatabase, FaStore } from 'react-icons/fa';
import { MdCloud } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { CiLogout } from 'react-icons/ci';
import { VscSaveAll } from 'react-icons/vsc';
import { EnrutadorApp } from '../routes/EnrutadorApp';

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Mapeo de rutas disponibles para el sidebar
  const sidebarRoutes = useMemo(() => [
    { path: 'analitica', name: 'Inicio', icon: GrHomeRounded },
    { path: 'servidoresf', name: 'Fisicos', icon: FaServer },
    { path: 'servidoresv', name: 'Virtuales', icon: FaServer },
    { path: 'sucursales', name: 'Sucursales', icon: FaStore },
    { path: 'Base-De-Datos', name: 'Base de datos', icon: FaDatabase },
    { path: 'storage', name: 'Storage', icon: MdCloud },
    { path: 'pseries', name: 'Pseries', icon: VscSaveAll },
    { path: 'usuarios', name: 'Usuarios', icon: FiUsers }
  ], []);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('autenticacionToken');
        logout();
        navigate('/inveplus/login');
      }
    });
  };

  // Verificar si una ruta existe en el enrutador principal
  const routeExists = (path) => {
    const dashboardRoutes = EnrutadorApp.find(route => route.path === '/inveplus/')?.children || [];
    return dashboardRoutes.some(route => route.path === path);
  };

  return (
    <div className={`${Style.sidebar} ${isOpen ? '' : Style.closed}`}>
      <ul>
        <Logo />
        <hr />
        <div className={Style.container}>
          {sidebarRoutes.map((route) => (
            routeExists(route.path) && (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    isActive ? `${Style.links} active` : Style.links
                  }
                >
                  <route.icon className={Style.icon} />
                  {route.name}
                </NavLink>
              </li>
            )
          ))}
          
          <li>
            <hr className={Style.line} />
            <button 
              onClick={handleLogout}
              className={Style.links}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <CiLogout className={Style.icon} />
              Cerrar sesión
            </button>
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