import { useState, useEffect } from "react";
import {
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

// Componente principal del Dashboard
export default function Dashboard() {
  const { logout } = useAuth(); // Función para cerrar sesión
  const [user, setUser] = useState({ name: "", email: "" }); // Estado para el usuario
  const BASE_PATH = "/inveplus"; // Ruta base del sistema

  // Estado para los módulos del dashboard
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
      count: 56,
      icon: Cloud,
      description: "Administración de máquinas virtuales",
      route: `${BASE_PATH}/servidoresv`,
      moduleKey: "servidoresv",
    },
    {
      id: 3,
      title: "Bases de Datos",
      count: 18,
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
      count: 8,
      icon: HardDrive,
      description: "Administración de almacenamiento",
      route: `${BASE_PATH}/storage`,
      moduleKey: "storage",
    },
    {
      id: 6,
      title: "Sucursales",
      count: 32,
      icon: Building,
      description: "Gestión de infraestructura por sucursal",
      route: `${BASE_PATH}/sucursales`,
      moduleKey: "sucursales",
    },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false); // Estado para el menú de perfil
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate(); // Navegación entre rutas

  // Función para obtener el conteo de servidores físicos
  const fetchServerCount = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) return;

      const response = await fetch(
        "http://localhost:8000/servers/physical?page=1&limit=1000",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

      const data = await response.json();
      if (data?.status === "success" && data.data) {
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
      }
    } catch (error) {
      setError(error);
    }
  };

  // Llama a la función de conteo al cargar el componente
  useEffect(() => {
    fetchServerCount();
    // fetchPseriesCount();
  }, []);

  // Función para cerrar sesión
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
    // Encontrar el módulo seleccionado
    const selectedModule = modules.find((module) => module.id === moduleId);

    if (!selectedModule) return;

    // Usar el campo moduleKey para el parámetro URL
    const { moduleKey } = selectedModule;

    if (moduleId === 1)
      navigate(`${BASE_PATH}/servidoresf?activeModule=${moduleKey}`);
    else if (moduleId === 2)
      navigate(`${BASE_PATH}/servidoresv?activeModule=${moduleKey}`);
    else if (moduleId === 3)
      navigate(`${BASE_PATH}/base-de-datos?activeModule=${moduleKey}`);
    else if (moduleId === 4)
      navigate(`${BASE_PATH}/pseries?activeModule=${moduleKey}`);
    // else if (moduleId === 5) navigate(`${BASE_PATH}/storage?activeModule=${moduleKey}`);
    // else if (moduleId === 6) navigate(`${BASE_PATH}/sucursales?activeModule=${moduleKey}`);
  };

  // Renderizado del componente
  return (
    <div className="min-h-screen bg-gray-300/20 dark:bg-zinc-800  ">
      {/* Encabezado */}
      <header className="w-full p-4 flex justify-between items-center">
        <h1 className="text-slate-900 dark:text-gray-100 text-4xl font-bold">
          Inveplus
        </h1>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center bg-gray-400 dark:bg-gray-800 border-1 border-white shadow-lg gap-2 p-2 rounded-lg hover:bg-gray-700"
          >
            <span>{user.name}</span>
            <ChevronDown size={16} />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-300 rounded-lg shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-600">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-900">{user.email}</p>
              </div>
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
        <div className="rounded-lg p-6 mb-8 shadow-lg bg-white dark:bg-stone-700">
          <h2 className="text-2xl text-gray-900 dark:text-white font-bold mb-2">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-gray-800">
            Desde aquí puedes gestionar todos los módulos del sistema.
          </p>
        </div>

        {/* Módulos disponibles */}
        <div className="bg-white dark:bg-stone-700 rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl text-gray-900 dark:bg-stone-700 dark:text-gray-200 font-bold mb-6">
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
