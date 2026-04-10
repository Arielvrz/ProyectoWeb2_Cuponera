import { SUPABASE_URL, authHeaders, parseResponse } from "../lib/supabaseApi";

export const fetchAllClientes = async (token) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clientes?select=id,nombres,apellidos,correo,telefono,dui&order=apellidos`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};

export const fetchClienteById = async (token, id) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clientes?select=id,nombres,apellidos,correo,telefono,direccion,dui&id=eq.${id}&limit=1`,
    { method: "GET", headers: authHeaders(token) }
  );
  const rows = await parseResponse(res);
  return rows[0] ?? null;
};

export const fetchCuponesByCliente = async (token, clienteId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cupones?select=id,codigo,estado,created_at,canjeado_at,ofertas(titulo,precio_oferta,fecha_limite_uso,rubros(nombre))&cliente_id=eq.${clienteId}&order=created_at.desc`,
    { method: "GET", headers: authHeaders(token) }
  );
  return parseResponse(res);
};
