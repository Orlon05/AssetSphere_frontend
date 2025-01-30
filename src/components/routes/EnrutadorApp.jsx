import ServidoresF from "../pages/ServidoresFisicos";
import ServidoresV from "../pages/ServidoresVirtuales";
import Dashboard from "../pages/Dashboard";
import Login from "../forms/Login";
import ProtectedRoute from "./ProtectedRoute";
import Analitica from "../pages/Analitica";
import CrearServerF from "../pages/CrearServidor";
import EditarServer from "../pages/EditarServidor";
import Perfil from "../perfil/Perfil";
import Usuarios from "../pages/Usuarios";
import CrearUsuario from "../forms/CrearUsuario";
import EditarUsuario from "../forms/EditarUsuario";
import Logs from "../pages/Logs";
import Storage from "../pages/Storage";
import BaseDatos from "../pages/BaseDatos";

export let EnrutadorApp = [
  //Generamos la variable para la routa protegida y sus hijas si,
  // la Auth es correcta sigue a las hijas si, no redireccionara al login
  {
    element: <Login />,
    path: "login",
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        {/*aquí se proteje el acceso al Dashboard*/}
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
        element: < CrearServerF />
      },
      {
        path: "/editar/:serverId/servidores",
        element: < EditarServer />
      },
      {
        path: "perfil",
        element: < Perfil />
      },
      {
        path: "usuarios",
        element: <Usuarios/>
      },
      {
        path: "crear-usuarios",
        element: <CrearUsuario/>
      },
      {
        path: "ver-logs",
        element: <Logs/>
      },
      {
        path: "/editar-usuarios",
        element: <EditarUsuario/>
      },
      {
        path: "/storage",
        element: <Storage/>
      },
      {
        path: "/BaseDatos",
        element: <BaseDatos/>
      }
    ],
  },
];
