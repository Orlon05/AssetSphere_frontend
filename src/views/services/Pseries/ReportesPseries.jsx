/**
 * Componente para visualizar y gestionar los reportes mensuales de PSeries.
 *
 * Funcionalidades:
 * - Carga y muestra reportes históricos en formato tabla
 * - Filtros por año y mes
 * - Parseo y renderizado de archivos CSV
 * - Cálculos automáticos de estadísticas basadas en los datos de los reportes
 * - Opción para simular reportes de meses pasados o el mes actual
 *
 * @file ReportesPseries.jsx
 */

import { API_URL } from "../../../config/api";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../../../components/ProfileDropdown";
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
  TrendingUp,
  Server,
} from "lucide-react";

/**
 * Componente ReportesPseries
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} [props.embedded=false] - Indica si el componente está incrustado en otra vista.
 */
const ReportesPseries = ({ embedded = false }) => {
  const navigate = useNavigate();
  const BASE_PATH = "/AssetSphere";

  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [tablaData, setTablaData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroYear, setFiltroYear] = useState("");
  const [filtroMonth, setFiltroMonth] = useState("");
  const [simulando, setSimulando] = useState(false);
  const [simMensaje, setSimMensaje] = useState("");
  const [simError, setSimError] = useState("");

  const token = localStorage.getItem("authenticationToken");

  /**
   * Parsea una línea de formato CSV, respetando las comillas dobles.
   * @param {string} line - Línea de texto en formato CSV.
   * @returns {string[]} Arreglo de valores parseados.
   */
  const parseCSVLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  /**
   * Parsea el contenido completo de un archivo CSV a un objeto con headers y rows.
   * @param {string} contenido - Contenido en texto del CSV.
   * @returns {Object} Objeto con la forma { headers: [], rows: [] }.
   */
  const parsearCSV = (contenido) => {
    const text = String(contenido || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    if (!text) return { headers: [], rows: [] };
    const lineas = text.split("\n").filter((l) => l !== "");
    if (lineas.length === 0) return { headers: [], rows: [] };
    const headers = parseCSVLine(lineas[0]).map((h) => h.trim());
    const rows = lineas.slice(1).map((linea) => parseCSVLine(linea));
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

    const pickIndex = (candidates) => {
      for (const c of candidates) {
        const idx = headerMap[String(c).toUpperCase()];
        if (idx !== undefined) return idx;
      }
      return undefined;
    };

    const idxEstado = pickIndex(["ESTADO", "STATUS"]);
    const idxCpu = pickIndex(["CPU_ACT", "ACT_CPU", "CPU_Act"]);
    const idxMemoria = pickIndex(["MEMORIA_ACT", "ACT_MEMORY", "Memoria_Act"]);

    let cpuActual = [],
      memoriaActual = [],
      estadoCounts = {};
    let totalActivos = 0,
      totalInactivos = 0;

    tablaData.rows.forEach((row) => {
      const estadoRaw = idxEstado !== undefined ? row[idxEstado] : undefined;
      const estado = String(estadoRaw || "").trim();
      if (estado) {
        estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        const e = estado.toLowerCase();
        if (e === "activo" || e === "active" || e === "running") totalActivos++;
        else totalInactivos++;
      }

      const cpu = idxCpu !== undefined ? parseFloat(String(row[idxCpu] || "").trim()) : NaN;
      const memoria = idxMemoria !== undefined ? parseFloat(String(row[idxMemoria] || "").trim()) : NaN;

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

  /**
   * Obtiene la lista de reportes desde el backend.
   * @param {string} year - Año para filtrar (opcional).
   * @param {string} month - Mes para filtrar (opcional).
   */
  const fetchReportes = async (year = filtroYear, month = filtroMonth) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year) params.set("year", year);
      if (month) params.set("month", month);
      const qs = params.toString();

      const response = await fetch(`${API_URL}/reportes/pseries${qs ? `?${qs}` : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
          const body = await response.json();
          if (body?.detail) message = body.detail;
        } catch {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch {
            message = `Error ${response.status}`;
          }
        }
        throw new Error(message);
      }
      const data = await response.json();
      setReportes(data);
      if (data.length > 0) {
        setReporteSeleccionado(data[0]);
        setTablaData(parsearCSV(data[0].contenido));
      } else {
        setReporteSeleccionado(null);
        setTablaData({ headers: [], rows: [] });
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

  /**
   * Aplica el filtro seleccionado para recargar los reportes.
   */
  const handleAplicarFiltro = () => {
    fetchReportes(filtroYear, filtroMonth);
  };

  /**
   * Limpia los filtros y recarga todos los reportes.
   */
  const handleLimpiarFiltro = () => {
    setFiltroYear("");
    setFiltroMonth("");
    fetchReportes("", "");
  };

  /**
   * Simula la generación de reportes del mes actual y del mes anterior mediante llamadas al backend.
   */
  const handleSimularDosMeses = async () => {
    if (simulando) return;
    setSimulando(true);
    setSimMensaje("");
    setSimError("");
    try {
      const now = new Date();
      const yearBase = parseInt(filtroYear || String(now.getFullYear()), 10);
      const monthBase = parseInt(filtroMonth || String(now.getMonth() + 1), 10);
      const prevYear = monthBase > 1 ? yearBase : yearBase - 1;
      const prevMonth = monthBase > 1 ? monthBase - 1 : 12;
      const seedNow = Date.now();

      const doSim = async (y, m, seed) => {
        const response = await fetch(
          `${API_URL}/reportes/pseries/simular?year=${y}&month=${m}&seed=${seed}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          let message = `Error ${response.status}`;
          try {
            const body = await response.json();
            if (body?.detail) message = body.detail;
          } catch {}
          throw new Error(message);
        }
        return response.json().catch(() => null);
      };

      const r1 = await doSim(
        yearBase,
        monthBase,
        parseInt(`${yearBase}${String(monthBase).padStart(2, "0")}01`, 10)
      );
      const r2 = await doSim(
        prevYear,
        prevMonth,
        seedNow
      );

      const m1 = r1?.reporte?.filename
        ? `${r1.reporte.filename} (id ${r1.reporte.id})`
        : `Mes ${monthBase}/${yearBase}`;
      const m2 = r2?.reporte?.filename
        ? `${r2.reporte.filename} (id ${r2.reporte.id})`
        : `Mes ${prevMonth}/${prevYear}`;
      setSimMensaje(`Listo: ${m1} y ${m2}`);

      fetchReportes("", "");
    } catch (err) {
      setSimError(err.message || "No se pudo simular el reporte.");
    } finally {
      setSimulando(false);
    }
  };

  /**
   * Actualiza el estado con el reporte seleccionado para su visualización.
   * @param {Object} reporte - Reporte seleccionado.
   */
  const handleSeleccionarReporte = (reporte) => {
    setReporteSeleccionado(reporte);
    setTablaData(parsearCSV(reporte.contenido));
    setBusqueda("");
  };

  /**
   * Permite descargar el contenido del reporte seleccionado como un archivo CSV.
   */
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

  /**
   * Formatea una fecha a un formato amigable.
   * @param {string} fechaStr - Fecha original.
   * @returns {string} Fecha formateada.
   */
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
      <div className="min-h-screen w-full text-gray-800 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-as-muted">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full text-gray-800 dark:text-slate-100 flex items-center justify-center">
        <div className="as-card p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Error al cargar reportes
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400">{error}</p>
          <button onClick={fetchReportes} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition mt-5">
            <RefreshCcw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? "" : "as-page"}>
      {!embedded && (
        <header className="w-full px-6 py-5 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-as-border shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`${BASE_PATH}/pseries`)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-as-text flex items-center gap-2">
                <FileText className="text-gray-900 dark:text-white" size={24} />
                Reportes PSeries
              </h1>
              <p className="text-sm text-as-muted">
                Historial de reportes mensuales generados automáticamente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimularDosMeses}
              disabled={simulando}
              className={`px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition ${simulando ? "opacity-70 cursor-not-allowed" : ""}`}
              title="Crea 2 reportes simulados (mes actual y mes anterior)"
            >
              <RefreshCcw size={16} />
              <span className="hidden sm:inline">
                {simulando ? "Simulando..." : "Simular 2 meses"}
              </span>
            </button>
            {reporteSeleccionado && (
              <button
                onClick={handleDescargar}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                title="Descargar CSV"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Descargar CSV</span>
              </button>
            )}
            <ProfileDropdown />
          </div>
        </header>
      )}

      <main className={embedded ? "" : "as-container"}>
        <div className="as-card p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600">Año:</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-gray-500/20 focus:border-gray-900 outline-none transition-all shadow-sm cursor-pointer focus:bg-slate-50"
                  value={filtroYear}
                  onChange={(e) => setFiltroYear(e.target.value)}
                >
                  <option value="">Todos</option>
                  {Array.from({ length: 10 }, (_, i) =>
                    String(new Date().getFullYear() - i)
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-600">Mes:</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-gray-500/20 focus:border-gray-900 outline-none transition-all shadow-sm cursor-pointer focus:bg-slate-50"
                  value={filtroMonth}
                  onChange={(e) => setFiltroMonth(e.target.value)}
                >
                  <option value="">Todos</option>
                  {[
                    ["1", "Ene"],
                    ["2", "Feb"],
                    ["3", "Mar"],
                    ["4", "Abr"],
                    ["5", "May"],
                    ["6", "Jun"],
                    ["7", "Jul"],
                    ["8", "Ago"],
                    ["9", "Sep"],
                    ["10", "Oct"],
                    ["11", "Nov"],
                    ["12", "Dic"],
                  ].map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
              <button
                onClick={handleAplicarFiltro}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
              >
                Filtrar
              </button>
              <button
                onClick={handleLimpiarFiltro}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Limpiar
              </button>
            </div>

            {embedded && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleSimularDosMeses}
                  disabled={simulando}
                  className={`px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition ${simulando ? "opacity-70 cursor-not-allowed" : ""}`}
                  title="Crea 2 reportes simulados (mes actual y mes anterior)"
                >
                  <RefreshCcw size={16} />
                  <span className="hidden sm:inline">
                    {simulando ? "Simulando..." : "Simular 2 meses"}
                  </span>
                </button>
                {reporteSeleccionado && (
                  <button
                    onClick={handleDescargar}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    title="Descargar CSV"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Descargar CSV</span>
                  </button>
                )}
              </div>
            )}
          </div>
          {(simMensaje || simError) && (
            <div
              className={`mt-3 text-sm ${
                simError ? "text-red-600" : "text-green-700"
              }`}
            >
              {simError || simMensaje}
            </div>
          )}
        </div>

        {reportes.length === 0 ? (
          <div className="as-card p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-lg font-semibold text-slate-700">
              {filtroYear || filtroMonth
                ? "No hay reportes para el filtro seleccionado"
                : "No hay reportes generados aún"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {filtroYear || filtroMonth
                ? "Prueba cambiando el año/mes o limpiando el filtro."
                : "El primer reporte se generará automáticamente el día 2 de cada mes."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* CORRECCIÓN: KPIs adaptados a la nueva escala de grises para un diseño más limpio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 animate-fade-in">
              <div className="rounded-2xl p-6 flex items-center gap-5 shadow-sm bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 hover:scale-[1.01] transition-transform duration-300">
                <div className="bg-gray-200 text-gray-700 dark:text-slate-300 rounded-full p-3 flex items-center justify-center shadow">
                  <Server size={28} className="text-gray-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Total Servidores</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{estadisticas.totalServidores}</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-5 shadow-sm bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 hover:scale-[1.01] transition-transform duration-300">
                <div className="bg-gray-200 text-gray-700 dark:text-slate-300 rounded-full p-3 flex items-center justify-center shadow">
                  <TrendingUp size={28} className="text-gray-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Activos</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{estadisticas.totalActivos}</p>
                </div>
              </div>
            </div>


            {/* Gráficos y resumen de estados ocultos para vista más limpia */}



            {/* CORRECCIÓN: Tabla de detalles adaptada a escala de grises (bordes y sombras suaves) */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md overflow-hidden mt-10 animate-fade-in">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Detalle de Servidores</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Generado el {formatearFecha(reporteSeleccionado?.fecha_generado)} · {tablaData.rows.length} registro{tablaData.rows.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {tablaData.headers.length > 0 ? (
                <>
                  {/* Buscador animado */}
                  <div className="px-8 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={17} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por cualquier campo..."
                        className="pl-10 pr-8 py-2 text-base rounded-lg border border-gray-200 dark:border-slate-700 focus:border-gray-400 outline-none w-full bg-white dark:bg-slate-800 transition-all duration-200 shadow-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                      {busqueda && (
                        <button
                          onClick={() => setBusqueda("")}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-700 dark:text-slate-300"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
                    <table className="w-full text-base">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                          {tablaData.headers.map((header, i) => (
                            <th
                              key={i}
                              className="px-5 py-4 text-left text-xs font-extrabold text-gray-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-slate-900/50"
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
                            const idxEstado =
                              tablaData.headers.findIndex(
                                (h) =>
                                  String(h || "").trim().toUpperCase() ===
                                    "ESTADO" ||
                                  String(h || "").trim().toUpperCase() ===
                                    "STATUS"
                              );
                            const estadoRaw = idxEstado >= 0 ? row[idxEstado] : "";
                            const estado = String(estadoRaw || "").trim();
                            let rowColor = rowIdx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-900/50/50";
                            if (estado?.toLowerCase() === "activo" || estado?.toLowerCase() === "active" || estado?.toLowerCase() === "running")
                              rowColor = "bg-emerald-50/40";
                            else if (estado?.toLowerCase() === "inactivo" || estado?.toLowerCase() === "inactive")
                              rowColor = "bg-rose-50/40";
                            else if (estado?.toLowerCase() === "warning")
                              rowColor = "bg-amber-50/40";

                            return (
                              <tr
                                key={rowIdx}
                                className={`${rowColor} border-b border-gray-100 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800/50 transition-colors`}
                              >
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-5 py-3 text-gray-700 dark:text-slate-300 whitespace-nowrap text-xs"
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
                              className="px-8 py-12 text-center text-gray-400 text-base"
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
                <div className="p-16 text-center text-gray-400 text-base">
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






