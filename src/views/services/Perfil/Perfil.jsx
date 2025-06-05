import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";

import { useState } from "react";

const gradientStyle = {
  background:
    "linear-gradient(45deg, rgb(133, 132, 132), rgb(184, 182, 182), rgb(124, 183, 231), rgb(86, 79, 179))",
  backgroundSize: "400% 400%",
  animation: "gradient 10s ease infinite",
  height: "100vh",
};

const Perfil = () => {
  const [name, setName] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas nuevas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://10.8.150.90/api/inveplus/users/edit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            associate_name: name,
            user_name: userName,
            email: email,
            role: role,
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.detail?.[0]?.msg || "Error al actualizar el perfil";
        throw new Error(message);
      }

      alert("Datos actualizados correctamente.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={gradientStyle}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="flex justify-center mb-6">
              <img src="/inveplus/logo.png" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Perfil del usuario
              </h1>
            </div>
            <div className="mt-5">
              <form onSubmit={handlePerfilSubmit}>
                <div className="relative mt-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Nombre de Asociado"
                    required
                  />
                  <label className="...">Nombre de Asociado</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Nombre de Usuario"
                    required
                  />
                  <label className="...">Nombre de Usuario</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Email"
                    required
                  />
                  <label className="...">Email</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Role"
                    required
                  />
                  <label className="...">Role</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Contraseña anterior"
                    required
                  />
                  <label className="...">Contraseña anterior</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Contraseña nueva"
                    required
                  />
                  <label className="...">Contraseña nueva</label>
                </div>

                <div className="relative mt-6">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    placeholder="Confirmar contraseña nueva"
                    required
                  />
                  <label className="...">Confirmar contraseña nueva</label>
                </div>

                {errorMessage && (
                  <p className="mt-4 text-sm text-red-600 text-center">
                    {errorMessage}
                  </p>
                )}

                <div className="my-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
