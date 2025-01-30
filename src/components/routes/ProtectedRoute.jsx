import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ajusta la ruta si es necesario

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();


    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;