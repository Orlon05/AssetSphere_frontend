"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Server,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

 const BASE_PATH = "/inveplus";

// Datos de ejemplo para los servidores físicos
const servidoresData = [
  {
    id: "SRV-001",
    nombre: "PROD-DB-SERVER01",
    ip: "192.168.1.10",
    sistema: "CentOS 8",
    estado: "Activo",
    ubicacion: "Rack A3 - DataCenter Principal",
    instalacion: "2023-05-15",
    memoria: "64GB",
    procesador: "Intel Xeon E5-2680 v4",
    almacenamiento: "4TB RAID 10",
  },
  {
    id: "SRV-002",
    nombre: "PROD-APP-SERVER01",
    ip: "192.168.1.11",
    sistema: "Ubuntu Server 22.04 LTS",
    estado: "Activo",
    ubicacion: "Rack A4 - DataCenter Principal",
    instalacion: "2023-06-22",
    memoria: "128GB",
    procesador: "AMD EPYC 7443",
    almacenamiento: "2TB SSD RAID 5",
  },
  {
    id: "SRV-003",
    nombre: "DEV-TEST-SERVER01",
    ip: "192.168.1.50",
    sistema: "Windows Server 2022",
    estado: "Mantenimiento",
    ubicacion: "Rack B2 - DataCenter Secundario",
    instalacion: "2023-02-10",
    memoria: "32GB",
    procesador: "Intel Xeon Silver 4310",
    almacenamiento: "1TB SSD",
  },
  {
    id: "SRV-004",
    nombre: "BACKUP-SERVER01",
    ip: "192.168.1.100",
    sistema: "Debian 11",
    estado: "Activo",
    ubicacion: "Rack C1 - DataCenter Principal",
    instalacion: "2022-11-05",
    memoria: "64GB",
    procesador: "Intel Xeon E5-2680 v4",
    almacenamiento: "16TB RAID 6",
  },
  {
    id: "SRV-005",
    nombre: "MONITOR-SERVER01",
    ip: "192.168.1.200",
    sistema: "Ubuntu Server 20.04 LTS",
    estado: "Inactivo",
    ubicacion: "Rack A5 - DataCenter Principal",
    instalacion: "2022-08-17",
    memoria: "32GB",
    procesador: "Intel Xeon E5-2650 v4",
    almacenamiento: "2TB RAID 1",
  },
  {
    id: "SRV-006",
    nombre: "PROD-WEB-SERVER01",
    ip: "192.168.1.20",
    sistema: "CentOS 7",
    estado: "Activo",
    ubicacion: "Rack A3 - DataCenter Principal",
    instalacion: "2022-04-30",
    memoria: "64GB",
    procesador: "Intel Xeon Gold 6330",
    almacenamiento: "1TB SSD RAID 10",
  },
  {
    id: "SRV-007",
    nombre: "PROD-WEB-SERVER02",
    ip: "192.168.1.21",
    sistema: "CentOS 7",
    estado: "Activo",
    ubicacion: "Rack A3 - DataCenter Principal",
    instalacion: "2022-05-02",
    memoria: "64GB",
    procesador: "Intel Xeon Gold 6330",
    almacenamiento: "1TB SSD RAID 10",
  },
  {
    id: "SRV-008",
    nombre: "STAGING-SERVER01",
    ip: "192.168.2.50",
    sistema: "Ubuntu Server 22.04 LTS",
    estado: "Activo",
    ubicacion: "Rack B1 - DataCenter Secundario",
    instalacion: "2023-01-20",
    memoria: "32GB",
    procesador: "AMD EPYC 7313",
    almacenamiento: "1TB SSD",
  },
];

export default function ServidoresFisicos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar servidores por término de búsqueda
  const filteredServidores = servidoresData.filter(
    (servidor) =>
      servidor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servidor.ip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServidores = filteredServidores.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServidores.length / itemsPerPage);

  // Manejadores de eventos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se busca
  };

  const handleView = (id) => {
    alert(`Ver detalles del servidor ${id}`);
    // En una aplicación real, aquí redirigirías a la página de detalles
    // router.push(`/servidores-fisicos/${id}`);
  };

  const handleEdit = (id) => {
    alert(`Editar servidor ${id}`);
    // En una aplicación real, aquí redirigirías a la página de edición
    // router.push(`/servidores-fisicos/editar/${id}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(`¿Estás seguro de que deseas eliminar el servidor ${id}?`)
    ) {
      alert(`Servidor ${id} eliminado`);
      // En una aplicación real, aquí eliminarías el servidor y actualizarías el estado
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Activo":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle size={12} className="mr-1" />
            Activo
          </span>
        );
      case "Inactivo":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle size={12} className="mr-1" />
            Inactivo
          </span>
        );
      case "Mantenimiento":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock size={12} className="mr-1" />
            Mantenimiento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Header */}
      <header className="w-full p-4 flex items-center border-b border-gray-700">
        <button
          onClick={() => navigate(`${BASE_PATH}/dashboard`)}
          className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Server className="mr-2 text-blue-400" />
            Servidores Físicos
          </h1>
          <p className="text-sm text-gray-400">
            Gestión y monitoreo de servidores físicos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-700 rounded-lg shadow-lg p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o IP..."
                className="bg-gray-600 border border-gray-500 text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                + Nuevo Servidor
              </button>
            </div>
          </div>

          {/* Tabla. */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-800 text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    IP
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sistema
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ubicación
                  </th>
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentServidores.length > 0 ? (
                  currentServidores.map((servidor, index) => (
                    <tr
                      key={servidor.id}
                      className={`border-b border-gray-600 ${
                        index % 2 === 0 ? "bg-gray-700" : "bg-gray-650"
                      } hover:bg-gray-600`}
                    >
                      <td className="px-6 py-4 font-medium">{servidor.id}</td>
                      <td className="px-6 py-4">{servidor.nombre}</td>
                      <td className="px-6 py-4">{servidor.ip}</td>
                      <td className="px-6 py-4">{servidor.sistema}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(servidor.estado)}
                      </td>
                      <td className="px-6 py-4">{servidor.ubicacion}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(servidor.id)}
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(servidor.id)}
                            className="p-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(servidor.id)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      No se encontraron servidores que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginacion */}
          {filteredServidores.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Mostrando {indexOfFirstItem + 1} a{" "}
                {Math.min(indexOfLastItem, filteredServidores.length)} de{" "}
                {filteredServidores.length} servidores
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
