export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Faltan variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
}

const sessionStorageKey = "supabase_session";
const pendingProfileStorageKey = "pending_cliente_profile";

export const defaultHeaders = {
  apikey: SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
};

export const authHeaders = (token) => ({
  ...defaultHeaders,
  Authorization: `Bearer ${token}`,
});

export const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Demasiados intentos en poco tiempo. Espera 1 minuto e inténtalo de nuevo.");
    }

    const errorMessage =
      data?.msg_description ||
      data?.error_description ||
      data?.message ||
      data?.error ||
      data?.details ||
      data?.hint ||
      `Error HTTP ${response.status}`;
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

export const setPendingClienteProfile = (email, profile) => {
  const all = JSON.parse(localStorage.getItem(pendingProfileStorageKey) || "{}");
  all[email] = profile;
  localStorage.setItem(pendingProfileStorageKey, JSON.stringify(all));
};

export const getPendingClienteProfile = (email) => {
  const all = JSON.parse(localStorage.getItem(pendingProfileStorageKey) || "{}");
  return all[email] || null;
};

export const clearPendingClienteProfile = (email) => {
  const all = JSON.parse(localStorage.getItem(pendingProfileStorageKey) || "{}");
  delete all[email];
  localStorage.setItem(pendingProfileStorageKey, JSON.stringify(all));
};

export const signUp = async ({ email, password, data }) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password, data }),
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

export const fetchClienteProfile = async (accessToken, userId) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/clientes?select=id&id=eq.${userId}&limit=1`,
    {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const rows = await parseResponse(response);
  return rows[0] ?? null;
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

export const fetchOfertaVigenteById = async (offerId) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/ofertas_vigentes?select=id,titulo,descripcion,precio_regular,precio_oferta,rubro_nombre,imagen_url,fecha_limite_uso,empresa_codigo&id=eq.${offerId}&limit=1`,
    {
      method: "GET",
      headers: defaultHeaders,
    }
  );

  const rows = await parseResponse(response);
  return rows[0] ?? null;
};

export const comprarCupon = async (accessToken, offerId) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/comprar_cupon`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ p_oferta_id: offerId }),
  });

  const rows = await parseResponse(response);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No se recibió el cupón generado.");
  }

  return rows[0];
};

export const fetchMisCupones = async (accessToken) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/cupones?select=id,codigo,estado,created_at,ofertas(titulo,precio_oferta,fecha_limite_uso,rubro_id,rubros(nombre))&order=created_at.desc`,
    {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return parseResponse(response);
};

export const fetchUserProfile = async (accessToken, userId) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=role,empresa_id&id=eq.${userId}&limit=1`,
    { method: "GET", headers: authHeaders(accessToken) }
  );
  const rows = await parseResponse(response);
  if (rows[0]?.role) return rows[0];

  const clientRes = await fetch(
    `${SUPABASE_URL}/rest/v1/clientes?select=id&id=eq.${userId}&limit=1`,
    { method: "GET", headers: authHeaders(accessToken) }
  );
  const clients = await parseResponse(clientRes);
  if (clients[0]) return { role: "cliente", empresa_id: null };

  return { role: "cliente", empresa_id: null };
};

export const upsertProfile = async (accessToken, id, role, empresa_id = null) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      ...authHeaders(accessToken),
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({ id, role, empresa_id }),
  });
  return parseResponse(response);
};
