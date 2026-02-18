import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, UserCircle } from "lucide-react";

export default function Perfil() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "No se pudo identificar al usuario",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/edit/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            authorized: true,
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Detalles del error (JSON):", errorData);
          if (errorData && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
          }

          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3085d6",
          });
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        Swal.fire({
          title: "¡Éxito!",
          text: "Contraseña actualizada con éxito",
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#10b981",
          background: "#ffffff",
          color: "#374151",
          iconColor: "#10b981",
          customClass: {
            popup: "rounded-lg shadow-xl",
            title: "text-xl font-bold text-gray-800",
            content: "text-gray-600",
            confirmButton:
              "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors",
          },
        }).then(() => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          navigate(`${BASE_PATH}/dashboard`);
        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3085d6",
      });
    }
  };

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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition"
          >
            Cambiar contraseña
          </button>

          <button
            type="button"
            onClick={() => navigate(`${BASE_PATH}/dashboard`)}
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition flex items-center justify-center mt-2"
          >
            <ArrowLeft className="mr-2" size={20} />
            Regresar
          </button>
        </form>
      </div>
    </div>
  );
}
