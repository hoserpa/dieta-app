import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../src/App'

describe('App', () => {
  it('renderiza sin errores', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
  })

  it('muestra estado de carga inicialmente', () => {
    render(<App />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
