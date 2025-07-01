/**
 * Componente para crear nuevos servidores PSeries
 *
 * Funcionalidades:
 * - Formulario organizado en secciones lógicas
 * - Validación de campos obligatorios
 * - Campos específicos para servidores IBM Power Systems
 * - Manejo de estados de carga y errores
 * - Confirmación antes de cancelar cambios
 *
 * @component
 * @example
 * return <CrearPseries />
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Server } from "lucide-react";
import Swal from "sweetalert2";

const CrearPseries = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del formulario con todos los campos necesarios para PSeries
  const [formData, setFormData] = useState({
    name: "",
    application: "",
    hostname: "",
    ip_address: "",
    environment: "",
    slot: "",
    lpar_id: "",
    status: "",
    os: "",
    version: "",
    subsidiary: "",
    min_cpu: "",
    act_cpu: "",
    max_cpu: "",
    min_v_cpu: "",
    act_v_cpu: "",
    max_v_cpu: "",
    min_memory: "",
    act_memory: "",
    max_memory: "",
    expansion_factor: "",
    memory_per_factor: "",
    processor_compatibility: "",
  });

  // Opciones predefinidas para campos de selección
  const environmentOptions = [
    "Certificación",
    "Desarrollo",
    "Producción",
    "Pruebas",
    "VIOS-Producción",
  ];

  const statusOptions = ["Running", "Not Activated"];
  const osOptions = ["Aixlinux", "Vioserver"];
  const subsidiaryOptions = [
    "Bancolombia",
    "Banistmo",
    "Filiales OffShore",
    "Nequi",
  ];

  const processorCompatibilityOptions = [
    "Default",
    "POWER7",
    "POWER8",
    "POWER9",
    "POWER9_base",
  ];

  const BASE_PATH = "/inveplus";

  /**
   * Configuración de secciones del formulario
   * Organiza los campos en grupos lógicos para mejor UX
   */
  const formSections = [
    {
      title: "Información Básica",
      fields: [
        {
          name: "name",
          label: "Nombre LPAR en la HMC",
          required: true,
          type: "text",
        },
        {
          name: "application",
          label: "Aplicación",
          required: true,
          type: "text",
        },
        { name: "hostname", label: "Hostname", required: true, type: "text" },
        {
          name: "ip_address",
          label: "Dirección IP",
          required: false,
          type: "text",
        },
        {
          name: "environment",
          label: "Ambiente",
          required: false,
          type: "select",
          options: environmentOptions,
        },
        {
          name: "subsidiary",
          label: "Filial",
          required: false,
          type: "select",
          options: subsidiaryOptions,
        },
      ],
    },
    {
      title: "Ubicación y Hardware",
      fields: [
        { name: "slot", label: "Cajón", required: false, type: "text" },
        { name: "lpar_id", label: "ID LPAR", required: false, type: "text" },
      ],
    },
    {
      title: "Sistema Operativo",
      fields: [
        {
          name: "os",
          label: "Sistema Operativo",
          required: true,
          type: "select",
          options: osOptions,
        },
        { name: "version", label: "Versión", required: false, type: "text" },
        {
          name: "status",
          label: "Estado",
          required: true,
          type: "select",
          options: statusOptions,
        },
      ],
    },
    {
      title: "Recursos CPU",
      fields: [
        { name: "min_cpu", label: "CPU MIN", required: true, type: "text" },
        { name: "act_cpu", label: "CPU ACT", required: true, type: "text" },
        { name: "max_cpu", label: "CPU MAX", required: true, type: "text" },
        { name: "min_v_cpu", label: "CPU V MIN", required: true, type: "text" },
        { name: "act_v_cpu", label: "CPU V ACT", required: true, type: "text" },
        { name: "max_v_cpu", label: "CPU V MAX", required: true, type: "text" },
      ],
    },
    {
      title: "Recursos Memoria",
      fields: [
        {
          name: "min_memory",
          label: "Memoria MIN",
          required: true,
          type: "text",
        },
        {
          name: "act_memory",
          label: "Memoria ACT",
          required: false,
          type: "text",
        },
        {
          name: "max_memory",
          label: "Memoria MAX",
          required: false,
          type: "text",
        },
      ],
    },
    {
      title: "Configuración Avanzada",
      fields: [
        {
          name: "expansion_factor",
          label: "Factor de expansión",
          required: false,
          type: "text",
        },
        {
          name: "memory_per_factor",
          label: "Memoria por factor",
          required: false,
          type: "text",
        },
        {
          name: "processor_compatibility",
          label: "Compatibilidad de procesador",
          required: false,
          type: "select",
          options: processorCompatibilityOptions,
        },
      ],
    },
  ];

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authenticationToken");

      const response = await fetch(
        "https://10.8.150.90/api/inveplus/pseries/pseries/add",
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
        text: "Servidor PSeries creado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate(`${BASE_PATH}/pseries`);
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

  /**
   * Maneja la cancelación del formulario con confirmación
   */
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
        navigate(`${BASE_PATH}/pseries`);
      }
    });
  };

  /**
   * Renderiza un campo según su tipo
   * @param {Object} field - Configuración del campo
   * @returns {JSX.Element} Campo renderizado
   */
  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar...</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full p-4 flex items-center border-b border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => navigate(`${BASE_PATH}/pseries`)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Server className="mr-2 text-blue-600" size={24} />
            Crear Servidor PSeries
          </h1>
          <p className="text-sm text-gray-500">
            Ingresa la información del nuevo servidor
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

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

export default CrearPseries;
