/**
 * @file ProtectedRoute.jsx
 * @description Component that restricts access to routes based on user authentication status.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * ProtectedRoute Component
 * @description Redirects unauthenticated users to the login page, otherwise renders the requested children.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The components to render if the user is authenticated.
 * @returns {JSX.Element} The rendered children or a redirect.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  const BASE_PATH = "/AssetSphere"; 

  if (!token) {
    return <Navigate to={`${BASE_PATH}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
