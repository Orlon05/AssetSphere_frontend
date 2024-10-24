import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Style from './navegacion.module.css';
import { useNavigate } from "react-router-dom";
import { RiMenu4Fill } from "react-icons/ri";

const Navegacion = ({ toggleSidebar }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticationToken");
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      navigate("/login");
    }
  };

  return (
    <nav className={Style.navbar}>
      <div className={Style.container}>
        <button className={Style.hamburger} onClick={toggleSidebar}>
          <RiMenu4Fill className={Style.iconHam} />
        </button>
        <form className={Style.searchForm} role="search">
          <input
            className={Style.searchInput}
            type="search"
            placeholder="Buscar..."
            aria-label="Search"
          />
          <button className={Style.searchButton} type="submit">
            <CiSearch />
          </button>
        </form>
        {/* Imagen de usuario redonda */}
        <div className={Style.userContainer} onClick={toggleModal}>
          <img
            src="../../../public/imagenes/user.png" // Aquí puedes cambiar el enlace por tu imagen de usuario
            alt="user"
            className={Style.userIcon}
          />
        </div>

        {/* Modal pequeño que se despliega debajo de la imagen */}
        {showModal && (
          <div className={Style.modalContent}>
            <ul className={Style.modalOptions}>
              <p className={Style.mailUser}>Admin@ejemplo.com</p>
              <hr />
              <li>Perfil</li>
              <li>Configuraciones</li>
              <hr />
              <li className={Style.btnLogout} onClick={handleLogout}>
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navegacion;
