export function EstadoCargando() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-muted)] border-t-[var(--color-ink)]" />
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">
        Cargando…
      </p>
    </div>
  )
}
