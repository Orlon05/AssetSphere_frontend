import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save, X } from "lucide-react";

const EditarPseries = ({ id }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_PATH = "/inveplus";

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

  useEffect(() => {
    const fetchPseriesDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authenticationToken");
        if (!token) {
          throw new Error("No se encontró token de autenticación");
        }

        const response = await fetch(
          `http://localhost:8000/pseries/pseries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data); // Para depuración

        if (data && data.status === "success" && data.data) {
          // Actualizar el estado del formulario con los datos del servidor
          setFormData({
            name: data.data.pseries.name || "",
            application: data.data.pseries.application || "",
            hostname: data.data.pseries.hostname || "",
            ip_address: data.data.pseries.ip_address || "",
            environment: data.data.pseries.environment || "",
            slot: data.data.pseries.slot || "",
            lpar_id: data.data.pseries.lpar_id || "",
            status: data.data.pseries.status || "",
            os: data.data.pseries.os || "",
            version: data.data.pseries.version || "",
            subsidiary: data.data.pseries.subsidiary || "",
            min_cpu: data.data.pseries.min_cpu || "",
            act_cpu: data.data.pseries.act_cpu || "",
            max_cpu: data.data.pseries.max_cpu || "",
            min_v_cpu: data.data.pseries.min_v_cpu || "",
            act_v_cpu: data.data.pseries.act_v_cpu || "",
            max_v_cpu: data.data.pseries.max_v_cpu || "",
            min_memory: data.data.pseries.min_memory || "",
            act_memory: data.data.pseries.act_memory || "",
            max_memory: data.data.pseries.max_memory || "",
            expansion_factor: data.data.pseries.expansion_factor || "",
            memory_per_factor: data.data.pseries.memory_per_factor || "",
            processor_compatibility:
              data.data.pseries.processor_compatibility || "",
          });
        } else {
          throw new Error("Respuesta inesperada de la API");
        }
      } catch (error) {
        console.error("Error al obtener detalles del servidor:", error);
        setError(
          error.message ||
            "Ha ocurrido un error al cargar los detalles del servidor"
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "Ha ocurrido un error al cargar los detalles del servidor",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPseriesDetails();
    }
  }, [id]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authenticationToken");

      const response = await fetch(
        `http://localhost:8000/pseries/pseries/${id}`,
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
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servidor actualizado correctamente",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/pseries");
      });
    } catch (error) {
      console.error("Error al actualizar servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al actualizar el servidor",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar y volver a la lista
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
            onClick={() => router.push("/pseries")}
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
      <header className="w-full p-4 flex items-center border-b border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => router.push("/pseries")}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Editar Servidor PSeries
          </h1>
          <p className="text-sm text-gray-500">
            Actualiza la información del servidor {formData.name}
          </p>
        </div>
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
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre Lpar en la HMC{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="application"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Aplicación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="application"
                    name="application"
                    required
                    value={formData.application}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="hostname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hostname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hostname"
                    name="hostname"
                    required
                    value={formData.hostname}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ip_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IP
                  </label>
                  <input
                    type="text"
                    id="ip_address"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subsidiary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Filial
                  </label>
                  <input
                    type="text"
                    id="subsidiary"
                    name="subsidiary"
                    value={formData.subsidiary}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Ubicación */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Ubicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="environment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ambiente
                  </label>
                  <input
                    type="text"
                    id="environment"
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="slot"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cajón
                  </label>
                  <input
                    type="text"
                    id="slot"
                    name="slot"
                    value={formData.slot}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lpar_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Lpar
                  </label>
                  <input
                    type="text"
                    id="lpar_id"
                    name="lpar_id"
                    value={formData.lpar_id}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Sistema Operativo */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Sistema Operativo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="os"
                    className="block text-sm font-medium text-gray-700"
                  >
                    S.O <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="os"
                    name="os"
                    required
                    value={formData.os}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="version"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Versión
                  </label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: CPU */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">CPU</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="min_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU MIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="min_cpu"
                    name="min_cpu"
                    required
                    value={formData.min_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="act_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU ACT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="act_cpu"
                    name="act_cpu"
                    required
                    value={formData.act_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="max_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU MAX <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="max_cpu"
                    name="max_cpu"
                    required
                    value={formData.max_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="min_v_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU V MIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="min_v_cpu"
                    name="min_v_cpu"
                    required
                    value={formData.min_v_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="act_v_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU V ACT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="act_v_cpu"
                    name="act_v_cpu"
                    required
                    value={formData.act_v_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="max_v_cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU V MAX <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="max_v_cpu"
                    name="max_v_cpu"
                    required
                    value={formData.max_v_cpu}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Memoria */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Memoria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="min_memory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria MIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="min_memory"
                    name="min_memory"
                    required
                    value={formData.min_memory}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="act_memory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria ACT
                  </label>
                  <input
                    type="text"
                    id="act_memory"
                    name="act_memory"
                    value={formData.act_memory}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="max_memory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria MAX
                  </label>
                  <input
                    type="text"
                    id="max_memory"
                    name="max_memory"
                    value={formData.max_memory}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Adicional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="expansion_factor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Factor de expansión
                  </label>
                  <input
                    type="text"
                    id="expansion_factor"
                    name="expansion_factor"
                    value={formData.expansion_factor}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="memory_per_factor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Memoria por factor
                  </label>
                  <input
                    type="text"
                    id="memory_per_factor"
                    name="memory_per_factor"
                    value={formData.memory_per_factor}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="processor_compatibility"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Proc Compat
                  </label>
                  <input
                    type="text"
                    id="processor_compatibility"
                    name="processor_compatibility"
                    value={formData.processor_compatibility}
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

export default EditarPseries;
