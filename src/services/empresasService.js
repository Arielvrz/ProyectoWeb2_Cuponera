import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchEmpresas = async (token) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/empresas?select=id,nombre,codigo_empresa,direccion,nombre_contacto,telefono,correo,comision_porcentaje,rubro_id,rubros(nombre)&order=nombre`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchEmpresaById = async (token, id) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/empresas?select=id,nombre,codigo_empresa,direccion,nombre_contacto,telefono,correo,comision_porcentaje,rubro_id,rubros(nombre)&id=eq.${id}&limit=1`,
    { method: "GET", headers: authHeaders(token) }
  );
  const rows = await parseResponse(res);
  return rows[0] ?? null;
};

export const createEmpresa = async (token, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empresas`, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const updateEmpresa = async (token, id, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empresas?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const deleteEmpresa = async (token, id) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empresas?id=eq.${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.error || `Error ${res.status}`);
  }
};
