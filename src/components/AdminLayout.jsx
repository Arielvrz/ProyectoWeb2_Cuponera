import { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/rubros", label: "Rubros" },
  { to: "/admin/empresas", label: "Empresas" },
  { to: "/admin/aprobacion", label: "Aprobacion de Ofertas" },
  { to: "/admin/clientes", label: "Clientes" },
];

export default function AdminLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-darkBg text-textMain flex font-serif">
      <aside className="w-60 shrink-0 bg-darkSurface border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/admin" className="text-xl font-bold tracking-widest text-accentRed uppercase">
            La Cuponera
          </Link>
          <p className="text-xs text-textMuted mt-1">Panel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-sm text-sm transition ${
                  isActive
                    ? "bg-accentRed text-white font-semibold"
                    : "text-textMuted hover:text-textMain hover:bg-gray-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-textMuted truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full border border-accentRed text-accentRed px-3 py-2 rounded-sm text-sm hover:bg-accentRed hover:text-white transition"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
