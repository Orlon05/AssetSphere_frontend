import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerPseries = () => {
  const [pserieData, setPserieData] = useState({});
  const { pseriesId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formSections = [
    {
      title: "Información Básica",
      fields: [
        "name",
        "application",
        "hostname",
        "ip_address",
        "environment",
        "subsidiary",
      ],
    },
    {
      title: "Ubicación y Hardware",
      fields: ["slot", "lpar_id"],
    },
    {
      title: "Sistema Operativo",
      fields: ["os", "version", "status"],
    },
    {
      title: "Recursos CPU",
      fields: [
        "min_cpu",
        "act_cpu",
        "max_cpu",
        "min_v_cpu",
        "act_v_cpu",
        "max_v_cpu",
      ],
    },
    {
      title: "Recursos Memoria",
      fields: ["min_memory", "act_memory", "max_memory"],
    },
    {
      title: "Configuración Avanzada",
      fields: [
        "expansion_factor",
        "memory_per_factor",
        "processor_compatibility",
      ],
    },
  ];

  // Etiquetas para los campos de PSeries
  const fieldLabels = {
    name: "Nombre LPAR en la HMC",
    application: "Aplicación",
    hostname: "Hostname",
    ip_address: "Dirección IP",
    environment: "Ambiente",
    slot: "Cajón",
    lpar_id: "ID LPAR",
    status: "Estado",
    os: "Sistema Operativo",
    version: "Versión",
    subsidiary: "Filial",
    min_cpu: "CPU MIN",
    act_cpu: "CPU ACT",
    max_cpu: "CPU MAX",
    min_v_cpu: "CPU V MIN",
    act_v_cpu: "CPU V ACT",
    max_v_cpu: "CPU V MAX",
    min_memory: "Memoria MIN",
    act_memory: "Memoria ACT",
    max_memory: "Memoria MAX",
    expansion_factor: "Factor de expansión",
    memory_per_factor: "Memoria por factor",
    processor_compatibility: "Compatibilidad de procesador",
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Aseguramos que pseriesId sea un valor y no undefined
        if (!pseriesId) {
          throw new Error("ID del PSeries no encontrado");
        }

        console.log("ID del PSeries a consultar:", pseriesId);

        // Obtenemos el token y verificamos que exista
        const token = localStorage.getItem("authenticationToken");
        if (!token) {
          throw new Error("Token de autenticación no encontrado");
        }

        // Usamos backticks (`) para la interpolación correcta de variables
        const url = `http://localhost:8000/pseries/get_by_id/${pseriesId}`;
        console.log("URL de la petición:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error en la respuesta:", errorText);

          try {
            const errorData = JSON.parse(errorText);
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                throw new Error(
                  errorData.detail.map((err) => err.msg).join(", ")
                );
              } else {
                throw new Error(errorData.detail);
              }
            } else {
              throw new Error(`Error HTTP ${response.status}`);
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            } else {
              throw e;
            }
          }
        }

        const data = await response.json();
        console.log("Respuesta completa:", data);

        if (data?.status === "success" && data.data) {
          console.log("Datos del PSeries:", data.data);
          setPserieData(data.data);
        } else {
          throw new Error("Estructura de respuesta inesperada");
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pseriesId) {
      fetchServerData();
    }
  }, [pseriesId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando datos del Pserie...
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
            onClick={() => window.history.back()}
            className="mt-3 block text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="inline mr-1" size={16} /> Volver a la lista
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
            Visualizar PSeries
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del Pserie
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
                          className={`
                            border rounded-lg block w-full p-2.5 font-medium text-center
                            ${
                              pserieData.status?.toLowerCase() === "active"
                                ? "bg-green-100 border-green-300 text-green-800"
                                : pserieData.status?.toLowerCase() ===
                                  "maintenance"
                                ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                : "bg-red-100 border-red-300 text-red-800"
                            }
                          `}
                        >
                          {pserieData.status?.toLowerCase() === "active"
                            ? "Activo"
                            : pserieData.status?.toLowerCase() === "maintenance"
                            ? "Mantenimiento"
                            : "Inactivo"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {pserieData[field] || "N/A"}
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

export default VerPseries;
