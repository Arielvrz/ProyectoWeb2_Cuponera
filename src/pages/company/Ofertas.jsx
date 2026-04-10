import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchOfertasByEmpresa,
  descartarOferta,
  resubmitOferta,
} from "../../services/ofertasService";

const STATUS_LABELS = {
  pendiente_aprobacion: { label: "Pendiente", cls: "bg-yellow-900/40 text-yellow-400 border-yellow-800" },
  aprobada: { label: "Aprobada", cls: "bg-green-900/40 text-green-400 border-green-800" },
  rechazada: { label: "Rechazada", cls: "bg-red-900/40 text-red-400 border-red-800" },
  descartada: { label: "Descartada", cls: "bg-gray-800 text-textMuted border-gray-700" },
};

const Badge = ({ estado }) => {
  const s = STATUS_LABELS[estado] || { label: estado, cls: "bg-gray-800 text-textMuted border-gray-700" };
  return <span className={`text-xs border px-2 py-0.5 rounded-sm ${s.cls}`}>{s.label}</span>;
};

export default function Ofertas() {
  const { session, empresaId } = useContext(AuthContext);
  const token = session?.access_token;

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [discardTarget, setDiscardTarget] = useState(null);

  const load = async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      setError("");
      const data = await fetchOfertasByEmpresa(token, empresaId);
      setOfertas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token, empresaId]);

  const handleDiscard = async () => {
    if (!discardTarget) return;
    setProcessing(true);
    try {
      await descartarOferta(token, discardTarget.id);
      setDiscardTarget(null);
      await load();
    } catch (e) {
      setError(e.message);
      setDiscardTarget(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleResubmit = async (oferta) => {
    setProcessing(true);
    try {
      await resubmitOferta(token, oferta.id, {
        titulo: oferta.titulo,
        precio_regular: oferta.precio_regular,
        precio_oferta: oferta.precio_oferta,
        fecha_inicio: oferta.fecha_inicio,
        fecha_fin: oferta.fecha_fin,
        fecha_limite_uso: oferta.fecha_limite_uso,
        max_cupones: oferta.max_cupones,
        descripcion: oferta.descripcion,
        otros_detalles: oferta.otros_detalles,
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mis Ofertas</h1>
          <p className="text-textMuted text-sm mt-1">{ofertas.length} ofertas registradas</p>
        </div>
        <Link
          to="/empresa/ofertas/nueva"
          className="bg-accentRed text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-red-700 transition"
        >
          + Nueva Oferta
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : !empresaId ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center text-sm">
          No hay empresa asociada a esta cuenta.
        </div>
      ) : ofertas.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center text-sm">
          No hay ofertas registradas. Crea tu primera oferta.
        </div>
      ) : (
        <div className="space-y-4">
          {ofertas.map((o) => (
            <div key={o.id} className="bg-darkSurface border border-gray-800 rounded-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-bold text-textMain">{o.titulo}</h2>
                    <Badge estado={o.estado} />
                  </div>
                  <p className="text-textMuted text-xs mt-1">
                    Precio regular: ${Number(o.precio_regular).toFixed(2)} &nbsp;&middot;&nbsp;
                    Precio oferta: ${Number(o.precio_oferta).toFixed(2)}
                  </p>
                  <p className="text-textMuted text-xs mt-0.5">
                    Vigencia: {o.fecha_inicio} — {o.fecha_fin} &nbsp;&middot;&nbsp;
                    Limite cupon: {o.fecha_limite_uso}
                  </p>
                  {o.max_cupones && (
                    <p className="text-textMuted text-xs mt-0.5">Max cupones: {o.max_cupones}</p>
                  )}

                  {o.estado === "rechazada" && o.motivo_rechazo && (
                    <div className="mt-3 text-sm text-red-300 border border-red-800 bg-red-900/20 px-3 py-2 rounded-sm">
                      Motivo de rechazo: {o.motivo_rechazo}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap">
                  {(o.estado === "pendiente_aprobacion" || o.estado === "rechazada") && (
                    <Link
                      to={`/empresa/ofertas/${o.id}/editar`}
                      className="border border-gray-700 text-textMuted px-3 py-1.5 rounded-sm text-xs hover:text-white transition"
                    >
                      Editar
                    </Link>
                  )}
                  {o.estado === "rechazada" && (
                    <>
                      <button
                        disabled={processing}
                        onClick={() => handleResubmit(o)}
                        className="bg-yellow-700 text-white px-3 py-1.5 rounded-sm text-xs font-semibold hover:bg-yellow-600 transition disabled:opacity-60"
                      >
                        Reenviar
                      </button>
                      <button
                        disabled={processing}
                        onClick={() => setDiscardTarget(o)}
                        className="border border-gray-700 text-textMuted px-3 py-1.5 rounded-sm text-xs hover:text-white transition disabled:opacity-60"
                      >
                        Descartar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {discardTarget && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-white mb-2">Descartar Oferta</h2>
            <p className="text-textMuted text-sm mb-5">
              La oferta <strong className="text-textMain">{discardTarget.titulo}</strong> quedara descartada
              y no podra editarse ni reenviarse.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDiscard}
                disabled={processing}
                className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                Descartar
              </button>
              <button
                onClick={() => setDiscardTarget(null)}
                className="border border-gray-700 text-textMuted px-4 py-2 rounded-sm text-sm hover:text-white transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
