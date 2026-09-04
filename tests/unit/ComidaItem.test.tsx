import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComidaItem } from '@/features/dieta/ComidaItem'

describe('ComidaItem', () => {
  it('muestra el nombre del alimento', () => {
    render(
      <ul>
        <ComidaItem alimento={{ nombre: 'Pan Integral', cantidadP1: '60 g', cantidadP2: '100 g' }} />
      </ul>,
    )
    expect(screen.getByText('Pan Integral')).toBeInTheDocument()
  })

  it('muestra ambas cantidades', () => {
    render(
      <ul>
        <ComidaItem alimento={{ nombre: 'Huevos', cantidadP1: '2', cantidadP2: '3' }} />
      </ul>,
    )
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('maneja cantidades undefined', () => {
    render(
      <ul>
        <ComidaItem alimento={{ nombre: 'Sal' }} />
      </ul>,
    )
    expect(screen.getByText('Sal')).toBeInTheDocument()
  })
})
