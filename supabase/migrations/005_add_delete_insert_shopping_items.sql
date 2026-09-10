-- ── Fase 5: Añadir/eliminar productos de compra ─────────────────
-- Políticas RLS para que usuarios autenticados puedan insertar y
-- eliminar productos de la lista de la compra.

create policy "Usuarios autenticados pueden crear productos"
  on public.shopping_items for insert
  with check (auth.uid() is not null);

create policy "Usuarios autenticados pueden eliminar productos"
  on public.shopping_items for delete
  using (auth.uid() is not null);