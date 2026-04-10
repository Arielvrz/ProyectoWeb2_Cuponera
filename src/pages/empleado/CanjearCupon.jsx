import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchCuponByCodigo, canjearCupon } from "../../services/cuponesService";
import { validateDUI, formatDUI } from "../../utils/validation";

export default function CanjearCupon() {
  const { session, logout } = useContext(AuthContext);
  const token = session?.access_token;

  const [codigo, setCodigo] = useState("");
  const [dui, setDui] = useState("");
  const [errors, setErrors] = useState({});
  const [cupon, setCupon] = useState(null);
  const [searching, setSearching] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleDuiChange = (e) => setDui(formatDUI(e.target.value));

  const validate = () => {
    const errs = {};
    if (!codigo.trim()) errs.codigo = "El codigo de cupon es requerido.";
    if (!validateDUI(dui)) errs.dui = "DUI invalido. Formato: 00000000-0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setCupon(null);
    setSuccessMsg("");
    if (!validate()) return;

    setSearching(true);
    try {
      const found = await fetchCuponByCodigo(token, codigo.trim().toUpperCase());
      if (!found) {
        setSearchError("Cupon no encontrado.");
        return;
      }

      const offer = Array.isArray(found.ofertas) ? found.ofertas[0] : found.ofertas;
      const limitDate = offer?.fecha_limite_uso ? new Date(offer.fecha_limite_uso) : null;

      if (found.estado !== "disponible") {
        setSearchError(
          found.estado === "canjeado"
            ? "Este cupon ya fue canjeado."
            : "Este cupon no esta disponible para canje."
        );
        return;
      }

      if (limitDate && limitDate < new Date()) {
        setSearchError("Este cupon esta vencido.");
        return;
      }

      if (found.dui_comprador !== dui) {
        setSearchError("El DUI ingresado no corresponde al titular del cupon.");
        return;
      }

      setCupon({ ...found, offer });
    } catch (e) {
      setSearchError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!cupon) return;
    setConfirming(true);
    try {
      await canjearCupon(token, cupon.id);
      setSuccessMsg(`Cupon ${cupon.codigo} canjeado exitosamente.`);
      setCupon(null);
      setCodigo("");
      setDui("");
    } catch (e) {
      setSearchError(e.message);
    } finally {
      setConfirming(false);
    }
  };

  const reset = () => {
    setCupon(null);
    setCodigo("");
    setDui("");
    setErrors({});
    setSearchError("");
    setSuccessMsg("");
  };

  return (
    <div className="min-h-screen bg-darkBg text-textMain font-serif flex flex-col">
      <nav className="bg-darkSurface border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-widest text-accentRed uppercase">La Cuponera</span>
        <div className="flex items-center gap-4">
          <span className="text-textMuted text-sm">Panel Empleado</span>
          <button
            onClick={async () => { await logout(); window.location.href = "/login"; }}
            className="border border-accentRed text-accentRed px-4 py-1.5 rounded-sm text-sm hover:bg-accentRed hover:text-white transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-white mb-1">Canjear Cupon</h1>
          <p className="text-textMuted text-sm mb-6">Ingresa el codigo del cupon y el DUI del cliente para validar.</p>

          {successMsg && (
            <div className="mb-4 border border-green-700 bg-green-900/20 px-4 py-3 rounded-sm text-green-300 text-sm">
              {successMsg}
              <button onClick={reset} className="ml-3 underline hover:no-underline">Canjear otro</button>
            </div>
          )}

          {!cupon && (
            <form onSubmit={handleSearch} className="bg-darkSurface border border-gray-800 rounded-sm p-6 space-y-4">
              <div>
                <label className="block text-sm text-textMuted mb-1">Codigo de cupon</label>
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="EJ. RES001-1234567"
                  className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain font-mono focus:border-accentRed focus:outline-none uppercase"
                />
                {errors.codigo && <p className="text-accentRed text-xs mt-1">{errors.codigo}</p>}
              </div>

              <div>
                <label className="block text-sm text-textMuted mb-1">DUI del cliente</label>
                <input
                  value={dui}
                  onChange={handleDuiChange}
                  placeholder="00000000-0"
                  maxLength={10}
                  className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain font-mono focus:border-accentRed focus:outline-none"
                />
                {errors.dui && <p className="text-accentRed text-xs mt-1">{errors.dui}</p>}
              </div>

              {searchError && (
                <p className="text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">
                  {searchError}
                </p>
              )}

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-accentRed text-white py-3 rounded-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {searching ? "Validando..." : "Validar Cupon"}
              </button>
            </form>
          )}

          {cupon && (
            <div className="bg-darkSurface border border-green-800 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-green-400 text-sm font-semibold">Cupon valido</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-textMuted">Codigo</div>
                <div className="font-mono text-xl text-textMain">{cupon.codigo}</div>
                <div className="text-textMuted mt-3">Oferta</div>
                <div className="text-textMain font-semibold">{cupon.offer?.titulo}</div>
                <div className="text-textMuted mt-2">Empresa</div>
                <div className="text-textMain">{cupon.offer?.empresas?.nombre}</div>
                <div className="text-textMuted mt-2">Limite de uso</div>
                <div className="text-textMain">{cupon.offer?.fecha_limite_uso}</div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="bg-green-700 text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60"
                >
                  {confirming ? "Procesando..." : "Confirmar Canje"}
                </button>
                <button
                  onClick={reset}
                  className="border border-gray-700 text-textMuted px-5 py-2.5 rounded-sm text-sm hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
