import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireRole({ roles }) {
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg text-textMain flex items-center justify-center">
        Verificando acceso...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
