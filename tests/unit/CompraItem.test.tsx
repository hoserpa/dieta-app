import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompraItem } from '@/features/compra/CompraItem'
import type { ProductoCompra } from '@/types/dominio'

function makeProducto(overrides: Partial<ProductoCompra> = {}): ProductoCompra {
  return {
    id: 'p1',
    nombre: 'Pollo',
    cantidad: '1.3-1.5 kg',
    unidad: undefined,
    categoria: 'Proteínas',
    orden: 1,
    checked: false,
    ...overrides,
  }
}

describe('CompraItem', () => {
  it('muestra el nombre del producto', () => {
    render(<CompraItem producto={makeProducto()} onToggle={() => {}} onEliminar={() => {}} />)
    expect(screen.getByText('Pollo')).toBeInTheDocument()
  })

  it('muestra la cantidad cuando existe', () => {
    render(<CompraItem producto={makeProducto()} onToggle={() => {}} onEliminar={() => {}} />)
    expect(screen.getByText('1.3-1.5 kg')).toBeInTheDocument()
  })

  it('no muestra cantidad cuando es undefined', () => {
    render(
      <CompraItem producto={makeProducto({ cantidad: undefined })} onToggle={() => {}} onEliminar={() => {}} />,
    )
    expect(screen.queryByText('1.3-1.5 kg')).not.toBeInTheDocument()
  })

  it('el checkbox refleja el estado checked', () => {
    const { rerender } = render(
      <CompraItem producto={makeProducto({ checked: false })} onToggle={() => {}} onEliminar={() => {}} />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()

    rerender(
      <CompraItem producto={makeProducto({ checked: true })} onToggle={() => {}} onEliminar={() => {}} />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('llama a onToggle al cambiar el checkbox', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<CompraItem producto={makeProducto()} onToggle={onToggle} onEliminar={() => {}} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('tiene aria-label con el nombre del producto', () => {
    render(<CompraItem producto={makeProducto()} onToggle={() => {}} onEliminar={() => {}} />)
    expect(screen.getByRole('checkbox', { name: 'Pollo' })).toBeInTheDocument()
  })

  it('llama a onEliminar al pulsar el botón de eliminar', async () => {
    const user = userEvent.setup()
    const onEliminar = vi.fn()
    render(<CompraItem producto={makeProducto()} onToggle={() => {}} onEliminar={onEliminar} />)
    await user.click(screen.getByRole('button', { name: 'Eliminar Pollo' }))
    expect(onEliminar).toHaveBeenCalledOnce()
  })
})