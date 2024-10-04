import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import style from "./login.module.css";
import PopupError from "../popups/PopupError";

const Login = () => {
  //estado para manejar el correo y la contraseña
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //estado para mostrar el modal de error
  const [modalError, setModalError] = useState(false);

  //simulación de autenticación
  const envioSesion = (e) => {
    e.preventDefault();

    if (email === "admin@correo.com" && password === "password123") {
      //guardar un token de auth
      localStorage.setItem("authToken", "123456");
      navigate("/"); //redirigir al dashboard
    } else {
      setModalError(true); //mostrar modal de error
    }
  };

  //función para cerrar el modal de error
  const cerrarModalError = () => {
    setModalError(false);
  };

  return (
    <div className={style.container}>
      {/*/MOSTRAR MODAL ERROR SI ESTA ACTIVADO */}
      {modalError && <PopupError onClose={cerrarModalError} />}
      <div className={style.screen}>
        <div className={style.screenContent}>
          <form className={style.login} onSubmit={envioSesion}>
            <div className={style.loginField}>
              <span className={style.loginIcon}>
                <FaUser />
              </span>
              <input
                type="email"
                className={style.loginInput}
                placeholder="Usuario / Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}// actualiza el estado 'EMAIL' cuando cambia el valor
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
            <button className={style.loginSubmit}>
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
