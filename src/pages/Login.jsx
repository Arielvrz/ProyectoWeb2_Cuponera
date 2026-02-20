import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ correo: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials.correo, credentials.password);
    };

    return (
        <div className="min-h-screen bg-darkBg flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-darkCard p-8 rounded-lg shadow-lg w-96 text-textMain">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="w-full p-2 mb-4 bg-darkSurface border border-gray-600 rounded focus:border-accentRed focus:outline-none"
                    onChange={(e) => setCredentials({...credentials, correo: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 mb-6 bg-darkSurface border border-gray-600 rounded focus:border-accentRed focus:outline-none"
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
                <button type="submit" className="w-full bg-accentRed text-white p-3 rounded font-bold hover:bg-red-700 transition">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;