import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { BottomNav } from '@/components/BottomNav'

function renderEn(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <BottomNav />
    </MemoryRouter>,
  )
}

describe('BottomNav', () => {
  it('muestra los enlaces Dieta y Compra', () => {
    renderEn('/app/dieta')
    expect(screen.getByRole('link', { name: 'Dieta' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Compra' })).toBeInTheDocument()
  })

  it('marca la sección activa con aria-current', () => {
    renderEn('/app/dieta')
    expect(screen.getByRole('link', { name: 'Dieta' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Compra' })).not.toHaveAttribute('aria-current')
  })

  it('marca Compra como activa al estar en /app/compra', () => {
    renderEn('/app/compra')
    expect(screen.getByRole('link', { name: 'Compra' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dieta' })).not.toHaveAttribute('aria-current')
  })

  it('navega a Compra al hacer clic', async () => {
    const usuario = userEvent.setup()
    renderEn('/app/dieta')
    await usuario.click(screen.getByRole('link', { name: 'Compra' }))
    expect(screen.getByRole('link', { name: 'Compra' })).toHaveAttribute('aria-current', 'page')
  })
})