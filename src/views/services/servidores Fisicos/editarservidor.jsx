import React, { useState, useEffect } from "react";
import { MdEdit, MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";

// Componente reutilizable para los campos del formulario
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

const EditarServer = () => {
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
    status: "",
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { serverId } = useParams();
  const token = localStorage.getItem("authenticationToken");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const showSuccessToast = () => {
    Toast.fire({ icon: "success", title: "Servidor actualizado exitosamente" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/servers/physical/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();
        if (data.status === "success" && data.data && data.data.server_info) {
          setFormData(data.data.server_info);
        } else {
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener datos del servidor:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail
          ? errorData.detail.map((e) => e.msg).join(", ")
          : errorData.message || "Error en la solicitud";
        throw new Error(errorMessage);
      }

      showSuccessToast();
      navigate("/inveplus/servidoresf");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">
          Cargando datos del servidor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Editar Servidor Físico
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información del servidor
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
                <InputField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Marca"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Modelo"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Serial"
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                  required
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>
                <InputField
                  label="Dirección IP"
                  name="ip_address"
                  value={formData.ip_address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Especificaciones Técnicas */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Procesador"
                  name="processor"
                  value={formData.processor}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Núcleos CPU"
                  name="cpu_cores"
                  value={formData.cpu_cores}
                  onChange={handleInputChange}
                />
                <InputField
                  label="RAM"
                  name="ram"
                  value={formData.ram}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tamaño Disco Total"
                  name="total_disk_size"
                  value={formData.total_disk_size}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tipo de OS"
                  name="os_type"
                  value={formData.os_type}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Versión de OS"
                  name="os_version"
                  value={formData.os_version}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Ubicación y Organización */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Ubicación y Organización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Rack ID"
                  name="rack_id"
                  value={formData.rack_id}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Unidad"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Ciudad"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Sucursal"
                  name="subsidiary"
                  value={formData.subsidiary}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Dominio"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Información Administrativa */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Administrativa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Rol"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Entorno"
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                />
                <InputField
                  label="ID de Activo"
                  name="asset_id"
                  value={formData.asset_id}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Propietario del Servicio"
                  name="service_owner"
                  value={formData.service_owner}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Responsable EVC"
                  name="responsible_evc"
                  value={formData.responsible_evc}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización Responsable"
                  name="responsible_organization"
                  value={formData.responsible_organization}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Garantía y Facturación */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Garantía y Facturación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Fecha Inicio Garantía"
                  name="warranty_start_date"
                  value={formData.warranty_start_date}
                  onChange={handleInputChange}
                  type="date"
                />
                <InputField
                  label="Fecha Fin Garantía"
                  name="warranty_end_date"
                  value={formData.warranty_end_date}
                  onChange={handleInputChange}
                  type="date"
                />
                <InputField
                  label="Facturable"
                  name="billable"
                  value={formData.billable}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Centro de Costos"
                  name="cost_center"
                  value={formData.cost_center}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tipo de Facturación"
                  name="billing_type"
                  value={formData.billing_type}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Órdenes y Mantenimiento */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Órdenes y Mantenimiento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Provisionamiento OC"
                  name="oc_provisioning"
                  value={formData.oc_provisioning}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Eliminación OC"
                  name="oc_deletion"
                  value={formData.oc_deletion}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Modificación OC"
                  name="oc_modification"
                  value={formData.oc_modification}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Periodo de Mantenimiento"
                  name="maintenance_period"
                  value={formData.maintenance_period}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización de Mantenimiento"
                  name="maintenance_organization"
                  value={formData.maintenance_organization}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Adicional
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Código de Aplicación"
                  name="application_code"
                  value={formData.application_code}
                  onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Comentarios
                  </label>
                  <textarea
                    name="comments"
                    rows="3"
                    value={formData.comments}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/inveplus/servidoresf")}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <MdArrowBack size={18} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MdEdit size={18} className="mr-2" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarServer;
