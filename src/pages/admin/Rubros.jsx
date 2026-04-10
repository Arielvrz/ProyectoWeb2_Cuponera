import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchRubros, createRubro, updateRubro, deleteRubro } from "../../services/rubrosService";

export default function Rubros() {
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | 'create' | { id, nombre }
  const [formNombre, setFormNombre] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchRubros(token);
      setRubros(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const openCreate = () => { setFormNombre(""); setFormError(""); setModal("create"); };
  const openEdit = (r) => { setFormNombre(r.nombre); setFormError(""); setModal(r); };
  const closeModal = () => { setModal(null); setFormNombre(""); setFormError(""); };

  const validate = () => {
    if (!formNombre.trim()) { setFormError("El nombre es requerido."); return false; }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal === "create") {
        await createRubro(token, formNombre.trim());
      } else {
        await updateRubro(token, modal.id, formNombre.trim());
      }
      await load();
      closeModal();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRubro(token, deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Rubros</h1>
          <p className="text-textMuted text-sm mt-1">Categorias de empresas</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accentRed text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-red-700 transition"
        >
          + Nuevo Rubro
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : rubros.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center">
          No hay rubros registrados.
        </div>
      ) : (
        <div className="bg-darkSurface border border-gray-800 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-textMuted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {rubros.map((r) => (
                <tr key={r.id} className="hover:bg-gray-900/40 transition">
                  <td className="px-4 py-3 text-textMain">{r.nombre}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="text-xs border border-gray-700 text-textMuted px-3 py-1 rounded-sm hover:text-white hover:border-gray-500 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="text-xs border border-red-800 text-red-400 px-3 py-1 rounded-sm hover:bg-red-900/30 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {modal === "create" ? "Nuevo Rubro" : "Editar Rubro"}
            </h2>
            <label className="block text-sm text-textMuted mb-1">Nombre</label>
            <input
              value={formNombre}
              onChange={(e) => setFormNombre(e.target.value)}
              className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-textMain focus:border-accentRed focus:outline-none"
            />
            {formError && <p className="text-accentRed text-xs mt-2">{formError}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={save}
                disabled={saving}
                className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={closeModal}
                className="border border-gray-700 text-textMuted px-4 py-2 rounded-sm text-sm hover:text-white transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-white mb-2">Eliminar Rubro</h2>
            <p className="text-textMuted text-sm mb-5">
              Esta accion eliminara el rubro <strong className="text-textMain">{deleteTarget.nombre}</strong>. Esta operacion no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
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
