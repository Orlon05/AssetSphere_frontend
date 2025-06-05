import { useState, useEffect } from "react";

export default function Perfil() {
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

  const token = localStorage.getItem("authenticationToken");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://10.8.150.90/api/inveplus/users/get_by_id/${userId}`,
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
            name: data.data.name || data.data.full_name || "",
            username: data.data.username || "",
            email: data.data.email || "",
            role: data.data.role || data.data.role_name || "",
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
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!userId) {
      alert("Error: No se pudo identificar al usuario");
      return;
    }

    try {
      const response = await fetch(
        `https://10.8.150.90/api/inveplus/users/edit/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
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
          alert(errorMessage);
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
          alert(errorMessage);
        }
      } else {
        alert("Contraseña actualizada con éxito");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error inesperado.");
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Perfil de Usuario
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de asociado
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <input
              type="text"
              value={user.role}
              readOnly
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-sky-400"
              required
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
