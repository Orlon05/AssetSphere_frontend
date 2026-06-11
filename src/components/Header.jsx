/**
 * @file Header.jsx
 * @description Main application header component with global search, theme toggle, and user profile.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, UserIcon, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import Logo from "../IMG/Tcs.png";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../routes/AuthContext";
import { API_URL } from "../config/api";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Header Component
 * @description The top navigation bar containing the logo, global search, theme toggler, and profile dropdown.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const BASE_PATH = "/AssetSphere";

  const [user, setUser] = useState({
    name: "Usuario",
    username: "Usuario",
    email: "",
    role: "",
    user_id: null,
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mock modules list for search (in a real app, this might come from context or props)
  const modules = [
    { title: "Servidores Físicos", description: "Gestión de servidores físicos y hardware", route: `${BASE_PATH}/servidoresf` },
    { title: "Servidores Virtuales", description: "Administración de máquinas virtuales", route: `${BASE_PATH}/servidoresv` },
    { title: "Bases de Datos", description: "Control de bases de datos y respaldos", route: `${BASE_PATH}/base-de-datos` },
    { title: "PSeries", description: "Gestión de servidores IBM Power Systems", route: `${BASE_PATH}/pseries` },
    { title: "Storage", description: "Administración de almacenamiento", route: `${BASE_PATH}/storage` },
    { title: "Sucursales", description: "Gestión de infraestructura por sucursal", route: `${BASE_PATH}/sucursales` },
  ];

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user")) || {};
        let userId = userData.user_id;

        const token = localStorage.getItem("authenticationToken");
        if (!userId && token) {
          const decodedToken = decodeJWT(token);
          userId = decodedToken?.user_id;
        }

        setUser((prevUser) => ({
          ...prevUser,
          user_id: userId,
          name: userData.name || "Usuario",
          username: userData.username || "Usuario",
          email: userData.email || "",
        }));

        if (userId && token) {
          const response = await fetch(`${API_URL}/users/get_by_id/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && data.data) {
              setUser((prevUser) => ({
                ...prevUser,
                name: data.data.name || "Usuario",
                username: data.data.username || "Usuario",
                email: data.data.email || "",
                role: data.data.role || "",
              }));
            }
          }
        }
      } catch (error) {
        // Error handling
      }
    };
    initializeUser();
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
        localStorage.removeItem("autenticacionToken");
        localStorage.removeItem("authenticationToken");
        logout();
        navigate(`${BASE_PATH}/login`);
      }
    });
  };

  const handleGlobalSearch = async (e) => {
    const value = e.target.value;
    setGlobalSearch(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const matches = [];
    modules.forEach(m => {
      if (m.title.toLowerCase().includes(value.toLowerCase()) || m.description.toLowerCase().includes(value.toLowerCase())) {
        matches.push({ type: "Módulo", title: m.title, route: m.route, description: m.description });
      }
    });

    try {
      const token = localStorage.getItem("authenticationToken");
      const response = await fetch(`${API_URL}/servers/physical/search?hostname=${value}&limit=3`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.data?.servers) {
        payload.data.servers.forEach(s => {
          matches.push({
            type: "Servidor Físico",
            title: s.hostname || s.name,
            route: `${BASE_PATH}/ver/${s.id}/servers`,
            description: `IP: ${s.ip_address || "—"} · Estado: ${s.status}`,
          });
        });
      }
    } catch {}

    setSearchResults(matches);
  };

  return (
    <header className="bg-as-panel dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-300 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <img src={Logo} alt="AssetSphere" className="h-8" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white hidden sm:block">
              AssetSphere
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar módulo o servidor por hostname..."
                className="w-full pl-10 pr-8 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-gray-50 dark:bg-slate-900/50 focus:bg-white dark:bg-slate-800 focus:outline-none focus:border-gray-400 transition-all duration-200 text-gray-800 dark:text-slate-100"
                value={globalSearch}
                onChange={handleGlobalSearch}
              />
              {globalSearch && (
                <button
                  onClick={() => { setGlobalSearch(""); setSearchResults([]); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-slate-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-[55] max-h-80 overflow-y-auto">
                <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 text-xs font-semibold text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800">
                  Resultados de Búsqueda
                </div>
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => { navigate(item.route); setGlobalSearch(""); setSearchResults([]); }}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-50 dark:border-slate-700 last:border-0 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</span>
                      <span className="text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden z-[60]">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setIsProfileOpen(false); navigate(`${BASE_PATH}/perfil/${user.user_id}/perfil`); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"
                  >
                    <UserIcon size={14} />
                    Ver Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 border-t border-gray-100 dark:border-slate-800 transition"
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
