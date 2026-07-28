-- ============================================================
-- Bahía Café — Actualización de esquema
-- Ejecutar en SQL Editor de Supabase (actualiza el esquema existente)
-- ============================================================

-- ─── 1. Actualizar tabla ventas ───────────────────────────

-- Agregar campo fecha (cuándo ocurrió la venta, editable por el usuario)
ALTER TABLE ventas ADD COLUMN IF NOT EXISTS
  fecha date NOT NULL DEFAULT current_date;

-- Cambiar estado: completada/anulada → pagado/pendiente/anulada
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_estado_check;

-- Primero migrar los datos, luego aplicar el nuevo constraint
UPDATE ventas SET estado = 'pagado' WHERE estado = 'completada';

ALTER TABLE ventas ALTER COLUMN estado SET DEFAULT 'pagado';
ALTER TABLE ventas ADD CONSTRAINT ventas_estado_check
  CHECK (estado IN ('pagado', 'pendiente', 'anulada'));

-- Ampliar metodo_pago para incluir 'no_especificado' (usado en migración histórica)
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_metodo_pago_check;
ALTER TABLE ventas ADD CONSTRAINT ventas_metodo_pago_check
  CHECK (metodo_pago IN ('efectivo','nequi','transferencia','daviplata','no_especificado'));

-- ─── 2. Actualizar venta_detalle ──────────────────────────

-- Descuento por unidad (ej: 3.000/ud en 500g)
ALTER TABLE venta_detalle ADD COLUMN IF NOT EXISTS
  descuento numeric(10,2) NOT NULL DEFAULT 0;

-- ─── 3. Nueva tabla gastos ────────────────────────────────

CREATE TABLE IF NOT EXISTS gastos (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text          NOT NULL,
  monto       numeric(10,2) NOT NULL CHECK (monto > 0),
  categoria   text          NOT NULL DEFAULT 'compra_cafe',
  fecha       date          NOT NULL DEFAULT current_date,
  notas       text,
  creado_en   timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- ─── 4. Actualizar función registrar_venta ────────────────

DROP FUNCTION IF EXISTS registrar_venta(uuid, text, jsonb);
CREATE OR REPLACE FUNCTION registrar_venta(
  p_cliente_id   uuid,
  p_metodo_pago  text,
  p_items        jsonb,
  p_fecha        date DEFAULT current_date,
  p_estado       text DEFAULT 'pagado'
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

  INSERT INTO ventas (cliente_id, total, metodo_pago, estado, fecha)
  VALUES (p_cliente_id, v_total, p_metodo_pago, p_estado, p_fecha)
  RETURNING id INTO v_venta_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario, descuento, subtotal)
    VALUES (
      v_venta_id,
      (v_item->>'producto_id')::uuid,
      (v_item->>'cantidad')::integer,
      (v_item->>'precio_unitario')::numeric,
      COALESCE((v_item->>'descuento')::numeric, 0),
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

-- ─── 5. Actualizar estadísticas del dashboard ─────────────

DROP FUNCTION IF EXISTS get_dashboard_stats();
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  ventas_hoy    bigint,
  total_hoy     numeric,
  total_mes     numeric,
  ventas_mes    bigint,
  gastos_mes    numeric
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*) FILTER (
      WHERE v.fecha = current_date AND v.estado = 'pagado'
    )::bigint AS ventas_hoy,
    COALESCE(SUM(v.total) FILTER (
      WHERE v.fecha = current_date AND v.estado = 'pagado'
    ), 0) AS total_hoy,
    COALESCE(SUM(v.total) FILTER (
      WHERE DATE_TRUNC('month', v.fecha) = DATE_TRUNC('month', current_date)
        AND v.estado = 'pagado'
    ), 0) AS total_mes,
    COUNT(*) FILTER (
      WHERE DATE_TRUNC('month', v.fecha) = DATE_TRUNC('month', current_date)
    )::bigint AS ventas_mes,
    COALESCE(
      (SELECT SUM(g.monto) FROM gastos g
       WHERE DATE_TRUNC('month', g.fecha) = DATE_TRUNC('month', current_date)),
      0
    ) AS gastos_mes
  FROM ventas v;
$$;

-- ─── 6. Actualizar top productos (usa fecha) ──────────────

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
  WHERE v.estado IN ('pagado', 'pendiente')
    AND DATE_TRUNC('month', v.fecha) = DATE_TRUNC('month', current_date)
  GROUP BY p.id, p.nombre, p.presentacion
  ORDER BY unidades DESC
  LIMIT 3;
$$;
