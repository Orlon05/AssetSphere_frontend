import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import {
  ChevronDown,
  LogOut,
  UserIcon,
  Server,
  Database,
  HardDrive,
  Building,
  Cloud,
  ShieldCheck,
  ArrowRight,
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

  useEffect(() => {
    fetchServerCount();
    fetchPseriesCount();
    fetchStorageCount();
    fetchBaseDatosCount();
    fetchServervCount();
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
    <div className="as-page min-h-screen bg-slate-50">
      {/* Encabezado con efecto Glassmorphism */}
      <header className="sticky top-0 z-50 w-full px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-as-brand-500 to-as-brand-700 flex items-center justify-center shadow-md shadow-as-brand-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
            AssetSphere
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/50 pl-2 pr-4 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-white hover:shadow transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
              <UserIcon size={16} className="text-slate-500" />
            </div>
            <span className="font-medium">{user.name || user.username || "Administrador"}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100 mb-2">
                <p className="text-sm font-semibold text-slate-800">{user.name || "Usuario"}</p>
                <p className="text-xs text-slate-500 truncate">{user.email || "admin@assetsphere.com"}</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(`${BASE_PATH}/perfil/${user.user_id}/perfil`);
                }}
                className="w-full text-slate-600 text-left px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-as-brand-600 flex items-center gap-3 transition-colors"
              >
                <UserIcon size={16} />
                <span className="font-medium">Mi Perfil</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-red-600 text-left px-4 py-2.5 text-sm hover:bg-red-50 flex items-center gap-3 transition-colors mt-1"
              >
                <LogOut size={16} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6 lg:p-8 max-w-[1400px]">
        {/* Banner de Bienvenida Premium */}
        <div className="relative bg-slate-900 rounded-3xl p-10 mb-10 text-white overflow-hidden shadow-2xl border border-slate-800">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-20 -top-40 w-96 h-96 bg-as-brand-500/20 rounded-full blur-3xl"></div>
            <div className="absolute right-40 -bottom-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            {/* Patrón de puntos (dot pattern) simulado con gradiente radial */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Sistema Operativo en Línea
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
                Resumen de <span className="text-transparent bg-clip-text bg-gradient-to-r from-as-brand-400 to-sky-400">Infraestructura</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Supervisa y administra todos los recursos de TI desde un único centro de comando. Selecciona un módulo para acceder a las herramientas de gestión avanzadas.
              </p>
            </div>
            
            {/* Widget de Resumen rápido en el banner */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 flex-1 md:w-40 flex flex-col items-center justify-center">
                <span className="text-slate-400 text-sm font-medium mb-1">Total Módulos</span>
                <span className="text-3xl font-bold text-white">{modules.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Módulos */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Módulos del Sistema</h3>
            <p className="text-slate-500 mt-1">Accede rápidamente a las distintas áreas de administración</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-as-brand-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Resplandor sutil en hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-as-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-as-brand-50 group-hover:border-as-brand-100 transition-all duration-300 shadow-sm">
                  <module.icon size={32} className="text-slate-600 group-hover:text-as-brand-600 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-as-brand-600 transition-colors duration-300">
                    {module.loading ? "..." : module.count}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Registros</span>
                </div>
              </div>
              
              <div className="relative z-10 flex-grow">
                <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-as-brand-700 transition-colors duration-300">
                  {module.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {module.description}
                </p>
              </div>
              
              <div className="relative z-10 pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-slate-400 group-hover:text-as-brand-600 transition-colors duration-300 uppercase tracking-wide">
                  Administrar
                </span>
                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-as-brand-600 group-hover:border-as-brand-600 shadow-sm transition-all duration-300">
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
