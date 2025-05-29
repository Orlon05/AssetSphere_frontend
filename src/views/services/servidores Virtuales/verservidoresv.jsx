import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerServidorVirtual = () => {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serverId } = useParams();

  // Definición de las secciones del formulario y sus campos
  const formSections = [
    {
      title: "Información Básica",
      fields: ["server", "id_vm", "platform", "status"],
    },
    {
      title: "Configuración Técnica",
      fields: ["memory", "cores", "hdd", "so"],
    },
    {
      title: "Configuración de Red",
      fields: ["ip", "cluster"],
    },
    {
      title: "Información Adicional",
      fields: ["modified"],
    },
  ];

  // Etiquetas para los campos
  const fieldLabels = {
    server: "Nombre del Servidor",
    id_vm: "ID de la VM",
    platform: "Plataforma",
    status: "Estado",
    memory: "Memoria (GB)",
    cores: "Núcleos",
    hdd: "Disco Duro",
    so: "Sistema Operativo",
    ip: "Dirección IP",
    cluster: "Cluster",
    modified: "Última Modificación",
  };

  // Colores para los estados
  const getStatusColor = (status) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-300";
      case "Inactivo":
        return "bg-red-100 text-red-800 border-red-300";
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Obtener datos del servidor
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `http://localhost:8000/vservers/virtual/get/${serverId}`,
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
        let serverInfo = null;

        if (data?.status === "success" && data.data?.server_info) {
          serverInfo = data.data.server_info;
        } else if (data?.data?.server_info) {
          serverInfo = data.data.server_info;
        } else if (data?.data) {
          serverInfo = data.data;
        } else if (data && typeof data === "object" && !data.error) {
          serverInfo = data;
        }

        if (serverInfo) {
          console.log("Datos del servidor encontrados:", serverInfo);
          setServerData(serverInfo);
        } else {
          console.error("Estructura no reconocida:", data);
          throw new Error(
            "Datos del servidor no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Cargando datos del servidor virtual...
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
            onClick={() => navigate("/servidoresv")}
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
            Visualizar Servidor Virtual
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Detalles completos del servidor virtual
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
                            serverData.status
                          )}`}
                        >
                          {serverData.status || "N/A"}
                        </div>
                      ) : field === "modified" ? (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {serverData.modified || "N/A"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {serverData[field] || "N/A"}
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

export default VerServidorVirtual;
