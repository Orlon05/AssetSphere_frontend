import React, { useState, useEffect } from "react";
import { MdVisibility, MdArrowBack } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

const VerServers = () => {
  const [serverData, setServerData] = useState({
    name: "",
    brand: "",
    model: "",
    processor: "",
    cpu_cores: "",
    ram: "",
    total_disk_size: "",
    os_type: "",
    os_version: "",
    status: "",
    role: "",
    environment: "",
    serial: "",
    rack_id: "",
    unit: "",
    ip_address: "",
    city: "",
    location: "",
    asset_id: "",
    service_owner: "",
    warranty_start_date: "",
    warranty_end_date: "",
    application_code: "",
    responsible_evc: "",
    domain: "",
    subsidiary: "",
    responsible_organization: "",
    billable: "",
    oc_provisioning: "",
    oc_deletion: "",
    oc_modification: "",
    maintenance_period: "",
    maintenance_organization: "",
    cost_center: "",
    billing_type: "",
    comments: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serverId } = useParams();

  // Estructura modular de los campos del formulario
  const formSections = [
    {
      title: "Información del Hardware",
      fields: [
        { id: "name", label: "Nombre del servidor", type: "text" },
        { id: "brand", label: "Marca", type: "text" },
        { id: "model", label: "Modelo", type: "text" },
        { id: "processor", label: "Procesador", type: "text" },
        { id: "cpu_cores", label: "CPU Cores", type: "text" },
        { id: "ram", label: "RAM", type: "text" },
        { id: "total_disk_size", label: "Tamaño del disco", type: "text" },
      ],
    },
    {
      title: "Sistema Operativo",
      fields: [
        { id: "os_type", label: "Sistema Operativo", type: "text" },
        { id: "os_version", label: "Versión del SO", type: "text" },
      ],
    },
    {
      title: "Configuración",
      fields: [
        { id: "status", label: "Estado", type: "text" },
        { id: "role", label: "Rol", type: "text" },
        { id: "environment", label: "Ambiente", type: "text" },
        { id: "serial", label: "Serial", type: "text" },
      ],
    },
    {
      title: "Ubicación Física",
      fields: [
        { id: "rack_id", label: "ID del Rack", type: "text" },
        { id: "unit", label: "Unidad", type: "text" },
        { id: "city", label: "Ciudad", type: "text" },
        { id: "location", label: "Ubicación", type: "text" },
      ],
    },
    {
      title: "Red",
      fields: [
        { id: "ip_address", label: "Dirección IP", type: "text" },
        { id: "domain", label: "Dominio", type: "text" },
      ],
    },
    {
      title: "Gestión de Activos",
      fields: [
        { id: "asset_id", label: "ID del Activo", type: "text" },
        { id: "service_owner", label: "Propietario", type: "text" },
        { id: "warranty_start_date", label: "Inicio Garantía", type: "date" },
        { id: "warranty_end_date", label: "Fin Garantía", type: "date" },
      ],
    },
    {
      title: "Información Organizacional",
      fields: [
        { id: "application_code", label: "Código de Aplicación", type: "text" },
        { id: "responsible_evc", label: "EVC Responsable", type: "text" },
        { id: "subsidiary", label: "Filial", type: "text" },
        {
          id: "responsible_organization",
          label: "Org. Responsable",
          type: "text",
        },
      ],
    },
    {
      title: "Facturación y Costos",
      fields: [
        { id: "billable", label: "Facturable", type: "text" },
        { id: "cost_center", label: "Centro de Costos", type: "text" },
        { id: "billing_type", label: "Tipo de Cobro", type: "text" },
      ],
    },
    {
      title: "Órdenes de Compra",
      fields: [
        { id: "oc_provisioning", label: "OC Aprovisionamiento", type: "text" },
        { id: "oc_deletion", label: "OC Eliminación", type: "text" },
        { id: "oc_modification", label: "OC Modificación", type: "text" },
      ],
    },
    {
      title: "Mantenimiento",
      fields: [
        {
          id: "maintenance_period",
          label: "Periodo Mantenimiento",
          type: "text",
        },
        {
          id: "maintenance_organization",
          label: "Org. Mantenimiento",
          type: "text",
        },
      ],
    },
    {
      title: "Observaciones",
      fields: [{ id: "comments", label: "", type: "textarea" }],
    },
  ];

  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/servers/physical/${serverId}`,
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
          setServerData({
            name: data.data.server_info.name || "",
            brand: data.data.server_info.brand || "",
            model: data.data.server_info.model || "",
            processor: data.data.server_info.processor || "",
            cpu_cores: parseInt(data.data.server_info.cpu_cores, 10) || 0,
            ram: data.data.server_info.ram || 0,
            total_disk_size: data.data.server_info.total_disk_size || "",
            os_type: data.data.server_info.os_type || "",
            os_version: data.data.server_info.os_version || "",
            status: data.data.server_info.status || "",
            role: data.data.server_info.role || "",
            environment: data.data.server_info.environment || "",
            serial: data.data.server_info.serial || "",
            rack_id: data.data.server_info.rack_id || "",
            unit: data.data.server_info.unit || "",
            ip_address: data.data.server_info.ip_address || "",
            city: data.data.server_info.city || "",
            location: data.data.server_info.location || "",
            asset_id: data.data.server_info.asset_id || "",
            service_owner: data.data.server_info.service_owner || "",
            warranty_start_date:
              data.data.server_info.warranty_start_date || "",
            warranty_end_date: data.data.server_info.warranty_end_date || "",
            application_code: data.data.server_info.application_code || "",
            responsible_evc: data.data.server_info.responsible_evc || "",
            domain: data.data.server_info.domain || "",
            subsidiary: data.data.server_info.subsidiary || "",
            responsible_organization:
              data.data.server_info.responsible_organization || "",
            billable: data.data.server_info.billable || "",
            oc_provisioning: data.data.server_info.oc_provisioning || "",
            oc_deletion: data.data.server_info.oc_deletion || "",
            oc_modification: data.data.server_info.oc_modification || "",
            maintenance_period: data.data.server_info.maintenance_period || "",
            maintenance_organization:
              data.data.server_info.maintenance_organization || "",
            cost_center: data.data.server_info.cost_center || "",
            billing_type: data.data.server_info.billing_type || "",
            comments: data.data.server_info.comments || "",
          });
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error al obtener datos del servidor:", error);
        setError(error.message || "Hubo un error al cargar los datos.");
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <MdVisibility className="mr-2 text-blue-600" />
          Visualizar Servidor Físico
        </h1>
        <Link
          to="/inveplus/Servidoresf"
          className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
        >
          <MdArrowBack className="mr-2" />
          Regresar
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Información General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre del Servidor
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.name || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Estado
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.status || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rol
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.role || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ambiente
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.environment || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Dirección IP
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.ip_address || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ubicación
            </label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {serverData.location
                ? `${serverData.city} - ${serverData.location}`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {formSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields.map((field) => (
                <div key={field.id}>
                  {field.label && (
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                  )}
                  {field.type === "textarea" ? (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                      {serverData[field.id] || "Ninguna"}
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      {serverData[field.id] || "N/A"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerServers;
