import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../src/App'

describe('App', () => {
  it('muestra el estado de carga al montar y luego la pantalla de login', async () => {
    render(<App />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await screen.findByRole('heading', { name: 'Dieta & Compra' }, { timeout: 2000 })
  })
})
