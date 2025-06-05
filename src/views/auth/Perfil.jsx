import { useState, useEffect } from "react";

export default function Perfil() {
  const [user, setUser] = useState({ name: "", role: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Cargar el usuario desde almacenamiento local o contexto
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email, // o username, según tu backend
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) throw new Error("Error al cambiar la contraseña");
      alert("Contraseña actualizada con éxito");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300/20 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Perfil de Usuario
        </h2>

        <div className="mb-6 space-y-2">
          <p>
            <span className="font-semibold text-gray-700">Nombre:</span>{" "}
            {user.name}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Rol:</span>{" "}
            {user.role}
          </p>
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
