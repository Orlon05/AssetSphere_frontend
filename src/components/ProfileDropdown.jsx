import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../routes/AuthContext";
import Swal from "sweetalert2";
import { LogOut, User as UserIcon } from "lucide-react";

export default function ProfileDropdown() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const BASE_PATH = "/AssetSphere";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Usuario",
    email: "",
    user_id: null,
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (storedUser) {
        setUser({
          name: storedUser.name || "Usuario",
          email: storedUser.email || "",
          user_id: storedUser.user_id || null,
        });
      }
    } catch (e) {
      console.error("Error al obtener información de usuario:", e);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate(`${BASE_PATH}/login`);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <span className="hidden sm:inline">{user.name}</span>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsProfileOpen(false);
              navigate(`${BASE_PATH}/perfil/${user.user_id}/perfil`);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <UserIcon size={14} />
            Ver Perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100 transition"
          >
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
