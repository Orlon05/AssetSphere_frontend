import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Style from './navegacion.module.css';
import { useNavigate } from "react-router-dom";
import { RiMenu4Fill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import Swal from "sweetalert2";
import { useAuth } from "../routes/ProtectedRoute"; 

const Navegacion = ({ toggleSidebar }) => {
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
        localStorage.removeItem("autenticacionToken");
        navigate("/login");
      }
    });
  };

  const showRemainingTime = () => {
    if (remainingTime) {
      const secondsLeft = Math.floor(remainingTime / 1000);
      const minutesLeft = Math.floor(secondsLeft / 60);
      const hoursLeft = Math.floor(minutesLeft / 60);
      const daysLeft = Math.floor(hoursLeft / 24);

      const timeLeftString = `${daysLeft} días, ${hoursLeft % 24} horas, ${minutesLeft % 60} minutos`;

      Swal.fire({
        title: 'Tiempo de sesión restante:',
        text: timeLeftString,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el tiempo de sesión restante',
        icon: 'error'
      });
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
          <button className={Style.noti} onClick={showRemainingTime}>
            <IoIosNotifications/>
          </button>
        </form>
        <div className={Style.containerNameUser}>
          <p className={Style.userName}>Administrador</p>
        </div>
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
