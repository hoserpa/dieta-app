import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormularioProducto } from '@/features/compra/FormularioProducto'

describe('FormularioProducto', () => {
  it('envía el nombre al enviar el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<FormularioProducto onSubmit={onSubmit} onCancel={() => {}} />)

    await user.type(screen.getByLabelText('Producto nuevo'), 'Leche')
    await user.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(onSubmit).toHaveBeenCalledWith('Leche')
  })

  it('envía el nombre al pulsar Enter', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<FormularioProducto onSubmit={onSubmit} onCancel={() => {}} />)

    await user.type(screen.getByLabelText('Producto nuevo'), 'Pan{Enter}')

    expect(onSubmit).toHaveBeenCalledWith('Pan')
  })

  it('no envía nombres vacíos', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<FormularioProducto onSubmit={onSubmit} onCancel={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('llama a onCancel al pulsar Cancelar', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<FormularioProducto onSubmit={() => {}} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('llama a onCancel al pulsar Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<FormularioProducto onSubmit={() => {}} onCancel={onCancel} />)

    await user.type(screen.getByLabelText('Producto nuevo'), '{Escape}')

    expect(onCancel).toHaveBeenCalledOnce()
  })
})