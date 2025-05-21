import React, { useEffect, useState } from "react";
import { MdEdit, MdArrowBack } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";

//componente reutilizable para los campos del formulario

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

const EditarBaseDeDatos = () => {
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
  const { error, SetError } = useState(null);
  const navigate = useNavigate();
  const { basedatosId } = useParams();
  const token = localStorage.getItem("authenticationToken");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showCOnfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.ondmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Base de datos editada correctamente",
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
    const fetchbasedata = async () => {
      setLoading(true);
      SetError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/base_datos/get_by_id/${basedatosId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los datos");
        }

        const data = await response.json();
        if (data.status === "Success" && data.data && data.data.base_info) {
          setFormData(data.data.base_info);
        } else {
          throw new Error("Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        SetError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (basedatosId) {
      fetchbasedata();
    }
  }, [basedatosId, token]);
  const handleSubmit = async (e) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/base_datos/edit/${basedatosId}`,
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
          : errorData.message || "Error al editar la base de datos";
        throw new Error(errorMessage);
      }

      showSuccessToast();
      navigate("/inveplus/basededatos");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">
          Cargando información de la Base de datos...
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
            Editar Base de datos
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
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="instance_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID de instancia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="instance_id"
                    name="instance_id"
                    required
                    value={formData.instance_id}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
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
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Categoría
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="item"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Objeto <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="item"
                    name="item"
                    required
                    value={formData.item}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Base de datos</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="owner_contact"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contacto del Propietario
                  </label>
                  <input
                    type="text"
                    id="owner_contact"
                    name="owner_contact"
                    value={formData.owner_contact}
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
                    htmlFor="application_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Codigo de Aplicación
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
                    htmlFor="inactive"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inactive"
                    name="inactive"
                    required
                    value={formData.inactive}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="asset_life_cycle_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado del ciclo de vida del activo
                  </label>
                  <input
                    type="text"
                    id="asset_life_cycle_status"
                    name="asset_life_cycle_status"
                    value={formData.asset_life_cycle_status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="system_environment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Entorno del sistema
                  </label>
                  <input
                    type="text"
                    id="system_environment"
                    name="system_environment"
                    value={formData.system_environment}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cloud"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nube
                  </label>
                  <input
                    type="text"
                    id="cloud"
                    name="cloud"
                    value={formData.cloud}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="version_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Numero de versión
                  </label>
                  <input
                    type="text"
                    id="version_number"
                    name="version_number"
                    value={formData.version_number}
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
                    htmlFor="ci_tag"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CI Tag
                  </label>
                  <input
                    type="text"
                    id="ci_tag"
                    name="ci_tag"
                    value={formData.ci_tag}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="instance_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre de la instancia
                  </label>
                  <input
                    type="text"
                    id="instance_name"
                    name="instance_name"
                    value={formData.instance_name}
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
                    htmlFor="ha"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ha
                  </label>
                  <input
                    type="text"
                    id="ha"
                    name="ha"
                    value={formData.ha}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="port"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Puerto
                  </label>
                  <input
                    type="port"
                    id="port"
                    name="port"
                    value={formData.port}
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
                    htmlFor="owner_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del dueño
                  </label>
                  <input
                    type="text"
                    id="owner_name"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Departamento
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Compañía
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="manufacturer_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del fabricante
                  </label>
                  <input
                    type="text"
                    id="manufacturer_name"
                    name="manufacturer_name"
                    value={formData.manufacturer_name}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="supplier_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del Proveedor
                  </label>
                  <input
                    type="text"
                    id="supplier_name"
                    name="supplier_name"
                    value={formData.supplier_name}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="supported"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apoyado Por
                  </label>
                  <input
                    type="text"
                    id="supported"
                    name="supported"
                    value={formData.supported}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="account_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID de Cuenta
                  </label>
                  <input
                    type="text"
                    id="account_id"
                    name="account_id"
                    value={formData.account_id}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="create_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de creación
                  </label>
                  <input
                    type="date"
                    id="create_date"
                    name="create_date"
                    value={formData.create_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="modified_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de modificación
                  </label>
                  <input
                    type="date"
                    id="modified_date"
                    name="modified_date"
                    value={formData.modified_date}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
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

export default EditarBaseDeDatos;
