import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerPseries = () => {
  const { pseriesId } = useParams();
  const [pseriesData, setPseriesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formSections = [
    {
      title: "Información General",
      fields: [
        "name",
        "application",
        "hostname",
        "ip_address",
        "status",
        "subsidiary",
      ],
    },
    {
      title: "Ubicación",
      fields: ["environment", "slot", "lpar_id"],
    },
    {
      title: "Sistema Operativo",
      fields: ["os", "version"],
    },
    {
      title: "CPU",
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
      title: "Memoria",
      fields: ["min_memory", "act_memory", "max_memory"],
    },
    {
      title: "Información Adicional",
      fields: [
        "expansion_factor",
        "memory_per_factor",
        "processor_compatibility",
      ],
    },
  ];

  const fieldLabels = {
    name: "Nombre Lpar en la HMC",
    application: "Aplicación",
    hostname: "Hostname",
    ip_address: "Dirección IP",
    status: "Estado",
    subsidiary: "Filial",
    environment: "Ambiente",
    slot: "Cajón",
    lpar_id: "ID Lpar",
    os: "Sistema Operativo",
    version: "Versión",
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
    processor_compatibility: "Proc Compat",
  };

  useEffect(() => {
    const fetchPseriesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `http://localhost:8000/pseries/get_by_id/${pseriesId}`,
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
        if (data?.status === "success" && data.data?.pseries) {
          setPseriesData(data.data.pseries);
        } else {
          throw new Error(
            "Datos del servidor no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pseriesId) {
      fetchPseriesData();
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
            Visualizar Servidor PSeries
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del servidor
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
                              pseriesData.status?.toLowerCase() === "active"
                                ? "bg-green-100 border-green-300 text-green-800"
                                : pseriesData.status?.toLowerCase() ===
                                  "maintenance"
                                ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                : "bg-red-100 border-red-300 text-red-800"
                            }
                          `}
                        >
                          {pseriesData.status?.toLowerCase() === "active"
                            ? "Activo"
                            : pseriesData.status?.toLowerCase() ===
                              "maintenance"
                            ? "Mantenimiento"
                            : "Inactivo"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {pseriesData[field] || "N/A"}
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
