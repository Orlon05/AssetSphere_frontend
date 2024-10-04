import React, { Children } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {

    const token = localStorage.getItem("authToken"); //Aqui pasamos el token que se genera en el login para proteger el resto del contenido
    return token !== null; // y se verifica si existe//

};

const ProtectedRoute = ({ Children }) => { //declaramos la prop//
    
    return isAuthenticated() ? Children : <Navigate to= "/login" />; 
};

export default ProtectedRoute;