import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerPseries = () => {
  const [name, setName] = useState("");
  const [application, setApplication] = useState("");
  const [hostname, setHostName] = useState("");
  const [ip_address, setIpAddress] = useState("");
  const [environment, setEnvironment] = useState(0);
  const [slot, setSlot] = useState(0);
  const [lpar_id, setLparId] = useState("");
  const [status, setStatus] = useState("");
  const [os, setOs] = useState("");
  const [version, setVersion] = useState("");
  const [subsidiary, setSubsidiary] = useState("");
  const [min_cpu, setMinCpu] = useState("");
  const [act_cpu, setActCpu] = useState("");
  const [max_cpu, setMaxCpu] = useState("");
  const [min_v_cpu, setMinVCpu] = useState("");
  const [act_v_cpu, setActVCpu] = useState("");
  const [max_v_cpu, setMaxVCpu] = useState("");
  const [min_memory, setMinMemory] = useState("");
  const [act_memory, setActMemory] = useState("");
  const [max_memory, setMaxMemory] = useState("");
  const [expansion_factor, setExpansionFactor] = useState("");
  const [memory_per_factor, setMemoryPerFactor] = useState("");
  const [processor_compatibility, setProcessorCompatibility] = useState("");
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const { pserieId } = useParams();

  const environment_ = [
    "Certificación",
    "Desarrollo",
    "Producción",
    "Pruebas",
    "VIOS-Producción",
  ];

  const status_ = ["Not Activated", "Running"];

  const os_ = ["Aixlinux", "Vioserver"];

  const subsidiary_ = ["Bancolombia", "Banistmo", "Filiales OffShore", "Nequi"];

  const processor_compatibility_ = [
    "Defalut",
    "POWER7",
    "POWER8",
    "POWER9",
    "POWER9_base",
    "#N/D",
  ];

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchPseriesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/pseries/pseries/${pserieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "authenticationToken"
              )}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener datos del servidor:", errorData);
          if (response.status === 404) {
            throw new Error("Servidor no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.message || errorData.detail
              }`
            );
          }
        }

        const data = await response.json();
        if (data && data.status === "success" && data.data) {
          setName(data.data.name || "");
          setApplication(data.data.application || "");
          setHostName(data.data.hostname || "");
          setIpAddress(data.data.ip_address || "");
          setEnvironment(data.data.environment || "");
          setSlot(data.data.slot || "");
          setLparId(data.data.lpar_id || "");
          setStatus(data.data.status || "");
          setOs(data.data.os || "");
          setVersion(data.data.version || "");
          setSubsidiary(data.data.subsidiary || "");
          setMinCpu(data.data.min_cpu || "");
          setActCpu(data.data.act_cpu || "");
          setMaxCpu(data.data.max_cpu || "");
          setMinVCpu(data.data.min_v_cpu || "");
          setActVCpu(data.data.act_v_cpu || "");
          setMaxVCpu(data.data.max_cpu || "");
          setMinMemory(data.data.min_memory || "");
          setActMemory(data.data.act_memory || "");
          setMaxMemory(data.data.max_memory || "");
          setExpansionFactor(data.data.expansion_factor || "");
          setMemoryPerFactor(data.data.memory_per_factor || "");
          setProcessorCompatibility(data.data.processor_compatibility || "");
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del storage");
        }
      } catch (error) {
        console.error("Error al obtener datos del storage:", error);
        setError(error.message || "Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    if (pserieId) {
      fetchPseriesData();
    }
  }, [pserieId]);

  useEffect(() => {}, [name, application]);

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
