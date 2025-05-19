import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Server,
  Database,
  HardDrive,
  Building,
  Cloud,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../routes/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const BASE_PATH = "/inveplus";

  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Servidores Físicos",
      count: 0,
      icon: Server,
      description: "Gestión de servidores físicos y hardware",
      route: `${BASE_PATH}/servidoresf`,
    },
    {
      id: 2,
      title: "Servidores Virtuales",
      count: 56,
      icon: Cloud,
      description: "Administración de máquinas virtuales",
    },
    {
      id: 3,
      title: "Bases de Datos",
      count: 18,
      icon: Database,
      description: "Control de bases de datos y respaldos",
    },
    {
      id: 4,
      title: "PSeries",
      count: 0,
      icon: Server,
      description: "Gestión de servidores IBM Power Systems",
      route: `${BASE_PATH}/pseries`,
    },
    {
      id: 5,
      title: "Storage",
      count: 8,
      icon: HardDrive,
      description: "Administración de almacenamiento",
    },
    {
      id: 6,
      title: "Sucursales",
      count: 32,
      icon: Building,
      description: "Gestión de infraestructura por sucursal",
    },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchServerCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");

      if (!token) {
        console.warn("No se encontró token de autenticación");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/servers/physical?page=1&limit=1000",
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
          0; // Si no hay nada, el conteo es 0

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
        "http://localhost:8000/pseries/pseries?page=1&limit=1000",
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

      console.log("Respuesta completa de la API PSeries:", data);

      if (data && data.status === "success" && data.data) {
        let totalCount = 0;

        if (data.data.total_count !== undefined) {
          totalCount = data.data.total_count;
          console.log("Usando total_count:", totalCount);
        } else if (data.data.total !== undefined) {
          totalCount = data.data.total;
          console.log("Usando total:", totalCount);
        } else if (data.data.pseries && Array.isArray(data.data.pseries)) {
          totalCount = data.data.pseries.length;
          console.log("Usando pseries.length:", totalCount);
        } else if (
          data.data.total_pages !== undefined &&
          data.data.per_page !== undefined
        ) {
          totalCount = data.data.total_pages * data.data.per_page;
          console.log("Usando total_pages * per_page:", totalCount);
        }

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 4
              ? { ...module, count: totalCount, loading: false }
              : module
          )
        );
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === 4 ? { ...module, loading: false } : module
          )
        );
      }
    } catch (error) {
      console.error("Error al obtener el conteo de servidores PSeries:", error);
      setError(error);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === 4 ? { ...module, loading: false } : module
        )
      );
    }
  };

  useEffect(() => {
    fetchServerCount();
    fetchPseriesCount();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d37171",
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
    switch (moduleId) {
      case 1:
        navigate(`${BASE_PATH}/servidoresf`);
        break;
      case 2:
        navigate(`${BASE_PATH}/basesdedatos`);
        break;
      case 3:
        navigate(`${BASE_PATH}/frontend`);
        break;
      case 4:
        navigate(`${BASE_PATH}/pseries`);
        break;
      default:
        console.warn("Módulo no reconocido:", moduleId);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-300/20 text-gray-100">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-black">Inveplus</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span>{user.name}</span>
              <ChevronDown size={16} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-10">
                <div className="px-4 py-2 border-b border-gray-600">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl text-gray-900 font-bold mb-2">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-gray-800">
            Desde aquí puedes gestionar todos los módulos del sistema.
            Selecciona una opción para comenzar.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl text-gray-900 font-bold mb-6">
            Módulos Disponibles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-gray-300/30 rounded-lg p-5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleModuleClick(module.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-300/30 rounded-lg">
                    <module.icon size={24} className="text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-blue-500">
                    {module.loading ? (
                      <div className="inline-block w-6 h-6 animate-pulse bg-blue-400/30 rounded"></div>
                    ) : (
                      module.count
                    )}
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
