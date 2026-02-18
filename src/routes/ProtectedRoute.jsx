import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  const BASE_PATH = "/AssetSphere"; 

  if (!token) {
    return <Navigate to={`${BASE_PATH}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
