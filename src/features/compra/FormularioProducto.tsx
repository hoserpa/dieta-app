import { useRef } from 'react'

interface Props {
  onSubmit: (nombre: string) => void
  onCancel: () => void
}

export function FormularioProducto({ onSubmit, onCancel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nombre = inputRef.current?.value.trim() ?? ''
    if (!nombre) return
    onSubmit(nombre)
  }

  return (
    <form
      onSubmit={enviar}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
      className="mb-6 border-b border-[var(--color-muted)] pb-4"
    >
      <label htmlFor="nombre-producto" className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--color-ink)]">
        Producto nuevo
      </label>
      <input
        id="nombre-producto"
        ref={inputRef}
        type="text"
        autoFocus
        placeholder="Ej. Leche"
        className="focus-ring mb-3 w-full border-b-2 border-[var(--color-ink)] bg-transparent px-3 py-2 font-body text-sm text-[var(--color-ink)]"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="focus-ring min-h-[44px] flex-1 border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-paper)] transition-colors hover:bg-transparent hover:text-[var(--color-ink)]"
        >
          Añadir
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring min-h-[44px] flex-1 border border-[var(--color-ink)] bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-[var(--color-muted)]"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}