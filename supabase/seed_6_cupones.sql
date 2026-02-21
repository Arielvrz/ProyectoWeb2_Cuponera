-- Crea 6 ofertas distintas (contenido e imagen) y genera 6 cupones
-- para el cliente más reciente en public.clientes.
-- Ejecutar una sola vez en Supabase SQL Editor.

do $$
begin
  if not exists (select 1 from public.clientes) then
    raise exception 'No hay clientes en public.clientes. Registra e inicia sesión con al menos una cuenta primero.';
  end if;
end $$;

insert into public.rubros (nombre)
values
  ('Aventura'),
  ('Gastronomía'),
  ('Bienestar'),
  ('Tecnología'),
  ('Cultura'),
  ('Deportes')
on conflict (nombre) do nothing;

with latest_cliente as (
  select c.id as cliente_id
  from public.clientes c
  order by c.created_at desc
  limit 1
),
new_offers as (
  insert into public.ofertas (
    titulo,
    descripcion,
    precio_regular,
    precio_oferta,
    fecha_inicio,
    fecha_fin,
    fecha_limite_uso,
    cantidad_limite,
    cantidad_vendidos,
    estado,
    rubro_id,
    empresa_codigo,
    imagen_url
  )
  values
    (
      'Ruta en Kayak al Atardecer',
      'Recorrido guiado por manglares con equipo incluido.',
      65.00, 39.90,
      current_date - 1, current_date + 30, current_date + 60,
      120, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Aventura' limit 1),
      'AVT101',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ),
    (
      'Degustación de Cocina Fusión',
      'Menú de 5 tiempos para dos personas con bebida artesanal.',
      90.00, 54.50,
      current_date - 1, current_date + 30, current_date + 60,
      80, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Gastronomía' limit 1),
      'GAS202',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
    ),
    (
      'Sesión Premium de Spa',
      'Masaje relajante + aromaterapia + circuito de hidroterapia.',
      75.00, 44.00,
      current_date - 1, current_date + 30, current_date + 60,
      90, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Bienestar' limit 1),
      'BIE303',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80'
    ),
    (
      'Diagnóstico Express de Laptop',
      'Evaluación técnica completa y limpieza interna preventiva.',
      45.00, 24.99,
      current_date - 1, current_date + 30, current_date + 60,
      150, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Tecnología' limit 1),
      'TEC404',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    ),
    (
      'Entrada Doble a Museo Interactivo',
      'Acceso completo a exhibiciones inmersivas y experiencia VR.',
      40.00, 21.00,
      current_date - 1, current_date + 30, current_date + 60,
      200, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Cultura' limit 1),
      'CUL505',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80'
    ),
    (
      'Clase Funcional de Alto Rendimiento',
      'Entrenamiento grupal con coach y evaluación física inicial.',
      30.00, 16.50,
      current_date - 1, current_date + 30, current_date + 60,
      140, 0, 'aprobada',
      (select id from public.rubros where nombre = 'Deportes' limit 1),
      'DEP606',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
    )
  returning id, empresa_codigo
),
codes as (
  select
    o.id as oferta_id,
    o.empresa_codigo || lpad((1000000 + (o.id % 9000000))::text, 7, '0') as codigo
  from new_offers o
)
insert into public.cupones (codigo, estado, oferta_id, cliente_id)
select
  d.codigo,
  'disponible',
  d.oferta_id,
  lc.cliente_id
from codes d
cross join latest_cliente lc;

-- Validación rápida
select
  c.id,
  c.codigo,
  c.estado,
  c.cliente_id,
  o.titulo,
  o.imagen_url
from public.cupones c
join public.ofertas o on o.id = c.oferta_id
order by c.created_at desc
limit 6;
