import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchMisCupones } from "../lib/supabaseApi";

export default function MyCoupons() {
  const { session } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCoupons = async () => {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchMisCupones(session.access_token);
        setCoupons(data);
      } catch (fetchError) {
        setError(fetchError.message || "No se pudieron cargar los cupones.");
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, [session?.access_token]);

  const grouped = useMemo(() => {
    const today = new Date();
    const result = { disponibles: [], canjeados: [], vencidos: [] };

    for (const c of coupons) {
      const offer = Array.isArray(c.ofertas) ? c.ofertas[0] : c.ofertas;
      const limitDate = offer?.fecha_limite_uso ? new Date(offer.fecha_limite_uso) : null;
      const isExpired = c.estado === "disponible" && limitDate && limitDate < today;

      const normalized = {
        id: c.id,
        codigo: c.codigo,
        estado: isExpired ? "vencido" : c.estado,
        createdAt: c.created_at,
        titulo: offer?.titulo || "Oferta",
        rubro: offer?.rubros?.nombre || "General",
        precio: offer?.precio_oferta ? `$${Number(offer.precio_oferta).toFixed(2)}` : "-",
        limiteUso: offer?.fecha_limite_uso || "-"
      };

      if (normalized.estado === "canjeado") result.canjeados.push(normalized);
      else if (normalized.estado === "vencido") result.vencidos.push(normalized);
      else result.disponibles.push(normalized);
    }

    return result;
  }, [coupons]);

  const sections = [
    { key: "disponibles", title: "Disponibles", data: grouped.disponibles },
    { key: "canjeados", title: "Canjeados", data: grouped.canjeados },
    { key: "vencidos", title: "Vencidos", data: grouped.vencidos }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-darkBg)] text-[var(--color-textMain)] font-serif">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide">Mis Cupones</h1>
            <p className="text-[var(--color-textMuted)] mt-2">
              Aquí se muestran únicamente tus cupones asociados a tu cuenta.
            </p>
          </div>

          <Link
            to="/"
            className="bg-[var(--color-accentRed)] px-5 py-2 rounded-sm font-bold hover:opacity-90 transition text-white shadow-lg shadow-black/30"
          >
            Volver al catálogo
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 bg-[var(--color-darkSurface)] border border-gray-800 p-8 rounded-sm">
            Cargando cupones...
          </div>
        ) : error ? (
          <div className="mt-10 border border-red-700 bg-red-900/20 p-4 rounded-sm">{error}</div>
        ) : (
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.key}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {section.title} ({section.data.length})
                </h2>

                {section.data.length === 0 ? (
                  <div className="bg-[var(--color-darkSurface)] border border-gray-800 p-6 rounded-sm text-[var(--color-textMuted)]">
                    No hay cupones en esta categoría.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.data.map((c) => (
                      <div key={c.id} className="bg-[var(--color-darkCard)] border border-gray-800 rounded-sm p-6">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-textMuted)]">{c.rubro}</div>
                        <h3 className="text-xl font-bold mt-2">{c.titulo}</h3>
                        <div className="mt-4 text-sm text-[var(--color-textMuted)]">Código</div>
                        <div className="font-mono text-2xl">{c.codigo}</div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-[var(--color-textMuted)]">Precio</div>
                            <div>{c.precio}</div>
                          </div>
                          <div>
                            <div className="text-[var(--color-textMuted)]">Límite de uso</div>
                            <div>{c.limiteUso}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
