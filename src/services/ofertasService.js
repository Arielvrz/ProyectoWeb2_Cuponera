import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchOfertasByEmpresa = async (token, empresaId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ofertas?select=id,titulo,precio_regular,precio_oferta,fecha_inicio,fecha_fin,fecha_limite_uso,max_cupones,descripcion,otros_detalles,estado,motivo_rechazo,imagen_url&empresa_id=eq.${empresaId}&order=created_at.desc`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchAllOfertas = async (token) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ofertas?select=id,titulo,precio_oferta,estado,motivo_rechazo,created_at,empresa_id,empresas(nombre,codigo_empresa)&order=created_at.desc`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchOfertaById = async (token, id) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ofertas?select=*,empresas(nombre,codigo_empresa,rubro_id,rubros(nombre))&id=eq.${id}&limit=1`,
    { method: "GET", headers: authHeaders(token) }
  );
  const rows = await parseResponse(res);
  return rows[0] ?? null;
};

export const createOferta = async (token, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ofertas`, {
    method: "POST",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const updateOferta = async (token, id, payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ofertas?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
};

export const aprobarOferta = async (token, id) => {
  return updateOferta(token, id, { estado: "aprobada", motivo_rechazo: null });
};

export const rechazarOferta = async (token, id, motivoRechazo) => {
  return updateOferta(token, id, { estado: "rechazada", motivo_rechazo: motivoRechazo });
};

export const resubmitOferta = async (token, id, payload) => {
  return updateOferta(token, id, { ...payload, estado: "pendiente_aprobacion", motivo_rechazo: null });
};

export const descartarOferta = async (token, id) => {
  return updateOferta(token, id, { estado: "descartada" });
};
