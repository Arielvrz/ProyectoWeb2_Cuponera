import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDuiChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 8) value = `${value.slice(0, 8)}-${value.slice(8)}`;
    setForm({ ...form, dui: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await completeProfile(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "No se pudo completar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-textMain flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-darkCard border border-gray-800 p-8 rounded-sm">
        <h1 className="text-2xl font-bold">Completa tu perfil</h1>
        <p className="text-textMuted text-sm mt-2">Cuenta: {user?.email}</p>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <input className="w-full mt-4 p-3 bg-darkSurface border border-gray-700 rounded-sm" placeholder="Nombres" onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
        <input className="w-full mt-3 p-3 bg-darkSurface border border-gray-700 rounded-sm" placeholder="Apellidos" onChange={(e) => setForm({ ...form, apellidos: e.target.value })} />
        <input className="w-full mt-3 p-3 bg-darkSurface border border-gray-700 rounded-sm" placeholder="Teléfono (8 dígitos)" maxLength="8" onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        <input className="w-full mt-3 p-3 bg-darkSurface border border-gray-700 rounded-sm" placeholder="Dirección" onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        <input className="w-full mt-3 p-3 bg-darkSurface border border-gray-700 rounded-sm" placeholder="DUI 00000000-0" value={form.dui} maxLength="10" onChange={handleDuiChange} />

        <button disabled={saving} className="w-full mt-5 bg-accentRed text-white p-3 rounded-sm font-bold disabled:opacity-60">
          {saving ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </div>
  );
}
