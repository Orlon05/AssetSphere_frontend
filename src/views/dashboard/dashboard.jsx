import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import Logo from "../../IMG/Tata_Logo.png";
import {
  ChevronDown,
  LogOut,
  UserIcon,
  Server,
  Database,
  HardDrive,
  Building,
  Cloud,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../routes/AuthContext";
import { useNavigate } from "react-router-dom";

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
    console.error("Error decodificando JWT:", error);
    return null;
  }
};

export default function Dashboard() {
  const { logout } = useAuth();
  const BASE_PATH = "/AssetSphere";
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    user_id: null,
  });

  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Servidores Físicos",
      count: 0,
      icon: Server,
      description: "Gestión de servidores físicos y hardware",
      route: `${BASE_PATH}/servidoresf`,
      moduleKey: "servidoresf",
    },
    {
      id: 2,
      title: "Servidores Virtuales",
      count: 0,
      icon: Cloud,
      description: "Administración de máquinas virtuales",
      route: `${BASE_PATH}/servidoresv`,
      moduleKey: "servidoresv",
    },
    {
      id: 3,
      title: "Bases de Datos",
      count: 0,
      icon: Database,
      description: "Control de bases de datos y respaldos",
      route: `${BASE_PATH}/base-de-datos`,
      moduleKey: "base-de-datos",
    },
    {
      id: 4,
      title: "PSeries",
      count: 0,
      icon: Server,
      description: "Gestión de servidores IBM Power Systems",
      route: `${BASE_PATH}/pseries`,
      moduleKey: "pseries",
    },
    {
      id: 5,
      title: "Storage",
      count: 0,
      icon: HardDrive,
      description: "Administración de almacenamiento",
      route: `${BASE_PATH}/storage`,
      moduleKey: "storage",
    },
    {
      id: 6,
      title: "Sucursales",
      count: 0,
      icon: Building,
      description: "Gestión de infraestructura por sucursal",
      route: `${BASE_PATH}/sucursales`,
      moduleKey: "sucursales",
    },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async (userId, token) => {
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
        throw new Error(`Error HTTP ${response.status}`);
      }

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
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setUser((prevUser) => ({
        ...prevUser,
        name: "Usuario",
        username: "Usuario",
      }));
    }
  };

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
          await fetchUserData(userId, token);
        }
      } catch (error) {
        console.error("Error al inicializar usuario:", error);
        setUser({
          name: "Usuario",
          username: "Usuario",
          email: "",
          role: "",
          user_id: null,
        });
      }
    };

    initializeUser();
  }, []);

  const fetchServerCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        `${API_URL}/servers/physical?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        const totalCount =
          data.data.total_count ||
          data.data.total ||
          data.data.servers?.length ||
          0;

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 1
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 1 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      console.error("Error al obtener el conteo de servidores:", error);
      setError(error);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 1 ? { ...module, loading: false } : module
        )
      );
    }
  };

  const fetchPseriesCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }
      const response = await fetch(
        `${API_URL}/pseries/pseries?page=1&limit=10000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        let totalCount = 0;

        if (data.data.total_count !== undefined) {
          totalCount = data.data.total_count;
        } else if (data.data.total !== undefined) {
          totalCount = data.data.total;
        } else if (data.data.pseries && Array.isArray(data.data.pseries)) {
          totalCount = data.data.pseries.length;
        } else if (
          data.data.total_pages !== undefined &&
          data.data.per_page !== undefined
        ) {
          totalCount = data.data.total_pages * data.data.per_page;
        }

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 4
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 4 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      setError(error);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 4 ? { ...module, loading: false } : module
        )
      );
    }
  };

  const fetchStorageCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        `${API_URL}/storage/get_all?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        let totalCount = 0;

        if (data.data.total_count !== undefined) {
          totalCount = data.data.total_count;
        } else if (data.data.total !== undefined) {
          totalCount = data.data.total;
        } else if (data.data.storages && Array.isArray(data.data.storages)) {
          totalCount = data.data.storages.length;
        } else if (
          data.data.total_pages !== undefined &&
          data.data.per_page !== undefined
        ) {
          totalCount = data.data.total_pages * data.data.per_page;
        }

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 5
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 5 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      setError(error);
      console.error("Error en fetchStorageCount:", error);

      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 5 ? { ...module, loading: false } : module
        )
      );
    }
  };

  const fetchBaseDatosCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        `${API_URL}/base_datos/get_all?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        let totalCount = 0;

        if (
          data.data.total_pages !== undefined &&
          Array.isArray(data.data.base_datos)
        ) {
          const totalPages = data.data.total_pages;

          const lastPageResponse = await fetch(
            `${API_URL}/base_datos/get_all?page=${totalPages}&limit=1000`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const lastPageData = await lastPageResponse.json();
          const lastPageCount = lastPageData.data.base_datos.length;

          totalCount = (totalPages - 1) * 1000 + lastPageCount;
        }

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 3
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 3 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      console.error("Error en fetchBaseDatosCount:", error);
      setError(error);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 3 ? { ...module, loading: false } : module
        )
      );
    }
  };
  
  
  const fetchServervCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        `${API_URL}/vservers/virtual?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        const totalCount =
          data.data.total_count ||
          data.data.total ||
          data.data.servers?.length ||
          0;

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 2
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 2 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      console.error("Error al obtener el conteo de servidores:", error);
      setError(error);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 2 ? { ...module, loading: false } : module
        )
      );
    }
  };

  const fetchDashboardCounts = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) return false;

      const response = await fetch(`${API_URL}/stats/counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) return false;

      const counts = payload?.data || {};

      setModules((prevModules) =>
        prevModules.map((module) => {
          if (module.id === 1) return { ...module, count: counts.physical_servers ?? module.count, loading: false };
          if (module.id === 2) return { ...module, count: counts.virtual_servers ?? module.count, loading: false };
          if (module.id === 3) return { ...module, count: counts.base_datos ?? module.count, loading: false };
          if (module.id === 4) return { ...module, count: counts.pseries ?? module.count, loading: false };
          if (module.id === 5) return { ...module, count: counts.storage ?? module.count, loading: false };
          if (module.id === 6) return { ...module, count: counts.sucursales ?? module.count, loading: false };
          return module;
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const load = async () => {
      const ok = await fetchDashboardCounts();
      if (!ok) {
        fetchServerCount();
        fetchPseriesCount();
        fetchStorageCount();
        fetchBaseDatosCount();
        fetchServervCount();
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("autenticacionToken");
        logout();
        navigate(`${BASE_PATH}/login`);
      }
    });
  };

  const handleModuleClick = (moduleId) => {
    const selectedModule = modules.find((module) => module.id === moduleId);

    if (!selectedModule) return;

    const { moduleKey } = selectedModule;

    if (moduleId === 1)
      navigate(`${BASE_PATH}/servidoresf?activeModule=${moduleKey}`);
    else if (moduleId === 2)
      navigate(`${BASE_PATH}/servidoresv?activeModule=${moduleKey}`);
    else if (moduleId === 3)
      navigate(`${BASE_PATH}/base-de-datos?activeModule=${moduleKey}`);
    else if (moduleId === 4)
      navigate(`${BASE_PATH}/pseries?activeModule=${moduleKey}`);
    else if (moduleId === 5)
      navigate(`${BASE_PATH}/storage?activeModule=${moduleKey}`);
    else if (moduleId === 6)
      navigate(`${BASE_PATH}/sucursales?activeModule=${moduleKey}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={Logo} alt="AssetSphere" className="h-8" />
              <h1 className="text-2xl font-semibold text-gray-900">
                AssetSphere
              </h1>
            </div>

            {/* Controles derechos */}
            <div className="flex items-center gap-4">
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
                  {user.name}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
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
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sección de bienvenida */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-1">
            Hola, {user.username || "Usuario"}
          </h2>
          <p className="text-gray-600">
            Gestiona tu infraestructura desde aquí.
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Servidores Físicos",
              value: modules.find(m => m.id === 1)?.count || 0,
              icon: Server,
            },
            {
              label: "Servidores Virtuales",
              value: modules.find(m => m.id === 2)?.count || 0,
              icon: Cloud,
            },
            {
              label: "Bases de Datos",
              value: modules.find(m => m.id === 3)?.count || 0,
              icon: Database,
            },
            {
              label: "Almacenamiento",
              value: modules.find(m => m.id === 5)?.count || 0,
              icon: HardDrive,
            },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent size={20} className="text-gray-600" />
                  <span className="text-2xl font-semibold text-gray-900">
                    {stat.value || "0"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Sección de módulos */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Módulos</h3>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm hover:border-gray-300 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <module.icon size={24} className="text-gray-600" />
                <span className="text-xl font-semibold text-gray-900">
                  {module.loading ? "..." : module.count}
                </span>
              </div>

              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {module.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {module.description}
              </p>

              <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                Gestionar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
