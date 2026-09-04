import { describe, it, expect } from 'vitest'
import { mapearProducto } from '@/data/repositorios/repositorio-compra'
import type { FilaProductoCompra } from '@/types/dominio'

describe('mapearProducto', () => {
  it('mapea una fila completa', () => {
    const fila: FilaProductoCompra = {
      id: 'p1',
      name: 'Pollo',
      quantity: '1.3-1.5 kg',
      unit: null,
      category: 'Proteínas',
      item_order: 1,
      checked: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }
    expect(mapearProducto(fila)).toEqual({
      id: 'p1',
      nombre: 'Pollo',
      cantidad: '1.3-1.5 kg',
      unidad: undefined,
      categoria: 'Proteínas',
      orden: 1,
      checked: false,
    })
  })

  it('convierte nulls a undefined', () => {
    const fila: FilaProductoCompra = {
      id: 'p2',
      name: 'Huevos',
      quantity: null,
      unit: null,
      category: null,
      item_order: 2,
      checked: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }
    expect(mapearProducto(fila)).toEqual({
      id: 'p2',
      nombre: 'Huevos',
      cantidad: undefined,
      unidad: undefined,
      categoria: undefined,
      orden: 2,
      checked: true,
    })
  })

  it('preserva el estado checked', () => {
    const fila: FilaProductoCompra = {
      id: 'p3',
      name: 'Arroz',
      quantity: '500 g',
      unit: null,
      category: 'Cereales',
      item_order: 3,
      checked: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }
    expect(mapearProducto(fila).checked).toBe(true)
  })
})
