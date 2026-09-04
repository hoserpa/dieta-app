import { describe, it, expect } from 'vitest'
import { mapearAlimento, mapearComida, mapearDia } from '@/data/repositorios/repositorio-dieta'
import type { FilaAlimentoComida, FilaComida, FilaDiaDieta } from '@/types/dominio'

describe('mapearAlimento', () => {
  it('mapea una fila completa', () => {
    const fila: FilaAlimentoComida = {
      id: 'a1',
      meal_id: 'm1',
      item_order: 1,
      name: 'Pan Integral',
      quantity_p1: '60 g',
      quantity_p2: '100 g',
    }
    expect(mapearAlimento(fila)).toEqual({
      nombre: 'Pan Integral',
      cantidadP1: '60 g',
      cantidadP2: '100 g',
    })
  })

  it('convierte nulls a undefined', () => {
    const fila: FilaAlimentoComida = {
      id: 'a2',
      meal_id: 'm1',
      item_order: 2,
      name: 'Huevos',
      quantity_p1: null,
      quantity_p2: null,
    }
    expect(mapearAlimento(fila)).toEqual({
      nombre: 'Huevos',
      cantidadP1: undefined,
      cantidadP2: undefined,
    })
  })

  it('maneja solo quantity_p1', () => {
    const fila: FilaAlimentoComida = {
      id: 'a3',
      meal_id: 'm1',
      item_order: 3,
      name: 'Leche',
      quantity_p1: '200 ml',
      quantity_p2: null,
    }
    expect(mapearAlimento(fila)).toEqual({
      nombre: 'Leche',
      cantidadP1: '200 ml',
      cantidadP2: undefined,
    })
  })
})

describe('mapearComida', () => {
  it('mapea una comida con items', () => {
    const fila: FilaComida = {
      id: 'c1',
      diet_day_id: 'd1',
      meal_order: 1,
      meal_type: 'desayuno',
      name: 'Tostadas + huevos + fruta',
      notes: null,
    }
    const items = [{ nombre: 'Pan', cantidadP1: '60 g', cantidadP2: '100 g' }]
    expect(mapearComida(fila, items)).toEqual({
      id: 'c1',
      tipo: 'desayuno',
      nombre: 'Tostadas + huevos + fruta',
      items,
      notas: undefined,
    })
  })

  it('preserva las notas cuando existen', () => {
    const fila: FilaComida = {
      id: 'c2',
      diet_day_id: 'd1',
      meal_order: 2,
      meal_type: 'comida',
      name: 'Pasta bolognesa',
      notes: 'Cocinar al dente',
    }
    expect(mapearComida(fila, [])).toEqual(
      expect.objectContaining({ notas: 'Cocinar al dente' }),
    )
  })
})

describe('mapearDia', () => {
  it('mapea un día con su etiqueta', () => {
    const fila: FilaDiaDieta = {
      id: 'd1',
      diet_id: 'diag1',
      day_order: 1,
      date: null,
      label: 'Lunes',
    }
    const comidas = [{ id: 'c1', tipo: 'desayuno' as const, nombre: 'Desayuno', items: [] }]
    expect(mapearDia(fila, comidas)).toEqual({
      id: 'd1',
      orden: 1,
      etiqueta: 'Lunes',
      comidas,
    })
  })

  it('convierte label null a undefined', () => {
    const fila: FilaDiaDieta = {
      id: 'd2',
      diet_id: 'diag1',
      day_order: 2,
      date: null,
      label: null,
    }
    expect(mapearDia(fila, [])).toEqual(
      expect.objectContaining({ etiqueta: undefined }),
    )
  })
})
