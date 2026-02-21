/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import {
    clearStoredSession,
    createClienteProfile,
    getAuthUser,
    getStoredSession,
    setStoredSession,
    signIn,
    signOut,
    signUp
} from "../lib/supabaseApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrapSession = async () => {
            try {
                const storedSession = getStoredSession();

                if (!storedSession?.access_token) {
                    setLoading(false);
                    return;
                }

                const authUser = await getAuthUser(storedSession.access_token);
                setSession(storedSession);
                setUser(authUser);
            } catch {
                clearStoredSession();
                setSession(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrapSession();
    }, []);

    const login = async (email, password) => {
        const loginData = await signIn({ email, password });
        const nextSession = {
            access_token: loginData.access_token,
            refresh_token: loginData.refresh_token,
            expires_in: loginData.expires_in
        };

        setStoredSession(nextSession);
        setSession(nextSession);

        const authUser = loginData.user ?? (await getAuthUser(nextSession.access_token));
        setUser(authUser);
        return authUser;
    };

    const register = async (formData) => {
        const registerData = await signUp({
            email: formData.correo,
            password: formData.password
        });

        // Si el proyecto exige confirmación por correo, Supabase no devuelve sesión aún.
        if (!registerData.session?.access_token || !registerData.user?.id) {
            return {
                success: true,
                requiresEmailConfirmation: true
            };
        }

        const nextSession = {
            access_token: registerData.session.access_token,
            refresh_token: registerData.session.refresh_token,
            expires_in: registerData.session.expires_in
        };

        await createClienteProfile(nextSession.access_token, {
            id: registerData.user.id,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            correo: formData.correo,
            direccion: formData.direccion,
            dui: formData.dui
        });

        setStoredSession(nextSession);
        setSession(nextSession);
        setUser(registerData.user);

        return {
            success: true,
            requiresEmailConfirmation: false
        };
    };

    const logout = async () => {
        if (session?.access_token) {
            try {
                await signOut(session.access_token);
            } catch {
                // Si la sesión ya expiró en servidor, igual limpiamos en cliente.
            }
        }

        clearStoredSession();
        setSession(null);
        setUser(null);
    };

    const value = {
        user,
        session,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
