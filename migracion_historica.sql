-- ============================================================
-- Bahía Café — Migración datos históricos desde Excel
-- IMPORTANTE: Ejecutar DESPUÉS de schema_actualizacion.sql
-- Borra datos de prueba e importa productos y ventas reales.
-- ============================================================

-- 1. Limpiar datos de prueba
TRUNCATE inventario_movimientos, venta_detalle, ventas, clientes, productos CASCADE;

-- ─── 2. Productos reales ──────────────────────────────────
-- IDs fijos para facilitar referencias en esta migración

INSERT INTO productos (id, nombre, presentacion, precio_venta, costo, stock_minimo) VALUES
  ('a0000000-cafe-0000-0000-000000000001', 'Café Molido Clasico',         '250g',  30000, 18000, 5),
  ('a0000000-cafe-0000-0000-000000000002', 'Café Molido Clasico',         '500g',  43000, 30000, 3),
  ('a0000000-cafe-0000-0000-000000000003', 'Café en Grano Clasico',       '250g',  30000, 18000, 1),
  ('a0000000-cafe-0000-0000-000000000004', 'Café en Grano Clasico',       '500g',  43000, 30000, 3),
  ('a0000000-cafe-0000-0000-000000000005', 'Café Molido Honey',           '250g',  34000, 22000, 1),
  ('a0000000-cafe-0000-0000-000000000006', 'Café Molido Honey',           '500g',  50000, 38000, 1),
  ('a0000000-cafe-0000-0000-000000000007', 'Prensa Francesa Cristal',     '600ml', 28000, 35000, 1),
  ('a0000000-cafe-0000-0000-000000000008', 'Prensa Francesa Dorada',      '600ml', 35900, 40000, 1),
  ('a0000000-cafe-0000-0000-000000000009', 'Prensa Francesa',             '350ml', 25000, 21000, 1),
  ('a0000000-cafe-0000-0000-000000000010', 'Prensa Francesa Vitto & Fiore','350ml',28000, 22000, 1);

-- ─── 3. Stock inicial (según Excel) ──────────────────────

INSERT INTO inventario_movimientos (producto_id, cantidad, motivo) VALUES
  ('a0000000-cafe-0000-0000-000000000001', 14, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000002', 14, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000003',  0, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000004', 10, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000005',  2, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000006',  0, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000007',  2, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000008',  1, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000009',  1, 'inicial'),
  ('a0000000-cafe-0000-0000-000000000010',  0, 'inicial');

-- ─── 4. Clientes históricos ───────────────────────────────

INSERT INTO clientes (id, nombre) VALUES
  ('b0000000-cafe-0000-0000-000000000001', 'Amparo Trocha'),
  ('b0000000-cafe-0000-0000-000000000002', 'Dayanis Herrera'),
  ('b0000000-cafe-0000-0000-000000000003', 'Cristian Ortiz'),
  ('b0000000-cafe-0000-0000-000000000004', 'Vilma Meza'),
  ('b0000000-cafe-0000-0000-000000000005', 'Cristian Morales'),
  ('b0000000-cafe-0000-0000-000000000006', 'Ayinson Ardila'),
  ('b0000000-cafe-0000-0000-000000000007', 'Pedro Nel'),
  ('b0000000-cafe-0000-0000-000000000008', 'Yenilsa Avila'),
  ('b0000000-cafe-0000-0000-000000000009', 'Carlos Garcia'),
  ('b0000000-cafe-0000-0000-000000000010', 'Wilson Vega'),
  ('b0000000-cafe-0000-0000-000000000011', 'Oscar Mejía'),
  ('b0000000-cafe-0000-0000-000000000012', 'Luz Guzman'),
  ('b0000000-cafe-0000-0000-000000000013', 'Karem Herrera'),
  ('b0000000-cafe-0000-0000-000000000014', 'Maria Clara Montalvo'),
  ('b0000000-cafe-0000-0000-000000000015', 'Cristóbal Jackson'),
  ('b0000000-cafe-0000-0000-000000000016', 'Maria Vertel'),
  ('b0000000-cafe-0000-0000-000000000017', 'Henser Constructor'),
  ('b0000000-cafe-0000-0000-000000000018', 'Wilson Vasquez'),
  ('b0000000-cafe-0000-0000-000000000019', 'Yenilsa Peña'),
  ('b0000000-cafe-0000-0000-000000000020', 'Gloricel Peña'),
  ('b0000000-cafe-0000-0000-000000000021', 'Jorge'),
  ('b0000000-cafe-0000-0000-000000000022', 'Yenilsa'),
  ('b0000000-cafe-0000-0000-000000000023', 'Gustavo (Barbero)'),
  ('b0000000-cafe-0000-0000-000000000024', 'María Alejandra Vertel'),
  ('b0000000-cafe-0000-0000-000000000025', 'Jessica Prima'),
  ('b0000000-cafe-0000-0000-000000000026', 'Sharick Alfaro'),
  ('b0000000-cafe-0000-0000-000000000027', 'Enaldo Avila'),
  ('b0000000-cafe-0000-0000-000000000028', 'Jiseth Romero');

-- ─── 5. Ventas históricas ─────────────────────────────────
-- Fuente: hoja VENTAS del Excel Bahia_Cafe_v3.xlsx
-- Descuento = por unidad (subtotal = (precio - descuento) × cantidad)
-- Método de pago: no estaba en el Excel → 'no_especificado'
-- (actualizar manualmente si recuerdas el método de cada venta)

-- Abreviaciones usadas abajo:
--   p1=Café Molido Clasico 250g  p2=Café Molido Clasico 500g
--   p4=Café en Grano Clasico 500g  p5=Café Molido Honey 250g
--   p6=Café Molido Honey 500g  p7=Prensa Francesa Cristal 600ml
--   p8=Prensa Francesa Dorada 600ml  p9=Prensa Francesa 350ml

DO $$
DECLARE
  -- Productos
  p1  uuid := 'a0000000-cafe-0000-0000-000000000001';
  p2  uuid := 'a0000000-cafe-0000-0000-000000000002';
  p4  uuid := 'a0000000-cafe-0000-0000-000000000004';
  p5  uuid := 'a0000000-cafe-0000-0000-000000000005';
  p6  uuid := 'a0000000-cafe-0000-0000-000000000006';
  p7  uuid := 'a0000000-cafe-0000-0000-000000000007';
  p8  uuid := 'a0000000-cafe-0000-0000-000000000008';
  p9  uuid := 'a0000000-cafe-0000-0000-000000000009';
  -- Clientes
  c1  uuid := 'b0000000-cafe-0000-0000-000000000001';
  c2  uuid := 'b0000000-cafe-0000-0000-000000000002';
  c3  uuid := 'b0000000-cafe-0000-0000-000000000003';
  c4  uuid := 'b0000000-cafe-0000-0000-000000000004';
  c5  uuid := 'b0000000-cafe-0000-0000-000000000005';
  c6  uuid := 'b0000000-cafe-0000-0000-000000000006';
  c7  uuid := 'b0000000-cafe-0000-0000-000000000007';
  c8  uuid := 'b0000000-cafe-0000-0000-000000000008';
  c9  uuid := 'b0000000-cafe-0000-0000-000000000009';
  c10 uuid := 'b0000000-cafe-0000-0000-000000000010';
  c11 uuid := 'b0000000-cafe-0000-0000-000000000011';
  c12 uuid := 'b0000000-cafe-0000-0000-000000000012';
  c13 uuid := 'b0000000-cafe-0000-0000-000000000013';
  c14 uuid := 'b0000000-cafe-0000-0000-000000000014';
  c15 uuid := 'b0000000-cafe-0000-0000-000000000015';
  c16 uuid := 'b0000000-cafe-0000-0000-000000000016';
  c17 uuid := 'b0000000-cafe-0000-0000-000000000017';
  c18 uuid := 'b0000000-cafe-0000-0000-000000000018';
  c19 uuid := 'b0000000-cafe-0000-0000-000000000019';
  c20 uuid := 'b0000000-cafe-0000-0000-000000000020';
  c21 uuid := 'b0000000-cafe-0000-0000-000000000021';
  c22 uuid := 'b0000000-cafe-0000-0000-000000000022';
  c23 uuid := 'b0000000-cafe-0000-0000-000000000023';
  c24 uuid := 'b0000000-cafe-0000-0000-000000000024';
  c25 uuid := 'b0000000-cafe-0000-0000-000000000025';
  c26 uuid := 'b0000000-cafe-0000-0000-000000000026';
  c27 uuid := 'b0000000-cafe-0000-0000-000000000027';
  c28 uuid := 'b0000000-cafe-0000-0000-000000000028';
  v   uuid;
BEGIN

-- Macro helper: para cada venta llamamos registrar_venta que ya
-- inserta en ventas + venta_detalle + inventario_movimientos.
-- Luego actualizamos la fecha porque la función usa current_date por defecto.

-- 2026-04-08 | Amparo Trocha | Café Molido Clasico 500g ×1 | desc 0 | $43.000 | Pagado
SELECT registrar_venta(c1,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":0,"subtotal":43000}]') INTO v;
UPDATE ventas SET fecha='2026-04-08', estado='pagado' WHERE id=v;

-- 2026-04-07 | Dayanis Herrera | Café en Grano Clasico 500g ×2 | desc 3.000/ud | $80.000 | Pagado
SELECT registrar_venta(c2,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":2,"precio_unitario":43000,"descuento":3000,"subtotal":80000}]') INTO v;
UPDATE ventas SET fecha='2026-04-07', estado='pagado' WHERE id=v;

-- 2026-04-07 | Cristian Ortiz | Café en Grano Clasico 500g ×1 | desc 8.000 | $35.000 | Pagado
SELECT registrar_venta(c3,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":8000,"subtotal":35000}]') INTO v;
UPDATE ventas SET fecha='2026-04-07', estado='pagado' WHERE id=v;

-- 2026-04-09 | Vilma Meza | Café Molido Clasico 250g ×1 | desc 0 | $30.000 | Pagado
SELECT registrar_venta(c4,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":0,"subtotal":30000}]') INTO v;
UPDATE ventas SET fecha='2026-04-09', estado='pagado' WHERE id=v;

-- 2026-04-08 | Cristian Morales | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c5,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-08', estado='pagado' WHERE id=v;

-- 2026-04-08 | Ayinson Ardila | Café Molido Clasico 250g ×2 | desc 5.000/ud | $50.000 | Pagado
SELECT registrar_venta(c6,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":2,"precio_unitario":30000,"descuento":5000,"subtotal":50000}]') INTO v;
UPDATE ventas SET fecha='2026-04-08', estado='pagado' WHERE id=v;

-- 2026-04-09 | Pedro Nel | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c7,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-09', estado='pagado' WHERE id=v;

-- 2026-04-09 | Yenilsa Avila | Café Molido Clasico 500g ×1 | desc 0 | $43.000 | Pagado
SELECT registrar_venta(c8,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":0,"subtotal":43000}]') INTO v;
UPDATE ventas SET fecha='2026-04-09', estado='pagado' WHERE id=v;

-- 2026-04-10 | Carlos Garcia | Café Molido Clasico 500g ×1 | desc 0 | $43.000 | Pagado
SELECT registrar_venta(c9,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":0,"subtotal":43000}]') INTO v;
UPDATE ventas SET fecha='2026-04-10', estado='pagado' WHERE id=v;

-- 2026-04-13 | Wilson Vega | Café Molido Clasico 250g ×1 | desc 0 | $30.000 | Pagado
SELECT registrar_venta(c10,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":0,"subtotal":30000}]') INTO v;
UPDATE ventas SET fecha='2026-04-13', estado='pagado' WHERE id=v;

-- 2026-04-14 | Oscar Mejía | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c11,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-14', estado='pagado' WHERE id=v;

-- 2026-04-17 | Ayinson Ardila | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c6,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-17 | Luz Guzman | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c12,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-17 | Karem Herrera | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c13,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-17 | Maria Clara Montalvo | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c14,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-20 | Cristóbal Jackson | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c15,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-20', estado='pagado' WHERE id=v;

-- 2026-04-16 | Maria Vertel | Prensa Francesa Dorada 600ml ×1 | desc 0 | $40.000 | Pagado
SELECT registrar_venta(c16,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000008","cantidad":1,"precio_unitario":40000,"descuento":0,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-16', estado='pagado' WHERE id=v;

-- 2026-04-17 | Karem Herrera | Prensa Francesa 350ml ×1 | desc 0 | $25.000 | Pagado
SELECT registrar_venta(c13,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":25000,"descuento":0,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-17 | Karem Herrera | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c13,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-04-17', estado='pagado' WHERE id=v;

-- 2026-04-28 | Wilson Vega | Prensa Francesa 350ml ×1 | desc 0 | $25.000 | Pagado
SELECT registrar_venta(c10,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":25000,"descuento":0,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-28', estado='pagado' WHERE id=v;

-- 2026-04-28 | Wilson Vega | Prensa Francesa Cristal 600ml ×1 | desc 0 | $35.000 | Pagado
SELECT registrar_venta(c10,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000007","cantidad":1,"precio_unitario":35000,"descuento":0,"subtotal":35000}]') INTO v;
UPDATE ventas SET fecha='2026-04-28', estado='pagado' WHERE id=v;

-- 2026-04-28 | Henser Constructor | Café Molido Clasico 250g ×1 | desc 0 | $30.000 | Pagado
SELECT registrar_venta(c17,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":0,"subtotal":30000}]') INTO v;
UPDATE ventas SET fecha='2026-04-28', estado='pagado' WHERE id=v;

-- 2026-04-29 | Vilma Meza | Café Molido Clasico 250g ×1 | desc 2.000 | $28.000 | Pagado
SELECT registrar_venta(c4,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":2000,"subtotal":28000}]') INTO v;
UPDATE ventas SET fecha='2026-04-29', estado='pagado' WHERE id=v;

-- 2026-04-29 | Vilma Meza | Prensa Francesa 350ml ×1 | desc 0 | $25.000 | Pagado
SELECT registrar_venta(c4,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":25000,"descuento":0,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-29', estado='pagado' WHERE id=v;

-- 2026-04-29 | Wilson Vasquez | Café Molido Clasico 250g ×1 | desc 2.000 | $28.000 | Pagado
SELECT registrar_venta(c18,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":2000,"subtotal":28000}]') INTO v;
UPDATE ventas SET fecha='2026-04-29', estado='pagado' WHERE id=v;

-- 2026-04-29 | Wilson Vasquez | Prensa Francesa 350ml ×1 | desc 0 | $25.000 | Pagado
SELECT registrar_venta(c18,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":25000,"descuento":0,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-04-29', estado='pagado' WHERE id=v;

-- 2026-05-05 | Yenilsa Peña | Café Molido Clasico 500g ×2 | desc 5.000/ud | $76.000 | Pagado
SELECT registrar_venta(c19,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":2,"precio_unitario":43000,"descuento":5000,"subtotal":76000}]') INTO v;
UPDATE ventas SET fecha='2026-05-05', estado='pagado' WHERE id=v;

-- 2026-05-06 | Ayinson Ardila | Café Molido Clasico 500g ×2 | desc 3.000/ud | $80.000 | Pagado
SELECT registrar_venta(c6,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":2,"precio_unitario":43000,"descuento":3000,"subtotal":80000}]') INTO v;
UPDATE ventas SET fecha='2026-05-06', estado='pagado' WHERE id=v;

-- 2026-05-06 | Gloricel Peña | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c20,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-05-06', estado='pagado' WHERE id=v;

-- 2026-05-09 | Jorge | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c21,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-05-09', estado='pagado' WHERE id=v;

-- 2026-05-09 | Jorge | Prensa Francesa 350ml ×1 | desc 0 | $25.000 | Pagado
SELECT registrar_venta(c21,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":25000,"descuento":0,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-05-09', estado='pagado' WHERE id=v;

-- 2026-05-09 | Cristian Morales | Café Molido Honey 250g ×1 | desc 2.000 | $32.000 | Pagado
SELECT registrar_venta(c5,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000005","cantidad":1,"precio_unitario":34000,"descuento":2000,"subtotal":32000}]') INTO v;
UPDATE ventas SET fecha='2026-05-09', estado='pagado' WHERE id=v;

-- 2026-05-09 | Cristian Ortiz | Café Molido Honey 250g ×1 | desc 6.000 | $28.000 | Pagado
SELECT registrar_venta(c3,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000005","cantidad":1,"precio_unitario":34000,"descuento":6000,"subtotal":28000}]') INTO v;
UPDATE ventas SET fecha='2026-05-09', estado='pagado' WHERE id=v;

-- 2026-05-15 | Gustavo (Barbero) | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c23,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-05-15', estado='pagado' WHERE id=v;

-- 2026-05-15 | María Alejandra Vertel | Prensa Francesa Cristal 600ml ×1 | desc 0 | $43.000 | Pagado
SELECT registrar_venta(c24,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000007","cantidad":1,"precio_unitario":43000,"descuento":0,"subtotal":43000}]') INTO v;
UPDATE ventas SET fecha='2026-05-15', estado='pagado' WHERE id=v;

-- 2026-05-15 | María Alejandra Vertel | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c24,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-05-15', estado='pagado' WHERE id=v;

-- 2026-05-19 | Jessica Prima | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pendiente
SELECT registrar_venta(c25,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-05-19', estado='pendiente' WHERE id=v;

-- 2026-05-19 | Jessica Prima | Prensa Francesa 350ml ×1 | desc 0 | $28.000 | Pendiente
SELECT registrar_venta(c25,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000009","cantidad":1,"precio_unitario":28000,"descuento":0,"subtotal":28000}]') INTO v;
UPDATE ventas SET fecha='2026-05-19', estado='pendiente' WHERE id=v;

-- 2026-05-19 | Dayanis Herrera | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c2,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-05-19', estado='pagado' WHERE id=v;

-- 2026-05-19 | Cristian Ortiz | Café en Grano Clasico 500g ×1 | desc 8.000 | $35.000 | Pagado
SELECT registrar_venta(c3,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":8000,"subtotal":35000}]') INTO v;
UPDATE ventas SET fecha='2026-05-19', estado='pagado' WHERE id=v;

-- 2026-05-22 | Sharick Alfaro | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c26,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-05-22', estado='pagado' WHERE id=v;

-- 2026-05-24 | Enaldo Avila | Café Molido Clasico 500g ×1 | desc 5.000 | $38.000 | Pendiente
SELECT registrar_venta(c27,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":5000,"subtotal":38000}]') INTO v;
UPDATE ventas SET fecha='2026-05-24', estado='pendiente' WHERE id=v;

-- 2026-06-02 | Wilson Vega | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c10,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-06-02', estado='pagado' WHERE id=v;

-- 2026-06-04 | Jorge | Café Molido Clasico 250g ×2 | desc 5.000/ud | $50.000 | Pagado
SELECT registrar_venta(c21,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":2,"precio_unitario":30000,"descuento":5000,"subtotal":50000}]') INTO v;
UPDATE ventas SET fecha='2026-06-04', estado='pagado' WHERE id=v;

-- 2026-06-08 | Yenilsa | Café Molido Clasico 500g ×1 | desc 13.000 | $30.000 | Pagado
SELECT registrar_venta(c22,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":13000,"subtotal":30000}]') INTO v;
UPDATE ventas SET fecha='2026-06-08', estado='pagado' WHERE id=v;

-- 2026-06-20 | Dayanis Herrera | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c2,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-06-20', estado='pagado' WHERE id=v;

-- 2026-06-21 | Cristian Ortiz | Café en Grano Clasico 500g ×1 | desc 8.000 | $35.000 | Pendiente
SELECT registrar_venta(c3,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":8000,"subtotal":35000}]') INTO v;
UPDATE ventas SET fecha='2026-06-21', estado='pendiente' WHERE id=v;

-- 2026-06-22 | Cristian Morales | Café Molido Honey 500g ×1 | desc 0 | $47.000 | Pagado
SELECT registrar_venta(c5,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000006","cantidad":1,"precio_unitario":47000,"descuento":0,"subtotal":47000}]') INTO v;
UPDATE ventas SET fecha='2026-06-22', estado='pagado' WHERE id=v;

-- 2026-06-29 | Gustavo (Barbero) | Café en Grano Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c23,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000004","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-06-29', estado='pagado' WHERE id=v;

-- 2026-06-29 | Jiseth Romero | Café Molido Honey 250g ×1 | desc 1.000 | $33.000 | Pendiente
SELECT registrar_venta(c28,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000005","cantidad":1,"precio_unitario":34000,"descuento":1000,"subtotal":33000}]') INTO v;
UPDATE ventas SET fecha='2026-06-29', estado='pendiente' WHERE id=v;

-- 2026-07-01 | Amparo Trocha | Café Molido Clasico 500g ×1 | desc 3.000 | $40.000 | Pagado
SELECT registrar_venta(c1,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000002","cantidad":1,"precio_unitario":43000,"descuento":3000,"subtotal":40000}]') INTO v;
UPDATE ventas SET fecha='2026-07-01', estado='pagado' WHERE id=v;

-- 2026-07-16 | Maria Vertel | Café Molido Clasico 250g ×1 | desc 5.000 | $25.000 | Pagado
SELECT registrar_venta(c16,'no_especificado','[{"producto_id":"a0000000-cafe-0000-0000-000000000001","cantidad":1,"precio_unitario":30000,"descuento":5000,"subtotal":25000}]') INTO v;
UPDATE ventas SET fecha='2026-07-16', estado='pagado' WHERE id=v;

END $$;

-- ─── Verificación ─────────────────────────────────────────
SELECT
  COUNT(*) AS total_ventas,
  SUM(total) AS total_cop
FROM ventas;
-- Esperado: 52 ventas, $1.945.000
