// editar-sucursal.jsx
"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Building, Save, ArrowLeft } from "lucide-react";

export default function EditarSucursal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_PATH = "/inveplus";
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchSucursal();
  }, [id]);

  useEffect(() => {
    // Verificar si hay cambios comparando con los datos originales
    const hasDataChanged =
      JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasDataChanged);
  }, [formData, originalData]);

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
        const sucursal = data.data;

        // Formatear fechas para el input date
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          } catch (error) {
            return "";
          }
        };

        const formattedData = {
          name: sucursal.name || "",
          brand: sucursal.brand || "",
          model: sucursal.model || "",
          processor: sucursal.processor || "",
          cpu_cores: sucursal.cpu_cores ? sucursal.cpu_cores.toString() : "",
          ram: sucursal.ram ? sucursal.ram.toString() : "",
          total_disk_size: sucursal.total_disk_size || "",
          os_type: sucursal.os_type || "",
          os_version: sucursal.os_version || "",
          status: sucursal.status || "Activo",
          role: sucursal.role || "",
          environment: sucursal.environment || "",
          serial: sucursal.serial || "",
          rack_id: sucursal.rack_id || "",
          unit: sucursal.unit || "",
          ip_address: sucursal.ip_address || "",
          city: sucursal.city || "",
          location: sucursal.location || "",
          asset_id: sucursal.asset_id || "",
          service_owner: sucursal.service_owner || "",
          warranty_start_date: formatDateForInput(sucursal.warranty_start_date),
          warranty_end_date: formatDateForInput(sucursal.warranty_end_date),
          application_code: sucursal.application_code || "",
          responsible_evc: sucursal.responsible_evc || "",
          domain: sucursal.domain || "",
          subsidiary: sucursal.subsidiary || "",
          responsible_organization: sucursal.responsible_organization || "",
          billable: sucursal.billable || "",
          oc_provisioning: sucursal.oc_provisioning || "",
          oc_deletion: sucursal.oc_deletion || "",
          oc_modification: sucursal.oc_modification || "",
          maintenance_period: sucursal.maintenance_period || "",
          maintenance_organization: sucursal.maintenance_organization || "",
          cost_center: sucursal.cost_center || "",
          billing_type: sucursal.billing_type || "",
          branch_code: sucursal.branch_code || "",
          branch_name: sucursal.branch_name || "",
          region: sucursal.region || "",
          department: sucursal.department || "",
          comments: sucursal.comments || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
      }
    } catch (error) {
      console.error("Error al cargar la sucursal:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información de la sucursal",
      }).then(() => {
        navigate(`${BASE_PATH}/sucursales`);
      });
    } finally {
      setLoadingData(false);
    }
  };

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

      const response = await fetch(
        `http://localhost:8000/branches/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la sucursal");
      }

      const data = await response.json();

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Sucursal actualizada correctamente",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate(`${BASE_PATH}/sucursales`);
      });
    } catch (error) {
      console.error("Error al actualizar la sucursal:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al actualizar la sucursal",
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando datos de la sucursal...</p>
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
            Editar Sucursal
          </h1>
          <p className="text-sm text-gray-900">
            Modifica los datos de la sucursal
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
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </header>

      {/* Main Content - Reutilizar el mismo formulario que crear-sucursal.jsx */}
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

            {/* Resto de las secciones del formulario - igual que en crear-sucursal.jsx */}
            {/* ... (incluir todas las demás secciones) */}
          </form>
        </div>
      </main>
    </div>
  );
}
