import { useState, useEffect } from "react";
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
  const BASE_PATH = "/inveplus";
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
        `https://10.8.150.90/api/inveplus/users/get_by_id/${userId}`,
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
        "https://10.8.150.90/api/inveplus/servers/physical?page=1&limit=1000",
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
        "https://10.8.150.90/api/inveplus/pseries/pseries?page=1&limit=10000",
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
        "https://10.8.150.90/api/inveplus/storage/get_all?page=1&limit=1000",
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
        "https://10.8.150.90/api/inveplus/base_datos/get_all?page=1&limit=1000",
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
        } else if (
          data.data.bases_datos &&
          Array.isArray(data.data.bases_datos)
        ) {
          totalCount = data.data.bases_datos.length;
        } else if (
          data.data.total_pages !== undefined &&
          data.data.per_page !== undefined
        ) {
          totalCount = data.data.total_pages * data.data.per_page;
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
        "https://10.8.150.90/api/inveplus/vservers/virtual?page=1&limit=1000",
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
    <div className="min-h-screen bg-gray-300/20">
      {/* Encabezado */}
      <header className="w-full p-4 flex justify-between items-center bg-white shadow-md rounded-b-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={40} />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-400 drop-shadow-sm tracking-wide">
            Inveplus
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center bg-gray-300 border-1 border-white shadow-lg gap-2 p-2 rounded-lg hover:bg-gray-400/30"
          >
            <span>{user.name || "Usuario"}</span>
            <ChevronDown size={16} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-200/40 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(`${BASE_PATH}/perfil/${user.user_id}`);
                }}
                className="w-full text-gray-900 text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2"
              >
                <UserIcon size={16} />
                Ver Perfil
              </button>

              <div className="border-t border-gray-500 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-gray-900 text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="rounded-lg p-6 mb-8 shadow-lg bg-white :bg-stone-700">
          <h2 className="text-2xl text-gray-900 :text-white font-bold mb-2">
            ¡Bienvenido, {user.username || "Usuario"}!
          </h2>
          <p className="text-gray-800">
            Desde aquí puedes gestionar todos los módulos del sistema.
          </p>
        </div>

        {/* Módulos disponibles */}
        <div className="bg-white :bg-stone-700 rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl text-gray-900 :bg-stone-700 :text-gray-200 font-bold mb-6">
            Módulos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className="bg-gray-300/30 rounded-lg p-5 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-300/30 rounded-lg">
                    <module.icon size={24} className="text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-blue-500">
                    {module.loading ? "..." : module.count}
                  </span>
                </div>
                <h4 className="text-lg text-gray-900 font-medium mb-2">
                  {module.title}
                </h4>
                <p className="text-gray-900 font-semibold text-sm mb-4">
                  {module.description}
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Gestionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
