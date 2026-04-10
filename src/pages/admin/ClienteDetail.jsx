import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchClienteById, fetchCuponesByCliente } from "../../services/clientesService";

export default function ClienteDetail() {
  const { id } = useParams();
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [cliente, setCliente] = useState(null);
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("disponibles");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [c, cups] = await Promise.all([
          fetchClienteById(token, id),
          fetchCuponesByCliente(token, id),
        ]);
        setCliente(c);
        setCupones(cups);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const grouped = useMemo(() => {
    const today = new Date();
    const result = { disponibles: [], canjeados: [], vencidos: [] };

    for (const c of cupones) {
      const offer = Array.isArray(c.ofertas) ? c.ofertas[0] : c.ofertas;
      const limit = offer?.fecha_limite_uso ? new Date(offer.fecha_limite_uso) : null;
      const isExpired = c.estado === "disponible" && limit && limit < today;

      const row = {
        id: c.id,
        codigo: c.codigo,
        estado: isExpired ? "vencido" : c.estado,
        titulo: offer?.titulo || "Oferta",
        rubro: offer?.rubros?.nombre || "—",
        precio: offer?.precio_oferta ? `$${Number(offer.precio_oferta).toFixed(2)}` : "—",
        limiteUso: offer?.fecha_limite_uso ?? "—",
        canjeadoAt: c.canjeado_at ?? null,
      };

      if (row.estado === "canjeado") result.canjeados.push(row);
      else if (row.estado === "vencido") result.vencidos.push(row);
      else result.disponibles.push(row);
    }

    return result;
  }, [cupones]);

  if (loading) return <p className="text-textMuted">Cargando...</p>;
  if (!cliente) return <p className="text-red-300">{error || "Cliente no encontrado."}</p>;

  const tabs = [
    { key: "disponibles", label: `Disponibles (${grouped.disponibles.length})` },
    { key: "canjeados", label: `Canjeados (${grouped.canjeados.length})` },
    { key: "vencidos", label: `Vencidos (${grouped.vencidos.length})` },
  ];

  return (
    <div>
      <Link to="/admin/clientes" className="text-sm text-textMuted hover:text-textMain transition">
        &larr; Volver a Clientes
      </Link>

      <div className="mt-4 bg-darkSurface border border-gray-800 rounded-sm p-6">
        <h1 className="text-2xl font-extrabold text-white">
          {cliente.apellidos}, {cliente.nombres}
        </h1>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-textMuted">
          <div><span className="text-textMain font-medium">Correo:</span> {cliente.correo}</div>
          <div><span className="text-textMain font-medium">Telefono:</span> {cliente.telefono}</div>
          <div><span className="text-textMain font-medium">DUI:</span> <span className="font-mono">{cliente.dui}</span></div>
          <div><span className="text-textMain font-medium">Direccion:</span> {cliente.direccion}</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-white mb-3">Cupones ({cupones.length})</h2>
        <div className="flex gap-4 border-b border-gray-800 mb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 text-sm font-semibold transition ${
                tab === t.key ? "border-b-2 border-accentRed text-white" : "text-textMuted hover:text-textMain"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {grouped[tab].length === 0 ? (
          <p className="text-textMuted text-sm">Sin cupones en esta categoria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[tab].map((c) => (
              <div key={c.id} className="bg-darkCard border border-gray-800 rounded-sm p-4">
                <div className="text-xs uppercase tracking-wider text-textMuted">{c.rubro}</div>
                <h3 className="font-bold text-textMain mt-1">{c.titulo}</h3>
                <div className="font-mono text-xl mt-2">{c.codigo}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-textMuted">
                  <div>Precio: <span className="text-textMain">{c.precio}</span></div>
                  <div>Limite: <span className="text-textMain">{c.limiteUso}</span></div>
                  {c.canjeadoAt && (
                    <div className="col-span-2">
                      Canjeado: <span className="text-textMain">{new Date(c.canjeadoAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
