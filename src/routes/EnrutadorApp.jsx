import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../views/auth/Login";
import Dashboard from "../views/dashboard/dashboard";
import Sidebar from "../views/layout/sidebar";

const ServidoresFisicos = lazy(() =>
  import("../views/services/servidores Fisicos/servidoresF")
);
const ServidoresVirtuales = lazy(() =>
  import("../views/services/servidores Virtuales/servidoresV")
);
// const Analitica = lazy(() => import("../pages/Analitica"));
const CrearServerF = lazy(() =>
  import("../views/services/servidores Fisicos/CrearServidor")
);
const EditarServer = lazy(() =>
  import("../views/services/servidores Fisicos/editarservidor")
);
const VerServers = lazy(() =>
  import("../views/services/servidores Fisicos/verservidor")
);
// const Perfil = lazy(() => import("../perfil/Perfil"));
// const Usuarios = lazy(() => import("../pages/Usuarios"));
// const CrearUsuario = lazy(() => import("../forms/CrearUsuario"));
// const EditarUsuario = lazy(() => import("../forms/EditarUsuario"));
// const Logs = lazy(() => import("../pages/Logs"));
const Storage = lazy(() => import("../views/services/Storage/Storage"));
const pseries = lazy(() => import("../views/services/Pseries/Pseries"));
const CrearPseries = lazy(() =>
  import("../views/services/Pseries/crearPserie")
);
const EditarPseries = lazy(() =>
  import("../views/services/Pseries/editarPseries")
);
const VerPseries = lazy(() => import("../views/services/Pseries/verPseries"));
const CrearStorage = lazy(() =>
  import("../views/services/Storage/crearStorage")
);
const EditarStorage = lazy(() =>
  import("../views/services/Storage/editarStorage")
);
const VerStorage = lazy(() => import("../views/services/Storage/VerStorage"));
const BaseDatos = lazy(() =>
  import("../views/services/Base de datos/baseDeDatos")
);
const CrearBaseDatos = lazy(() =>
  import("../views/services/Base de datos/CrearBasedeDatos")
);
const VerBaseDatos = lazy(() =>
  import("../views/services/Base de datos/verbasededatos")
);
const EditarBaseDatos = lazy(() =>
  import("../views/services/Base de datos/editarbasededatos")
);
// const Sucursales = lazy(() => import("../pages/Sucursales"));
// const CrearSucursales = lazy(() => import("../pages/CrearSucursales"));
// const EditarSucursal = lazy(() => import("../pages/EditarSucursales"));
// const VerSucursales = lazy(() => import("../pages/VerSucursales"));
const CrearServidorVirtual = lazy(() =>
  import("../views/services/servidores Virtuales/CrearServidorV")
);
const EditarservidorV = lazy(() =>
  import("../views/services/servidores Virtuales/editarservidorv")
);
const VerServidoresV = lazy(() =>
  import("../views/services/servidores Virtuales/verservidoresv")
);

const BASE_PATH = "/inveplus";

const EnrutadorApp = [
  {
    path: `${BASE_PATH}/login`,
    element: <Login />,
  },
  {
    path: `${BASE_PATH}/dashboard`,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  // Rutas protegidas directamente bajo /inveplus/
  {
    path: `${BASE_PATH}/servidoresf`,
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/servidoresv`,
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/analitica`,
  //   element: (
  //     <ProtectedRoute>
  //       <Analitica />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: `${BASE_PATH}/usuarios`,
  //   element: (
  //     <ProtectedRoute>
  //       <Usuarios />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: `${BASE_PATH}/perfil`,
  //   element: (
  //     <ProtectedRoute>
  //       <Perfil />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: `${BASE_PATH}/ver-logs`,
  //   element: (
  //     <ProtectedRoute>
  //       <Logs />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: `${BASE_PATH}/storage`,
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/pseries`,
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/base-de-datos`,
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/sucursales`,
  //   element: (
  //     <ProtectedRoute>
  //       <Sucursales />
  //     </ProtectedRoute>
  //   ),
  // },

  // Crear
  {
    path: `${BASE_PATH}/crear-servidores-f`,
    element: (
      <ProtectedRoute>
        <CrearServerF />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/crear-servidores-v`,
    element: (
      <ProtectedRoute>
        <CrearServidorVirtual />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/crear-usuarios`,
  //   element: (
  //     <ProtectedRoute>
  //       <CrearUsuario />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: `${BASE_PATH}/crear-storages`,
    element: (
      <ProtectedRoute>
        <CrearStorage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/crear-pseries`,
    element: (
      <ProtectedRoute>
        <CrearPseries />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/crear-base-de-datos`,
    element: (
      <ProtectedRoute>
        <CrearBaseDatos />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/crear-sucursales`,
  //   element: (
  //     <ProtectedRoute>
  //       <CrearSucursales />
  //     </ProtectedRoute>
  //   ),
  // },

  // // Editar
  {
    path: `${BASE_PATH}/editar/:serverId/servers`,
    element: (
      <ProtectedRoute>
        <EditarServer />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/editar/:serverId/vservers`,
    element: (
      <ProtectedRoute>
        <EditarservidorV />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/editar-usuarios`,
  //   element: (
  //     <ProtectedRoute>
  //       <EditarUsuario />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: `${BASE_PATH}/editar/:storageId/storages`,
    element: (
      <ProtectedRoute>
        <EditarStorage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/editar/:pserieId/pseries`,
    element: (
      <ProtectedRoute>
        <EditarPseries />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/editar/:baseDatosId/base-de-datos`,
    element: (
      <ProtectedRoute>
        <EditarBaseDatos />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/editar/:sucursalId/sucursales`,
  //   element: (
  //     <ProtectedRoute>
  //       <EditarSucursal />
  //     </ProtectedRoute>
  //   ),
  // },

  // Ver
  {
    path: `${BASE_PATH}/ver/:serverId/servers`,
    element: (
      <ProtectedRoute>
        <VerServers />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/ver/:serverId/vservers`,
    element: (
      <ProtectedRoute>
        <VerServidoresV />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/ver/:storageId/storages`,
    element: (
      <ProtectedRoute>
        <VerStorage />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/ver/:pserieId/pseries`,
    element: (
      <ProtectedRoute>
        <VerPseries />
      </ProtectedRoute>
    ),
  },
  {
    path: `${BASE_PATH}/ver/:baseDeDatosId/base-de-datos`,
    element: (
      <ProtectedRoute>
        <VerBaseDatos />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: `${BASE_PATH}/ver/:sucursalId/sucursales`,
  //   element: (
  //     <ProtectedRoute>
  //       <VerSucursales />
  //     </ProtectedRoute>
  //   ),
  // },

  {
    path: BASE_PATH,
    element: <Login />,
  },
];

export default EnrutadorApp;
