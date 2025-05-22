import React, { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VerServers = () => {
  const { serverId } = useParams();
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formSections = [
    {
      title: "Información del Hardware",
      fields: [
        "name",
        "brand",
        "model",
        "processor",
        "cpu_cores",
        "ram",
        "total_disk_size",
      ],
    },
    {
      title: "Sistema Operativo",
      fields: ["os_type", "os_version"],
    },
    {
      title: "Configuración",
      fields: ["status", "role", "environment", "serial"],
    },
    {
      title: "Ubicación Física",
      fields: ["rack_id", "unit", "city", "location"],
    },
    {
      title: "Red",
      fields: ["ip_address", "domain"],
    },
    {
      title: "Gestión de Activos",
      fields: [
        "asset_id",
        "service_owner",
        "warranty_start_date",
        "warranty_end_date",
      ],
    },
    {
      title: "Información Organizacional",
      fields: [
        "application_code",
        "responsible_evc",
        "subsidiary",
        "responsible_organization",
      ],
    },
    {
      title: "Facturación y Costos",
      fields: ["billable", "cost_center", "billing_type"],
    },
    {
      title: "Órdenes de Compra",
      fields: ["oc_provisioning", "oc_deletion", "oc_modification"],
    },
    {
      title: "Mantenimiento",
      fields: ["maintenance_period", "maintenance_organization"],
    },
    {
      title: "Observaciones",
      fields: ["comments"],
    },
  ];

  const fieldLabels = {
    name: "Nombre del servidor",
    brand: "Marca",
    model: "Modelo",
    processor: "Procesador",
    cpu_cores: "CPU Cores",
    ram: "RAM",
    total_disk_size: "Tamaño del disco",
    os_type: "Sistema Operativo",
    os_version: "Versión del SO",
    status: "Estado",
    role: "Rol",
    environment: "Ambiente",
    serial: "Serial",
    rack_id: "ID del Rack",
    unit: "Unidad",
    city: "Ciudad",
    location: "Ubicación",
    ip_address: "Dirección IP",
    domain: "Dominio",
    asset_id: "ID del Activo",
    service_owner: "Propietario",
    warranty_start_date: "Inicio Garantía",
    warranty_end_date: "Fin Garantía",
    application_code: "Código de Aplicación",
    responsible_evc: "EVC Responsable",
    subsidiary: "Filial",
    responsible_organization: "Org. Responsable",
    billable: "Facturable",
    cost_center: "Centro de Costos",
    billing_type: "Tipo de Cobro",
    oc_provisioning: "OC Aprovisionamiento",
    oc_deletion: "OC Eliminación",
    oc_modification: "OC Modificación",
    maintenance_period: "Periodo Mantenimiento",
    maintenance_organization: "Org. Mantenimiento",
    comments: "Observaciones",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactive";
      case "maintenance":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authenticationToken");
        const response = await fetch(
          `http://localhost:8000/servers/physical/${serverId}`,
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
        if (data?.status === "success" && data.data?.server_info) {
          setServerData(data.data.server_info);
        } else {
          throw new Error(
            "Datos del servidor no encontrados o con formato inesperado"
          );
        }
      } catch (err) {
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
            Cargando datos del servidor...
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
          <Link
            to="/inveplus/Servidoresf"
            className="mt-3 block text-blue-600 hover:text-blue-800"
          >
            <MdArrowBack className="inline mr-1" /> Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-200 bg-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualizar Servidor Físico
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
                          serverData.status?.toLowerCase() === "active"
                            ? "bg-green-100 border-green-300 text-green-800"
                            : serverData.status?.toLowerCase() === "maintenance"
                            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                            : "bg-red-100 border-red-300 text-red-800"
                        }
                      `}
                        >
                          {serverData.status?.toLowerCase() === "active"
                            ? "Activo"
                            : serverData.status?.toLowerCase() === "maintenance"
                            ? "Mantenimiento"
                            : "Inactivo"}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5">
                          {serverData[field]}
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

export default VerServers;
