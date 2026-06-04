import { API_URL } from "../../../config/api";
/**
 * Componente para visualizar detalles de dispositivos de Storage
 *
 * Este componente permite:
 * - Mostrar todos los detalles de un dispositivo de storage en modo solo lectura
 * - Organizar la información en secciones lógicas
 * - Aplicar estilos visuales premium en escala de grises
 * - Manejar diferentes estructuras de respuesta de la API
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Layers,
  Cpu,
  Sliders,
  HardDrive,
  AlertCircle,
  Network,
} from "lucide-react";

const VerStorage = () => {
  const navigate = useNavigate();
  const [storageData, setStorageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storageId } = useParams();

  /**
   * Configuración de secciones del formulario para organizar la visualización
   */
  const formSections = [
    {
      title: "Información Básica",
      fields: [
        "name",
        "cod_item_configuracion",
        "serial",
        "host_name",
        "status",
        "active",
      ],
    },
    {
      title: "Configuración de Red",
      fields: ["ip_address"],
    },
    {
      title: "Especificaciones Técnicas",
      fields: [
        "manufacturer",
        "model",
        "type",
        "category",
        "disk_size",
        "item",
      ],
    },
    {
      title: "Información Organizacional",
      fields: [
        "company",
        "organization_responsible",
        "owner",
        "org_maintenance",
        "cost_center",
        "application_code",
        "location",
      ],
    },
  ];

  /**
   * Mapeo de nombres de campos a etiquetas legibles
   */
  const fieldLabels = {
    name: "Nombre",
    cod_item_configuracion: "Código Item Configuración",
    serial: "Número de Serie",
    host_name: "Nombre del Host",
    status: "Estado",
    active: "Activo",
    ip_address: "Dirección IP",
    manufacturer: "Fabricante",
    model: "Modelo",
    type: "Tipo",
    category: "Categoría",
    disk_size: "Tamaño de Disco",
    item: "Item",
    company: "Empresa",
    organization_responsible: "Organización Responsable",
    owner: "Propietario",
    org_maintenance: "Organización de Mantenimiento",
    cost_center: "Centro de Costo",
    application_code: "Código de Aplicación",
    location: "Ubicación",
  };

  /**
   * Obtiene el icono apropiado para cada sección
   */
  const getSectionIcon = (title) => {
    switch (title) {
      case "Información Básica":
        return <Database className="text-gray-500" size={16} />;
      case "Configuración de Red":
        return <Network className="text-gray-500" size={16} />;
      case "Especificaciones Técnicas":
        return <Cpu className="text-gray-500" size={16} />;
      case "Información Organizacional":
        return <Layers className="text-gray-500" size={16} />;
      default:
        return <Database className="text-gray-500" size={16} />;
    }
  };

  /**
   * Obtiene el badge de estado premium en escala de grises / sutil
   */
  const renderStatusBadge = (statusVal) => {
    const s = (statusVal || "").toLowerCase().trim();
    if (s === "aplicado" || s === "activo" || s === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Aplicado
        </span>
      );
    } else if (s === "no aplicado" || s === "inactivo" || s === "inactive") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          No Aplicado
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

  /**
   * Obtiene el badge de activo premium en escala de grises / sutil
   */
  const renderActiveBadge = (activeVal) => {
    const a = (activeVal || "").toLowerCase().trim();
    if (a === "sí" || a === "si" || a === "yes" || a === "active" || a === "true") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Sí
        </span>
      );
    } else if (a === "no" || a === "false") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          No
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          {activeVal || "N/A"}
        </span>
      );
    }
  };

  /**
   * Renderiza el valor del campo
   */
  const renderFieldValue = (field) => {
    const val = storageData[field];
    if (field === "status") {
      return renderStatusBadge(val);
    }
    if (field === "active") {
      return renderActiveBadge(val);
    }
    return (
      <span className="text-sm font-semibold text-gray-800">
        {val || "—"}
      </span>
    );
  };

  /**
   * Carga los datos del storage desde la API
   */
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `${API_URL}/storage/get_by_id/${storageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        let storageInfo = null;

        // Manejo flexible de diferentes estructuras de respuesta
        if (data?.status === "success" && data.data?.storage_info) {
          storageInfo = data.data.storage_info;
        } else if (data?.data?.storage_info) {
          storageInfo = data.data.storage_info;
        } else if (data?.data) {
          storageInfo = data.data;
        } else if (data && typeof data === "object" && !data.error) {
          storageInfo = data;
        }

        if (storageInfo) {
          setStorageData(storageInfo);
        } else {
          console.error("Estructura no reconocida:", data);
          throw new Error(
            "Datos del storage no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId) {
      fetchStorageData();
    }
  }, [storageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Cargando detalles del storage...</p>
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
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Ver Registro Storage
            </h1>
            <p className="text-xs font-semibold text-gray-500">
              Detalles completos del dispositivo de almacenamiento
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
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Nombre del Storage</span>
            <span className="text-2xl font-bold text-gray-900">{storageData.name || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Dirección IP</span>
            <span className="text-lg font-semibold text-gray-800">{storageData.ip_address || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Número de Serie</span>
            <span className="text-lg font-semibold text-gray-800">{storageData.serial || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Estado</span>
            <div>{renderStatusBadge(storageData.status)}</div>
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
                    <div key={field} className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {fieldLabels[field]}
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

export default VerStorage;
