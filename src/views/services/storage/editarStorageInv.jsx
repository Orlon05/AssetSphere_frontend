/**
 * @file editarStorageInv.jsx
 * @description Componente para editar los registros de inventario de Storage.
 * Permite la modificación y creación de detalles de inventario asociados a un storage.
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save, HardDrive } from "lucide-react";
import { API_URL } from "../../../config/api";

/**
 * Componente reutilizable para campos de entrada de texto.
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.value - Valor actual del campo
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {string} [props.type="text"] - Tipo de input
 * @param {boolean} [props.required=false] - Si el campo es requerido
 */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

/**
 * Componente reutilizable para campos de selección (dropdowns).
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.value - Valor actual seleccionado
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {Array<string>} props.options - Opciones disponibles
 * @param {boolean} [props.required=false] - Si el campo es requerido
 */
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    >
      <option value="">Seleccionar estado</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Componente principal para editar o crear el inventario de un Storage.
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.storageId] - ID del storage (opcional, puede venir por ruta)
 * @param {Function} [props.onClose] - Función para cerrar la vista actual
 * @param {Function} [props.onSuccess] - Función a ejecutar tras guardar exitosamente
 * @param {boolean} [props.isModal] - Indica si se renderiza en un modal
 * @param {boolean} [props.isCreate] - Indica si el formulario es para crear en lugar de editar
 */
const EditarStorageInv = ({ storageId: propStorageId, onClose, onSuccess, isModal, isCreate }) => {
  const navigate = useNavigate();
  const { storageId: routeStorageId } = useParams();
  const storageId = propStorageId || routeStorageId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isCreate);
  const [error, setError] = useState(null);
  const BASE_PATH = "/AssetSphere";
  const token = localStorage.getItem("authenticationToken");

  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(`${BASE_PATH}/storage-inv`);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`${BASE_PATH}/storage-inv`);
    }
  };

  const [formData, setFormData] = useState({
    GPS: "",
    SerialNumber: "",
    ItemsPurchased: "",
    Description: "",
    Provider: "",
    LocalVendor: "",
    Model: "",
    Hostname: "",
    IPAddress: "",
    RawCapacityTB: "",
    UsableCapacityTB: "",
    Location: "",
    Position: "",
    RackUnit: "",
    TCSAssetID: "",
    PONumber: "",
    HWWarrantyStartDate: "",
    HWWarrantyEndDate: "",
    WarrantyStatus: "",
    TypeOfHWSupport: "",



  });


  const warrantyStatusOptions = [
    "With Support",
    "Expired",
    "Otros",
    "N/A"
  ];

  useEffect(() => {
    if (isCreate) {
      setLoading(false);
      return;
    }
    const fetchStorageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/inv/storage/${storageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,

            
          },
        });
        if (!response.ok) {
          throw new Error("No se pudieron cargar los datos de inventario del Storage.");
        }
        const resData = await response.json();
        if (resData.status === "success" && resData.data) {
          const data = resData.data;
          // Format date strings to YYYY-MM-DD for input type date
          const formatted = { ...data };
          if (formatted.HWWarrantyStartDate) {
            formatted.HWWarrantyStartDate = formatted.HWWarrantyStartDate.slice(0, 10);
          }
          if (formatted.HWWarrantyEndDate) {
            formatted.HWWarrantyEndDate = formatted.HWWarrantyEndDate.slice(0, 10);
          }
          setFormData(formatted);
        } else {
          throw new Error("Estructura de respuesta inesperada del servidor.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storageId && !isCreate) {
      fetchStorageData();
    }
  }, [storageId, token, isCreate]);

  // Auto-calculate WarrantyStatus based on HWWarrantyEndDate
  useEffect(() => {
    if (loading) return; // Don't override during initial data load
    if (formData.HWWarrantyEndDate) {
      const parts = formData.HWWarrantyEndDate.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        const endDate = new Date(year, month - 1, day);
        if (!isNaN(endDate.getTime())) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          const newStatus = endDate < today ? "Expired" : "With Support";
          if (formData.WarrantyStatus !== newStatus) {
            setFormData((prev) => ({
              ...prev,
              WarrantyStatus: newStatus,
            }));
          }
        }
      }
    }
  }, [formData.HWWarrantyEndDate, loading]);

  /**
   * Maneja el cambio de valores en los campos del formulario.
   * @param {Event} e - Evento de cambio en el input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Envía los datos del formulario a la API para crear o actualizar el inventario.
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      delete payload.id;
      delete payload.created_at;

      const url = isCreate 
        ? `${API_URL}/inv/storage` 
        : `${API_URL}/inv/storage/${storageId}`;
      const method = isCreate ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errDetail = await response.text();
        throw new Error(errDetail || `Error HTTP ${response.status}`);
      }

      Swal.fire({
        icon: "success",
        title: isCreate ? "Registro creado" : "Registro actualizado",
        text: isCreate ? "El registro se creó correctamente." : "Los cambios se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      handleDone();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.message || "Ocurrió un error al intentar guardar los cambios.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja el botón de cancelar, solicitando confirmación al usuario antes de salir.
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
        handleClose();
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Cargando detalles de inventario del Storage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 w-full bg-white dark:bg-slate-800">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-slate-700 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-800 dark:text-slate-100 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver al inventario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "p-6 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100" : "min-h-screen bg-gray-50 dark:bg-slate-900/50 text-gray-800 dark:text-slate-100"}>
      {/* Header */}
      <header className={`w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm ${isModal ? "rounded-t-xl mb-4" : ""}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <HardDrive className="mr-2 text-blue-600" size={24} />
            {isCreate ? "Crear Registro Inventario Storage" : "Editar Registro Inventario Storage"}
          </h1>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {isCreate 
              ? "Ingresa la información del nuevo registro de inventario" 
              : `Modifica la información del dispositivo de inventario ${formData.Hostname || formData.SerialNumber || ""}`}
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          {isModal ? "Cerrar" : "Regresar"}
        </button>
      </header>

      {/* Main Content */}
      <main className={isModal ? "" : "container mx-auto p-6"}>
        <div className={isModal ? "bg-white dark:bg-slate-800" : "bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700"}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="TCS Asset ID"
                  name="TCSAssetID"
                  value={formData.TCSAssetID}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de Serie"
                  name="SerialNumber"
                  value={formData.SerialNumber}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Número de PO / Orden Compra"
                  name="PONumber"
                  value={formData.PONumber}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Modelo"
                  name="Model"
                  value={formData.Model}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Ubicación y Localización */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Ubicación y Localización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Ubicación / Datacenter"
                  name="Location"
                  value={formData.Location}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Coordenadas GPS"
                  name="GPS"
                  value={formData.GPS}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Posición"
                  name="Position"
                  value={formData.Position}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Unidad de Rack"
                  name="RackUnit"
                  value={formData.RackUnit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Especificaciones Técnicas */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Especificaciones Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Hostname"
                  name="Hostname"
                  value={formData.Hostname}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Dirección IP"
                  name="IPAddress"
                  value={formData.IPAddress}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Capacidad Bruta (TB)"
                  name="RawCapacityTB"
                  type="number"
                  value={formData.RawCapacityTB}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Capacidad Utilizable (TB)"
                  name="UsableCapacityTB"
                  type="number"
                  value={formData.UsableCapacityTB}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Adquisición y Proveedor */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Adquisición y Proveedor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Proveedor"
                  name="Provider"
                  value={formData.Provider}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Vendedor Local"
                  name="LocalVendor"
                  value={formData.LocalVendor}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Items Comprados"
                  name="ItemsPurchased"
                  value={formData.ItemsPurchased}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Garantía y Soporte */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Garantía y Soporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Inicio Garantía HW"
                  name="HWWarrantyStartDate"
                  type="date"
                  value={formData.HWWarrantyStartDate}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Fin Garantía HW"
                  name="HWWarrantyEndDate"
                  type="date"
                  value={formData.HWWarrantyEndDate}
                  onChange={handleInputChange}
                />
                <SelectField
                  label="Estado de Garantía"
                  name="WarrantyStatus"
                  value={formData.WarrantyStatus}
                  onChange={handleInputChange}
                  options={warrantyStatusOptions}
                />
                <InputField
                  label="Tipo de Soporte HW"
                  name="TypeOfHWSupport"
                  value={formData.TypeOfHWSupport}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sección: Descripción */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300">
                Descripción
              </h2>
              <div className="space-y-2">
                <label htmlFor="Description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Comentarios / Descripción detallada
                </label>
                <textarea
                  id="Description"
                  name="Description"
                  rows={4}
                  value={formData.Description ?? ""}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors gap-2"
              >
                <Save size={18} />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarStorageInv;






