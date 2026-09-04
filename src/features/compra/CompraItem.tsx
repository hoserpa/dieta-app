import type { ProductoCompra } from '@/types/dominio'

interface Props {
  producto: ProductoCompra
  onToggle: () => void
}

export function CompraItem({ producto, onToggle }: Props) {
  const partes = [producto.cantidad, producto.unidad].filter(Boolean).join(' ')

  return (
    <li className="flex items-center gap-3 border-b border-[var(--color-muted)] py-3 last:border-b-0">
      <input
        type="checkbox"
        checked={producto.checked}
        onChange={onToggle}
        aria-label={producto.nombre}
        className="focus-ring h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-ink)]"
      />
      <span
        className={`min-w-0 flex-1 truncate font-body text-sm ${
          producto.checked
            ? 'text-[var(--color-neutral-400)] line-through'
            : 'text-[var(--color-ink)]'
        }`}
      >
        {producto.nombre}
      </span>
      {partes && (
        <span className="shrink-0 font-mono text-xs text-[var(--color-neutral-500)]">
          {partes}
        </span>
      )}
    </li>
  )
}
