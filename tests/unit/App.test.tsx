import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../../src/App'

describe('App', () => {
  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('Dieta & Compra')).toBeInTheDocument()
  })
})
