import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchOfertaById, updateOferta } from "../../services/ofertasService";

const validateForm = (form) => {
  const errs = {};
  if (!form.titulo.trim()) errs.titulo = "Requerido";
  const reg = Number(form.precio_regular);
  const ofr = Number(form.precio_oferta);
  if (!form.precio_regular || isNaN(reg) || reg <= 0) errs.precio_regular = "Debe ser mayor a 0";
  if (!form.precio_oferta || isNaN(ofr) || ofr <= 0) errs.precio_oferta = "Debe ser mayor a 0";
  if (!isNaN(reg) && !isNaN(ofr) && ofr >= reg) errs.precio_oferta = "El precio oferta debe ser menor al precio regular";
  if (!form.fecha_inicio) errs.fecha_inicio = "Requerido";
  if (!form.fecha_fin) errs.fecha_fin = "Requerido";
  if (form.fecha_inicio && form.fecha_fin && form.fecha_fin <= form.fecha_inicio)
    errs.fecha_fin = "Debe ser posterior a la fecha de inicio";
  if (!form.fecha_limite_uso) errs.fecha_limite_uso = "Requerido";
  if (form.max_cupones && (isNaN(Number(form.max_cupones)) || Number(form.max_cupones) < 1))
    errs.max_cupones = "Debe ser un numero entero positivo";
  if (!form.descripcion.trim()) errs.descripcion = "Requerido";
  return errs;
};

export default function EditarOferta() {
  const { id } = useParams();
  const { session } = useContext(AuthContext);
  const token = session?.access_token;
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const o = await fetchOfertaById(token, id);
        if (!o) { setLoadError("Oferta no encontrada."); return; }
        setForm({
          titulo: o.titulo ?? "",
          precio_regular: String(o.precio_regular ?? ""),
          precio_oferta: String(o.precio_oferta ?? ""),
          fecha_inicio: o.fecha_inicio ?? "",
          fecha_fin: o.fecha_fin ?? "",
          fecha_limite_uso: o.fecha_limite_uso ?? "",
          max_cupones: o.max_cupones != null ? String(o.max_cupones) : "",
          descripcion: o.descripcion ?? "",
          otros_detalles: o.otros_detalles ?? "",
          imagen_url: o.imagen_url ?? "",
        });
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await updateOferta(token, id, {
        titulo: form.titulo.trim(),
        precio_regular: Number(form.precio_regular),
        precio_oferta: Number(form.precio_oferta),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        fecha_limite_uso: form.fecha_limite_uso,
        max_cupones: form.max_cupones ? Number(form.max_cupones) : null,
        descripcion: form.descripcion.trim(),
        otros_detalles: form.otros_detalles.trim() || null,
        imagen_url: form.imagen_url.trim() || null,
      });
      navigate("/empresa/ofertas");
    } catch (e) {
      setServerError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-textMuted">Cargando...</p>;
  if (loadError) return <p className="text-red-300">{loadError}</p>;
  if (!form) return null;

  const field = (name, label, type = "text", extra = {}) => (
    <div>
      <label className="block text-sm text-textMuted mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none"
        {...extra}
      />
      {errors[name] && <p className="text-accentRed text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <Link to="/empresa/ofertas" className="text-sm text-textMuted hover:text-textMain transition">
        &larr; Volver a Mis Ofertas
      </Link>

      <h1 className="text-2xl font-extrabold text-white mt-4 mb-6">Editar Oferta</h1>

      {serverError && (
        <p className="mb-4 text-sm text-red-300 border border-red-700 bg-red-900/20 px-3 py-2 rounded-sm">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {field("titulo", "Titulo de la oferta")}
        <div className="grid grid-cols-2 gap-4">
          {field("precio_regular", "Precio regular ($)", "number", { min: "0", step: "0.01" })}
          {field("precio_oferta", "Precio oferta ($)", "number", { min: "0", step: "0.01" })}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {field("fecha_inicio", "Fecha de inicio", "date")}
          {field("fecha_fin", "Fecha de fin", "date")}
        </div>
        {field("fecha_limite_uso", "Fecha limite para usar el cupon", "date")}
        {field("max_cupones", "Maximo de cupones (opcional)", "number", { min: "1", placeholder: "Sin limite" })}
        <div>
          <label className="block text-sm text-textMuted mb-1">Descripcion</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none resize-none"
          />
          {errors.descripcion && <p className="text-accentRed text-xs mt-1">{errors.descripcion}</p>}
        </div>
        <div>
          <label className="block text-sm text-textMuted mb-1">Otros detalles (opcional)</label>
          <textarea
            name="otros_detalles"
            value={form.otros_detalles}
            onChange={handleChange}
            rows={2}
            className="w-full bg-darkBg border border-gray-700 rounded-sm px-3 py-2 text-sm text-textMain focus:border-accentRed focus:outline-none resize-none"
          />
        </div>
        {field("imagen_url", "URL de imagen (opcional)", "url")}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-accentRed text-white px-6 py-3 rounded-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
