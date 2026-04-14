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

            {/* KPIs - Estadísticas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="as-card p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Total Servidores
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {estadisticas.totalServidores}
                    </p>
                  </div>
                  <Server size={24} className="text-blue-500 opacity-20" />
                </div>
              </div>

              <div className="as-card p-4 border-l-4 border-l-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Servidores Activos
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {estadisticas.totalActivos}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {estadisticas.totalServidores > 0
                        ? (
                            (estadisticas.totalActivos /
                              estadisticas.totalServidores) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp size={24} className="text-green-500 opacity-20" />
                </div>
              </div>

              <div className="as-card p-4 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      CPU Promedio
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {estadisticas.cpuPromedio}%
                    </p>
                  </div>
                  <Zap size={24} className="text-orange-500 opacity-20" />
                </div>
              </div>

              <div className="as-card p-4 border-l-4 border-l-purple-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Memoria Promedio
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {estadisticas.memoriaPromedio} GB
                    </p>
                  </div>
                  <BarChart3 size={24} className="text-purple-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Gráficos */}
            {estadisticas.totalServidores > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Estados */}
                <div className="as-card p-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">
                    Distribución de Estados
                  </h3>
                  {estadisticas.estadosData.length > 0 ? (
                    <Chart
                      options={{
                        chart: { type: "donut" },
                        labels: estadisticas.estadosData.map((d) => d.name),
                        colors: [
                          "#10b981",
                          "#ef4444",
                          "#f59e0b",
                          "#6366f1",
                        ],
                        plotOptions: {
                          pie: {
                            donut: {
                              size: "75%",
                              labels: {
                                show: true,
                                name: {
                                  show: true,
                                  fontSize: "12px",
                                },
                                value: {
                                  show: true,
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                              },
                            },
                          },
                        },
                        legend: { position: "bottom" },
                      }}
                      series={estadisticas.estadosData.map((d) => d.value)}
                      type="donut"
                      height={300}
                    />
                  ) : (
                    <p className="text-slate-400 text-sm">
                      Sin datos de estado
                    </p>
                  )}
                </div>

                {/* Resumen tabla de Estados */}
                <div className="as-card p-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">
                    Resumen de Estados
                  </h3>
                  <div className="space-y-3">
                    {estadisticas.estadosData.map((estado, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: [
                                "#10b981",
                                "#ef4444",
                                "#f59e0b",
                                "#6366f1",
                              ][idx % 4],
                            }}
                          ></div>
                          <span className="text-sm text-slate-700">
                            {estado.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-800">
                            {estado.value}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">
                            (
                            {(
                              (estado.value /
                                estadisticas.totalServidores) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabla de datos */}
            <div className="as-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">
                    Detalle de Servidores
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generado el {formatearFecha(reporteSeleccionado?.fecha_generado)} ·{" "}
                    {tablaData.rows.length} registro{tablaData.rows.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {tablaData.headers.length > 0 ? (
                <>
                  {/* Buscador */}
                  <div className="px-6 py-3 border-b border-slate-100 bg-white">
                    <div className="relative max-w-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={15} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar en el reporte..."
                        className="as-input pl-9 pr-8 py-1.5 text-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                      {busqueda && (
                        <button
                          onClick={() => setBusqueda("")}
                          className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <tr>
                          {tablaData.headers.map((header, i) => (
                            <th
                              key={i}
                              className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap bg-slate-50"
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
                            let rowColor = "bg-white";
                            if (estado?.toLowerCase() === "activo")
                              rowColor = "bg-green-50/50";
                            else if (estado?.toLowerCase() === "inactivo")
                              rowColor = "bg-red-50/50";
                            else if (estado?.toLowerCase() === "warning")
                              rowColor = "bg-yellow-50/50";

                            return (
                              <tr
                                key={rowIdx}
                                className={`${rowColor} border-b border-slate-100 hover:bg-opacity-75 transition-colors`}
                              >
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-4 py-3 text-slate-700 whitespace-nowrap text-xs"
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
                              className="px-6 py-10 text-center text-slate-400 text-sm"
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
