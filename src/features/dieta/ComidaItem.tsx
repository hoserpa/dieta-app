import type { Alimento } from '@/types/dominio'

interface Props {
  alimento: Alimento
}

export function ComidaItem({ alimento }: Props) {
  return (
    <li className="flex items-baseline border-b border-[var(--color-muted)] py-2 last:border-b-0">
      <span className="min-w-0 flex-1 truncate font-body text-sm text-[var(--color-ink)]">{alimento.nombre}</span>
      <span className="w-20 shrink-0 text-right font-mono text-xs text-[var(--color-neutral-500)]">{alimento.cantidadP1 ?? ''}</span>
      <span className="w-20 shrink-0 text-right font-mono text-xs text-[var(--color-neutral-500)]">{alimento.cantidadP2 ?? ''}</span>
    </li>
  )
}