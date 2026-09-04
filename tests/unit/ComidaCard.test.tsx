import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComidaCard } from '@/features/dieta/ComidaCard'
import type { Comida } from '@/types/dominio'

function makeComida(overrides: Partial<Comida> = {}): Comida {
  return {
    id: 'c1',
    tipo: 'desayuno',
    nombre: 'Tostadas + huevos',
    items: [],
    ...overrides,
  }
}

describe('ComidaCard', () => {
  it('muestra el título traducido del tipo', () => {
    const comida = makeComida({ tipo: 'desayuno' })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByRole('heading', { name: 'Desayuno' })).toBeInTheDocument()
  })

  it('muestra "Otro" cuando el tipo es "otro"', () => {
    const comida = makeComida({ tipo: 'otro', nombre: 'Plato especial' })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByRole('heading', { name: 'Otro' })).toBeInTheDocument()
  })

  it('muestra las notas cuando existen', () => {
    const comida = makeComida({ notas: 'Cocinar al dente' })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByText('Cocinar al dente')).toBeInTheDocument()
  })

  it('renderiza items en modo tabla', () => {
    const comida = makeComida({
      items: [
        { nombre: 'Pan Integral', cantidadP1: '60 g', cantidadP2: '100 g' },
        { nombre: 'Huevos', cantidadP1: '2', cantidadP2: '3' },
      ],
    })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByText('Pan Integral')).toBeInTheDocument()
    expect(screen.getByText('Huevos')).toBeInTheDocument()
    expect(screen.getByText('60 g')).toBeInTheDocument()
    expect(screen.getByText('100 g')).toBeInTheDocument()
  })

  it('muestra headers P1 y P2 en modo tabla', () => {
    const comida = makeComida({
      items: [{ nombre: 'Pan', cantidadP1: '60 g', cantidadP2: '100 g' }],
    })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText('P2')).toBeInTheDocument()
  })

  it('detecta texto libre y muestra P1/P2 como párrafos', () => {
    const comida = makeComida({
      items: [
        {
          nombre: 'Comida fuera',
          cantidadP1: 'Racion normal; ejemplos: pollo + patatas',
          cantidadP2: 'Misma eleccion, con una racion extra',
        },
      ],
    })
    render(<ComidaCard comida={comida} />)
    expect(screen.getByText(/Racion normal/)).toBeInTheDocument()
    expect(screen.getByText(/Misma eleccion/)).toBeInTheDocument()
  })
})
