import { useState } from 'react'
import { useDieta } from './use-dieta'
import { SelectorDia } from './SelectorDia'
import { ComidaCard } from './ComidaCard'
import { EstadoCargando } from '@/components/EstadoCargando'
import { EstadoError } from '@/components/EstadoError'

const ABREVIATURAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const

function indiceDiaActual(): number {
  return (new Date().getDay() + 6) % 7
}

export function PantallaDieta() {
  const { estado, reintentar } = useDieta()
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(indiceDiaActual)

  if (estado.estado === 'cargando') return <EstadoCargando />

  if (estado.estado === 'error') {
    return <EstadoError mensaje={estado.mensaje} onReintentar={reintentar} />
  }

  const { dias } = estado

  if (!dias.length) {
    return (
      <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">
        No hay comidas para este día.
      </p>
    )
  }

  const indice = Math.min(indiceSeleccionado, dias.length - 1)
  const dia = dias[indice]

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {dias.map((d, i) => (
          <SelectorDia
            key={d.id}
            etiqueta={ABREVIATURAS[i] ?? String(i + 1)}
            seleccionado={i === indice}
            onSelect={() => setIndiceSeleccionado(i)}
          />
        ))}
      </div>

      <h2 className="mb-4 font-serif text-2xl text-[var(--color-ink)]">
        {dia.etiqueta ?? `Día ${dia.orden}`}
      </h2>

      <div className="flex flex-col gap-4">
        {dia.comidas.map((comida) => (
          <ComidaCard key={comida.id} comida={comida} />
        ))}
      </div>
    </div>
  )
}
