import { API_URL } from "../../../config/api";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  ChevronDown,
  AlertCircle,
  RefreshCcw,
  Search,
  X,
  BarChart3,
  TrendingUp,
  Server,
  Zap,
} from "lucide-react";

const ReportesPseries = () => {
  const navigate = useNavigate();
  const BASE_PATH = "/AssetSphere";

  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [tablaData, setTablaData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const token = localStorage.getItem("authenticationToken");

  // Parsea el contenido CSV en headers + filas
  const parsearCSV = (contenido) => {
    const lineas = contenido.trim().split("\n");
    if (lineas.length === 0) return { headers: [], rows: [] };
    const headers = lineas[0].split(",");
    const rows = lineas.slice(1).map((linea) => linea.split(","));
    return { headers, rows };
  };

  // Calcula estadísticas para gráficos
  const estadisticas = useMemo(() => {
    if (tablaData.rows.length === 0) {
      return {
        totalServidores: 0,
        totalActivos: 0,
        totalInactivos: 0,
        cpuPromedio: 0,
        memoriaPromedio: 0,
        cpuData: [],
        memoriaData: [],
        estadosData: [],
      };
    }

    const headerMap = {};
    tablaData.headers.forEach((h, i) => {
      headerMap[h.trim().toUpperCase()] = i;
    });

    let cpuActual = [],
      memoriaActual = [],
      estadoCounts = {};
    let totalActivos = 0,
      totalInactivos = 0;

    tablaData.rows.forEach((row) => {
      const estado = row[headerMap["ESTADO"]]?.trim();
      if (estado) {
        estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        if (estado.toLowerCase() === "activo") totalActivos++;
        else totalInactivos++;
      }

      const cpu = parseFloat(row[headerMap["CPU_ACT"]]?.trim());
      const memoria = parseFloat(row[headerMap["MEMORIA_ACT"]]?.trim());

      if (!isNaN(cpu)) cpuActual.push(cpu);
      if (!isNaN(memoria)) memoriaActual.push(memoria);
    });

    const cpuPromedioVal =
      cpuActual.length > 0
        ? (cpuActual.reduce((a, b) => a + b, 0) / cpuActual.length).toFixed(2)
        : 0;
    const memoriaPromedioVal =
      memoriaActual.length > 0
        ? (memoriaActual.reduce((a, b) => a + b, 0) / memoriaActual.length).toFixed(2)
        : 0;

    return {
      totalServidores: tablaData.rows.length,
      totalActivos,
      totalInactivos,
      cpuPromedio: cpuPromedioVal,
      memoriaPromedio: memoriaPromedioVal,
      estadosData: Object.entries(estadoCounts).map(([key, val]) => ({
        name: key,
        value: val,
      })),
    };
  }, [tablaData]);

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
    setBusqueda("");
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

        <div className="flex items-center gap-2">
          {reporteSeleccionado && (
            <button
              onClick={handleDescargar}
              className="as-btn-primary"
              title="Descargar CSV"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Descargar CSV</span>
            </button>
          )}
        </div>
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




            {/* KPIs - Diseño avanzado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 animate-fade-in">
              <div className="rounded-2xl p-6 flex items-center gap-5 shadow-lg bg-gradient-to-br from-gray-50 via-white to-blue-50 border border-blue-100 hover:scale-[1.03] transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-full p-3 flex items-center justify-center shadow">
                  <Server size={28} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Servidores</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">{estadisticas.totalServidores}</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-5 shadow-lg bg-gradient-to-br from-gray-50 via-white to-green-50 border border-green-100 hover:scale-[1.03] transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-100 to-green-300 rounded-full p-3 flex items-center justify-center shadow">
                  <TrendingUp size={28} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Activos</p>
                  <p className="text-3xl font-extrabold text-green-900 mt-1">{estadisticas.totalActivos}</p>
                </div>
              </div>
            </div>


            {/* Gráficos y resumen de estados ocultos para vista más limpia */}



            {/* Tabla de datos - Diseño avanzado */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden mt-10 animate-fade-in">
              <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-blue-900 tracking-tight">Detalle de Servidores</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Generado el {formatearFecha(reporteSeleccionado?.fecha_generado)} · {tablaData.rows.length} registro{tablaData.rows.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {tablaData.headers.length > 0 ? (
                <>
                  {/* Buscador animado */}
                  <div className="px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={17} className="text-blue-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por cualquier campo..."
                        className="pl-10 pr-8 py-2 text-base rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none w-full bg-white transition-all duration-200 shadow-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                      {busqueda && (
                        <button
                          onClick={() => setBusqueda("")}
                          className="absolute inset-y-0 right-2 flex items-center text-blue-400 hover:text-blue-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
                    <table className="w-full text-base">
                      <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-blue-100">
                        <tr>
                          {tablaData.headers.map((header, i) => (
                            <th
                              key={i}
                              className="px-5 py-4 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider whitespace-nowrap bg-blue-50"
                            >
                              {header.trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tablaData.rows
                          .filter((row) =>
                            busqueda.trim() === ""
                              ? true
                              : row.some((cell) =>
                                  cell?.toLowerCase().includes(busqueda.toLowerCase())
                                )
                          )
                          .map((row, rowIdx) => {
                            const estado = row[
                              tablaData.headers.indexOf("Estado")
                            ]?.trim();
                            let rowColor = rowIdx % 2 === 0 ? "bg-white" : "bg-blue-50/60";
                            if (estado?.toLowerCase() === "activo")
                              rowColor = "bg-green-50/70";
                            else if (estado?.toLowerCase() === "inactivo")
                              rowColor = "bg-red-50/70";
                            else if (estado?.toLowerCase() === "warning")
                              rowColor = "bg-yellow-50/70";

                            return (
                              <tr
                                key={rowIdx}
                                className={`${rowColor} border-b border-blue-100 hover:bg-blue-100/70 transition-colors`}
                              >
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-5 py-3 text-gray-700 whitespace-nowrap text-xs"
                                  >
                                    {cell?.trim() || "—"}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        {tablaData.rows.filter((row) =>
                          busqueda.trim() === ""
                            ? true
                            : row.some((cell) =>
                                cell?.toLowerCase().includes(busqueda.toLowerCase())
                              )
                        ).length === 0 && (
                          <tr>
                            <td
                              colSpan={tablaData.headers.length}
                              className="px-8 py-12 text-center text-blue-300 text-base"
                            >
                              No se encontraron resultados para "{busqueda}"
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-16 text-center text-blue-200 text-base">
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
