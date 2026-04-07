import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";
import { API_URL } from "../../config/api";

const gradientStyle = {
  background:
    "radial-gradient(1200px circle at 15% 10%, rgba(37, 99, 235, 0.20), transparent 55%), radial-gradient(900px circle at 85% 20%, rgba(56, 189, 248, 0.20), transparent 50%), linear-gradient(135deg, #0B1220 0%, #0F172A 45%, #111827 100%)",
  backgroundSize: "400% 400%",
  animation: "gradient 10s ease infinite",
  height: "100vh",
};

const Login = () => {
  const user = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.detail && data.detail.length > 0
            ? data.detail[0].msg
            : "Error de autenticación";
        throw new Error(errorMessage);
      }

      const tokenFromResponse = data.data.accessToken;
      user.login(tokenFromResponse);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      navigate("/AssetSphere/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Usuario o contraseña incorrectos.");
      setModalError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const cerrarModalError = () => {
    setModalError(false);
  };

  useEffect(() => {
    if (user.token) navigate("/AssetSphere/dashboard");
  }, [user.token]);

  return (
    !user.token && (
      <div style={gradientStyle}>
        {/* Modal de error */}
        {modalError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-as-md w-full max-w-sm border border-as-border">
              <h2 className="text-lg font-semibold text-as-text mb-2">Error</h2>
              <p className="text-sm text-as-muted mb-4">{errorMessage}</p>
              <div className="text-right">
                <button
                  onClick={cerrarModalError}
                  className="as-btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-as-md ring-1 ring-gray-900/5 rounded-2xl sm:px-10 border border-as-border">
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <img src="/AssetSphere/logo.png" alt="Logo AssetSphere" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-semibold text-as-text">Iniciar Sesión</h1>
                <p className="text-sm text-as-muted mt-1">
                  Accede para gestionar y monitorear tu infraestructura
                </p>
              </div>
              <div className="mt-5">
                <form onSubmit={handleLoginSubmit}>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-as-text mb-2">
                      Usuario
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="as-input pl-10"
                        placeholder="Ingresa tu usuario"
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-as-text mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="as-input pl-10"
                        placeholder="Ingresa tu contraseña"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  <div className="my-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full as-btn-primary py-3"
                    >
                      {isLoading ? "Cargando..." : "Ingresar"}
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
