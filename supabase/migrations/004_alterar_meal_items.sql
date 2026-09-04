-- ── Fase 5: Cantidades por persona ───────────────────────────────
-- Ejecutar después de 002_datos_dieta.sql

-- Añadir columnas para cantidades de cada persona
ALTER TABLE public.meal_items
  ADD COLUMN quantity_p1 text,
  ADD COLUMN quantity_p2 text;

-- Migrar datos existentes (persona_2 era la que importábamos)
UPDATE public.meal_items SET quantity_p2 = quantity;

-- Eliminar columnas obsoletas
ALTER TABLE public.meal_items
  DROP COLUMN quantity,
  DROP COLUMN unit;
