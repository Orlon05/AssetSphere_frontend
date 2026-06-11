/**
 * @file verSucursal.jsx
 * @description Component to view the details of a specific branch in read-only mode.
 */
// ver-sucursal.jsx
"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Building,
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  Server,
  Settings,
  FileText,
} from "lucide-react";

/**
 * Main component for viewing the details of a branch.
 * @returns {JSX.Element} The rendered component.
 */
export default function VerSucursal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_PATH = "/AssetSphere";
  const [sucursal, setSucursal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSucursal();
  }, [id]);

  /**
   * Fetches the branch data from the API and updates the state.
   */
  const fetchSucursal = async () => {
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado");
      }

      const response = await fetch(`http://localhost:8000/branches/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos de la sucursal");
      }

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setSucursal(data.data);
      } else {
        throw new Error("Datos de sucursal no encontrados");
      }
    } catch (error) {
      console.error("Error al cargar la sucursal:", error);
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información de la sucursal",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats a date string into a localized Spanish format.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string, or a fallback string if invalid.
   */
  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100">
          Sin estado
        </span>
      );
    }

    const statusLower = status.toLowerCase();

    if (statusLower === "active" || statusLower === "activo") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Activo
        </span>
      );
    } else if (statusLower === "inactive" || statusLower === "inactivo") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Inactivo
        </span>
      );
    } else if (
      statusLower === "maintenance" ||
      statusLower === "mantenimiento"
    ) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Mantenimiento
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {status}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full text-gray-800 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-as-brand-500 border-t-transparent mb-4"></div>
          <p className="text-as-text font-medium">Cargando información de la sucursal...</p>
        </div>
      </div>
    );
  }

  if (error || !sucursal) {
    return (
      <div className="min-h-screen w-full text-gray-800 dark:text-slate-100 flex items-center justify-center p-6">
        <div className="as-card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-as-text mb-2">Error</h2>
          <p className="text-as-muted mb-6">
            {error || "No se pudo cargar la información de la sucursal"}
          </p>
          <button
            onClick={() => navigate(`${BASE_PATH}/sucursales`)}
            className="as-btn-primary w-full justify-center"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-gray-800 dark:text-slate-100">
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-as-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-as-text flex items-center">
            <Building className="mr-2 text-as-brand-600" />
            Detalles de Sucursal
          </h1>
          <p className="text-sm text-as-muted mt-1">
            {sucursal.branch_name || sucursal.name || "Sucursal"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`${BASE_PATH}/sucursales`)}
            className="as-btn-secondary"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <button
            onClick={() => navigate(`${BASE_PATH}/editar/${id}/sucursal`)}
            className="as-btn-primary"
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="as-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="as-card p-6">
              <div className="flex items-center mb-4">
                <Building className="mr-2 text-blue-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información General
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Nombre
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.name || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Código de Sucursal
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.branch_code || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Nombre de Sucursal
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.branch_name || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Estado
                  </label>
                  <div className="mt-1">{getStatusBadge(sucursal.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Subsidiaria
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.subsidiary || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Departamento
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.department || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="as-card p-6">
              <div className="flex items-center mb-4">
                <MapPin className="mr-2 text-green-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ubicación
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Ciudad
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.city || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Región
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.region || "No especificado"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Ubicación Física
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.location || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    ID de Rack
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.rack_id || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Unidad
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.unit || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de Hardware */}
            <div className="as-card p-6">
              <div className="flex items-center mb-4">
                <Server className="mr-2 text-purple-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hardware
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Marca
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.brand || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Modelo
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.model || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Procesador
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.processor || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Núcleos CPU
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.cpu_cores || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    RAM (GB)
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.ram ? `${sucursal.ram} GB` : "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Tamaño de Disco
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.total_disk_size || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Tipo de SO
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.os_type || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Versión de SO
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.os_version || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Serial
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.serial || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Dirección IP
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.ip_address || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información Administrativa */}
            <div className="as-card p-6">
              <div className="flex items-center mb-4">
                <Settings className="mr-2 text-orange-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información Administrativa
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    ID de Activo
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.asset_id || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Propietario del Servicio
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.service_owner || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Código de Aplicación
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.application_code || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Responsable EVC
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.responsible_evc || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Dominio
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.domain || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Organización Responsable
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.responsible_organization || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Facturable
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.billable || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Centro de Costo
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.cost_center || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Tipo de Facturación
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.billing_type || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Rol
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.role || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Entorno
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.environment || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Garantía */}
            <div className="bg-white dark:bg-slate-800 border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Calendar className="mr-2 text-blue-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Garantía
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Inicio
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDate(sucursal.warranty_start_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Fin
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDate(sucursal.warranty_end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mantenimiento */}
            <div className="bg-white dark:bg-slate-800 border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="mr-2 text-green-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mantenimiento
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Período
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.maintenance_period || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    Organización
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.maintenance_organization || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Órdenes de Compra */}
            <div className="bg-white dark:bg-slate-800 border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FileText className="mr-2 text-purple-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Órdenes de Compra
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    OC Provisión
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.oc_provisioning || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    OC Eliminación
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.oc_deletion || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">
                    OC Modificación
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {sucursal.oc_modification || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Comentarios */}
            {sucursal.comments && (
              <div className="bg-white dark:bg-slate-800 border rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <FileText className="mr-2 text-gray-500 dark:text-slate-400" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Comentarios
                  </h2>
                </div>
                <p className="text-gray-900 dark:text-white">{sucursal.comments}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}






