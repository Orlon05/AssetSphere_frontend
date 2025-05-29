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

const EditarServer = () => {
  const [formData, setFormData] = useState({
    serial_number: "",
    hostname: "",
    ip_server: "",
    ip_ilo: "",
    service_status: "",
    server_type: "",
    total_disk_capacity: "",
    action: "",
    server_model: "",
    service_type: "",
    core_count: "",
    manufacturer: "",
    installed_memory: "",
    warranty_start_date: "",
    warranty_end_date: "",
    eos: "",
    enclosure: "",
    application: "",
    owner: "",
    location: "",
    unit: "",
    ubication: "",
    comments: "",
    po_number: "",
  });

  // Opciones para campos de selección
  const serviceStatusOptions = [
    "active",
    "inactive",
    "maintenance",
    "decommissioned",
  ];
  const serverTypeOptions = ["Physical", "Virtual", "Blade", "Rack"];
  const serviceTypeOptions = [
    "Production",
    "Development",
    "Testing",
    "Staging",
  ];
  const manufacturerOptions = [
    "Dell",
    "HP",
    "IBM",
    "Cisco",
    "Lenovo",
    "Supermicro",
  ];

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
                  label="Hostname"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Número de Serie"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  required
                />
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
                  label="Modelo del Servidor"
                  name="server_model"
                  value={formData.server_model}
                  onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Servidor
                  </label>
                  <select
                    name="server_type"
                    value={formData.server_type}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {serverTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Estado del Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_status"
                    value={formData.service_status}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {serviceStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
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
                  label="IP del Servidor"
                  name="ip_server"
                  value={formData.ip_server}
                  onChange={handleInputChange}
                />
                <InputField
                  label="IP iLO/IPMI"
                  name="ip_ilo"
                  value={formData.ip_ilo}
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
                  label="Número de Núcleos"
                  name="core_count"
                  value={formData.core_count}
                  onChange={handleInputChange}
                  type="number"
                />
                <InputField
                  label="Memoria Instalada"
                  name="installed_memory"
                  value={formData.installed_memory}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Capacidad Total de Disco"
                  name="total_disk_capacity"
                  value={formData.total_disk_capacity}
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
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Ubicación Específica"
                  name="ubication"
                  value={formData.ubication}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Unidad/Rack"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Gabinete/Enclosure"
                  name="enclosure"
                  value={formData.enclosure}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Información de Servicio */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información de Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Servicio
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo de servicio</option>
                    {serviceTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Aplicación"
                  name="application"
                  value={formData.application}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Propietario/Responsable"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Acción"
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Garantía y Soporte */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Garantía y Soporte
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
                  label="End of Support (EOS)"
                  name="eos"
                  value={formData.eos}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de Orden de Compra"
                  name="po_number"
                  value={formData.po_number}
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
