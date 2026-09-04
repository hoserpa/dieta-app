import type { Comida as ComidaModelo } from '@/types/dominio'
import { ComidaItem } from './ComidaItem'

interface Props {
  comida: ComidaModelo
}

const ETIQUETAS_TIPO: Record<string, string> = {
  desayuno: 'Desayuno',
  media_manana: 'Media mañana',
  comida: 'Comida',
  merienda: 'Merienda',
  cena: 'Cena',
  otro: 'Otro',
}

export function ComidaCard({ comida }: Props) {
  const titulo = ETIQUETAS_TIPO[comida.tipo] ?? comida.nombre

  const esTextoLibre =
    comida.items.length === 1 &&
    comida.items[0].cantidadP1 !== undefined &&
    !/^\d+(\s*\w+)?$/.test(comida.items[0].cantidadP1)

  return (
    <section className="border border-[var(--color-ink)] bg-[var(--color-paper)] p-4">
      <h3 className="mb-3 border-b border-[var(--color-ink)] pb-2 font-serif text-lg text-[var(--color-ink)]">
        {titulo}
      </h3>

      {comida.notas && (
        <p className="mb-3 font-body text-xs italic text-[var(--color-neutral-500)]">
          {comida.notas}
        </p>
      )}

      {esTextoLibre ? (
        <div className="space-y-2">
          {comida.items[0].cantidadP1 && (
            <p className="font-body text-sm text-[var(--color-ink)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">P1: </span>
              {comida.items[0].cantidadP1}
            </p>
          )}
          {comida.items[0].cantidadP2 && (
            <p className="font-body text-sm text-[var(--color-ink)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">P2: </span>
              {comida.items[0].cantidadP2}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-2 flex justify-end gap-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-neutral-500)]">
            <span className="w-16 text-right">P1</span>
            <span className="w-16 text-right">P2</span>
          </div>
          <ul className="divide-y divide-[var(--color-muted)]">
            {comida.items.map((alimento, i) => (
              <ComidaItem key={i} alimento={alimento} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}