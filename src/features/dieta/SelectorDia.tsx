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
      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center border border-[var(--color-ink)] font-mono text-xs uppercase tracking-widest transition-colors ${
        seleccionado
          ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
          : 'bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-muted)]'
      }`}
    >
      {etiqueta}
    </button>
  )
}
