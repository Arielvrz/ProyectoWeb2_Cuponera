/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import {
    clearPendingClienteProfile,
    clearStoredSession,
    createClienteProfile,
    fetchClienteProfile,
    getPendingClienteProfile,
    getAuthUser,
    getStoredSession,
    setPendingClienteProfile,
    setStoredSession,
    signIn,
    signOut,
    signUp
} from "../lib/supabaseApi";

export const AuthContext = createContext();

const buildClientePayload = (authUser, explicitProfile = null) => {
    const metadata = authUser?.user_metadata || {};
    const profile = explicitProfile || {};

    return {
        id: authUser.id,
        nombres: profile.nombres || metadata.nombres || "",
        apellidos: profile.apellidos || metadata.apellidos || "",
        telefono: profile.telefono || metadata.telefono || "",
        correo: authUser.email,
        direccion: profile.direccion || metadata.direccion || "",
        dui: profile.dui || metadata.dui || ""
    };
};

const ensureClienteProfile = async (accessToken, authUser, explicitProfile = null) => {
    if (!authUser?.id) {
        throw new Error("No se pudo identificar el usuario autenticado.");
    }

    const existingProfile = await fetchClienteProfile(accessToken, authUser.id);
    if (existingProfile) return true;

    const payload = buildClientePayload(authUser, explicitProfile);
    const missingRequired = ["nombres", "apellidos", "telefono", "direccion", "dui"].some(
        (field) => !payload[field]
    );

    if (missingRequired) return false;

    await createClienteProfile(accessToken, payload);
    return true;
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(true);

    useEffect(() => {
        const bootstrapSession = async () => {
            try {
                const storedSession = getStoredSession();

                if (!storedSession?.access_token) {
                    setLoading(false);
                    return;
                }

                const authUser = await getAuthUser(storedSession.access_token);
                const pendingProfile = getPendingClienteProfile(authUser.email);
                const ok = await ensureClienteProfile(storedSession.access_token, authUser, pendingProfile);
                clearPendingClienteProfile(authUser.email);
                setSession(storedSession);
                setUser(authUser);
                setProfileComplete(ok);
            } catch {
                clearStoredSession();
                setSession(null);
                setUser(null);
                setProfileComplete(true);
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
        const pendingProfile = getPendingClienteProfile(authUser.email);
        const ok = await ensureClienteProfile(nextSession.access_token, authUser, pendingProfile);
        clearPendingClienteProfile(authUser.email);
        setUser(authUser);
        setProfileComplete(ok);
        return { user: authUser, profileIncomplete: !ok };
    };

    const register = async (formData) => {
        const profilePayload = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            direccion: formData.direccion,
            dui: formData.dui
        };

        setPendingClienteProfile(formData.correo, profilePayload);

        const registerData = await signUp({
            email: formData.correo,
            password: formData.password,
            data: profilePayload
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

        const currentAuthUser = registerData.user ?? (await getAuthUser(nextSession.access_token));
        await ensureClienteProfile(nextSession.access_token, currentAuthUser, profilePayload);
        clearPendingClienteProfile(formData.correo);

        setStoredSession(nextSession);
        setSession(nextSession);
        setUser(currentAuthUser);
        setProfileComplete(true);

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
        setProfileComplete(true);
    };

    const completeProfile = async (formData) => {
        if (!session?.access_token || !user?.id) {
            throw new Error("No hay sesión activa.");
        }

        await createClienteProfile(session.access_token, {
            id: user.id,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            correo: user.email,
            direccion: formData.direccion,
            dui: formData.dui
        });

        setProfileComplete(true);
    };

    const value = {
        user,
        session,
        isAuthenticated: Boolean(user),
        profileComplete,
        loading,
        login,
        register,
        completeProfile,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
