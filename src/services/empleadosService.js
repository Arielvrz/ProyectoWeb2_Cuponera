import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchEmpleadosByEmpresa = async (token, empresaId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/empleados?select=id,nombres,apellidos,correo,empresa_id&empresa_id=eq.${empresaId}&order=apellidos`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchAllEmpleados = async (token) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/empleados?select=id,nombres,apellidos,correo,empresa_id,empresas(nombre)&order=apellidos`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const createEmpleado = async (token, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empleados`, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const updateEmpleado = async (token, id, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empleados?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const deleteEmpleado = async (token, id) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/empleados?id=eq.${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.error || `Error ${res.status}`);
  }
};
