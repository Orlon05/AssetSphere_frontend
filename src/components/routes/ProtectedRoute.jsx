import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  return (
    <AuthContext.Provider value={{ remainingTime, setRemainingTime }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authenticationToken");
    const { setRemainingTime } = useAuth();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000; // milisegundos
                const timeLeft = expirationTime - Date.now(); // Tiempo restante en milisegundos

                if (timeLeft < 0) {
                    localStorage.removeItem("authenticationToken");
                } else {
                    setRemainingTime(timeLeft); // Guarda el tiempo restante en el contexto
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
                localStorage.removeItem("authenticationToken");
            }
        }
    }, [token, setRemainingTime]); // Dependencia del token para que se ejecute cuando cambia


    if (!token || (token && (Date.now() > jwtDecode(token).exp * 1000))) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;