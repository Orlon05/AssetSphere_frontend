import ServidoresF from "../pages/ServidoresFisicos";
import ServidoresV from "../pages/ServidoresVirtuales";
import Dashboard from "../pages/Dashboard";
import Login from "../forms/Login";
import ProtectedRoute from "./ProtectedRoute";
import Analitica from "../pages/Analitica";
import CrearServerF from "../pages/CrearServidor";
import EditarServer from "../pages/EditarServidor";
import VerServers from "../pages/VerServers";  
import Perfil from "../perfil/Perfil";
import Usuarios from "../pages/Usuarios";
import CrearUsuario from "../forms/CrearUsuario";
import EditarUsuario from "../forms/EditarUsuario";
import Logs from "../pages/Logs";
import Storage from "../pages/Storage";
import Pseries from "../pages/Pseries";
import CrearPseries from "../pages/CrearPseries";
import EditarPseries from "../pages/EditarPseries";
import VerPseries from "../pages/VerPseries";
import CrearStorage from "../pages/CrearStorage";
import EditarStorage from "../pages/EditarStorage";
import VerStorage from "../pages/VerStorage";
import BaseDatos from "../pages/BaseDatos";
import CrearBaseDatos from "../pages/CrearBaseDatos";
import VerBaseDatos from "../pages/VerBaseDatos";
import EditarBaseDatos from "../pages/EditarBaseDatos";
import Sucursales from "../pages/Sucursales";
import CrearSucursales from "../pages/CrearSucursales";
import EditarSucursal from "../pages/EditarSucursales";
import VerSucursales from "../pages/VerSucursales";

export let EnrutadorApp = [
  {
    element: <Login />,
    path: "login",
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "analitica",
        element: <Analitica />,
      },
      {
        path: "servidoresf",
        element: <ServidoresF />,
      },
      {
        path: "servidoresv",
        element: <ServidoresV />,
      },
      {
        path: "crear-servidores-f",
        element: <CrearServerF />,
      },
      {
        path: "/editar/:serverId/servidores",
        element: <EditarServer />,
      },
      {
        path: "/ver/:serverId/servers",
        element: <VerServers />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "usuarios",
        element: <Usuarios />,
      },
      {
        path: "crear-usuarios",
        element: <CrearUsuario />,
      },
      {
        path: "/editar-usuarios",
        element: <EditarUsuario />,
      },
      {
        path: "ver-logs",
        element: <Logs />,
      },
      {
        path: "/storage",
        element: <Storage />,
      },
      {
        path: "/crear-storages",
        element: <CrearStorage />,
      },
      {
        path: "/ver/:storageId/storages",
        element: <VerStorage />,
      },
      {
        path: "/editar/:storageId/storages",
        element: <EditarStorage />,
      },
      {
        path: "/Base-De-Datos",
        element: <BaseDatos />,
      },
      {
        path: "/crear-base-de-datos",
        element: <CrearBaseDatos />,
      },
      {
        path: "/ver/:baseDatosId/basedatos",
        element: <VerBaseDatos />,
      },
      {
        path: "/editar/:baseDatosId/basedatos",
        element: <EditarBaseDatos />,
      },
      {
        path: "/sucursales",
        element: <Sucursales />,
      },
      {
        path: "/ver/:sucursalId/sucursales",
        element: <VerSucursales />,
      },
      {
        path: "/crear-sucursales",
        element: <CrearSucursales />,
      },
      {
        path: "/editar/:sucursalId/sucursales",
        element: <EditarSucursal />,
      },
      {
        path: "/pseries",
        element: <Pseries />,
      },
      {
        path: "/crear-pseries",
        element: <CrearPseries />,
      },
      {
        path: "/editar/:pserieId/pseries",
        element: <EditarPseries />,
      },
      {
        path: "/ver/:pserieId/pseries",
        element: <VerPseries />,
      },
    ],
  },
];
