import { API_URL } from "../../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  ChevronDown,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

const ReportesPseries = () => {
  const navigate = useNavigate();
  const BASE_PATH = "/AssetSphere";

  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [tablaData, setTablaData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authenticationToken");

  // Parsea el contenido CSV en headers + filas
  const parsearCSV = (contenido) => {
    const lineas = contenido.trim().split("\n");
    if (lineas.length === 0) return { headers: [], rows: [] };
    const headers = lineas[0].split(",");
    const rows = lineas.slice(1).map((linea) => linea.split(","));
    return { headers, rows };
  };

  const fetchReportes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/reportes/pseries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setReportes(data);
      if (data.length > 0) {
        setReporteSeleccionado(data[0]);
        setTablaData(parsearCSV(data[0].contenido));
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleSeleccionarReporte = (reporte) => {
    setReporteSeleccionado(reporte);
    setTablaData(parsearCSV(reporte.contenido));
  };

  const handleDescargar = () => {
    if (!reporteSeleccionado) return;
    const blob = new Blob([reporteSeleccionado.contenido], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fecha = reporteSeleccionado.fecha_generado
      ? reporteSeleccionado.fecha_generado.replace(/[: ]/g, "-").slice(0, 19)
      : "reporte";
    a.download = `pseries_reporte_${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "—";
    const d = new Date(fechaStr);
    return d.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-as-brand-600 mb-4"></div>
          <p className="text-as-muted">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-page flex items-center justify-center">
        <div className="as-card p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Error al cargar reportes
            </h2>
          </div>
          <p className="text-sm text-gray-600">{error}</p>
          <button onClick={fetchReportes} className="as-btn-primary mt-5">
            <RefreshCcw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="as-page">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white border-b border-as-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${BASE_PATH}/pseries`)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-as-text flex items-center gap-2">
              <FileText className="text-as-brand-600" size={24} />
              Reportes PSeries
            </h1>
            <p className="text-sm text-as-muted">
              Historial de reportes mensuales generados automáticamente
            </p>
          </div>
        </div>

        {reporteSeleccionado && (
          <button
            onClick={handleDescargar}
            className="as-btn-primary group relative"
            title="Descargar CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Descargar CSV</span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Descargar archivo</span>
          </button>
        )}
      </header>

      <main className="as-container">
        {reportes.length === 0 ? (
          <div className="as-card p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-lg font-semibold text-slate-700">
              No hay reportes generados aún
            </p>
            <p className="text-sm text-slate-500 mt-1">
              El primer reporte se generará automáticamente el día 2 de cada mes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Selector de reporte */}
            <div className="as-card p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Calendar size={16} />
                  Seleccionar reporte:
                </span>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-as-brand-500/20 focus:border-as-brand-500 outline-none transition-all shadow-sm cursor-pointer focus:bg-slate-50"
                    value={reporteSeleccionado?.id ?? ""}
                    onChange={(e) => {
                      const rep = reportes.find(
                        (r) => r.id === parseInt(e.target.value)
                      );
                      if (rep) handleSeleccionarReporte(rep);
                    }}
                  >
                    {reportes.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {formatearFecha(rep.fecha_generado)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {reportes.length} reporte{reportes.length !== 1 ? "s" : ""} disponible{reportes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="as-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">
                    Datos del reporte
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generado el {formatearFecha(reporteSeleccionado?.fecha_generado)} ·{" "}
                    {tablaData.rows.length} registro{tablaData.rows.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {tablaData.headers.length > 0 ? (
                <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                      <tr>
                        {tablaData.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {header.trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tablaData.rows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={
                            "border-b border-slate-100 transition-colors " +
                            (rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/70")
                          }
                        >
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="px-4 py-3 text-slate-700 whitespace-nowrap"
                            >
                              {cell?.trim() || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm">
                  El reporte no tiene datos.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesPseries;
