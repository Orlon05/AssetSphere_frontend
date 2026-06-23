import { API_URL } from "../../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Server,
  Cpu,
  Layers,
  Clock,
  AlertCircle,
  Shield,
  MapPin,
  Edit,
  Printer,
  ArrowUpRight
} from "lucide-react";

/**
 * Componente para visualizar detalles de registro del Inventario PSeries con mejoras
 */
const VerPseriesInv = ({ pserieId: propPserieId, onClose }) => {
  const navigate = useNavigate();
  const { pserieId: urlPserieId } = useParams();
  const pserieId = propPserieId || urlPserieId;
  const isModal = !!propPserieId;
  const BASE_PATH = "/AssetSphere";
  const token = localStorage.getItem("authenticationToken");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  /**
   * Normaliza las llaves de un objeto de datos de inventario.
   * Empareja propiedades ignorando mayúsculas/minúsculas.
   * @param {Object} obj - Objeto a normalizar.
   * @returns {Object} Objeto con llaves normalizadas.
   */
  const normalizeKeys = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const normalized = {};
    const expectedKeys = [
      "TCSAssetID",
      "SerialNumber",
      "PONumber",
      "ItemsPurchased",
      "Provider",
      "LocalVendor",
      "Model",
      "CPU",
      "Memory",
      "Hostname",
      "IPAddress",
      "GPS",
      "Location",
      "Position",
      "RackUnit",
      "HWWarrantyStartDate",
      "HWWarrantyEndDate",
      "WarrantyStatus",
      "TypeOfHWSupport",
      "Description"
    ];
    for (const [key, val] of Object.entries(obj)) {
      const matchedKey = expectedKeys.find(
        (ek) => ek.toLowerCase() === key.toLowerCase()
      );
      if (matchedKey) {
        normalized[matchedKey] = val;
      } else {
        normalized[key] = val;
      }
    }
    return normalized;
  };

  useEffect(() => {
    const fetchPseriesInvData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/inv/pseries/${pserieId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error al obtener datos de inventario PSeries:", errorData);

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
          setData(normalizeKeys(resJson.data));
        } else {
          console.error("Estructura de datos inesperada:", resJson);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (err) {
        console.error("Error en fetchPseriesInvData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pserieId) {
      fetchPseriesInvData();
    }
  }, [pserieId, token]);

  /**
   * Calcula los días restantes basados en una fecha final.
   * @param {string} endDateStr - Fecha final en formato de texto.
   * @returns {number|null} Diferencia en días, o nulo si no es válida.
   */
  const calculateRemainingDays = (endDateStr) => {
    if (!endDateStr) return null;
    const end = new Date(endDateStr);
    if (isNaN(end.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Genera el elemento JSX y el texto con la información de garantía basada en fechas.
   * @param {string} statusVal - Valor textual del estado de garantía.
   * @param {string} endDateStr - Fecha final en formato de texto.
   * @returns {Object} Objeto con las propiedades 'badge' (JSX) y 'text' (string).
   */
  const getWarrantyInfo = (statusVal, endDateStr) => {
    const s = (statusVal || "").toLowerCase().trim();
    const diffDays = calculateRemainingDays(endDateStr);

    if (s.includes("support") || s.includes("con soporte")) {
      if (diffDays !== null) {
        if (diffDays < 0) {
          return {
            badge: (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Soporte Expirado
              </span>
            ),
            text: `La garantía expiró hace ${Math.abs(diffDays)} días`
          };
        } else if (diffDays === 0) {
          return {
            badge: (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Vence Hoy
              </span>
            ),
            text: "El soporte expira el día de hoy"
          };
        } else if (diffDays <= 90) {
          return {
            badge: (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Expira Pronto
              </span>
            ),
            text: `Expira en ${diffDays} días`
          };
        } else {
          return {
            badge: (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Con Soporte
              </span>
            ),
            text: `${diffDays} días restantes de garantía`
          };
        }
      }
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Con Soporte
          </span>
        ),
        text: "Garantía con soporte activo"
      };
    } else if (s.includes("expired") || s.includes("expirado")) {
      const daysText = diffDays !== null ? ` (hace ${Math.abs(diffDays)} días)` : "";
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Expirado
          </span>
        ),
        text: `Garantía vencida${daysText}`
      };
    } else {
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {statusVal || "N/A"}
          </span>
        ),
        text: "Sin detalles de tiempo restante"
      };
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
        { key: "CPU", label: "CPU" },
        { key: "Memory", label: "Memoria" },
        { key: "Hostname", label: "Hostname" },
        { key: "IPAddress", label: "Dirección IP" },
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

  /**
   * Formatea un texto de fecha para mostrarlo.
   * @param {string} dateStr - Fecha en formato texto.
   * @returns {string} Fecha formateada amigable.
   */
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

  /**
   * Renderiza el contenido de un campo de visualización basado en su tipo y valores de datos.
   * @param {Object} field - Definición de campo.
   * @returns {JSX.Element} Componente renderizado para el campo.
   */
  const renderFieldValue = (field) => {
    const val = data[field.key];
    if (field.type === "badge" && field.key === "WarrantyStatus") {
      const warranty = getWarrantyInfo(val, data.HWWarrantyEndDate);
      return (
        <div className="flex flex-col gap-1 items-start">
          {warranty.badge}
          <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">{warranty.text}</span>
        </div>
      );
    }
    if (field.type === "date") {
      return (
        <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
          {formatDate(val)}
        </span>
      );
    }
    if ((field.key === "Hostname" || field.key === "SerialNumber") && val) {
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">{val}</span>
          <button
            onClick={() => navigate(`${BASE_PATH}/pseries?search=${encodeURIComponent(val)}`)}
            className="text-indigo-600 hover:text-indigo-800 text-[10px] font-extrabold underline flex items-center gap-0.5 print:hidden"
            title="Buscar este host en Servicios Activos"
          >
            <ArrowUpRight size={10} />
            <span>Ver Activo</span>
          </button>
        </div>
      );
    }
    return (
      <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
        {val || "—"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-slate-400">Cargando detalles de inventario PSeries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="bg-white dark:bg-slate-800 border border-red-100 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={onClose || (() => navigate(-1))}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>{isModal ? "Cerrar" : "Volver a la lista"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? "p-6" : "min-h-screen pb-12"} bg-[#fcfcfc] text-gray-800 dark:text-slate-100 font-sans print:bg-white dark:bg-slate-800 print:pb-0`}>
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, button, nav, aside, .print-hide, .no-print {
            display: none !important;
          }
          main, .print-full {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .bg-white dark:bg-slate-800 {
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
          }
          .grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}} />

      {/* Header */}
      <header className="w-full px-8 py-5 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-t-xl mb-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center shadow-sm">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ver Registro Completo Inventario PSeries
            </h1>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Detalles técnicos e información de inventario físico de la PSeries
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose || (() => navigate(-1))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 hover:text-gray-900 dark:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>{isModal ? "Cerrar" : "Regresar"}</span>
          </button>
          {!isModal && (
            <>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 hover:text-gray-900 dark:text-white transition-all shadow-sm"
                title="Imprimir ficha técnica"
              >
                <Printer size={16} />
                <span>Imprimir</span>
              </button>
              <button
                onClick={() => navigate(`${BASE_PATH}/editar/${pserieId}/pseries-inv`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm border border-gray-900"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 mt-8 print:mt-0 print:px-0">
        {/* Banner principal rápido */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:shadow-none print:mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Número de Serie</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.SerialNumber || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800 print:hidden"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Modelo</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">{data.Model || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800 print:hidden"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Ubicación / Datacenter</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">{data.Location || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800 print:hidden"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Garantía</span>
            <div>{getWarrantyInfo(data.WarrantyStatus, data.HWWarrantyEndDate).badge}</div>
          </div>
        </div>

        {/* Secciones de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2">
          {formSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-gray-900 rounded-full print:bg-black"></span>
                <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex-1 print:p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 print:gap-y-3">
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
          <div className="mt-8 flex flex-col print:mt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 bg-gray-900 rounded-full print:bg-black"></span>
              <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">
                Descripción / Comentarios
              </h3>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm print:p-4">
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {data.Description}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerPseriesInv;






