import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Server,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const VerPseries = () => {
  const navigate = useNavigate();
  const { pserieId } = useParams();
  const BASE_PATH = "/inveplus";

  // Estados para todos los campos
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

  // Definición de secciones y campos para PSeries
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

  useEffect(() => {
    const fetchPseriesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/pseries/get_by_id/${pserieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "authenticationToken"
              )}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Intenta leer la respuesta en caso de error
          console.error("Error al obtener datos del servidor:", errorData); // Logs para depuración
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
        // console.log("Datos recibidos:", data);
        // Actualiza los estados con los datos recibidos
        if (data.status === "success" && data.data) {
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
          setMaxVCpu(data.data.max_cpu || "");
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
        console.error("Error en fetchPseriesData:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pserieId) {
      fetchPseriesData();
    }
  }, [pserieId]);

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();

    if (
      statusLower === "active" ||
      statusLower === "activo" ||
      statusLower === "running"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Activo
        </span>
      );
    } else if (
      statusLower === "inactive" ||
      statusLower === "inactivo" ||
      statusLower === "not activated"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" />
          Inactivo
        </span>
      );
    } else if (
      statusLower === "maintenance" ||
      statusLower === "mantenimiento"
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          Mantenimiento
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
  };

  // Función para formatear valores según el tipo de campo
  const formatFieldValue = (field, value) => {
    if (!value) return "-";

    // Campos que podrían necesitar formateo especial
    if (field.includes("memory")) {
      return `${value} GB`;
    }

    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando datos del servidor...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <strong>Error:</strong> {error}
          <button
            onClick={() => navigate(`${BASE_PATH}/pseries`)}
            className="mt-3 block text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="inline mr-1" size={16} /> Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Server className="mr-2 text-blue-600" size={24} />
            Visualizar PSeries
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del servidor{" "}
            <span className="font-bold">{name}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`${BASE_PATH}/pseries`)}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          {formSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.key === "status" ? (
                      <div className="py-2">{getStatusBadge(field.value)}</div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg p-2.5 min-h-[38px] flex items-center">
                        {formatFieldValue(field.key, field.value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default VerPseries;
