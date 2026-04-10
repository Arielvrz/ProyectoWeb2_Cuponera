import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const cards = [
  { to: "/admin/rubros", title: "Rubros", desc: "Categorias de empresa" },
  { to: "/admin/empresas", title: "Empresas", desc: "Gestion de empresas socias" },
  { to: "/admin/aprobacion", title: "Aprobacion de Ofertas", desc: "Revisar ofertas pendientes" },
  { to: "/admin/clientes", title: "Clientes", desc: "Listado de clientes registrados" },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
      <p className="text-textMuted mt-1">Bienvenido, {user?.email}</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="bg-darkCard border border-gray-800 rounded-sm p-6 hover:border-accentRed/50 hover:shadow-lg transition group"
          >
            <h2 className="text-lg font-bold group-hover:text-accentRed transition">{c.title}</h2>
            <p className="text-textMuted text-sm mt-2">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
