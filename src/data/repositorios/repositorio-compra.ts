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

async function siguienteOrden(categoria?: string): Promise<number> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('item_order')
    .eq('category', categoria ?? null)
    .order('item_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.item_order ?? 0) + 1
}

export async function agregarProducto(datos: {
  nombre: string
  categoria?: string
}): Promise<ProductoCompra> {
  const orden = await siguienteOrden(datos.categoria)

  const { data, error } = await supabase
    .from('shopping_items')
    .insert({
      name: datos.nombre,
      category: datos.categoria ?? null,
      item_order: orden,
      checked: false,
    })
    .select()
    .single()

  if (error) throw error
  return mapearProducto(data)
}

export async function eliminarProducto(id: string): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleChecked(id: string, checked: boolean): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .update({ checked })
    .eq('id', id)

  if (error) throw error
}
