import { supabase } from '@/lib/supabase'
import type {
  DiaDieta,
  Comida,
  Alimento,
  FilaDiaDieta,
  FilaComida,
  FilaAlimentoComida,
} from '@/types/dominio'

function mapearAlimento(fila: FilaAlimentoComida): Alimento {
  return {
    nombre: fila.name,
    cantidadP1: fila.quantity_p1 ?? undefined,
    cantidadP2: fila.quantity_p2 ?? undefined,
  }
}

function mapearComida(fila: FilaComida, alimentos: Alimento[]): Comida {
  return {
    id: fila.id,
    tipo: fila.meal_type,
    nombre: fila.name,
    items: alimentos,
    notas: fila.notes ?? undefined,
  }
}

function mapearDia(
  fila: FilaDiaDieta,
  comidas: Comida[],
): DiaDieta {
  return {
    id: fila.id,
    orden: fila.day_order,
    etiqueta: fila.label ?? undefined,
    comidas,
  }
}

export async function obtenerDiasDieta(): Promise<DiaDieta[]> {
  const { data: filasDias, error: errDias } = await supabase
    .from('diet_days')
    .select('*')
    .order('day_order')

  if (errDias) throw errDias
  if (!filasDias?.length) return []

  const { data: filasComidas, error: errComidas } = await supabase
    .from('meals')
    .select('*')
    .order('meal_order')

  if (errComidas) throw errComidas

  const { data: filasAlimentos, error: errAlimentos } = await supabase
    .from('meal_items')
    .select('*')
    .order('item_order')

  if (errAlimentos) throw errAlimentos

  const alimentosPorComida = new Map<string, Alimento[]>()
  for (const fila of filasAlimentos ?? []) {
    const lista = alimentosPorComida.get(fila.meal_id) ?? []
    lista.push(mapearAlimento(fila))
    alimentosPorComida.set(fila.meal_id, lista)
  }

  const comidasPorDia = new Map<string, Comida[]>()
  for (const fila of filasComidas ?? []) {
    const lista = comidasPorDia.get(fila.diet_day_id) ?? []
    lista.push(mapearComida(fila, alimentosPorComida.get(fila.id) ?? []))
    comidasPorDia.set(fila.diet_day_id, lista)
  }

  return (filasDias ?? []).map((fila) =>
    mapearDia(fila, comidasPorDia.get(fila.id) ?? []),
  )
}