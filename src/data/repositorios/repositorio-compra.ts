import { supabase } from '@/lib/supabase'
import type { ProductoCompra, FilaProductoCompra } from '@/types/dominio'

export function mapearProducto(fila: FilaProductoCompra): ProductoCompra {
  return {
    id: fila.id,
    nombre: fila.name,
    cantidad: fila.quantity ?? undefined,
    unidad: fila.unit ?? undefined,
    categoria: fila.category ?? undefined,
    orden: fila.item_order,
    checked: fila.checked,
  }
}

export async function obtenerProductosCompra(): Promise<ProductoCompra[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .order('category')
    .order('item_order')

  if (error) throw error
  return (data ?? []).map(mapearProducto)
}

export async function toggleChecked(id: string, checked: boolean): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .update({ checked })
    .eq('id', id)

  if (error) throw error
}
