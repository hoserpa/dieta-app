interface Props {
  etiqueta: string
  seleccionado: boolean
  onSelect: () => void
}

export function SelectorDia({ etiqueta, seleccionado, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={etiqueta}
      aria-pressed={seleccionado}
      className={`focus-ring flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--color-ink)] font-mono text-xs uppercase tracking-widest transition-colors sm:h-14 sm:w-14 ${
        seleccionado
          ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
          : 'bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-muted)]'
      }`}
    >
      {etiqueta}
    </button>
  )
}
