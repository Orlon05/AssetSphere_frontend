// crear-sucursal.jsx
"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Building, Save, ArrowLeft } from "lucide-react";

export default function CrearSucursal() {
  const navigate = useNavigate();
  const BASE_PATH = "/inveplus";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    processor: "",
    cpu_cores: "",
    ram: "",
    total_disk_size: "",
    os_type: "",
    os_version: "",
    status: "Activo",
    role: "",
    environment: "",
    serial: "",
    rack_id: "",
    unit: "",
    ip_address: "",
    city: "",
    location: "",
    asset_id: "",
    service_owner: "",
    warranty_start_date: "",
    warranty_end_date: "",
    application_code: "",
    responsible_evc: "",
    domain: "",
    subsidiary: "",
    responsible_organization: "",
    billable: "",
    oc_provisioning: "",
    oc_deletion: "",
    oc_modification: "",
    maintenance_period: "",
    maintenance_organization: "",
    cost_center: "",
    billing_type: "",
    branch_code: "",
    branch_name: "",
    region: "",
    department: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (formData.cpu_cores && isNaN(parseInt(formData.cpu_cores))) {
      newErrors.cpu_cores = "Debe ser un número";
    }

    if (formData.ram && isNaN(parseInt(formData.ram))) {
      newErrors.ram = "Debe ser un número";
    }

    if (formData.warranty_start_date && formData.warranty_end_date) {
      const startDate = new Date(formData.warranty_start_date);
      const endDate = new Date(formData.warranty_end_date);

      if (startDate > endDate) {
        newErrors.warranty_end_date =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Por favor, corrige los errores en el formulario",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado");
      }

      // Preparar datos para enviar
      const dataToSend = { ...formData };

      // Convertir campos numéricos
      if (dataToSend.cpu_cores) {
        dataToSend.cpu_cores = parseInt(dataToSend.cpu_cores);
      }

      if (dataToSend.ram) {
        dataToSend.ram = parseInt(dataToSend.ram);
      }

      const response = await fetch("http://localhost:8000/sucursales/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la sucursal");
      }

      const data = await response.json();

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Sucursal creada correctamente",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate(`${BASE_PATH}/sucursales`);
      });
    } catch (error) {
      console.error("Error al crear la sucursal:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al crear la sucursal",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Perderás todos los cambios realizados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`${BASE_PATH}/sucursales`);
        }
      });
    } else {
      navigate(`${BASE_PATH}/sucursales`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="mr-2 text-blue-400" />
            Crear Nueva Sucursal
          </h1>
          <p className="text-sm text-gray-900">
            Ingresa los datos de la nueva sucursal
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 flex items-center gap-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            <Save size={16} />
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-300/30 border rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información General */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información General
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`bg-white border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg block w-full p-2.5`}
                    placeholder="Nombre de la sucursal"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Código de Sucursal
                  </label>
                  <input
                    type="text"
                    name="branch_code"
                    value={formData.branch_code}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Código de la sucursal"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Nombre de Sucursal
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Nombre comercial de la sucursal"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Ciudad"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Región
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Región"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Departamento"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Dirección física"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Subsidiaria
                  </label>
                  <input
                    type="text"
                    name="subsidiary"
                    value={formData.subsidiary}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Subsidiaria"
                  />
                </div>
              </div>
            </div>

            {/* Información de Hardware */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Hardware
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Marca del equipo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Modelo del equipo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Procesador
                  </label>
                  <input
                    type="text"
                    name="processor"
                    value={formData.processor}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Tipo de procesador"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Núcleos CPU
                  </label>
                  <input
                    type="number"
                    name="cpu_cores"
                    value={formData.cpu_cores}
                    onChange={handleInputChange}
                    className={`bg-white border ${
                      errors.cpu_cores ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg block w-full p-2.5`}
                    placeholder="Número de núcleos"
                  />
                  {errors.cpu_cores && (
                    <p className="text-red-500 text-xs">{errors.cpu_cores}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    RAM (GB)
                  </label>
                  <input
                    type="number"
                    name="ram"
                    value={formData.ram}
                    onChange={handleInputChange}
                    className={`bg-white border ${
                      errors.ram ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg block w-full p-2.5`}
                    placeholder="Memoria RAM en GB"
                  />
                  {errors.ram && (
                    <p className="text-red-500 text-xs">{errors.ram}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Tamaño de Disco
                  </label>
                  <input
                    type="text"
                    name="total_disk_size"
                    value={formData.total_disk_size}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Ej: 500GB, 1TB"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Tipo de SO
                  </label>
                  <input
                    type="text"
                    name="os_type"
                    value={formData.os_type}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Ej: Windows, Linux"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Versión de SO
                  </label>
                  <input
                    type="text"
                    name="os_version"
                    value={formData.os_version}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Ej: Windows 10, Ubuntu 20.04"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Serial
                  </label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Número de serie"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    ID de Rack
                  </label>
                  <input
                    type="text"
                    name="rack_id"
                    value={formData.rack_id}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Identificador del rack"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Unidad
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Unidad en el rack"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Dirección IP
                  </label>
                  <input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Dirección IP"
                  />
                </div>
              </div>
            </div>

            {/* Información Administrativa */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información Administrativa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    ID de Activo
                  </label>
                  <input
                    type="text"
                    name="asset_id"
                    value={formData.asset_id}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Identificador de activo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Propietario del Servicio
                  </label>
                  <input
                    type="text"
                    name="service_owner"
                    value={formData.service_owner}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Propietario del servicio"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Inicio de Garantía
                  </label>
                  <input
                    type="date"
                    name="warranty_start_date"
                    value={formData.warranty_start_date}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Fin de Garantía
                  </label>
                  <input
                    type="date"
                    name="warranty_end_date"
                    value={formData.warranty_end_date}
                    onChange={handleInputChange}
                    className={`bg-white border ${
                      errors.warranty_end_date
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg block w-full p-2.5`}
                  />
                  {errors.warranty_end_date && (
                    <p className="text-red-500 text-xs">
                      {errors.warranty_end_date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Código de Aplicación
                  </label>
                  <input
                    type="text"
                    name="application_code"
                    value={formData.application_code}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Código de aplicación"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Responsable EVC
                  </label>
                  <input
                    type="text"
                    name="responsible_evc"
                    value={formData.responsible_evc}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Responsable EVC"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Dominio
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Dominio"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Organización Responsable
                  </label>
                  <input
                    type="text"
                    name="responsible_organization"
                    value={formData.responsible_organization}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Organización responsable"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Facturable
                  </label>
                  <select
                    name="billable"
                    value={formData.billable}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Centro de Costo
                  </label>
                  <input
                    type="text"
                    name="cost_center"
                    value={formData.cost_center}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Centro de costo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Tipo de Facturación
                  </label>
                  <input
                    type="text"
                    name="billing_type"
                    value={formData.billing_type}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Tipo de facturación"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Rol
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Rol del sistema"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Entorno
                  </label>
                  <input
                    type="text"
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Entorno (Prod, Test, Dev)"
                  />
                </div>
              </div>
            </div>

            {/* Información de Mantenimiento */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Mantenimiento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    OC Provisión
                  </label>
                  <input
                    type="text"
                    name="oc_provisioning"
                    value={formData.oc_provisioning}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Orden de compra provisión"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    OC Eliminación
                  </label>
                  <input
                    type="text"
                    name="oc_deletion"
                    value={formData.oc_deletion}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Orden de compra eliminación"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    OC Modificación
                  </label>
                  <input
                    type="text"
                    name="oc_modification"
                    value={formData.oc_modification}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Orden de compra modificación"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Período de Mantenimiento
                  </label>
                  <input
                    type="text"
                    name="maintenance_period"
                    value={formData.maintenance_period}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Período de mantenimiento"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Organización de Mantenimiento
                  </label>
                  <input
                    type="text"
                    name="maintenance_organization"
                    value={formData.maintenance_organization}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Organización de mantenimiento"
                  />
                </div>
              </div>
            </div>

            {/* Comentarios */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comentarios
              </h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Comentarios Adicionales
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Comentarios adicionales sobre la sucursal..."
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
