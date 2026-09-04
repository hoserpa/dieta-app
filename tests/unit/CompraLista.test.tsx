import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompraLista } from '@/features/compra/CompraLista'
import type { ProductoCompra } from '@/types/dominio'

const PRODUCTOS: ProductoCompra[] = [
  { id: 'p1', nombre: 'Pollo', cantidad: '1 kg', orden: 1, checked: false, categoria: 'Proteínas' },
  { id: 'p2', nombre: 'Ternera', cantidad: '500 g', orden: 2, checked: true, categoria: 'Proteínas' },
  { id: 'p3', nombre: 'Arroz', cantidad: '500 g', orden: 1, checked: false, categoria: 'Cereales' },
]

describe('CompraLista', () => {
  it('agrupa productos por categoría', () => {
    render(<CompraLista productos={PRODUCTOS} onToggle={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Proteínas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cereales' })).toBeInTheDocument()
  })

  it('muestra todos los productos', () => {
    render(<CompraLista productos={PRODUCTOS} onToggle={() => {}} />)
    expect(screen.getByText('Pollo')).toBeInTheDocument()
    expect(screen.getByText('Ternera')).toBeInTheDocument()
    expect(screen.getByText('Arroz')).toBeInTheDocument()
  })

  it('llama a onToggle con el id correcto', async () => {
    const onToggle = vi.fn()
    render(<CompraLista productos={PRODUCTOS} onToggle={onToggle} />)
    const checkboxes = screen.getAllByRole('checkbox')
    await checkboxes[0].click()
    expect(onToggle).toHaveBeenCalledWith('p1')
  })

  it('renderiza "Otros" para productos sin categoría', () => {
    const sinCategoria: ProductoCompra[] = [
      { id: 'p4', nombre: 'Café', orden: 1, checked: false },
    ]
    render(<CompraLista productos={sinCategoria} onToggle={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Otros' })).toBeInTheDocument()
  })
})
