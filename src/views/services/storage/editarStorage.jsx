import { useState, useEffect } from "react";
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

const EditarStorage = () => {
  const [formData, setFormData] = useState({
    cod_item_configuracion: "",
    name: "",
    application_code: "",
    cost_center: "",
    active: "Sí",
    category: "",
    type: "",
    item: "",
    company: "",
    organization_responsible: "",
    host_name: "",
    manufacturer: "",
    status: "Aplicado",
    owner: "",
    model: "",
    serial: "",
    org_maintenance: "",
    ip_address: "",
    disk_size: "",
    location: "",
  });

  // Opciones para campos de selección
  const statusOptions = ["Aplicado", "No Aplicado"];
  const activeOptions = ["Sí", "No"];
  const typeOptions = ["SAN", "NAS", "DAS", "Local Storage", "Cloud Storage"];
  const manufacturerOptions = [
    "Dell",
    "HP",
    "IBM",
    "NetApp",
    "EMC",
    "Hitachi",
    "Pure Storage",
  ];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authenticationToken");
  const BASE_PATH = "/inveplus";
  const { storageId } = useParams();

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
    Toast.fire({ icon: "success", title: "Storage actualizado exitosamente" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchStorageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://10.8.150.90/api/inveplus/storage/get_by_id/${storageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();

        if (data && data.data && data.data.storage_info) {
          setFormData(data.data.storage_info);
        } else if (data && data.storage_info) {
          setFormData(data.storage_info);
        } else if (data && data.data) {
          setFormData(data.data);
        } else if (data && typeof data === "object") {
          setFormData(data);
        } else {
          console.error("Estructura de respuesta no reconocida:", data);
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener datos del storage:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId) {
      fetchStorageData();
    }
  }, [storageId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://10.8.150.90/api/inveplus/storage/edit/${storageId}`,
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
      navigate(`${BASE_PATH}/storage`);
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
          Cargando datos del storage...
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
            Editar Storage
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información del dispositivo de almacenamiento
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
                  label="Código Item Configuración"
                  name="cod_item_configuracion"
                  value={formData.cod_item_configuracion}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de Serie"
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Nombre del Host"
                  name="host_name"
                  value={formData.host_name}
                  onChange={handleInputChange}
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
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activo
                  </label>
                  <select
                    name="active"
                    value={formData.active}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {activeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Configuración de Red */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Configuración de Red
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fabricante
                  </label>
                  <select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar fabricante</option>
                    {manufacturerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Modelo"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Tamaño de Disco"
                  name="disk_size"
                  value={formData.disk_size}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Item"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Información Organizacional */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Organizacional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Empresa"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización Responsable"
                  name="organization_responsible"
                  value={formData.organization_responsible}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Propietario"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Organización de Mantenimiento"
                  name="org_maintenance"
                  value={formData.org_maintenance}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Centro de Costo"
                  name="cost_center"
                  value={formData.cost_center}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Código de Aplicación"
                  name="application_code"
                  value={formData.application_code}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`${BASE_PATH}/storage`)}
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

export default EditarStorage;
