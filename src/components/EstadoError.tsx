interface Props {
  mensaje: string
  onReintentar?: () => void
}

export function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center" role="alert">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
        {mensaje}
      </p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="focus-ring min-h-[44px] min-w-[44px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-paper)] transition-colors hover:bg-transparent hover:text-[var(--color-ink)]"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
