/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Función simulada de login
    const login = (email, password) => {
        // Usamos la variable password en consola para quitar el error de ESLint
        console.log("Simulando login para:", email, "con contraseña:", password);

        // Aquí luego conectarás con tu Backend/Supabase
        setUser({ email, name: "Cliente Prueba" });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};