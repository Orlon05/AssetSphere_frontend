import React, { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerDatabase = () => {
  const { baseDeDatosId } = useParams();
  const [baseData, setBaseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formSections = [
    {
      title: "Información Básica",
      fields: [
        "instance_id",
        "cost_center",
        "category",
        "type",
        "item",
        "owner_contact",
        "name",
      ],
    },
    {
      title: "Especificaciones Técnicas",
      fields: [
        "application_code",
        "inactive",
        "asset_life_cycle_status",
        "system_environment",
        "cloud",
        "version_number",
        "serial",
        "ci_tag",
        "instance_name",
        "model",
        "ha",
        "port",
      ],
    },
    {
      title: "Ubicación y Organización",
      fields: [
        "owner_name",
        "department",
        "company",
        "manufacturer_name",
        "supplier_name",
        "supported",
        "account_id",
        "create_date",
        "modified_date",
      ],
    },
  ];
  const fieldLabels = {
    instance_id: "ID de instancia",
    cost_center: "Centro de Costos",
    category: "Categoría",
    type: "Tipo",
    item: "Objeto",
    owner_contact: "Contacto del Propietario",
    name: "Nombre",
    application_code: "Codigo de Aplicación",
    inactive: "Estado",
    asset_life_cycle_status: "Estado del ciclo de vida del activo",
    system_environment: "Entorno del Sistema",
    cloud: "Nube",
    version_number: "Versión",
    serial: "Serial",
    ci_tag: "CI Tag",
    instance_name: "Nombre de la Instancia",
    model: "Modelo",
    ha: "Ha",
    port: "Puerto",
    owner_name: "Nombre del dueño",
    department: "Departamento",
    company: "Compañía",
    manufacturer_name: "Nombre del Fabricante",
    supplier_name: "nombre del proveedor",
    supported: "Apoyado",
    account_id: "ID de cuenta",
    create_date: "Fecha de creación",
    modified_date: "Fecha de modificación",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  // Función para obtener todos los campos disponibles que no están en las secciones predefinidas
  const getAdditionalFields = () => {
    if (!baseData || typeof baseData !== "object") return [];

    // Recopilar todos los campos definidos en formSections
    const definedFields = formSections.flatMap((section) => section.fields);

    // Encontrar campos adicionales en el objeto baseData
    return Object.keys(baseData).filter(
      (key) =>
        !definedFields.includes(key) &&
        baseData[key] !== undefined &&
        baseData[key] !== null &&
        key !== "_id" &&
        key !== "__v" // Excluir campos internos de MongoDB
    );
  };

  const additionalFields = getAdditionalFields();

  useEffect(() => {
    const fetchBaseDeDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        console.log("Fetching data for ID:", baseDeDatosId);

        const response = await fetch(
          `http://localhost:8000/base_datos/get_by_id/${baseDeDatosId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          throw new Error(errorData.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        // Intentamos ser más flexibles con la estructura de la respuesta
        if (data?.status === "success") {
          // Primero intentamos la estructura esperada
          if (data.data?.basededatos_info) {
            setBaseData(data.data.basededatos_info);
          }
          // Si no, intentamos encontrar los datos en otras ubicaciones posibles
          else if (data.data?.database_info) {
            setBaseData(data.data.database_info);
          } else if (data.data?.base_datos) {
            setBaseData(data.data.base_datos);
          } else if (data.data) {
            // Si data existe pero no tiene la estructura esperada, usamos data directamente
            setBaseData(data.data);
          } else {
            throw new Error("Estructura de datos inesperada en la respuesta");
          }
        } else if (data?.data) {
          // Si no hay status pero hay data, intentamos usarla
          setBaseData(data.data);
        } else {
          console.error("Estructura de respuesta inesperada:", data);
          throw new Error(
            "Datos de la base de datos no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (baseDeDatosId) {
      fetchBaseDeDatos();
    }
  }, [baseDeDatosId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando Base de datos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg mx-auto shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Error al cargar los datos
          </h2>
          <p className="mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setTimeout(() => window.location.reload(), 300);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Intentar nuevamente
            </button>
            <Link
              to="/inveplus/base-de-datos"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-center"
            >
              Volver a la lista
            </Link>
          </div>
          <div className="mt-4 text-sm bg-red-50 p-3 rounded border border-red-200">
            <p>Sugerencias de solución:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Verifique que el ID de la base de datos sea correcto</li>
              <li>Compruebe su conexión a internet</li>
              <li>El servidor API puede estar inactivo o no responder</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualizar Base de datos
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos
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

      <main className="container mx-auto p-6">
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {formSections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {fieldLabels[field]}
                      </label>
                      {field === "inactive" ? (
                        <div
                          className={`
                        border rounded-lg block w-full p-2.5 font-medium text-center
                        ${
                          baseData.inactive?.toLowerCase() === "active"
                            ? "bg-green-100 border-green-300 text-green-800"
                            : baseData.inactive?.toLowerCase() === "inactive"
                            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                            : "bg-red-100 border-red-300 text-red-800"
                        }
                      `}
                        >
                          {baseData.inactive?.toLowerCase() === "active"
                            ? "Activo"
                            : baseData.inactive?.toLowerCase() === "inactive"
                            ? "Desconocido"
                            : "Inactivo"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {baseData[field] !== undefined &&
                          baseData[field] !== null
                            ? typeof baseData[field] === "object"
                              ? JSON.stringify(baseData[field])
                              : String(baseData[field])
                            : "N/A"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerDatabase;
