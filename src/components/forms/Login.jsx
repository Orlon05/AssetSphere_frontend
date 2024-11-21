import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import style from "./login.module.css";
import PopupError from "../popups/PopupError";
import Loader from "../layouts/Loader";

const Login = () => {
  //estado para manejar el correo y la contraseña
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  //estado para mostrar el modal de error
  const [modalError, setModalError] = useState(false);

  // Función para logearse
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        setMessage("Inicio de sesión exitoso");
        localStorage.setItem("authenticationToken",data.data.accessToken); // Guardar token de manera local

        // Decodificar el token para obtener el tipo de usuario
        const decodedToken = jwtDecode(data.data.accessToken);
        console.log("Token decodificado:", decodedToken);

        // LIMPIAR CAMPOS DESPUES DEL INICIO DE SESION
        setUsername("");
        setPassword("");
        setIsLoading(true);

        setTimeout(() => {
          navigate("/"); // Redirige al dashboard
        }, 1500); // Tiempo de espera en milisegundos (1.5 segundos)

        setTimeout(() => {
          setIsLoading(false);
        }, 2500); // Tiempo de espera en milisegundos (2.5 segundos)
      } else {
        setMessage(data.msg || "Error al iniciar sesión");
        setShowErrorPopup(true);
        console.error("Error al iniciar sesión:", data.msg);
      }
    } catch (error) {
      handleError(error);
    }
  };

  //función para cerrar el modal de error
  const cerrarModalError = () => {
    setModalError(false);
  };

  return (
    <div className={style.container}>
      {isLoading && <Loader />}
      {/*/MOSTRAR MODAL ERROR SI ESTA ACTIVADO */}
      {modalError && <PopupError onClose={cerrarModalError} />}
      <div className={style.screen}>
        <div className={style.screenContent}>
          <form className={style.login} onSubmit={handleLoginSubmit}>
            <div className={style.loginField}>
              <span className={style.loginIcon}>
                <FaUser />
              </span>
              <input
                type="user"
                className={style.loginInput}
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
               />
            </div>
            <div className={style.loginField}>
              <span className={style.loginIcon}>
                <FaLock />
              </span>
              <input
                type="password"
                className={style.loginInput}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} //actualiza el estado 'PASSWORD' cuando cambia el valor
                required
              />
            </div>
            <button type="submit" className={style.loginSubmit}>
              <span>Iniciar Sesión</span>
              <span className={style.buttonIcon}>
                <IoIosArrowForward />
              </span>
            </button>
          </form>
          <div className={style.socialLogin}>
            <img
              className={style.socialLoginIcon}
              src="/src/assets/tcs_logo.png"
              alt="logo TATA"
            />
          </div>
        </div>
        <div className={style.screenBackground}>
          <span
            className={`${style.screenBackgroundShape} ${style.screenBackgroundShape4}`}
          ></span>
          <span
            className={`${style.screenBackgroundShape} ${style.screenBackgroundShape3}`}
          ></span>
          <span
            className={`${style.screenBackgroundShape} ${style.screenBackgroundShape2}`}
          ></span>
          <span
            className={`${style.screenBackgroundShape} ${style.screenBackgroundShape1}`}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
