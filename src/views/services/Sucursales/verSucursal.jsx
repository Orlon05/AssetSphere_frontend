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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
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
      <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando información de la sucursal...</p>
        </div>
      </div>
    );
  }

  if (error || !sucursal) {
    return (
      <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error || "No se pudo cargar la información de la sucursal"}</p>
          <button
            onClick={() => navigate(`${BASE_PATH}/sucursales`)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="mr-2 text-blue-400" />
            Detalles de Sucursal
          </h1>
          <p className="text-sm text-gray-900">
            {sucursal.branch_name || sucursal.name || "Sucursal"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`${BASE_PATH}/sucursales`)}
            className="px-4 py-2 flex items-center gap-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <button
            onClick={() => navigate(`${BASE_PATH}/editar/${id}/sucursal`)}
            className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Editar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Building className="mr-2 text-blue-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información General
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nombre
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.name || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Código de Sucursal
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.branch_code || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nombre de Sucursal
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.branch_name || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Estado
                  </label>
                  <div className="mt-1">{getStatusBadge(sucursal.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Subsidiaria
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.subsidiary || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Departamento
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.department || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <MapPin className="mr-2 text-green-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Ubicación
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ciudad
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.city || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Región
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.region || "No especificado"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Ubicación Física
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.location || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    ID de Rack
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.rack_id || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Unidad
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.unit || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de Hardware */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Server className="mr-2 text-purple-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Hardware
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Marca
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.brand || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Modelo
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.model || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Procesador
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.processor || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Núcleos CPU
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.cpu_cores || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    RAM (GB)
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.ram ? `${sucursal.ram} GB` : "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tamaño de Disco
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.total_disk_size || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tipo de SO
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.os_type || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Versión de SO
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.os_version || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Serial
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.serial || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Dirección IP
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.ip_address || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información Administrativa */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="mr-2 text-orange-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información Administrativa
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    ID de Activo
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.asset_id || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Propietario del Servicio
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.service_owner || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Código de Aplicación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.application_code || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Responsable EVC
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.responsible_evc || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Dominio
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.domain || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Organización Responsable
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.responsible_organization || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Facturable
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.billable || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Centro de Costo
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.cost_center || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tipo de Facturación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.billing_type || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Rol
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.role || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Entorno
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.environment || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Garantía */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Calendar className="mr-2 text-blue-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Garantía
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Inicio
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(sucursal.warranty_start_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Fin
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(sucursal.warranty_end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mantenimiento */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="mr-2 text-green-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mantenimiento
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Período
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.maintenance_period || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Organización
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.maintenance_organization || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Órdenes de Compra */}
            <div className="bg-white border rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FileText className="mr-2 text-purple-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Órdenes de Compra
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    OC Provisión
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.oc_provisioning || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    OC Eliminación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.oc_deletion || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    OC Modificación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {sucursal.oc_modification || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Comentarios */}
            {sucursal.comments && (
              <div className="bg-white border rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <FileText className="mr-2 text-gray-500" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Comentarios
                  </h2>
                </div>
                <p className="text-gray-900">{sucursal.comments}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
