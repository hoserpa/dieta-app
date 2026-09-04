// ── Tipos de dominio ──────────────────────────────────────────────

export type TipoComida =
  | 'desayuno'
  | 'media_manana'
  | 'comida'
  | 'merienda'
  | 'cena'
  | 'otro'

export interface Alimento {
  nombre: string
  cantidadP1?: string
  cantidadP2?: string
}

export interface Comida {
  id: string
  tipo: TipoComida
  nombre: string
  items: Alimento[]
  notas?: string
}

export interface DiaDieta {
  id: string
  orden: number
  etiqueta?: string
  comidas: Comida[]
}

export interface ProductoCompra {
  id: string
  nombre: string
  cantidad?: string
  unidad?: string
  categoria?: string
  orden: number
  checked: boolean
}

// ── Tipos de filas de base de datos ──────────────────────────────

export interface FilaPerfil {
  id: string
  display_name: string | null
  created_at: string
}

export interface FilaDieta {
  id: string
  name: string
  created_at: string
}

export interface FilaDiaDieta {
  id: string
  diet_id: string
  day_order: number
  date: string | null
  label: string | null
}

export interface FilaComida {
  id: string
  diet_day_id: string
  meal_order: number
  meal_type: TipoComida
  name: string
  notes: string | null
}

export interface FilaAlimentoComida {
  id: string
  meal_id: string
  item_order: number
  name: string
  quantity_p1: string | null
  quantity_p2: string | null
}

export interface FilaProductoCompra {
  id: string
  name: string
  quantity: string | null
  unit: string | null
  category: string | null
  item_order: number
  checked: boolean
  created_at: string
  updated_at: string
}