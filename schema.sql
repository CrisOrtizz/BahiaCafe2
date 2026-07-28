-- ============================================================
-- Bahía Café — Esquema base de datos
-- Pegar completo en el SQL Editor de Supabase y ejecutar.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────
-- Tablas
-- ─────────────────────────────────────────

CREATE TABLE productos (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        text          NOT NULL,
  presentacion  text          NOT NULL,
  precio_venta  numeric(10,2) NOT NULL,
  costo         numeric(10,2) NOT NULL DEFAULT 0,
  stock_minimo  integer       NOT NULL DEFAULT 5,
  activo        boolean       NOT NULL DEFAULT true,
  creado_en     timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE clientes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     text        NOT NULL,
  telefono   text,
  creado_en  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ventas (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  uuid          REFERENCES clientes(id),
  total       numeric(10,2) NOT NULL,
  metodo_pago text          NOT NULL
                            CHECK (metodo_pago IN ('efectivo','nequi','transferencia','daviplata')),
  estado      text          NOT NULL DEFAULT 'completada'
                            CHECK (estado IN ('completada','anulada')),
  creado_en   timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE venta_detalle (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id        uuid          NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id     uuid          NOT NULL REFERENCES productos(id),
  cantidad        integer       NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(10,2) NOT NULL,
  subtotal        numeric(10,2) NOT NULL
);

-- Libro mayor de inventario: nunca se sobreescribe el stock directamente.
-- Cada venta inserta una fila negativa; cada compra, una positiva.
-- El stock actual siempre se calcula sumando esta tabla.
CREATE TABLE inventario_movimientos (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id   uuid        NOT NULL REFERENCES productos(id),
  cantidad      integer     NOT NULL,   -- positivo = entrada, negativo = salida
  motivo        text        NOT NULL,   -- 'inicial' | 'venta' | 'compra' | 'ajuste'
  referencia_id uuid,                   -- ventas.id cuando motivo='venta'
  creado_en     timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────
-- Vistas
-- ─────────────────────────────────────────

CREATE VIEW stock_actual AS
SELECT
  p.id,
  p.nombre,
  p.presentacion,
  p.precio_venta,
  p.costo,
  p.stock_minimo,
  p.activo,
  COALESCE(SUM(im.cantidad), 0)::integer AS stock_actual
FROM productos p
LEFT JOIN inventario_movimientos im ON im.producto_id = p.id
GROUP BY p.id, p.nombre, p.presentacion, p.precio_venta,
         p.costo, p.stock_minimo, p.activo;

CREATE VIEW resumen_diario AS
SELECT
  (creado_en AT TIME ZONE 'America/Bogota')::date AS fecha,
  COUNT(*)                                          AS num_ventas,
  COALESCE(SUM(total), 0)                          AS total_vendido
FROM ventas
WHERE estado = 'completada'
GROUP BY (creado_en AT TIME ZONE 'America/Bogota')::date
ORDER BY fecha DESC;

-- ─────────────────────────────────────────
-- Row Level Security (sin políticas públicas)
-- El navegador NUNCA habla con Supabase directamente.
-- Solo el servidor Next.js usa la service_role key, que omite RLS.
-- ─────────────────────────────────────────

ALTER TABLE productos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE venta_detalle          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_movimientos ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- Función atómica: registrar_venta
-- Inserta ventas + venta_detalle + inventario_movimientos
-- en una sola transacción Postgres.
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION registrar_venta(
  p_cliente_id   uuid,
  p_metodo_pago  text,
  p_items        jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_venta_id  uuid;
  v_total     numeric;
  v_item      jsonb;
BEGIN
  SELECT COALESCE(SUM((item->>'subtotal')::numeric), 0)
  INTO v_total
  FROM jsonb_array_elements(p_items) AS item;

  INSERT INTO ventas (cliente_id, total, metodo_pago)
  VALUES (p_cliente_id, v_total, p_metodo_pago)
  RETURNING id INTO v_venta_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario, subtotal)
    VALUES (
      v_venta_id,
      (v_item->>'producto_id')::uuid,
      (v_item->>'cantidad')::integer,
      (v_item->>'precio_unitario')::numeric,
      (v_item->>'subtotal')::numeric
    );

    INSERT INTO inventario_movimientos (producto_id, cantidad, motivo, referencia_id)
    VALUES (
      (v_item->>'producto_id')::uuid,
      -(v_item->>'cantidad')::integer,
      'venta',
      v_venta_id
    );
  END LOOP;

  RETURN v_venta_id;
END;
$$;

-- ─────────────────────────────────────────
-- Función: estadísticas para el dashboard
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  ventas_hoy  bigint,
  total_hoy   numeric,
  total_mes   numeric,
  ventas_mes  bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*) FILTER (
      WHERE (creado_en AT TIME ZONE 'America/Bogota')::date
            = (now() AT TIME ZONE 'America/Bogota')::date
    )::bigint,
    COALESCE(SUM(total) FILTER (
      WHERE (creado_en AT TIME ZONE 'America/Bogota')::date
            = (now() AT TIME ZONE 'America/Bogota')::date
    ), 0),
    COALESCE(SUM(total) FILTER (
      WHERE DATE_TRUNC('month', creado_en AT TIME ZONE 'America/Bogota')
            = DATE_TRUNC('month', now() AT TIME ZONE 'America/Bogota')
    ), 0),
    COUNT(*) FILTER (
      WHERE DATE_TRUNC('month', creado_en AT TIME ZONE 'America/Bogota')
            = DATE_TRUNC('month', now() AT TIME ZONE 'America/Bogota')
    )::bigint
  FROM ventas
  WHERE estado = 'completada';
$$;

-- ─────────────────────────────────────────
-- Función: top 3 productos del mes
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_top_productos_mes()
RETURNS TABLE (
  nombre       text,
  presentacion text,
  unidades     bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.nombre,
    p.presentacion,
    SUM(vd.cantidad)::bigint AS unidades
  FROM venta_detalle vd
  JOIN productos p ON p.id = vd.producto_id
  JOIN ventas v ON v.id = vd.venta_id
  WHERE v.estado = 'completada'
    AND DATE_TRUNC('month', v.creado_en AT TIME ZONE 'America/Bogota')
        = DATE_TRUNC('month', now() AT TIME ZONE 'America/Bogota')
  GROUP BY p.id, p.nombre, p.presentacion
  ORDER BY unidades DESC
  LIMIT 3;
$$;

-- ─────────────────────────────────────────
-- Datos iniciales
-- ─────────────────────────────────────────

INSERT INTO productos (nombre, presentacion, precio_venta, costo, stock_minimo) VALUES
  ('Café Origen Líbano', '250g', 18000, 8000, 5),
  ('Café Origen Líbano', '500g', 32000, 14000, 3);

INSERT INTO inventario_movimientos (producto_id, cantidad, motivo)
SELECT id, 20, 'inicial' FROM productos;
