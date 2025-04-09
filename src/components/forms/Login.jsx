/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import style from "./login.module.css";
import PopupError from "../popups/PopupError";
import Loader from "../layouts/Loader";
import { useAuth } from "../routes/AuthContext";

const Login = () => {
  const user = useAuth();
  //estado para manejar el correo y la contraseña
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //estado para mostrar el modal de error
  const [modalError, setModalError] = useState(false);

  // Función para logearse
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // Llama a response.json() solo una vez

      if (!response.ok) {
        const errorMessage =
          data.detail && data.detail.length > 0
            ? data.detail[0].msg
            : "Error de autenticación";
        throw new Error(errorMessage);
      }

      const tokenFromResponse = data.data.accessToken;

      user.login(tokenFromResponse);
      const tokenFromLocalStorage = localStorage.getItem("authenticationToken");

      localStorage.setItem("userInfo", JSON.stringify(data.data));
      navigate("/inveplus/analitica"); // Cambiado a la nueva ruta
    } catch (error) {
      setErrorMessage(error.message);
      setModalError(true);
      console.error("Error de inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //función para cerrar el modal de error
  const cerrarModalError = () => {
    setModalError(false);
  };

  useEffect(() => {
    if (user.token) navigate("/inveplus/analitica"); // Cambiado a la nueva ruta
  }, [user.token]);

  return (
    !user.token && (
      <div className={style.container}>
        {isLoading && <Loader isLoading={isLoading} />}
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
    )
  );
};

export default Login;