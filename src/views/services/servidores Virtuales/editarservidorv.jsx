import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save, X, Server } from "lucide-react";

const EditarServidorVirtual = () => {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_PATH = "/inveplus";

  // Estados para los campos del formulario
  const [platform, setPlatform] = useState("");
  const [id_vm, setIdVm] = useState("");
  const [server, setServer] = useState("");
  const [memory, setMemory] = useState("");
  const [so, setSo] = useState("");
  const [status, setStatus] = useState("");
  const [cluster, setCluster] = useState("");
  const [hdd, setHdd] = useState("");
  const [cores, setCores] = useState("");
  const [ip, setIp] = useState("");
  const [modified, setModified] = useState("");

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

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
  const fetchServerData = async () => {
    setLoading(true);
    setError(null);
    try {
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
      if (data.status === "success" && data.data?.server_info) {
        const server = data.data.server_info;

        setPlatform(server.platform || "");
        setIdVm(server.id_vm || "");
        setServer(server.server || "");
        setMemory(server.memory || "");
        setSo(server.so || "");
        setStatus(server.status || "");
        setCluster(server.cluster || "");
        setHdd(server.hdd || "");
        setCores(server.cores || "");
        setIp(server.ip || "");
        setModified(server.modified || "");
      } else {
        console.error("Estructura de datos inesperada:", data);
        setError("Estructura de datos inesperada del servidor");
      }
    } catch (error) {
      console.error("Error en fetchServerData:", error);
      setError(error.message || "Error al obtener los datos del servidor");
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
    setIsSubmitting(true);

    const serverData = {
      platform,
      id_vm,
      server,
      memory: parseInt(memory) || null,
      so,
      status,
      cluster,
      hdd,
      cores: parseInt(cores) || null,
      ip,
      modified,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/vservers/virtual/edit/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serverData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Detalles del error (JSON):", errorData);
          if (errorData && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
          }
          Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
          Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
      } else {
        showSuccessToast();
        navigate(`${BASE_PATH}/servidoresv`);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        navigate(`${BASE_PATH}/servidoresv`);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando detalles del servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate(`${BASE_PATH}/servidoresv`)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Server className="mr-2 text-blue-600" size={24} />
            Editar Servidor Virtual
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información del servidor{" "}
            <span className="font-bold">{server}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`${BASE_PATH}/servidoresv`)}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Regresar
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="platform"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Plataforma
                  </label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="id_vm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID VM
                  </label>
                  <input
                    type="text"
                    id="id_vm"
                    name="id_vm"
                    value={id_vm}
                    onChange={(e) => setIdVm(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="server"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Servidor
                  </label>
                  <input
                    type="text"
                    id="server"
                    name="server"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="memory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria (MB)
                  </label>
                  <input
                    type="number"
                    id="memory"
                    name="memory"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="so"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sistema Operativo
                  </label>
                  <input
                    type="text"
                    id="so"
                    name="so"
                    value={so}
                    onChange={(e) => setSo(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Configuración */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Configuración
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="cluster"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cluster
                  </label>
                  <input
                    type="text"
                    id="cluster"
                    name="cluster"
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="hdd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Disco Duro
                  </label>
                  <input
                    type="text"
                    id="hdd"
                    name="hdd"
                    value={hdd}
                    onChange={(e) => setHdd(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cores"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Núcleos
                  </label>
                  <input
                    type="number"
                    id="cores"
                    name="cores"
                    value={cores}
                    onChange={(e) => setCores(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección IP
                  </label>
                  <input
                    type="text"
                    id="ip"
                    name="ip"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="modified"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Modificación
                  </label>
                  <input
                    type="date"
                    id="modified"
                    name="modified"
                    value={modified}
                    onChange={(e) => setModified(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

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
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarServidorVirtual;
