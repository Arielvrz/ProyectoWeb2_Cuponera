import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllOfertas, aprobarOferta, rechazarOferta } from "../../services/ofertasService";

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

export default function AprobacionOfertas() {
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterEstado, setFilterEstado] = useState("pendiente_aprobacion");
  const [rejectModal, setRejectModal] = useState(null); // oferta obj | null
  const [motivo, setMotivo] = useState("");
  const [motivoError, setMotivoError] = useState("");
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllOfertas(token);
      setOfertas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const filtered = filterEstado === "todas"
    ? ofertas
    : ofertas.filter((o) => o.estado === filterEstado);

  const handleAprobar = async (oferta) => {
    setProcessing(true);
    try {
      await aprobarOferta(token, oferta.id);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const openReject = (oferta) => {
    setRejectModal(oferta);
    setMotivo("");
    setMotivoError("");
  };

  const handleRechazar = async () => {
    if (!motivo.trim()) { setMotivoError("El motivo de rechazo es requerido."); return; }
    setProcessing(true);
    try {
      await rechazarOferta(token, rejectModal.id, motivo.trim());
      setRejectModal(null);
      await load();
    } catch (e) {
      setMotivoError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const FILTERS = ["pendiente_aprobacion", "aprobada", "rechazada", "descartada", "todas"];
  const FILTER_LABELS = {
    pendiente_aprobacion: "Pendientes",
    aprobada: "Aprobadas",
    rechazada: "Rechazadas",
    descartada: "Descartadas",
    todas: "Todas",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Aprobacion de Ofertas</h1>
        <p className="text-textMuted text-sm mt-1">Revisar, aprobar o rechazar ofertas enviadas por empresas</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilterEstado(f)}
            className={`px-3 py-1.5 text-xs rounded-sm font-medium transition ${
              filterEstado === f
                ? "bg-accentRed text-white"
                : "bg-darkSurface text-textMuted border border-gray-800 hover:text-textMain"
            }`}
          >
            {FILTER_LABELS[f]}
            {f !== "todas" && (
              <span className="ml-1.5 opacity-70">
                ({ofertas.filter((o) => o.estado === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center text-sm">
          No hay ofertas en este estado.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="bg-darkSurface border border-gray-800 rounded-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-bold text-textMain">{o.titulo}</h2>
                    <Badge estado={o.estado} />
                  </div>
                  <p className="text-textMuted text-xs mt-1">
                    {o.empresas?.nombre ?? "—"} ({o.empresas?.codigo_empresa ?? "—"})
                  </p>
                  <p className="text-textMuted text-xs mt-0.5">
                    Precio oferta: ${Number(o.precio_oferta ?? 0).toFixed(2)}
                  </p>
                  {o.motivo_rechazo && (
                    <p className="mt-2 text-sm text-red-300 border border-red-800 bg-red-900/20 px-3 py-2 rounded-sm">
                      Motivo de rechazo: {o.motivo_rechazo}
                    </p>
                  )}
                </div>

                {o.estado === "pendiente_aprobacion" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={processing}
                      onClick={() => handleAprobar(o)}
                      className="bg-green-700 text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60"
                    >
                      Aprobar
                    </button>
                    <button
                      disabled={processing}
                      onClick={() => openReject(o)}
                      className="border border-red-800 text-red-400 px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-900/30 transition disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-1">Rechazar Oferta</h2>
            <p className="text-textMuted text-sm mb-4">
              Oferta: <strong className="text-textMain">{rejectModal.titulo}</strong>
            </p>
            <label className="block text-sm text-textMuted mb-1">
              Motivo de rechazo <span className="text-accentRed">*</span>
            </label>
            <textarea
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none resize-none"
              placeholder="Explica el motivo del rechazo..."
            />
            {motivoError && <p className="text-accentRed text-xs mt-1">{motivoError}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRechazar}
                disabled={processing}
                className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {processing ? "Procesando..." : "Confirmar Rechazo"}
              </button>
              <button
                onClick={() => setRejectModal(null)}
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
