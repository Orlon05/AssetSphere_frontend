import React from "react";
import ServidoresF from "../pages/ServidoresFisicos";
import ServidoresV from "../pages/ServidoresVirtuales";
import Dashboard from "../pages/Dashboard";
import Login from "../forms/Login";
import ProtectedRoute from "./ProtectedRoute";
import Analitica from "../pages/Analitica";
import CrearServerF from "../pages/CrearServidor";

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
    ],
  },
];
