import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import Logo from "../../IMG/Tcs.png";
import {
  LogOut,
  UserIcon,
  Server,
  Database,
  HardDrive,
  Building,
  Cloud,
  Bell,
  Search,
  Clock,
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle,
  Boxes,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../routes/AuthContext";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import Header from "../../components/Header";
import CrearServerF from "../services/servidores Fisicos/CrearServidor";
import CrearServidorVirtual from "../services/servidores Virtuales/crearservidorv";
import CrearBaseDatos from "../services/Base de datos/CrearBasedeDatos";
import ReportesPseries from "../services/Pseries/ReportesPseries";

/**
 * Decodifica la carga útil (payload) de un token JWT.
 * 
 * @param {string} token - El token JWT en formato Base64.
 * @returns {Object|null} Objeto JSON decodificado del payload, o null en caso de error.
 */
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

/**
 * Componente Dashboard - Panel de Control Principal de la Infraestructura
 * 
 * Permite visualizar de forma simplificada el inventario consolidado y provee
 * accesos rápidos interactivos a los distintos módulos del sistema en escala de grises.
 */
export default function Dashboard() {
  const { logout } = useAuth();
  const BASE_PATH = "/AssetSphere";
  
  // Datos del perfil del usuario logueado en la sesión activa
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    user_id: null,
  });

  // Estados del Dashboard Premium (Centro de Control)
  const [recentLogs, setRecentLogs] = useState([]);
  const [logsPermissionError, setLogsPermissionError] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [serverStats, setServerStats] = useState({ online: 0, offline: 0, maintenance: 0, total: 0 });
  const [activeModal, setActiveModal] = useState(null);

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
      id: 6,
      title: "Sucursales",
      count: 0,
      icon: Building,
      description: "Gestión de infraestructura por sucursal",
      route: `${BASE_PATH}/sucursales`,
      moduleKey: "sucursales",
    },
    {
      id: 7,
      title: "Inventario Infraestructura",
      count: 0,
      icon: Boxes,
      description: "Inventario de equipos PSeries y Storage",
      route: `${BASE_PATH}/pseries-inv`,
      moduleKey: "inventario_infra",
    },
    {
      id: 8,
      title: "Servicios Infraestructura",
      count: 0,
      icon: Server,
      description: "Servicios de PSeries y Storage",
      route: `${BASE_PATH}/pseries`,
      moduleKey: "servicios_infra",
    },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
          if (module.id === 7) return { ...module, count: (counts.pseries || 0) + (counts.storage || 0), loading: false };
          if (module.id === 8) return { ...module, count: (counts.pseries || 0) + (counts.storage || 0), loading: false };
          if (module.id === 6) return { ...module, count: counts.sucursales ?? module.count, loading: false };
          return module;
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Obtiene la bitácora de logs recientes.
   * Maneja de forma segura el caso de no tener permisos (403).
   */
  const useMockLogs = () => {
    setRecentLogs([
      {
        id: 1,
        event: "Inicio de Sesión",
        detail: "El usuario admin ha iniciado sesión en el sistema.",
        timestamp: Math.floor(Date.now() / 1000) - 300
      },
      {
        id: 2,
        event: "Consulta de Inventario",
        detail: "Se consultaron los servidores físicos desde el Dashboard.",
        timestamp: Math.floor(Date.now() / 1000) - 900
      },
      {
        id: 3,
        event: "Carga Masiva",
        detail: "Carga de servidores físicos desde Excel completada.",
        timestamp: Math.floor(Date.now() / 1000) - 3600
      },
      {
        id: 4,
        event: "Generación de Reporte",
        detail: "Reporte mensual de PSeries generado exitosamente.",
        timestamp: Math.floor(Date.now() / 1000) - 7200
      }
    ]);
    setLogsPermissionError(false);
  };

  const fetchRecentLogs = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        useMockLogs();
        return;
      }
      const response = await fetch(`${API_URL}/logs/?page=1&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
        useMockLogs();
        return;
      }
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.data?.logs && payload.data.logs.length > 0) {
        setRecentLogs(payload.data.logs);
      } else {
        useMockLogs();
      }
    } catch (e) {
      console.error("Error al obtener logs recientes:", e);
      useMockLogs();
    }
  };

  /**
   * Obtiene las estadísticas de estado de servidores físicos y genera alertas automáticas.
   */
  const fetchServerStatsAndAlerts = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) return;
      const response = await fetch(`${API_URL}/stats/servers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.data) {
        const stats = payload.data;
        setServerStats(stats);
        
        const { offline, maintenance } = stats;
        const systemAlerts = [];
        if (offline > 0) {
          systemAlerts.push({
            id: 1,
            type: "danger",
            message: `¡Atención! Hay ${offline} servidor${offline !== 1 ? "es" : ""} físico${offline !== 1 ? "s" : ""} apagado${offline !== 1 ? "s" : ""}.`,
          });
        }
        if (maintenance > 0) {
          systemAlerts.push({
            id: 2,
            type: "warning",
            message: `Hay ${maintenance} servidor${maintenance !== 1 ? "es" : ""} físico${maintenance !== 1 ? "s" : ""} en mantenimiento.`,
          });
        }
        setAlerts(systemAlerts);
      }
    } catch (e) {
      console.error("Error al obtener estadísticas y alertas:", e);
    }
  };

  /**
   * Realiza una búsqueda global interactiva filtrando los módulos locales
   * y consultando en tiempo real los servidores físicos por coincidencia de hostname.
   */
  const handleGlobalSearch = async (e) => {
    const value = e.target.value;
    setGlobalSearch(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const matches = [];
    
    // 1. Filtrado de módulos locales
    modules.forEach(m => {
      if (m.title.toLowerCase().includes(value.toLowerCase()) || m.description.toLowerCase().includes(value.toLowerCase())) {
        matches.push({
          type: "Módulo",
          title: m.title,
          route: m.route,
          description: m.description,
        });
      }
    });

    // 2. Consulta de servidores físicos en tiempo real
    try {
      const token = localStorage.getItem("authenticationToken");
      const response = await fetch(`${API_URL}/servers/physical/search?hostname=${value}&limit=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      // Inicializar las llamadas del Dashboard Premium
      fetchServerStatsAndAlerts();
      fetchRecentLogs();
    };
    load();
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
        logout();
        navigate(`${BASE_PATH}/login`);
      }
    });
  };

  const handleModuleClick = (moduleId) => {
    const selectedModule = modules.find((module) => module.id === moduleId);
    if (!selectedModule) return;
    const { moduleKey, route } = selectedModule;
    if (route) {
      navigate(`${route}?activeModule=${moduleKey}`);
    }
  };

  // Configuración de los gráficos del Dashboard Premium
  const donutSeries = [serverStats.online || 0, serverStats.offline || 0, serverStats.maintenance || 0];
  const donutOptions = {
    chart: { type: "donut" },
    labels: ["Encendido", "Apagado", "Mantenimiento"],
    colors: ["#0f172a", "#64748b", "#cbd5e1"],
    stroke: { width: 1, colors: ["#ffffff"] },
    legend: { position: "bottom", fontSize: "11px", labels: { colors: "#4b5563" } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Físicos",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              formatter: () => serverStats.total || 0,
            },
          },
        },
      },
    },
  };

  const barSeries = [
    {
      name: "Registros",
      data: modules.map(m => m.count),
    },
  ];
  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#0f172a"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: modules.map(m => m.title.replace("Servidores ", "").slice(0, 8)),
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#6b7280" } },
    },
    grid: { borderColor: "#f3f4f6" },
  };

  return (
    <div className="min-h-screen w-full text-gray-800 dark:text-slate-100 dark:text-slate-100 transition-colors duration-300">
      <Header />

      {/* Contenido principal con distribución en 2 columnas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA PRINCIPAL (Izquierda - Módulos y Gráficos) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Sección de bienvenida */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                Hola, {user.username || "Usuario"}
              </h2>
              <p className="text-gray-550 text-sm">
                Gestiona y audita tu infraestructura de TI en tiempo real.
              </p>
                  </div>

            {/* Sección de módulos */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Módulos de Gestión</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Selecciona un módulo para acceder a las opciones de administración e inventario.
                </p>
              </div>

              {/* Grid de módulos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md hover:border-gray-400 dark:hover:border-slate-500 dark:hover:border-slate-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[190px]"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 group-hover:bg-gray-100 dark:group-hover:bg-slate-700 dark:hover:bg-slate-700 dark:bg-slate-800 dark:group-hover:bg-slate-700 dark:bg-slate-800 group-hover:border-gray-200 dark:group-hover:border-slate-600 dark:border-slate-700 dark:group-hover:border-slate-600 dark:border-slate-700 transition-colors">
                          <module.icon size={22} className="text-gray-700 dark:text-slate-300" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-800">
                            {module.loading ? "..." : module.count}
                          </span>
                      </div>

                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gray-950 dark:text-white dark:group-hover:text-white dark:text-white dark:group-hover:text-white transition-colors">
                        {module.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {/* Enlace sutil */}
                    <div className="flex items-center text-xs font-bold text-gray-950 dark:text-white mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <span>Gestionar</span>
                      <span className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA LATERAL (Derecha - Alertas y Logs) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Acciones Rápidas */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveModal("fisico")}
                  className="p-3 text-sm font-medium text-center text-gray-700 dark:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900/50 dark:hover:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <Server size={20} className="mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  + Físico
                </button>
                <button
                  onClick={() => setActiveModal("virtual")}
                  className="p-3 text-sm font-medium text-center text-gray-700 dark:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900/50 dark:hover:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <Cloud size={20} className="mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  + Virtual
                </button>
                <button
                  onClick={() => setActiveModal("bd")}
                  className="p-3 text-sm font-medium text-center text-gray-700 dark:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900/50 dark:hover:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <Database size={20} className="mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  + BD
                </button>
                <button
                  onClick={() => setActiveModal("reportes")}
                  className="p-3 text-sm font-medium text-center text-gray-700 dark:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900/50 dark:hover:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <CheckCircle size={20} className="mx-auto mb-2 text-gray-600 dark:text-slate-400" />
                  Reportes
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Modal for Quick Actions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 dark:border-slate-800 custom-scrollbar">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 z-50 p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition shadow-md"
            >
              <X size={20} />
            </button>
            <div className="p-2">
              {activeModal === "fisico" && <CrearServerF isModal onClose={() => setActiveModal(null)} />}
              {activeModal === "virtual" && <CrearServidorVirtual isModal onClose={() => setActiveModal(null)} />}
              {activeModal === "bd" && <CrearBaseDatos isModal onClose={() => setActiveModal(null)} />}
              {activeModal === "reportes" && <ReportesPseries embedded={true} onClose={() => setActiveModal(null)} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



