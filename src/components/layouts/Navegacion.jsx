import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { RiMenu4Fill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { useAuth } from "../routes/AuthContext";
import SessionTimerNotification from "../popups/SessionTimerNotification";
import Style from "./navegacion.module.css";
import Swal from "sweetalert2";

const Navegacion = ({ toggleSidebar }) => {
  const [showNotification, setShowNotification] = useState(false);
  const storedUserInfo = localStorage.getItem("userInfo");
  const [userName, setUserName] = useState("Usuario");
  const [userEmail, setUserEmail] = useState("Email");
  const [errorLoadingUser, setErrorLoadingUser] = useState(false);

  useEffect(() => {
    if (storedUserInfo) {
      try {
        const userInfo = JSON.parse(storedUserInfo);
        setUserName(userInfo.name);
        setUserEmail(userInfo.email);
      } catch (error) {
        console.error("Error al parsear userInfo:", error);
        setErrorLoadingUser(true);
      }
    }
  }, [storedUserInfo]);

  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { remainingTime } = useAuth();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
        localStorage.removeItem("authenticationToken");
        logout();
        navigate("/login");
      }
    });
  };

  const showTimerNotification = () => {
    setShowNotification(true);
  };

  const closeNotification = () => {
    setShowNotification(false);
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
          <button className={Style.noti} onClick={showTimerNotification}>
            <IoIosNotifications />
          </button>
        </form>
        <div className={Style.containerNameUser}>
          <p className={Style.userName}>{userName}</p>
        </div>
        <div className={Style.userContainer} onClick={toggleModal}>
          <img
            src="../../../public/imagenes/user.png"
            alt="user"
            className={Style.userIcon}
          />
        </div>
        {showModal && (
          <div className={Style.modalContent}>
            <ul className={Style.modalOptions}>
              <p className={Style.mailUser}>{userEmail}</p>
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
        {showNotification && (
          <SessionTimerNotification
            remainingTime={remainingTime}
            onClose={closeNotification}
          />
        )}
      </div>
    </nav>
  );
};

export default Navegacion;
