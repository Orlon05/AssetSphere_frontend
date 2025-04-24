import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import style from "../../css/login.module";
//import PopupError from "../popups/PopupError";
// import Loader from "../layouts/Loader";
import { useAuth } from "../../routes/AuthContext";

const gradientStyle = {
  background:
    "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const Login = () => {
  const user = useAuth();
  //estado para manejar el correo y la contraseña
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // //estado para mostrar el modal de error
  // const [modalError, setModalError] = useState(false);

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
      navigate("/dashboard");
    } catch (error) {
      // setErrorMessage(error.message);
      // setModalError(true);
      console.error("Error de inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //función para cerrar el modal de error
  // const cerrarModalError = () => {
  //   setModalError(false);
  // };

  useEffect(() => {
    if (user.token) navigate("/inveplus/dashboard");
  }, [user.token]);

  return (
    !user.token && (
      <div className="" style={gradientStyle}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <img src="src/assets/logo.png" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-semibold text-gray-900">
                  Iniciar Sesión
                </h1>
              </div>
              <div className="mt-5">
                <form action="" onSubmit={handleLoginSubmit}>
                  <div className="relative mt-6">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                      placeholder="Usuario"
                      required
                    />
                    <label
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 
                                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      Usuario
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                      placeholder="Contraseña"
                      required
                    />
                    <label
                      for="password"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 
                                    ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      Contraseña
                    </label>
                  </div>
                  <div className="my-6 ">
                    <button
                      type="submit"
                      className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
                    >
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
