import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireClienteProfile() {
  const { loading, profileComplete } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg text-textMain flex items-center justify-center">
        Verificando perfil...
      </div>
    );
  }

  return profileComplete ? <Outlet /> : <Navigate to="/completar-perfil" replace />;
}
