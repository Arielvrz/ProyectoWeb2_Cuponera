const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Faltan variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
}

const sessionStorageKey = "supabase_session";

const defaultHeaders = {
  apikey: SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.msg_description || data?.error_description || data?.message || "Error en la solicitud";
    throw new Error(errorMessage);
  }

  return data;
};

export const getStoredSession = () => {
  const raw = localStorage.getItem(sessionStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(sessionStorageKey);
    return null;
  }
};

export const setStoredSession = (session) => {
  localStorage.setItem(sessionStorageKey, JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem(sessionStorageKey);
};

export const signUp = async ({ email, password }) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(response);
};

export const signIn = async ({ email, password }) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(response);
};

export const getAuthUser = async (accessToken) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response);
};

export const signOut = async (accessToken) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await parseResponse(response);
};

export const createClienteProfile = async (accessToken, clientePayload) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${accessToken}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(clientePayload),
  });

  return parseResponse(response);
};

export const fetchOfertasVigentes = async () => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/ofertas_vigentes?select=id,titulo,precio_regular,precio_oferta,rubro_nombre,imagen_url`,
    {
      method: "GET",
      headers: defaultHeaders,
    }
  );

  return parseResponse(response);
};
