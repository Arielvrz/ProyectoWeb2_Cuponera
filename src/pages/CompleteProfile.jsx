import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { validateDUI, validatePhone, formatDUI } from "../utils/validation";

export default function CompleteProfile() {
  const { user, completeProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dui: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDuiChange = (e) => setForm({ ...form, dui: formatDUI(e.target.value) });

  const validate = () => {
    const errs = {};
    if (!form.nombres.trim()) errs.nombres = "Requerido";
    if (!form.apellidos.trim()) errs.apellidos = "Requerido";
    if (!validatePhone(form.telefono)) errs.telefono = "Debe iniciar con 2, 6 o 7 y tener 8 digitos";
    if (!form.direccion.trim()) errs.direccion = "Requerido";
    if (!validateDUI(form.dui)) errs.dui = "DUI invalido. Formato: 00000000-0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSaving(true);
    try {
      await completeProfile(form);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "No se pudo completar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-textMain flex items-center justify-center p-4 font-serif">
      <form onSubmit={submit} className="w-full max-w-md bg-darkCard border border-gray-800 p-8 rounded-sm">
        <h1 className="text-2xl font-bold text-white">Completa tu perfil</h1>
        <p className="text-textMuted text-sm mt-1 mb-6">Cuenta: {user?.email}</p>

        {serverError && <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">{serverError}</p>}

        {[
          ["nombres", "Nombres", "text"],
          ["apellidos", "Apellidos", "text"],
          ["direccion", "Direccion", "text"],
        ].map(([name, label, type]) => (
          <div key={name} className="mb-4">
            <label className="block text-sm text-textMuted mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:outline-none transition"
            />
            {errors[name] && <p className="text-accentRed text-xs mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm text-textMuted mb-1">Telefono</label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            maxLength={8}
            className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:outline-none transition"
          />
          {errors.telefono && <p className="text-accentRed text-xs mt-1">{errors.telefono}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-textMuted mb-1">DUI</label>
          <input
            value={form.dui}
            onChange={handleDuiChange}
            placeholder="00000000-0"
            maxLength={10}
            className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:outline-none transition"
          />
          {errors.dui && <p className="text-accentRed text-xs mt-1">{errors.dui}</p>}
        </div>

        <button
          disabled={saving}
          className="w-full bg-accentRed text-white p-3 rounded-sm font-bold hover:bg-red-700 transition disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </div>
  );
}
