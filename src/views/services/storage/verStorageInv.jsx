import { API_URL } from "../../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  HardDrive,
  Cpu,
  Layers,
  Clock,
  AlertCircle,
  Shield,
  MapPin
} from "lucide-react";

/**
 * Componente para visualizar detalles de registro del Inventario Storage
 */
const VerStorageInv = () => {
  const navigate = useNavigate();
  const { storageId } = useParams();
  const BASE_PATH = "/AssetSphere";
  const token = localStorage.getItem("authenticationToken");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchStorageInvData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/inv/storage/${storageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error al obtener datos de inventario Storage:", errorData);

          if (response.status === 404) {
            throw new Error("Registro de inventario no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.detail || errorData.message || "Error desconocido"
              }`
            );
          }
        }

        const resJson = await response.json();

        if (resJson.status === "success" && resJson.data) {
          setData(resJson.data);
        } else {
          console.error("Estructura de datos inesperada:", resJson);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (err) {
        console.error("Error en fetchStorageInvData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId) {
      fetchStorageInvData();
    }
  }, [storageId, token]);

  const getSectionIcon = (title) => {
    switch (title) {
      case "Información General":
        return <HardDrive className="text-gray-500" size={16} />;
      case "Especificaciones Técnicas":
        return <Cpu className="text-gray-500" size={16} />;
      case "Ubicación Física":
        return <MapPin className="text-gray-500" size={16} />;
      case "Garantía y Soporte":
        return <Shield className="text-gray-500" size={16} />;
      default:
        return <HardDrive className="text-gray-500" size={16} />;
    }
  };

  const renderWarrantyBadge = (statusVal) => {
    const s = (statusVal || "").toLowerCase().trim();
    if (s.includes("support") || s.includes("con soporte")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Con Soporte
        </span>
      );
    } else if (s.includes("expired") || s.includes("expirado")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Expirado
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

  const formSections = [
    {
      title: "Información General",
      fields: [
        { key: "TCSAssetID", label: "TCS Asset ID" },
        { key: "SerialNumber", label: "Número de Serie" },
        { key: "PONumber", label: "Número de PO" },
        { key: "ItemsPurchased", label: "Artículos Adquiridos" },
        { key: "Provider", label: "Proveedor" },
        { key: "LocalVendor", label: "Vendedor Local" },
      ],
    },
    {
      title: "Especificaciones Técnicas",
      fields: [
        { key: "Model", label: "Modelo" },
        { key: "Hostname", label: "Hostname" },
        { key: "IPAddress", label: "Dirección IP" },
        { key: "RawCapacityTB", label: "Capacidad Bruta (TB)" },
        { key: "UsableCapacityTB", label: "Capacidad Utilizable (TB)" },
      ],
    },
    {
      title: "Ubicación Física",
      fields: [
        { key: "GPS", label: "GPS" },
        { key: "Location", label: "Ubicación / Datacenter" },
        { key: "Position", label: "Posición" },
        { key: "RackUnit", label: "Unidad de Rack" },
      ],
    },
    {
      title: "Garantía y Soporte",
      fields: [
        { key: "HWWarrantyStartDate", label: "Inicio de Garantía HW", type: "date" },
        { key: "HWWarrantyEndDate", label: "Fin de Garantía HW", type: "date" },
        { key: "WarrantyStatus", label: "Estado de Garantía", type: "badge" },
        { key: "TypeOfHWSupport", label: "Tipo de Soporte HW" },
      ],
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderFieldValue = (field) => {
    const val = data[field.key];
    if (field.type === "badge" && field.key === "WarrantyStatus") {
      return renderWarrantyBadge(val);
    }
    if (field.type === "date") {
      return (
        <span className="text-sm font-semibold text-gray-800">
          {formatDate(val)}
        </span>
      );
    }
    return (
      <span className="text-sm font-semibold text-gray-800">
        {val || "—"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Cargando detalles de inventario Storage...</p>
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
            <HardDrive size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Ver Registro Completo Inventario Storage
            </h1>
            <p className="text-xs font-semibold text-gray-500">
              Detalles técnicos e información de inventario físico del Storage
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
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Número de Serie</span>
            <span className="text-2xl font-bold text-gray-900">{data.SerialNumber || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Modelo</span>
            <span className="text-lg font-semibold text-gray-800">{data.Model || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Hostname / IP</span>
            <span className="text-lg font-semibold text-gray-800">
              {data.Hostname ? `${data.Hostname} (${data.IPAddress || "—"})` : data.IPAddress || "—"}
            </span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Garantía</span>
            <div>{renderWarrantyBadge(data.WarrantyStatus)}</div>
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

        {/* Descripción / Comentarios si existen */}
        {data.Description && (
          <div className="mt-8 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 bg-gray-900 rounded-full"></span>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Descripción / Comentarios
              </h3>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {data.Description}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerStorageInv;
