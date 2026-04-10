import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllClientes } from "../../services/clientesService";

export default function Clientes() {
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllClientes(token);
        setClientes(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const filtered = search.trim()
    ? clientes.filter(
        (c) =>
          `${c.nombres} ${c.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
          c.correo.toLowerCase().includes(search.toLowerCase()) ||
          (c.dui || "").includes(search)
      )
    : clientes;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Clientes</h1>
          <p className="text-textMuted text-sm mt-1">{clientes.length} clientes registrados</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o DUI..."
          className="bg-darkSurface border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none w-64"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center text-sm">
          No se encontraron clientes.
        </div>
      ) : (
        <div className="bg-darkSurface border border-gray-800 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-textMuted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Correo</th>
                <th className="text-left px-4 py-3">DUI</th>
                <th className="text-left px-4 py-3">Telefono</th>
                <th className="text-right px-4 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-900/40 transition">
                  <td className="px-4 py-3 font-medium text-textMain">
                    {c.apellidos}, {c.nombres}
                  </td>
                  <td className="px-4 py-3 text-textMuted">{c.correo}</td>
                  <td className="px-4 py-3 font-mono text-textMuted">{c.dui}</td>
                  <td className="px-4 py-3 text-textMuted">{c.telefono}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/clientes/${c.id}`}
                      className="text-xs border border-gray-700 text-textMuted px-3 py-1 rounded-sm hover:text-white hover:border-gray-500 transition"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
