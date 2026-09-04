-- ── Fase 2: Esquema inicial ───────────────────────────────────────
-- Ejecutar en el SQL Editor de Supabase.

-- ─────────────────────────────────────────────────────────────────
-- 1. Perfiles (metadata de usuario)
-- ─────────────────────────────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios autenticados ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────
-- 2. Dietas
-- ─────────────────────────────────────────────────────────────────

create table public.diets (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

alter table public.diets enable row level security;

create policy "Usuarios autenticados pueden leer dietas"
  on public.diets for select
  using (auth.uid() is not null);


-- ─────────────────────────────────────────────────────────────────
-- 3. Días de dieta
-- ─────────────────────────────────────────────────────────────────

create table public.diet_days (
  id       uuid primary key default gen_random_uuid(),
  diet_id  uuid not null references public.diets(id) on delete cascade,
  day_order integer not null,
  date     date,
  label    text,
  unique (diet_id, day_order)
);

alter table public.diet_days enable row level security;

create policy "Usuarios autenticados pueden leer días"
  on public.diet_days for select
  using (auth.uid() is not null);


-- ─────────────────────────────────────────────────────────────────
-- 4. Comidas
-- ─────────────────────────────────────────────────────────────────

create table public.meals (
  id           uuid primary key default gen_random_uuid(),
  diet_day_id  uuid not null references public.diet_days(id) on delete cascade,
  meal_order   integer not null,
  meal_type    text not null,
  name         text not null,
  notes        text,
  unique (diet_day_id, meal_order)
);

alter table public.meals enable row level security;

create policy "Usuarios autenticados pueden leer comidas"
  on public.meals for select
  using (auth.uid() is not null);


-- ─────────────────────────────────────────────────────────────────
-- 5. Alimentos de cada comida
-- ─────────────────────────────────────────────────────────────────

create table public.meal_items (
  id         uuid primary key default gen_random_uuid(),
  meal_id    uuid not null references public.meals(id) on delete cascade,
  item_order integer not null,
  name       text not null,
  quantity   text,
  unit       text,
  notes      text,
  unique (meal_id, item_order)
);

alter table public.meal_items enable row level security;

create policy "Usuarios autenticados pueden leer alimentos"
  on public.meal_items for select
  using (auth.uid() is not null);


-- ─────────────────────────────────────────────────────────────────
-- 6. Productos de la compra
-- ─────────────────────────────────────────────────────────────────

create table public.shopping_items (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  quantity   text,
  unit       text,
  category   text,
  item_order integer not null default 0,
  checked    boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shopping_items enable row level security;

create policy "Usuarios autenticados pueden leer productos"
  on public.shopping_items for select
  using (auth.uid() is not null);

create policy "Usuarios autenticados pueden actualizar checked"
  on public.shopping_items for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- ─────────────────────────────────────────────────────────────────
-- 7. Triggers
-- ─────────────────────────────────────────────────────────────────

-- Auto-actualizar updated_at en shopping_items
create or replace function public.actualizar_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_actualizar_updated_at
  before update on public.shopping_items
  for each row
  execute function public.actualizar_updated_at();

-- Auto-crear perfil cuando se registra un usuario
create or replace function public.crear_perfil_automatico()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger trigger_crear_perfil
  after insert on auth.users
  for each row
  execute function public.crear_perfil_automatico();
