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
        navigate("/inveplus/login");
      }
    });
  };

  const showTimerNotification = () => {
    const minutes = Math.floor(remainingTime / 60); // Calcula los minutos
    const seconds = remainingTime % 60; // Calcula los segundos restantes

    Swal.fire({
      title: "Tiempo de sesión restante:",
      text: `${minutes} minuto${minutes !== 1 ? "s" : ""} y ${seconds} segundo${
        seconds !== 1 ? "s" : ""
      }`, // Ajusta la gramática
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onOpen: () => {
        const interval = setInterval(() => {
          const updatedMinutes = Math.floor(remainingTime / 60);
          const updatedSeconds = remainingTime % 60;
          Swal.update({
            text: `${updatedMinutes} minuto${
              updatedMinutes !== 1 ? "s" : ""
            } y ${updatedSeconds} segundo${updatedSeconds !== 1 ? "s" : ""}`,
          });
        }, 1000);
        return () => clearInterval(interval);
      },
    });
  };

  return (
    <nav className={Style.navbar}>
      <div className={Style.containerSecond}>
        <button className={Style.noti} onClick={showTimerNotification}>
          <IoIosNotifications />
        </button>
      </div>
      <div className={Style.container}>
        <button className={Style.hamburger} onClick={toggleSidebar}>
          <RiMenu4Fill className={Style.iconHam} />
        </button>
 
        <div className={Style.containerNameUser}>
          <p className={Style.userName}>{userName}</p>
        </div>
 
        <div className={Style.userContainer} onClick={toggleModal}>
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${userName}`}
            alt="user"
            className={Style.userIcon}
          />
        </div>
       
        {showModal && (
          <div className={Style.modalContent} onMouseEnter={() => setShowModal(true)}
          onMouseLeave={() => setShowModal(false)}>
            <ul className={Style.modalOptions}>
              <p className={Style.mailUser}>{userEmail}</p>
              <hr />
              <li onClick={() => navigate("/profile")}>Perfil</li>
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
}
export default Navegacion;
