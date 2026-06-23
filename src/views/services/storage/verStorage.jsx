/**
 * @file verStorage.jsx
 * @description Component to visualize the details of a storage device in read-only mode.
 * It manages different API response structures and organizes information into logical sections.
 */
import { API_URL } from "../../../config/api";

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
  Edit,
  Printer,
  ArrowUpRight,
} from "lucide-react";

/**
 * Main component for viewing storage device details.
 * @param {Object} props - Component props.
 * @param {string} [props.storageId] - Optional ID of the storage device to view. If not provided, it's extracted from URL params.
 * @param {Function} [props.onClose] - Optional callback function to execute when closing the view.
 * @param {boolean} [props.isModal] - Indicates if the component is being rendered inside a modal.
 * @returns {JSX.Element} The rendered component.
 */
const VerStorage = ({ storageId: propStorageId, onClose, isModal }) => {
  const navigate = useNavigate();
  const [storageData, setStorageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storageId: routeStorageId } = useParams();
  const storageId = propStorageId || routeStorageId;
  const BASE_PATH = "/AssetSphere";

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

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
        return <Database className="text-gray-500 dark:text-slate-400" size={16} />;
      case "Configuración de Red":
        return <Network className="text-gray-500 dark:text-slate-400" size={16} />;
      case "Especificaciones Técnicas":
        return <Cpu className="text-gray-500 dark:text-slate-400" size={16} />;
      case "Información Organizacional":
        return <Layers className="text-gray-500 dark:text-slate-400" size={16} />;
      default:
        return <Database className="text-gray-500 dark:text-slate-400" size={16} />;
    }
  };

  /**
   * Generates a premium grayscale/subtle status badge.
   * @param {string} statusVal - The status value to evaluate.
   * @returns {JSX.Element} The badge element.
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
   * Generates a premium grayscale/subtle active badge.
   * @param {string} activeVal - The active value to evaluate.
   * @returns {JSX.Element} The active badge element.
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
   * Renders the value for a specific field, including status and active badges.
   * @param {string} field - The name of the field to render.
   * @returns {JSX.Element} The rendered field value.
   */
  const renderFieldValue = (field) => {
    const val = storageData[field];
    if (field === "status") {
      return renderStatusBadge(val);
    }
    if (field === "active") {
      return renderActiveBadge(val);
    }
    if ((field === "host_name" || field === "serial" || field === "ip_address") && val) {
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">{val}</span>
          <button
            onClick={() => navigate(`${BASE_PATH}/storage-inv?search=${encodeURIComponent(val)}`)}
            className="text-indigo-600 hover:text-indigo-800 text-[10px] font-extrabold underline flex items-center gap-0.5 print:hidden"
            title="Buscar en Inventario"
          >
            <ArrowUpRight size={10} />
            <span>Ver Inventario</span>
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
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-slate-400">Cargando detalles del storage...</p>
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
            onClick={handleClose}
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
    <div className={isModal ? "p-6 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 pb-4 print:bg-white dark:bg-slate-800 print:pb-0" : "min-h-screen bg-[#fcfcfc] text-gray-800 dark:text-slate-100 font-sans pb-12 print:bg-white dark:bg-slate-800 print:pb-0"}>
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, button, nav, aside, .sidebar, .print-hide, .no-print {
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
      <header className={`w-full px-8 py-5 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/80 backdrop-blur-md print:hidden ${isModal ? "rounded-t-xl mb-4" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center shadow-sm">
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ver Registro Storage
            </h1>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Detalles completos del dispositivo de almacenamiento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
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
                onClick={() => navigate(`${BASE_PATH}/editar/${storageId}/storages`)}
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
      <main className={isModal ? "max-w-7xl mx-auto mt-2" : "max-w-7xl mx-auto px-8 mt-8"}>
        {/* Banner principal rápido */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Nombre del Storage</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{storageData.name || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Dirección IP</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">{storageData.ip_address || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Número de Serie</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">{storageData.serial || "—"}</span>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-gray-100 dark:bg-slate-800"></div>
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
                <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex-1">
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






