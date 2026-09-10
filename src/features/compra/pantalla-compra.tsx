import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCompra } from './use-compra'
import { CompraLista } from './CompraLista'
import { FormularioProducto } from './FormularioProducto'
import { EstadoCargando } from '@/components/EstadoCargando'
import { EstadoError } from '@/components/EstadoError'

export function PantallaCompra() {
  const { productos, isLoading, isError, mensajeError, alternarChecked, agregar, eliminar, reintentar } =
    useCompra()
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)

  if (isLoading) return <EstadoCargando />

  if (isError) {
    return <EstadoError mensaje={mensajeError} onReintentar={() => { void reintentar() }} />
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-[var(--color-ink)]">Compra</h2>

      {mostrandoFormulario && (
        <FormularioProducto
          onSubmit={(nombre) => {
            agregar({ nombre })
            setMostrandoFormulario(false)
          }}
          onCancel={() => setMostrandoFormulario(false)}
        />
      )}

      {productos.length ? (
        <CompraLista productos={productos} onToggle={alternarChecked} onEliminar={eliminar} />
      ) : (
        <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">
          No hay productos en la lista.
        </p>
      )}

      <button
        type="button"
        onClick={() => setMostrandoFormulario((v) => !v)}
        aria-label="Añadir producto"
        className="focus-ring fixed bottom-24 right-6 z-10 flex h-12 w-12 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] transition-colors hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}