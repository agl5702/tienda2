import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authenticatedUser } from "../../services/auth/authenticated";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem("token"); // buena práctica
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // O un loader, dependiendo de tu preferencia

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
