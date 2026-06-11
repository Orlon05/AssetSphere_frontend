/**
 * @file AuthContext.jsx
 * @description Context provider for managing authentication state and token validation.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

/**
 * AuthProvider Component
 * @description Provides authentication context to its children, managing token lifecycle and authenticated fetch requests.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components that will consume the context.
 * @returns {JSX.Element} The rendered provider component.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authenticationToken"));
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp * 1000;
          const timeLeft = expirationTime - Date.now();
          if (timeLeft <= 0) {
            logout();
          } else {
            setRemainingTime(timeLeft);
          }
        } catch (error) {
          console.error("Error decodificando el token:", error);
          logout();
        }
      }
    };

    checkTokenExpiration();

    // Eliminado: No borrar el token al cerrar la ventana/pestaña para permitir recarga sin cerrar sesión
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authenticationToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authenticationToken');
    setToken(null);
    setRemainingTime(0);
  };

  // Wrapper para fetch autenticado que cierra sesión si el backend no responde o devuelve 401/403
  const authFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (response.status === 401 || response.status === 403) {
        logout();
        window.location.href = "/AssetSphere/login";
        return null;
      }
      return response;
    } catch (error) {
      // Si el backend no responde, cerrar sesión y redirigir
      logout();
      window.location.href = "/AssetSphere/login";
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, remainingTime, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};