/**
 * @file Insumos.jsx
 * @description View component for uploading Excel files to collect or update inventory resources (insumos) in the database.
 */
import { API_URL } from "../../../config/api";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Activity, Upload } from "lucide-react";
import Header from "../../../components/Header";

/**
 * Component for managing the import of resources (insumos) via Excel files.
 * @returns {JSX.Element} The Insumos component.
 */
export default function Insumos() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  /**
   * Triggers the hidden file input element to open the file selection dialog.
   */
  const handleSelectFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  /**
   * Handles the file change event, validates the Excel file, and uploads it to the server.
   * Manages the loading state and displays success/error notifications.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      Swal.fire({
        icon: "error",
        title: "Archivo inválido",
        text: "Selecciona un archivo .xlsx",
      });
      return;
    }

    const token = localStorage.getItem("authenticationToken");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Sesión no válida",
        text: "Inicia sesión nuevamente.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/insumos/recolectar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.detail || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: data.mensaje || "Proceso completado",
        text: `Registros procesados: ${data.registros_procesados ?? 0}`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Error interno",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-800 dark:text-slate-100">
      {/* Header */}
      <Header title="Insumos" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Sube un Excel (.xlsx) para recolectar/actualizar insumos en la base de datos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleSelectFile}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                <Activity size={16} />
                <span>{loading ? "Recolectando..." : "Recolectar insumos"}</span>
              </button>
              <button
                onClick={handleSelectFile}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                title="Seleccionar archivo"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Seleccionar Excel</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}







