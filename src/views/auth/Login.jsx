import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";
import { API_URL } from "../../config/api";
import Logo from "../../IMG/Tcs.png"; // ✅ CORRECCIÓN

// ✅ CORRECCIÓN: estilos + animación funcionan
const gradientStyle = {
  background:
    "linear-gradient(45deg, rgb(133, 132, 132), rgb(184, 182, 182), rgb(124, 183, 231), rgb(86, 79, 179))",
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
      navigate("/dashboard");
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
    // Forzar modo claro en la vista de login
    window.document.documentElement.classList.remove("dark");
    
    if (user.token) navigate("/AssetSphere/dashboard");
  }, [user.token, navigate]);

  return (
    !user.token && (
      <div style={gradientStyle}>
        {/* ✅ KEYFRAMES INLINE (SIN CAMBIAR TU ESTRUCTURA) */}
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>

        {/* Modal de error */}
        {modalError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold text-red-650 mb-2">Error</h2>
              <p className="text-gray-700 mb-4">{errorMessage}</p>
              <div className="text-right">
                <button
                  onClick={cerrarModalError}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10 overflow-hidden">
            {isLoading && !isSuccess && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-30 transition-all duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-900/10 border-t-slate-900 animate-spin"></div>
                    <img src={Logo} alt="Logo" className="absolute w-8 h-8 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 tracking-wide animate-pulse">Autenticando...</p>
                    <p className="text-[10px] text-gray-500 mt-1">Conectando con AssetSphere</p>
                  </div>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-30 transition-all duration-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 scale-100 animate-bounce">
                    <CheckCircle size={36} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 tracking-wide">¡Acceso Concedido!</p>
                    <p className="text-[10px] text-emerald-650 font-semibold mt-1">Cargando tu panel principal...</p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full">
              <div className="flex justify-center mb-6">
                {/* ✅ CORRECCIÓN LOGO */}
                <img src={Logo} alt="Logo AssetSphere" className="h-12 w-auto object-contain" />
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-semibold text-gray-900">
                  Iniciar Sesión
                </h1>
              </div>

              <div className="mt-5">
                <form onSubmit={handleLoginSubmit}>
                  <div className="relative mt-6">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                      placeholder="Usuario"
                      required
                    />
                    <label className="absolute top-0 left-0 text-sm text-gray-800">
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
                    <label className="absolute top-0 left-0 text-sm text-gray-800">
                      Contraseña
                    </label>
                  </div>

                  <div className="my-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-md bg-black px-3 py-4 text-white disabled:opacity-50"
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




