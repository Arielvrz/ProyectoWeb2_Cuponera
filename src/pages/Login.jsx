import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ correo: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const result = await login(credentials.correo, credentials.password);
            if (result.profileIncomplete) {
                navigate("/completar-perfil");
                return;
            }
            navigate("/");
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-darkCard p-8 rounded-lg shadow-lg w-96 text-textMain">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                {error && (
                    <p className="mb-4 rounded border border-red-700 bg-red-900/30 px-3 py-2 text-sm text-red-200">
                        {error}
                    </p>
                )}
                <input
                    type="email"
                    value={credentials.correo}
                    placeholder="Correo Electrónico"
                    required
                    className="w-full p-2 mb-4 bg-darkSurface border border-gray-600 rounded focus:border-accentRed focus:outline-none"
                    onChange={(e) => setCredentials({ ...credentials, correo: e.target.value })}
                />
                <input
                    type="password"
                    value={credentials.password}
                    placeholder="Contraseña"
                    required
                    className="w-full p-2 mb-6 bg-darkSurface border border-gray-600 rounded focus:border-accentRed focus:outline-none"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accentRed text-white p-3 rounded font-bold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? "Ingresando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
};

export default Login;
