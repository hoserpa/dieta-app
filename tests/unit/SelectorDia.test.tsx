import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectorDia } from '@/features/dieta/SelectorDia'

describe('SelectorDia', () => {
  it('muestra la etiqueta del día', () => {
    render(<SelectorDia etiqueta="L" seleccionado={false} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'L' })).toBeInTheDocument()
  })

  it('tiene aria-pressed en false cuando no está seleccionado', () => {
    render(<SelectorDia etiqueta="M" seleccionado={false} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('tiene aria-pressed en true cuando está seleccionado', () => {
    render(<SelectorDia etiqueta="X" seleccionado={true} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'X' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('llama a onSelect al hacer clic', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SelectorDia etiqueta="J" seleccionado={false} onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: 'J' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
