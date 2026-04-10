import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ correo: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const errs = {};
        if (!validateEmail(credentials.correo)) errs.correo = "Ingresa un correo valido.";
        if (!credentials.password.trim()) errs.password = "La contrasena es requerida.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;
        setSubmitting(true);

        try {
            const result = await login(credentials.correo, credentials.password);
            if (result.profileIncomplete) {
                navigate("/completar-perfil");
                return;
            }
            if (result.role === "admin") navigate("/admin");
            else if (result.role === "company_admin") navigate("/empresa/ofertas");
            else if (result.role === "employee") navigate("/empleado/canjear");
            else navigate("/");
        } catch (err) {
            setServerError(err.message || "No se pudo iniciar sesion.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex justify-center items-center font-serif">
            <form onSubmit={handleSubmit} className="bg-darkCard p-8 rounded-sm shadow-lg w-full max-w-sm text-textMain border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">Iniciar Sesion</h2>

                {serverError && (
                    <p className="mb-4 rounded-sm border border-red-700 bg-red-900/30 px-3 py-2 text-sm text-red-200">
                        {serverError}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm text-textMuted mb-1">Correo electronico</label>
                    <input
                        type="email"
                        value={credentials.correo}
                        onChange={(e) => setCredentials({ ...credentials, correo: e.target.value })}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:outline-none transition"
                    />
                    {errors.correo && <p className="text-accentRed text-xs mt-1">{errors.correo}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-textMuted mb-1">Contrasena</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:outline-none transition"
                    />
                    {errors.password && <p className="text-accentRed text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accentRed text-white p-3 rounded-sm font-bold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? "Ingresando..." : "Entrar"}
                </button>

                <p className="mt-4 text-center text-sm text-textMuted">
                    Sin cuenta?{" "}
                    <Link to="/register" className="text-accentRed hover:underline">Registrarse</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
