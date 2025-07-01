/**
 * Componente para editar servidores PSeries existentes
 *
 * Funcionalidades:
 * - Carga datos existentes del servidor
 * - Formulario pre-poblado con información actual
 * - Validación de campos obligatorios
 * - Manejo de estados de carga y errores
 * - Confirmación antes de cancelar cambios
 *
 * @component
 * @example
 * return <EditarPseries />
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save, X, Server } from "lucide-react";

const EditarPseries = () => {
  const navigate = useNavigate();
  const { pserieId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_PATH = "/inveplus";

  // Estados individuales para cada campo del formulario
  const [name, setName] = useState("");
  const [application, setApplication] = useState("");
  const [hostname, setHostName] = useState("");
  const [ip_address, setIpAddress] = useState("");
  const [environment, setEnvironment] = useState("");
  const [slot, setSlot] = useState("");
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

  /**
   * Configuración de notificaciones toast
   */
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

  /**
   * Muestra notificación de éxito
   */
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Servidor actualizado exitosamente",
    });
  };

  // Opciones para campos de selección
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

  const token = localStorage.getItem("authenticationToken");

  /**
   * Carga los datos del servidor desde la API
   */
  useEffect(() => {
    const fetchPseriesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://10.8.150.90/api/inveplus/pseries/get_by_id/${pserieId}`,
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

        if (data.status === "success" && data.data) {
          // Poblar todos los campos con los datos obtenidos
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
          setMaxVCpu(data.data.max_v_cpu || "");
          setMinMemory(data.data.min_memory || "");
          setActMemory(data.data.act_memory || "");
          setMaxMemory(data.data.max_memory || "");
          setExpansionFactor(data.data.expansion_factor || "");
          setMemoryPerFactor(data.data.memory_per_factor || "");
          setProcessorCompatibility(data.data.processor_compatibility || "");
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error en fetchPseriesData:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (pserieId) {
      fetchPseriesData();
    }
  }, [pserieId, token]);

  /**
   * Maneja el envío del formulario
   * @param {Event} event - Evento del formulario
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos obligatorios
    if (!application || !name || !hostname) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }

    // Preparar datos para envío
    const pserieData = {
      name,
      application,
      hostname,
      ip_address,
      environment,
      slot,
      lpar_id,
      status,
      os,
      version,
      subsidiary,
      min_cpu,
      act_cpu,
      max_cpu,
      min_v_cpu,
      act_v_cpu,
      max_v_cpu,
      min_memory,
      act_memory,
      max_memory,
      expansion_factor,
      memory_per_factor,
      processor_compatibility,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `https://10.8.150.90/api/inveplus/pseries/edit/${pserieId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pserieData),
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
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      } else {
        showSuccessToast();
        navigate(`${BASE_PATH}/pseries`);
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

  /**
   * Maneja la cancelación con confirmación
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

  // Estados de carga y error
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
            onClick={() => navigate(`${BASE_PATH}/pseries`)}
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
            Editar PSeries
          </h1>
          <p className="text-sm font-semibold text-gray-900">
            Modifica la información del servidor{" "}
            <span className="font-bold">{name}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`${BASE_PATH}/pseries`)}
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
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre LPAR en la HMC{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
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
                    value={hostname}
                    onChange={(e) => setHostName(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ip_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección IP
                  </label>
                  <input
                    type="text"
                    id="ip_address"
                    name="ip_address"
                    value={ip_address}
                    onChange={(e) => setIpAddress(e.target.value)}
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar estado</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subsidiary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Filial
                  </label>
                  <select
                    id="subsidiary"
                    name="subsidiary"
                    value={subsidiary}
                    onChange={(e) => setSubsidiary(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar filial</option>
                    {subsidiaryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                  <select
                    id="environment"
                    name="environment"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar ambiente</option>
                    {environmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lpar_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID LPAR
                  </label>
                  <input
                    type="text"
                    id="lpar_id"
                    name="lpar_id"
                    value={lpar_id}
                    onChange={(e) => setLparId(e.target.value)}
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
                    Sistema Operativo <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="os"
                    name="os"
                    required
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar S.O</option>
                    {osOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
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
                    value={min_cpu}
                    onChange={(e) => setMinCpu(e.target.value)}
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
                    value={act_cpu}
                    onChange={(e) => setActCpu(e.target.value)}
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
                    value={max_cpu}
                    onChange={(e) => setMaxCpu(e.target.value)}
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
                    value={min_v_cpu}
                    onChange={(e) => setMinVCpu(e.target.value)}
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
                    value={act_v_cpu}
                    onChange={(e) => setActVCpu(e.target.value)}
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
                    value={max_v_cpu}
                    onChange={(e) => setMaxVCpu(e.target.value)}
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
                    value={min_memory}
                    onChange={(e) => setMinMemory(e.target.value)}
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
                    value={act_memory}
                    onChange={(e) => setActMemory(e.target.value)}
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
                    value={max_memory}
                    onChange={(e) => setMaxMemory(e.target.value)}
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
                    value={expansion_factor}
                    onChange={(e) => setExpansionFactor(e.target.value)}
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
                    value={memory_per_factor}
                    onChange={(e) => setMemoryPerFactor(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="processor_compatibility"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Compatibilidad de procesador
                  </label>
                  <select
                    id="processor_compatibility"
                    name="processor_compatibility"
                    value={processor_compatibility}
                    onChange={(e) => setProcessorCompatibility(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar compatibilidad</option>
                    {processorCompatibilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
