import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import Swal from "sweetalert2";

const BASE_PATH = "/inveplus";

const CrearServidorFisico = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    status: "active",
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
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authenticationToken");

      const response = await fetch(
        "http://localhost:8000/servers/physical/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servidor creado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate(`${BASE_PATH}/servidoresf`);
      });
    } catch (error) {
      console.error("Error al crear servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al crear el servidor",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`${BASE_PATH}/servidoresf`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Crear Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Ingresa la información del nuevo servidor
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Marca
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modelo
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="serial"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Serial
                  </label>
                  <input
                    type="text"
                    id="serial"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ip_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección IP
                  </label>
                  <input
                    type="text"
                    id="ip_address"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Especificaciones Técnicas */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="processor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Procesador
                  </label>
                  <input
                    type="text"
                    id="processor"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cpu_cores"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Núcleos CPU
                  </label>
                  <input
                    type="text"
                    id="cpu_cores"
                    name="cpu_cores"
                    value={formData.cpu_cores}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ram"
                    className="block text-sm font-medium text-gray-700"
                  >
                    RAM
                  </label>
                  <input
                    type="text"
                    id="ram"
                    name="ram"
                    value={formData.ram}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="total_disk_size"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tamaño Disco Total
                  </label>
                  <input
                    type="text"
                    id="total_disk_size"
                    name="total_disk_size"
                    value={formData.total_disk_size}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="os_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de OS
                  </label>
                  <input
                    type="text"
                    id="os_type"
                    name="os_type"
                    value={formData.os_type}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="os_version"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Versión de OS
                  </label>
                  <input
                    type="text"
                    id="os_version"
                    name="os_version"
                    value={formData.os_version}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Ubicación y Organización */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Ubicación y Organización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="rack_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rack ID
                  </label>
                  <input
                    type="text"
                    id="rack_id"
                    name="rack_id"
                    value={formData.rack_id}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unidad
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ubicación
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subsidiary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sucursal
                  </label>
                  <input
                    type="text"
                    id="subsidiary"
                    name="subsidiary"
                    value={formData.subsidiary}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="domain"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dominio
                  </label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Información Administrativa */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Administrativa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rol
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="environment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Entorno
                  </label>
                  <input
                    type="text"
                    id="environment"
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="asset_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID de Activo
                  </label>
                  <input
                    type="text"
                    id="asset_id"
                    name="asset_id"
                    value={formData.asset_id}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="service_owner"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Propietario del Servicio
                  </label>
                  <input
                    type="text"
                    id="service_owner"
                    name="service_owner"
                    value={formData.service_owner}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="responsible_evc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Responsable EVC
                  </label>
                  <input
                    type="text"
                    id="responsible_evc"
                    name="responsible_evc"
                    value={formData.responsible_evc}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="responsible_organization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organización Responsable
                  </label>
                  <input
                    type="text"
                    id="responsible_organization"
                    name="responsible_organization"
                    value={formData.responsible_organization}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Garantía y Facturación */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Garantía y Facturación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="warranty_start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Inicio Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_start_date"
                    name="warranty_start_date"
                    value={formData.warranty_start_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="warranty_end_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha Fin Garantía
                  </label>
                  <input
                    type="date"
                    id="warranty_end_date"
                    name="warranty_end_date"
                    value={formData.warranty_end_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="billable"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Facturable
                  </label>
                  <input
                    type="text"
                    id="billable"
                    name="billable"
                    value={formData.billable}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cost_center"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Centro de Costos
                  </label>
                  <input
                    type="text"
                    id="cost_center"
                    name="cost_center"
                    value={formData.cost_center}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="billing_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de Facturación
                  </label>
                  <input
                    type="text"
                    id="billing_type"
                    name="billing_type"
                    value={formData.billing_type}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Órdenes y Mantenimiento */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Órdenes y Mantenimiento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="oc_provisioning"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Provisionamiento OC
                  </label>
                  <input
                    type="text"
                    id="oc_provisioning"
                    name="oc_provisioning"
                    value={formData.oc_provisioning}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="oc_deletion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Eliminación OC
                  </label>
                  <input
                    type="text"
                    id="oc_deletion"
                    name="oc_deletion"
                    value={formData.oc_deletion}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="oc_modification"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modificación OC
                  </label>
                  <input
                    type="text"
                    id="oc_modification"
                    name="oc_modification"
                    value={formData.oc_modification}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="maintenance_period"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Periodo de Mantenimiento
                  </label>
                  <input
                    type="text"
                    id="maintenance_period"
                    name="maintenance_period"
                    value={formData.maintenance_period}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="maintenance_organization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organización de Mantenimiento
                  </label>
                  <input
                    type="text"
                    id="maintenance_organization"
                    name="maintenance_organization"
                    value={formData.maintenance_organization}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Adicional
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="application_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Código de Aplicación
                  </label>
                  <input
                    type="text"
                    id="application_code"
                    name="application_code"
                    value={formData.application_code}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comentarios
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows="3"
                    value={formData.comments}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <X size={18} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Servidor"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CrearServidorFisico;
