import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authenticationToken"));
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    console.log("HOLA")
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

  return (
    <AuthContext.Provider value={{ token, login, logout, remainingTime }}>
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