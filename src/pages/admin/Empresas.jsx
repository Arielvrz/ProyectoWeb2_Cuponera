import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../services/empresasService";
import { fetchRubros } from "../../services/rubrosService";
import { validateEmail, validateCompanyCode } from "../../utils/validation";

const EMPTY_FORM = {
  nombre: "",
  codigo_empresa: "",
  direccion: "",
  nombre_contacto: "",
  telefono: "",
  correo: "",
  rubro_id: "",
  comision_porcentaje: "",
};

export default function Empresas() {
  const { session } = useContext(AuthContext);
  const token = session?.access_token;

  const [empresas, setEmpresas] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | 'create' | empresa obj
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [emp, rub] = await Promise.all([fetchEmpresas(token), fetchRubros(token)]);
      setEmpresas(emp);
      setRubros(rub);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModal("create");
  };

  const openEdit = (e) => {
    setForm({
      nombre: e.nombre,
      codigo_empresa: e.codigo_empresa,
      direccion: e.direccion,
      nombre_contacto: e.nombre_contacto,
      telefono: e.telefono,
      correo: e.correo,
      rubro_id: String(e.rubro_id ?? ""),
      comision_porcentaje: String(e.comision_porcentaje ?? ""),
    });
    setFormErrors({});
    setModal(e);
  };

  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setFormErrors({}); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Requerido";
    if (!validateCompanyCode(form.codigo_empresa))
      errs.codigo_empresa = "Formato: 3 letras mayusculas + 3 digitos (ej. RES001)";
    if (!form.direccion.trim()) errs.direccion = "Requerido";
    if (!form.nombre_contacto.trim()) errs.nombre_contacto = "Requerido";
    if (!form.telefono.trim()) errs.telefono = "Requerido";
    if (!validateEmail(form.correo)) errs.correo = "Correo invalido";
    if (!form.rubro_id) errs.rubro_id = "Seleccione un rubro";
    const comision = Number(form.comision_porcentaje);
    if (isNaN(comision) || comision < 0 || comision > 100)
      errs.comision_porcentaje = "Debe ser un numero entre 0 y 100";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        rubro_id: Number(form.rubro_id),
        comision_porcentaje: Number(form.comision_porcentaje),
      };
      if (modal === "create") {
        await createEmpresa(token, payload);
      } else {
        await updateEmpresa(token, modal.id, payload);
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
      await deleteEmpresa(token, deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    }
  };

  const field = (name, label, type = "text", extra = {}) => (
    <div>
      <label className="block text-xs text-textMuted mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none"
        {...extra}
      />
      {formErrors[name] && <p className="text-accentRed text-xs mt-1">{formErrors[name]}</p>}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Empresas</h1>
          <p className="text-textMuted text-sm mt-1">Empresas socias registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accentRed text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-red-700 transition"
        >
          + Nueva Empresa
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

      {loading ? (
        <p className="text-textMuted">Cargando...</p>
      ) : empresas.length === 0 ? (
        <div className="bg-darkSurface border border-gray-800 p-8 rounded-sm text-textMuted text-center">
          No hay empresas registradas.
        </div>
      ) : (
        <div className="bg-darkSurface border border-gray-800 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-textMuted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Empresa</th>
                <th className="text-left px-4 py-3">Codigo</th>
                <th className="text-left px-4 py-3">Rubro</th>
                <th className="text-left px-4 py-3">Correo</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {empresas.map((e) => (
                <tr key={e.id} className="hover:bg-gray-900/40 transition">
                  <td className="px-4 py-3 font-medium text-textMain">{e.nombre}</td>
                  <td className="px-4 py-3 font-mono text-textMuted">{e.codigo_empresa}</td>
                  <td className="px-4 py-3 text-textMuted">{e.rubros?.nombre ?? "-"}</td>
                  <td className="px-4 py-3 text-textMuted">{e.correo}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      to={`/admin/empresas/${e.id}`}
                      className="text-xs border border-gray-700 text-textMuted px-3 py-1 rounded-sm hover:text-white hover:border-gray-500 transition inline-block"
                    >
                      Ver
                    </Link>
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-darkSurface border border-gray-800 rounded-sm w-full max-w-lg p-6 my-4">
            <h2 className="text-lg font-bold text-white mb-4">
              {modal === "create" ? "Nueva Empresa" : "Editar Empresa"}
            </h2>
            <div className="space-y-3">
              {field("nombre", "Nombre de la empresa")}
              {field("codigo_empresa", "Codigo (ej. RES001)", "text", { placeholder: "RES001" })}
              {field("direccion", "Direccion")}
              {field("nombre_contacto", "Nombre del contacto")}
              {field("telefono", "Telefono")}
              {field("correo", "Correo electronico", "email")}
              <div>
                <label className="block text-xs text-textMuted mb-1">Rubro</label>
                <select
                  name="rubro_id"
                  value={form.rubro_id}
                  onChange={handleChange}
                  className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {rubros.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
                {formErrors.rubro_id && <p className="text-accentRed text-xs mt-1">{formErrors.rubro_id}</p>}
              </div>
              {field("comision_porcentaje", "Comision (%)", "number", { min: 0, max: 100, step: "0.01" })}
            </div>
            {formErrors._global && <p className="text-accentRed text-xs mt-3">{formErrors._global}</p>}
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
            <h2 className="text-lg font-bold text-white mb-2">Eliminar Empresa</h2>
            <p className="text-textMuted text-sm mb-5">
              Eliminar <strong className="text-textMain">{deleteTarget.nombre}</strong> es permanente.
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
