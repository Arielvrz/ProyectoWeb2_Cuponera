import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        correo: "",
        direccion: "",
        dui: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const tempErrors = {};
        const duiRegex = /^\d{8}-\d{1}$/;
        const phoneRegex = /^[267]\d{7}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!formData.nombres.trim()) tempErrors.nombres = "Nombres es requerido";
        if (!formData.apellidos.trim()) tempErrors.apellidos = "Apellidos es requerido";
        if (!formData.direccion.trim()) tempErrors.direccion = "Dirección es requerida";
        if (!duiRegex.test(formData.dui)) tempErrors.dui = "DUI inválido (ej. 12345678-9)";
        if (!phoneRegex.test(formData.telefono)) tempErrors.telefono = "Debe iniciar con 2, 6 o 7 y tener 8 dígitos";
        if (!emailRegex.test(formData.correo)) tempErrors.correo = "Correo inválido";
        if (!passwordRegex.test(formData.password)) tempErrors.password = "Mínimo 8 caracteres, 1 mayúscula y 1 número";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDuiChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 9) {
            value = value.slice(0, 9);
        }
        if (value.length > 8) {
            value = `${value.slice(0, 8)}-${value.slice(8)}`;
        }
        setFormData({ ...formData, dui: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setServerSuccess("");

        if (!validate()) {
            return;
        }

        setSubmitting(true);
        try {
            const result = await register(formData);

            if (result.requiresEmailConfirmation) {
                setServerSuccess("Registro enviado. Revisa tu correo para confirmar la cuenta.");
            } else {
                setServerSuccess("Cuenta creada correctamente.");
                navigate("/");
            }
        } catch (err) {
            setServerError(err.message || "No se pudo completar el registro.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex justify-center items-center p-4 font-serif">
            <form onSubmit={handleSubmit} className="bg-darkCard p-8 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full max-w-md text-textMain border border-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">Únete a <span className="text-accentRed">La Cuponera</span></h2>

                {serverError && (
                    <p className="mb-4 rounded border border-red-700 bg-red-900/30 px-3 py-2 text-sm text-red-200">
                        {serverError}
                    </p>
                )}
                {serverSuccess && (
                    <p className="mb-4 rounded border border-green-700 bg-green-900/30 px-3 py-2 text-sm text-green-200">
                        {serverSuccess}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Nombres</label>
                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.nombres && <p className="text-accentRed text-xs mt-1 font-medium">{errors.nombres}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Apellidos</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.apellidos && <p className="text-accentRed text-xs mt-1 font-medium">{errors.apellidos}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        maxLength="8"
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.telefono && <p className="text-accentRed text-xs mt-1 font-medium">{errors.telefono}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Correo</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.correo && <p className="text-accentRed text-xs mt-1 font-medium">{errors.correo}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.direccion && <p className="text-accentRed text-xs mt-1 font-medium">{errors.direccion}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Número de DUI</label>
                    <input
                        type="text"
                        value={formData.dui}
                        maxLength="10"
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                        placeholder="00000000-0"
                        onChange={handleDuiChange}
                    />
                    {errors.dui && <p className="text-accentRed text-xs mt-1 font-medium">{errors.dui}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                    />
                    {errors.password && <p className="text-accentRed text-xs mt-1 font-medium">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 bg-accentRed text-white p-3 rounded-sm font-bold hover:bg-red-700 transition duration-300 shadow-[0_0_15px_rgba(230,57,70,0.3)] tracking-wider uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? "Creando..." : "Crear Cuenta"}
                </button>
            </form>
        </div>
    );
};

export default Register;
