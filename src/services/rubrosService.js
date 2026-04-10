import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchRubros = async (token) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rubros?select=id,nombre&order=nombre`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const createRubro = async (token, nombre) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rubros`, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ nombre }),
  });
  return parseResponse(res);
};

export const updateRubro = async (token, id, nombre) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rubros?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ nombre }),
  });
  return parseResponse(res);
};

export const deleteRubro = async (token, id) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rubros?id=eq.${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.error || `Error ${res.status}`);
  }
};
