import React, { Children } from "react";
import ServidoresF from "../pages/ServidoresFisicos";
import ServidoresV from "../pages/ServidoresVirtuales";
import Dashboard from "../layouts/Dashboard";
import Login from "../forms/Login";
import ProtectedRoute from "./ProtectedRoute";

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
    Children: [
      {
        path: "servidoresf",
        element: <ServidoresF />,
      },
      {
        path: "servidoresv",
        element: <ServidoresV />,
      },
    ],
  },
];
