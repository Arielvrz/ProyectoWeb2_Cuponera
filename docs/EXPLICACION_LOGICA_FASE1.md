# Explicacion Tecnica Fase 1 - La Cuponera

## 1. Objetivo de la Fase 1
Implementar en React la tienda de cupones (sin back-office), cumpliendo:
- Mostrar ofertas aprobadas vigentes por rubro.
- Registro y autenticacion de clientes.
- Compra y generacion de cupones.
- Visualizacion de cupones del cliente autenticado.

## 2. Stack y Arquitectura
- Frontend: React + Vite + React Router + Tailwind.
- Backend/Persistencia: Supabase (Auth + Postgres + RLS + RPC).
- El frontend consume endpoints de Supabase via `fetch`:
  - Auth: `/auth/v1/...`
  - Data: `/rest/v1/...`
  - RPC: `/rest/v1/rpc/comprar_cupon`

## 3. Modelo de Datos (Supabase)
Tablas principales:
- `rubros`: categorias de ofertas.
- `clientes`: perfil del cliente (id = `auth.users.id`).
- `ofertas`: promociones publicadas.
- `cupones`: cupones comprados por clientes.

Vista:
- `ofertas_vigentes`: filtra ofertas aprobadas, vigentes y no agotadas.

Funcion SQL:
- `comprar_cupon(p_oferta_id)`:
  - valida usuario autenticado.
  - valida que exista perfil en `clientes`.
  - valida oferta disponible/vigente.
  - genera codigo unico.
  - inserta cupon ligado a `cliente_id = auth.uid()`.
  - incrementa `cantidad_vendidos`.

## 4. Seguridad de Accesos
Se aplico seguridad en dos capas:

### Frontend
- Rutas protegidas (`/oferta/:id`, `/mis-cupones`) solo con sesion activa.
- Si no hay sesion, redirige a `/login`.
- Si usuario no tiene perfil completo, redirige a `/completar-perfil`.

### Base de Datos (RLS)
- Lectura de `cupones` solo del propietario (`auth.uid() = cliente_id`).
- Compra via RPC autenticado.
- Resultado: cada cliente solo ve sus propios cupones.

## 5. Flujo de Registro y Login
### Registro
1. Usuario llena formulario validado (dui, telefono, correo, password, etc.).
2. Se crea cuenta en Supabase Auth.
3. Se crea perfil en `clientes`.
4. Si hay confirmacion por correo y no hay sesion inmediata, se guarda perfil pendiente y se completa al primer login.

### Login
1. `signIn` con correo/password.
2. Se recupera usuario autenticado.
3. Se verifica/crea perfil en `clientes` si faltaba.
4. Se guarda sesion local para mantener autenticacion.

## 6. Flujo de Compra de Cupon
1. Cliente autenticado entra al detalle de oferta.
2. Completa formulario de pago simulado.
3. Al pagar, se invoca RPC `comprar_cupon`.
4. El cupon se guarda en DB con `cliente_id` del usuario actual.
5. Se redirige a `/mis-cupones`.

Nota:
- Se elimino la logica anterior de `localStorage` para cupones.
- Ahora los cupones son persistentes y por usuario real.

## 7. Flujo de "Mis Cupones"
1. La vista consulta `cupones` del usuario autenticado.
2. Se muestran con datos de la oferta relacionada.
3. Se clasifican en:
- disponibles
- canjeados
- vencidos

## 8. Problemas Reales Encontrados y Solucion
### A) Cupones se mezclaban entre cuentas
Causa:
- Se guardaban en `localStorage` general.
Solucion:
- Migracion a Supabase + RLS + consulta por usuario autenticado.

### B) Se podia comprar sin login
Causa:
- Rutas no protegidas y logica de compra local.
Solucion:
- Guards de ruta + compra solo con token de sesion.

### C) Error "Perfil de cliente no existe"
Causa:
- Usuario en `auth.users` sin fila en `clientes`.
Solucion:
- Auto-creacion de perfil al login y pantalla `/completar-perfil` para cuentas antiguas.

### D) Error 400 / 429 en auth
Causa:
- 400: datos invalidos o conflicto.
- 429: rate limit de Supabase por muchos intentos.
Solucion:
- Mejor parseo de errores.
- Mensaje claro al usuario.
- Cooldown de 60s en boton de registro cuando hay muchos intentos.

## 9. UI y Navegacion Implementada
- Navbar con acceso a `Mis Cupones` para usuarios autenticados.
- Landing con ofertas reales desde `ofertas_vigentes`.
- Login y registro conectados a Supabase.
- Detalle de oferta con compra.
- Vista de cupones por cliente.
- Pantalla de completar perfil.

## 10. Validacion Tecnica
- `npm run lint` sin errores.
- `npm run build` exitoso.
- Flujo funcional probado:
  - registro/login
  - compra
  - visualizacion de cupones por usuario

## 11. Consideraciones para Presentacion
- Si hay limite de Supabase Auth (`429`), usar cuentas demo ya creadas.
- Mostrar que la compra queda ligada al usuario correcto.
- Demostrar que otro usuario no ve cupones ajenos.

## 12. Conclusion
La Fase 1 quedo estructurada con autenticacion real, persistencia en Supabase y aislamiento de datos por usuario. El sistema ya no depende de almacenamiento local para compra/cupones, y cumple el flujo principal solicitado para el avance.
