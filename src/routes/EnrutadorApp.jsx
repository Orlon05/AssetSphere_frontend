import { lazy } from 'react';
import ProtectedRoute from "./ProtectedRoute";
import Login from "../views/auth/Login";
// import Dashboard from "../pages/Dashboard";

// const ServidoresF = lazy(() => import("../pages/ServidoresFisicos"));
// const ServidoresV = lazy(() => import("../pages/ServidoresVirtuales"));
// const Analitica = lazy(() => import("../pages/Analitica"));
// const CrearServerF = lazy(() => import("../pages/CrearServidor"));
// const EditarServer = lazy(() => import("../pages/EditarServidor"));
// const VerServers = lazy(() => import("../pages/VerServers"));  
// const Perfil = lazy(() => import("../perfil/Perfil"));
// const Usuarios = lazy(() => import("../pages/Usuarios"));
// const CrearUsuario = lazy(() => import("../forms/CrearUsuario"));
// const EditarUsuario = lazy(() => import("../forms/EditarUsuario"));
// const Logs = lazy(() => import("../pages/Logs"));
// const Storage = lazy(() => import("../pages/Storage"));
// const Pseries = lazy(() => import("../pages/Pseries"));
// const CrearPseries = lazy(() => import("../pages/CrearPseries"));
// const EditarPseries = lazy(() => import("../pages/EditarPseries"));
// const VerPseries = lazy(() => import("../pages/VerPseries"));
// const CrearStorage = lazy(() => import("../pages/CrearStorage"));
// const EditarStorage = lazy(() => import("../pages/EditarStorage"));
// const VerStorage = lazy(() => import("../pages/VerStorage"));
// const BaseDatos = lazy(() => import("../pages/BaseDatos"));
// const CrearBaseDatos = lazy(() => import("../pages/CrearBaseDatos"));
// const VerBaseDatos = lazy(() => import("../pages/VerBaseDatos"));
// const EditarBaseDatos = lazy(() => import("../pages/EditarBaseDatos"));
// const Sucursales = lazy(() => import("../pages/Sucursales"));
// const CrearSucursales = lazy(() => import("../pages/CrearSucursales"));
// const EditarSucursal = lazy(() => import("../pages/EditarSucursales"));
// const VerSucursales = lazy(() => import("../pages/VerSucursales"));
// const VirtualForm = lazy(() => import("../pages/crearServidorv"));
// const EditarServerVirtual = lazy(() => import("../pages/editarServidorv"));
// const VerServidoresVirtuales = lazy(() => import("../pages/verServidoresVirtuales"));

const BASE_PATH = "/inveplus";

export const EnrutadorApp = [
  {
    element: <Login />,
    path: `${BASE_PATH}/login`,
  },
//   {
//     path: `${BASE_PATH}/`,
//     element: (
//       <ProtectedRoute>
//         <Dashboard />
//       </ProtectedRoute>
//     ),
//     children: [
//       // Rutas principales
//       { path: "analitica", element: <Analitica /> },
//       { path: "servidoresf", element: <ServidoresF /> },
//       { path: "servidoresv", element: <ServidoresV /> },
//       { path: "usuarios", element: <Usuarios /> },
//       { path: "perfil", element: <Perfil /> },
//       { path: "ver-logs", element: <Logs /> },
//       { path: "storage", element: <Storage /> },
//       { path: "pseries", element: <Pseries /> },
//       { path: "Base-De-Datos", element: <BaseDatos /> },
//       { path: "sucursales", element: <Sucursales /> },
      
//       // Rutas de creación
//       { path: "crear-servidores-f", element: <CrearServerF /> },
//       { path: "crear-servidores-v", element: <VirtualForm /> },
//       { path: "crear-usuarios", element: <CrearUsuario /> },
//       { path: "crear-storages", element: <CrearStorage /> },
//       { path: "crear-pseries", element: <CrearPseries /> },
//       { path: "crear-base-de-datos", element: <CrearBaseDatos /> },
//       { path: "crear-sucursales", element: <CrearSucursales /> },
      
//       // Rutas de edición
//       { path: "editar/:serverId/servidores", element: <EditarServer /> },
//       { path: "editar/:serverId/servidoresv", element: <EditarServerVirtual /> },
//       { path: "editar-usuarios", element: <EditarUsuario /> },
//       { path: "editar/:storageId/storages", element: <EditarStorage /> },
//       { path: "editar/:pserieId/pseries", element: <EditarPseries /> },
//       { path: "editar/:baseDatosId/basedatos", element: <EditarBaseDatos /> },
//       { path: "editar/:sucursalId/sucursales", element: <EditarSucursal /> },
      
//       // Rutas de visualización
//       { path: "ver/:serverId/servers", element: <VerServers /> },
//       { path: "ver/:serverId/servidoresv", element: <VerServidoresVirtuales /> },
//       { path: "ver/:storageId/storages", element: <VerStorage /> },
//       { path: "ver/:pserieId/pseries", element: <VerPseries /> },
//       { path: "ver/:baseDatosId/basedatos", element: <VerBaseDatos /> },
//       { path: "ver/:sucursalId/sucursales", element: <VerSucursales /> },
//     ],
//   },
 ];