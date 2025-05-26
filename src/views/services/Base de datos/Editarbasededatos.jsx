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

const EditarBaseDatos = () => {
  const [formData, setFormData] = useState({
    instance_id: "",
    cost_center: "",
    category: "",
    type: "",
    item: "",
    owner_contact: "",
    name: "",
    application_code: "",
    inactive: "",
    asset_life_cycle_status: "",
    system_environment: "",
    cloud: "",
    version_number: "",
    serial: "",
    ci_tag: "",
    instance_name: "",
    model: "",
    ha: "",
    port: "",
    owner_name: "",
    department: "",
    company: "",
    manufacturer_name: "",
    supplier_name: "",
    supported: "",
    account_id: "",
    create_date: "",
    modified_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { baseDatosId } = useParams();
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
    Toast.fire({
      icon: "success",
      title: "Base de datos actualizada exitosamente",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchBaseDatosData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/base_datos/get_by_id/${baseDatosId}`,
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
        if (data.status === "success" && data.data) {
          // Formatear las fechas para los inputs de tipo date
          const formatDate = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString).toISOString().split("T")[0];
          };

          setFormData({
            instance_id: data.data.instance_id || "",
            cost_center: data.data.cost_center || "",
            category: data.data.category || "",
            type: data.data.type || "",
            item: data.data.item || "",
            owner_contact: data.data.owner_contact || "",
            name: data.data.name || "",
            application_code: data.data.application_code || "",
            inactive: data.data.inactive || "",
            asset_life_cycle_status: data.data.asset_life_cycle_status || "",
            system_environment: data.data.system_environment || "",
            cloud: data.data.cloud || "",
            version_number: data.data.version_number || "",
            serial: data.data.serial || "",
            ci_tag: data.data.ci_tag || "",
            instance_name: data.data.instance_name || "",
            model: data.data.model || "",
            ha: data.data.ha || "",
            port: data.data.port || "",
            owner_name: data.data.owner_name || "",
            department: data.data.department || "",
            company: data.data.company || "",
            manufacturer_name: data.data.manufacturer_name || "",
            supplier_name: data.data.supplier_name || "",
            supported: data.data.supported || "",
            account_id: data.data.account_id || "",
            create_date: formatDate(data.data.create_date),
            modified_date: formatDate(data.data.modified_date),
          });
        } else {
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener datos de la base de datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (baseDatosId) {
      fetchBaseDatosData();
    }
  }, [baseDatosId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/base_datos/edit/${baseDatosId}`,
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
      navigate("/inveplus/Base-De-Datos");
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
          Cargando datos de la base de datos...
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
            Editar Base de Datos
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información de la base de datos
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
            {/* Sección: Información de Identificación */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información de Identificación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="ID de Instancia"
                  name="instance_id"
                  value={formData.instance_id}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Nombre de Instancia"
                  name="instance_name"
                  value={formData.instance_name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Etiqueta CI"
                  name="ci_tag"
                  value={formData.ci_tag}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Serie"
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Puerto"
                  name="port"
                  value={formData.port}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sección: Clasificación y Categorización */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Clasificación y Categorización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Tipo"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Ítem"
                  name="item"
                  value={formData.item}
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
                  label="Código de Aplicación"
                  name="application_code"
                  value={formData.application_code}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Número de Versión"
                  name="version_number"
                  value={formData.version_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sección: Estado y Entorno */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Estado y Entorno
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Inactivo"
                  name="inactive"
                  value={formData.inactive}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Estado del Ciclo de Vida del Activo"
                  name="asset_life_cycle_status"
                  value={formData.asset_life_cycle_status}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Entorno del Sistema"
                  name="system_environment"
                  value={formData.system_environment}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Nube"
                  name="cloud"
                  value={formData.cloud}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="HA"
                  name="ha"
                  value={formData.ha}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Soporte"
                  name="supported"
                  value={formData.supported}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sección: Información de Propietario */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información de Propietario
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Nombre del Propietario"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Contacto del Propietario"
                  name="owner_contact"
                  value={formData.owner_contact}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Departamento"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Compañía"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sección: Información de Proveedores */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información de Proveedores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Nombre del Fabricante"
                  name="manufacturer_name"
                  value={formData.manufacturer_name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Nombre del Proveedor"
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleInputChange}
                  required
                />

                <InputField
                  label="Centro de Costos"
                  name="cost_center"
                  value={formData.cost_center}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="ID de Cuenta"
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sección: Fechas */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Fechas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Fecha de Creación"
                  name="create_date"
                  value={formData.create_date}
                  onChange={handleInputChange}
                  type="date"
                  required
                />
                <InputField
                  label="Fecha de Modificación"
                  name="modified_date"
                  value={formData.modified_date}
                  onChange={handleInputChange}
                  type="date"
                  required
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/inveplus/base-de-datos")}
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

export default EditarBaseDatos;
