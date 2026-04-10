import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchEmpresaById } from "../../services/empresasService";
import { fetchOfertasByEmpresa } from "../../services/ofertasService";
import { fetchEmpleadosByEmpresa, createEmpleado, deleteEmpleado } from "../../services/empleadosService";
import { validateEmail } from "../../utils/validation";

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

const EMPTY_EMP = { nombres: "", apellidos: "", correo: "" };

export default function EmpresaDetail() {
  const { id } = useParams();
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("ofertas");
  const [empModal, setEmpModal] = useState(false);
  const [empForm, setEmpForm] = useState(EMPTY_EMP);
  const [empErrors, setEmpErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [emp, ofs, emps] = await Promise.all([
        fetchEmpresaById(token, id),
        fetchOfertasByEmpresa(token, id),
        fetchEmpleadosByEmpresa(token, id),
      ]);
      setEmpresa(emp);
      setOfertas(ofs);
      setEmpleados(emps);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, token]);

  const validateEmp = () => {
    const errs = {};
    if (!empForm.nombres.trim()) errs.nombres = "Requerido";
    if (!empForm.apellidos.trim()) errs.apellidos = "Requerido";
    if (!validateEmail(empForm.correo)) errs.correo = "Correo invalido";
    setEmpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveEmpleado = async () => {
    if (!validateEmp()) return;
    setSaving(true);
    try {
      await createEmpleado(token, { ...empForm, empresa_id: Number(id) });
      setEmpModal(false);
      setEmpForm(EMPTY_EMP);
      setEmpErrors({});
      await load();
    } catch (e) {
      setEmpErrors({ _global: e.message });
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteEmp = async () => {
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

  if (loading) return <p className="text-textMuted">Cargando...</p>;
  if (!empresa) return <p className="text-red-300">{error || "Empresa no encontrada."}</p>;

  return (
    <div>
      <Link to="/admin/empresas" className="text-sm text-textMuted hover:text-textMain transition">
        &larr; Volver a Empresas
      </Link>

      <div className="mt-4 bg-darkSurface border border-gray-800 rounded-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{empresa.nombre}</h1>
            <p className="text-textMuted text-sm mt-1 font-mono">{empresa.codigo_empresa}</p>
          </div>
          <div className="text-sm text-textMuted space-y-1 text-right">
            <p>{empresa.rubros?.nombre}</p>
            <p>{empresa.correo}</p>
            <p>{empresa.telefono}</p>
            <p>Comision: {empresa.comision_porcentaje}%</p>
          </div>
        </div>
        <p className="text-textMuted text-sm mt-3">{empresa.direccion}</p>
        <p className="text-textMuted text-sm">Contacto: {empresa.nombre_contacto}</p>
      </div>

      <div className="mt-6 flex gap-4 border-b border-gray-800">
        {["ofertas", "empleados"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-semibold capitalize transition ${
              tab === t ? "border-b-2 border-accentRed text-white" : "text-textMuted hover:text-textMain"
            }`}
          >
            {t === "ofertas" ? `Ofertas (${ofertas.length})` : `Empleados (${empleados.length})`}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      {tab === "ofertas" && (
        <div className="mt-4 space-y-3">
          {ofertas.length === 0 ? (
            <p className="text-textMuted text-sm">Sin ofertas registradas.</p>
          ) : (
            ofertas.map((o) => (
              <div key={o.id} className="bg-darkCard border border-gray-800 rounded-sm p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-textMain">{o.titulo}</p>
                  <p className="text-textMuted text-xs mt-1">${Number(o.precio_oferta).toFixed(2)}</p>
                </div>
                <Badge estado={o.estado} />
              </div>
            ))
          )}
        </div>
      )}

      {tab === "empleados" && (
        <div className="mt-4">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => { setEmpForm(EMPTY_EMP); setEmpErrors({}); setEmpModal(true); }}
              className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition"
            >
              + Nuevo Empleado
            </button>
          </div>
          {empleados.length === 0 ? (
            <p className="text-textMuted text-sm">Sin empleados registrados.</p>
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
                      <td className="px-4 py-3 text-right">
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
        </div>
      )}

      {empModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4">Nuevo Empleado</h2>
            <div className="space-y-3">
              {[["nombres", "Nombres"], ["apellidos", "Apellidos"], ["correo", "Correo"]].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-textMuted mb-1">{label}</label>
                  <input
                    value={empForm[name]}
                    onChange={(e) => setEmpForm({ ...empForm, [name]: e.target.value })}
                    className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none"
                  />
                  {empErrors[name] && <p className="text-accentRed text-xs mt-1">{empErrors[name]}</p>}
                </div>
              ))}
              {empErrors._global && <p className="text-accentRed text-xs">{empErrors._global}</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEmpleado} disabled={saving} className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60">
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => setEmpModal(false)} className="border border-gray-700 text-textMuted px-4 py-2 rounded-sm text-sm hover:text-white transition">
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
              <button onClick={confirmDeleteEmp} className="bg-accentRed text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-red-700 transition">
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
