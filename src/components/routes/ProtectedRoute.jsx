import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    const token = localStorage.getItem("authenticationToken"); // Obtener el token del almacenamiento local
    return token !== null; // Verificar si el token existe
};

const ProtectedRoute = ({ children }) => { // Cambiado a 'children' en minúsculas
    return isAuthenticated() ? children : <Navigate to="/login" />; // Redirigir si no está autenticado
};

export default ProtectedRoute;
