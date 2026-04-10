import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchCuponesByOferta = async (token, ofertaId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cupones?select=id,codigo,estado,created_at,canjeado_at&oferta_id=eq.${ofertaId}&order=created_at.desc`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchCuponByCodigo = async (token, codigo) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cupones?select=id,codigo,estado,dui_comprador,canjeado_at,oferta_id,ofertas(titulo,fecha_limite_uso,empresas(nombre))&codigo=eq.${encodeURIComponent(codigo)}&limit=1`,
    { method: "GET", headers: authHeaders(token) }
  );
  const rows = await parseResponse(res);
  return rows[0] ?? null;
};

export const canjearCupon = async (token, cuponId) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cupones?id=eq.${cuponId}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify({ estado: "canjeado", canjeado_at: new Date().toISOString() }),
  });
  return parseResponse(res);
};
