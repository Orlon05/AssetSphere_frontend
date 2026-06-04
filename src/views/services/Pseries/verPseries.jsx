import { API_URL } from "../../../config/api";
/**
 * Componente para visualizar detalles de servidores PSeries
 *
 * Funcionalidades:
 * - Vista de solo lectura de todos los campos del servidor
 * - Organización en secciones lógicas
 * - Badges de estado visuales
 * - Formateo especial para campos de memoria
 * - Manejo robusto de errores y estados de carga
 *
 * @component
 * @example
 * return <VerPseries />
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Server,
  CheckCircle,
  AlertCircle,
  Clock,
  Cpu,
  Layers,
  Sliders,
  HardDrive,
} from "lucide-react";

const VerPseries = () => {
  const navigate = useNavigate();
  const { pserieId } = useParams();
  const BASE_PATH = "/AssetSphere";

  // Estados para todos los campos del servidor
  const [name, setName] = useState("");
  const [application, setApplication] = useState("");
  const [hostname, setHostName] = useState("");
  const [ip_address, setIpAddress] = useState("");
  const [environment, setEnvironment] = useState("");
  const [slot, setSlot] = useState("");
  const [lpar_id, setLparId] = useState("");
  const [status, setStatus] = useState("");
  const [os, setOs] = useState("");
  const [version, setVersion] = useState("");
  const [subsidiary, setSubsidiary] = useState("");
  const [min_cpu, setMinCpu] = useState("");
  const [act_cpu, setActCpu] = useState("");
  const [max_cpu, setMaxCpu] = useState("");
  const [min_v_cpu, setMinVCpu] = useState("");
  const [act_v_cpu, setActVCpu] = useState("");
  const [max_v_cpu, setMaxVCpu] = useState("");
  const [min_memory, setMinMemory] = useState("");
  const [act_memory, setActMemory] = useState("");
  const [max_memory, setMaxMemory] = useState("");
  const [expansion_factor, setExpansionFactor] = useState("");
  const [memory_per_factor, setMemoryPerFactor] = useState("");
  const [processor_compatibility, setProcessorCompatibility] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Configuración de secciones para organizar la vista
   * Agrupa campos relacionados para mejor legibilidad
   */
  const formSections = [
    {
      title: "Información Básica",
      fields: [
        { key: "name", label: "Nombre LPAR en la HMC", value: name },
        { key: "application", label: "Aplicación", value: application },
        { key: "hostname", label: "Hostname", value: hostname },
        { key: "ip_address", label: "Dirección IP", value: ip_address },
        { key: "environment", label: "Ambiente", value: environment },
        { key: "subsidiary", label: "Filial", value: subsidiary },
      ],
    },
    {
      title: "Ubicación y Hardware",
      fields: [
        { key: "slot", label: "Cajón", value: slot },
        { key: "lpar_id", label: "ID LPAR", value: lpar_id },
      ],
    },
    {
      title: "Sistema Operativo",
      fields: [
        { key: "os", label: "Sistema Operativo", value: os },
        { key: "version", label: "Versión", value: version },
        { key: "status", label: "Estado", value: status },
      ],
    },
    {
      title: "Recursos CPU",
      fields: [
        { key: "min_cpu", label: "CPU MIN", value: min_cpu },
        { key: "act_cpu", label: "CPU ACT", value: act_cpu },
        { key: "max_cpu", label: "CPU MAX", value: max_cpu },
        { key: "min_v_cpu", label: "CPU V MIN", value: min_v_cpu },
        { key: "act_v_cpu", label: "CPU V ACT", value: act_v_cpu },
        { key: "max_v_cpu", label: "CPU V MAX", value: max_v_cpu },
      ],
    },
    {
      title: "Recursos Memoria",
      fields: [
        { key: "min_memory", label: "Memoria MIN", value: min_memory },
        { key: "act_memory", label: "Memoria ACT", value: act_memory },
        { key: "max_memory", label: "Memoria MAX", value: max_memory },
      ],
    },
    {
      title: "Configuración Avanzada",
      fields: [
        {
          key: "expansion_factor",
          label: "Factor de expansión",
          value: expansion_factor,
        },
        {
          key: "memory_per_factor",
          label: "Memoria por factor",
          value: memory_per_factor,
        },
        {
          key: "processor_compatibility",
          label: "Compatibilidad de procesador",
          value: processor_compatibility,
        },
      ],
    },
  ];

  const token = localStorage.getItem("authenticationToken");

  /**
   * Carga los datos del servidor desde la API
   */
  useEffect(() => {
    const fetchPseriesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/pseries/get_by_id/${pserieId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener datos del servidor:", errorData);

          if (response.status === 404) {
            throw new Error("Servidor no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.message || errorData.detail
              }`
            );
          }
        }

        const data = await response.json();

        if (data.status === "success" && data.data) {
          // Poblar todos los estados con los datos obtenidos
          setName(data.data.name || "");
          setApplication(data.data.application || "");
          setHostName(data.data.hostname || "");
          setIpAddress(data.data.ip_address || "");
          setEnvironment(data.data.environment || "");
          setSlot(data.data.slot || "");
          setLparId(data.data.lpar_id || "");
          setStatus(data.data.status || "");
          setOs(data.data.os || "");
          setVersion(data.data.version || "");
          setSubsidiary(data.data.subsidiary || "");
          setMinCpu(data.data.min_cpu || "");
          setActCpu(data.data.act_cpu || "");
          setMaxCpu(data.data.max_cpu || "");
          setMinVCpu(data.data.min_v_cpu || "");
          setActVCpu(data.data.act_v_cpu || "");
          setMaxVCpu(data.data.max_v_cpu || "");
          setMinMemory(data.data.min_memory || "");
          setActMemory(data.data.act_memory || "");
          setMaxMemory(data.data.max_memory || "");
          setExpansionFactor(data.data.expansion_factor || "");
          setMemoryPerFactor(data.data.memory_per_factor || "");
          setProcessorCompatibility(data.data.processor_compatibility || "");
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error en fetchPseriesData:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (pserieId) {
      fetchPseriesData();
    }
  }, [pserieId, token]);

  const getSectionIcon = (title) => {
    switch (title) {
      case "Información Básica":
        return <Server className="text-gray-500" size={16} />;
      case "Ubicación y Hardware":
        return <Layers className="text-gray-500" size={16} />;
      case "Sistema Operativo":
        return <Cpu className="text-gray-500" size={16} />;
      case "Recursos CPU":
        return <Cpu className="text-gray-500" size={16} />;
      case "Recursos Memoria":
        return <HardDrive className="text-gray-500" size={16} />;
      case "Configuración Avanzada":
        return <Sliders className="text-gray-500" size={16} />;
      default:
        return <Server className="text-gray-500" size={16} />;
    }
  };

  const renderStatusBadge = (statusVal) => {
    const s = (statusVal || "").toLowerCase().trim();
    if (s === "activo" || s === "active" || s === "up" || s === "online") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Activo
        </span>
      );
    } else if (s === "mantenimiento" || s === "maintenance") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Mantenimiento
        </span>
      );
    } else if (s === "inactivo" || s === "inactive" || s === "down" || s === "offline") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Inactivo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          {statusVal || "N/A"}
        </span>
      );
    }
  };

  const renderFieldValue = (field) => {
    if (field.key === "status") {
      return renderStatusBadge(field.value);
    }
    return (
      <span className="text-sm font-semibold text-gray-800">
        {field.value || "—"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Cargando detalles del servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/30">
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Volver a la lista</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-sans pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full px-8 py-5 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center shadow-sm">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Ver Registro PSeries
            </h1>
            <p className="text-xs font-semibold text-gray-500">
              Detalles técnicos y recursos de la LPAR
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Regresar</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 mt-8">
        {/* Banner principal rápido */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Nombre LPAR (HMC)</span>
            <span className="text-2xl font-bold text-gray-900">{name || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Dirección IP</span>
            <span className="text-lg font-semibold text-gray-800">{ip_address || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Sistema Operativo</span>
            <span className="text-lg font-semibold text-gray-800">{os ? `${os} ${version}`.trim() : "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Estado</span>
            <div>{renderStatusBadge(status)}</div>
          </div>
        </div>

        {/* Secciones de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-gray-900 rounded-full"></span>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm flex-1">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {section.fields.map((field) => (
                    <div key={field.key} className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {field.label}
                      </span>
                      {renderFieldValue(field)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default VerPseries;
