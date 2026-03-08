import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCircle, ShieldCheck } from "lucide-react";

export default function Perfil() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_PATH = "/AssetSphere";

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/users/get_by_id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener datos del usuario:", errorData);
          if (response.status === 404) {
            throw new Error("Usuario no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.message || errorData.detail
              }`
            );
          }
        }

        const data = await response.json();

        if (data.status === "success" && data.data) {
          setUser({
            name: data.data.name || "",
            username: data.data.username || "",
            email: data.data.email || "",
            role: data.data.role || "",
          });
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error en fetchUserData:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
      setError(
        "No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente."
      );
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500 mb-4"></div>
            <p>Cargando información del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
  //       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
  //         <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
  //         <p className="text-gray-700 mb-4">{error}</p>
  //         <button
  //           onClick={() => navigate(`${BASE_PATH}/dashboard`)}
  //           className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition"
  //         >
  //           Volver al Dashboard
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <UserCircle size={28} className="text-sky-600 mr-2" />
          <h2 className="text-2xl font-bold text-slate-800">
            Perfil de Usuario
          </h2>
        </div>

        <hr className="mb-6 border-gray-300" />

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de asociado
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <ShieldCheck size={22} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Autenticación por Directorio Activo
            </p>
            <p className="text-sm text-blue-700">
              La gestión de contraseñas se realiza a través del Directorio
              Activo corporativo. Para cambiar su contraseña, comuníquese con
              el área de Tecnología o use el portal de autoservicio de TI.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`${BASE_PATH}/dashboard`)}
          className="w-full mt-6 bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition flex items-center justify-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </div>
    </div>
  );
}
