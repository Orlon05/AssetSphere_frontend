import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerStorage = () => {
  const navigate = useNavigate();
  const [storageData, setStorageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storageId } = useParams();

  const formSections = [
    {
      title: "Información Básica",
      fields: [
        "name",
        "cod_item_configuracion",
        "serial",
        "host_name",
        "status",
        "active",
      ],
    },
    {
      title: "Configuración de Red",
      fields: ["ip_address"],
    },
    {
      title: "Especificaciones Técnicas",
      fields: [
        "manufacturer",
        "model",
        "type",
        "category",
        "disk_size",
        "item",
      ],
    },
    {
      title: "Información Organizacional",
      fields: [
        "company",
        "organization_responsible",
        "owner",
        "org_maintenance",
        "cost_center",
        "application_code",
        "location",
      ],
    },
  ];

  const fieldLabels = {
    name: "Nombre",
    cod_item_configuracion: "Código Item Configuración",
    serial: "Número de Serie",
    host_name: "Nombre del Host",
    status: "Estado",
    active: "Activo",
    ip_address: "Dirección IP",
    manufacturer: "Fabricante",
    model: "Modelo",
    type: "Tipo",
    category: "Categoría",
    disk_size: "Tamaño de Disco",
    item: "Item",
    company: "Empresa",
    organization_responsible: "Organización Responsable",
    owner: "Propietario",
    org_maintenance: "Organización de Mantenimiento",
    cost_center: "Centro de Costo",
    application_code: "Código de Aplicación",
    location: "Ubicación",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Aplicado":
        return "bg-green-100 text-green-800 border-green-300";
      case "No Aplicado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getActiveColor = (active) => {
    switch (active) {
      case "Sí":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "No":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `https://10.8.150.90/api/inveplus/storage/get_by_id/${storageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Respuesta completa de la API:", data);

        // Intentar diferentes estructuras de respuesta
        let storageInfo = null;

        if (data?.status === "success" && data.data?.storage_info) {
          // Estructura como servidores: data.data.storage_info
          storageInfo = data.data.storage_info;
        } else if (data?.data?.storage_info) {
          // Estructura: data.storage_info
          storageInfo = data.data.storage_info;
        } else if (data?.data) {
          // Estructura: data.data
          storageInfo = data.data;
        } else if (data && typeof data === "object" && !data.error) {
          // Respuesta directa
          storageInfo = data;
        }

        if (storageInfo) {
          console.log("Datos del storage encontrados:", storageInfo);
          setStorageData(storageInfo);
        } else {
          console.error("Estructura no reconocida:", data);
          throw new Error(
            "Datos del storage no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId) {
      fetchStorageData();
    }
  }, [storageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando datos del storage...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <strong>Error:</strong> {error}
          <button
            onClick={() => navigate("/storage")}
            className="mt-3 block text-blue-600 hover:text-blue-800"
          >
            <MdArrowBack className="inline mr-1" /> Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualizar Storage
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del dispositivo de almacenamiento
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
                      {field === "status" ? (
                        <div
                          className={`border rounded-lg block w-full p-2.5 font-medium text-center ${getStatusColor(
                            storageData.status
                          )}`}
                        >
                          {storageData.status || "N/A"}
                        </div>
                      ) : field === "active" ? (
                        <div
                          className={`border rounded-lg block w-full p-2.5 font-medium text-center ${getActiveColor(
                            storageData.active
                          )}`}
                        >
                          {storageData.active || "N/A"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {storageData[field] || "N/A"}
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

export default VerStorage;
