import { useCompra } from './use-compra'
import { CompraLista } from './CompraLista'
import { EstadoCargando } from '@/components/EstadoCargando'
import { EstadoError } from '@/components/EstadoError'

export function PantallaCompra() {
  const { productos, isLoading, isError, mensajeError, alternarChecked, reintentar } =
    useCompra()

  if (isLoading) return <EstadoCargando />

  if (isError) {
    return <EstadoError mensaje={mensajeError} onReintentar={() => { void reintentar() }} />
  }

  if (!productos.length) {
    return (
      <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-neutral-500)]">
        No hay productos en la lista.
      </p>
    )
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-[var(--color-ink)]">Compra</h2>
      <CompraLista productos={productos} onToggle={alternarChecked} />
    </div>
  )
}
