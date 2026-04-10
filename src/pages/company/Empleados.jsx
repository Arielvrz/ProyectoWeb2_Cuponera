import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchEmpleadosByEmpresa,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../../services/empleadosService";
import { validateEmail } from "../../utils/validation";

const EMPTY = { nombres: "", apellidos: "", correo: "" };

export default function Empleados() {
  const { session, empresaId } = useContext(AuthContext);
  const token = session?.access_token;

  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | 'create' | empleado obj
  const [form, setForm] = useState(EMPTY);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    if (!empresaId) return;
    try {
      setLoading(true);
      setError("");
      const data = await fetchEmpleadosByEmpresa(token, empresaId);
      setEmpleados(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token, empresaId]);

  const validate = () => {
    const errs = {};
    if (!form.nombres.trim()) errs.nombres = "Requerido";
    if (!form.apellidos.trim()) errs.apellidos = "Requerido";
    if (!validateEmail(form.correo)) errs.correo = "Correo invalido";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => { setForm(EMPTY); setFormErrors({}); setModal("create"); };
  const openEdit = (e) => {
    setForm({ nombres: e.nombres, apellidos: e.apellidos, correo: e.correo });
    setFormErrors({});
    setModal(e);
  };
  const closeModal = () => { setModal(null); setForm(EMPTY); setFormErrors({}); };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal === "create") {
        await createEmpleado(token, { ...form, empresa_id: empresaId });
      } else {
        await updateEmpleado(token, modal.id, form);
      }
      await load();
      closeModal();
    } catch (e) {
      setFormErrors({ _global: e.message });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmpleado(token, deleteTarget.id);
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
          <h1 className="text-2xl font-extrabold text-white">Empleados</h1>
          <p className="text-textMuted text-sm mt-1">Personal de la empresa</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accentRed text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-red-700 transition"
        >
          + Nuevo Empleado
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : empleados.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center text-sm">
          No hay empleados registrados.
        </div>
      ) : (
        <div className="bg-darkSurface border border-gray-800 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-textMuted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Correo</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {empleados.map((e) => (
                <tr key={e.id} className="hover:bg-gray-900/40 transition">
                  <td className="px-4 py-3 text-textMain">{e.apellidos}, {e.nombres}</td>
                  <td className="px-4 py-3 text-textMuted">{e.correo}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(e)}
                      className="text-xs border border-gray-700 text-textMuted px-3 py-1 rounded-sm hover:text-white hover:border-gray-500 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteTarget(e)}
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
              {modal === "create" ? "Nuevo Empleado" : "Editar Empleado"}
            </h2>
            <div className="space-y-3">
              {[["nombres", "Nombres"], ["apellidos", "Apellidos"], ["correo", "Correo electronico"]].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-textMuted mb-1">{label}</label>
                  <input
                    value={form[name]}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none"
                  />
                  {formErrors[name] && <p className="text-accentRed text-xs mt-1">{formErrors[name]}</p>}
                </div>
              ))}
              {formErrors._global && <p className="text-accentRed text-xs">{formErrors._global}</p>}
            </div>
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
            <h2 className="text-lg font-bold text-white mb-2">Eliminar Empleado</h2>
            <p className="text-textMuted text-sm mb-5">
              Eliminar a <strong className="text-textMain">{deleteTarget.nombres} {deleteTarget.apellidos}</strong> es permanente.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition">
                Eliminar
              </button>
              <button onClick={() => setDeleteTarget(null)} className="border border-gray-700 text-textMuted px-4 py-2 rounded-sm text-sm hover:text-white transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
