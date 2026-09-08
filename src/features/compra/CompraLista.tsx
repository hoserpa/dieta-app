import { CompraItem } from './CompraItem'
import type { ProductoCompra } from '@/types/dominio'

interface Props {
  productos: ProductoCompra[]
  onToggle: (id: string) => void
}

export function CompraLista({ productos, onToggle }: Props) {
  const porCategoria = new Map<string, ProductoCompra[]>()
  for (const producto of productos) {
    const cat = producto.categoria ?? 'Otros'
    const lista = porCategoria.get(cat) ?? []
    lista.push(producto)
    porCategoria.set(cat, lista)
  }

  return (
    <div className="flex flex-col gap-6">
      {[...porCategoria.entries()].map(([categoria, items]) => (
        <section key={categoria}>
          <h3 className="mb-2 border-b border-[var(--color-ink)] pb-1 font-mono text-xs uppercase tracking-widest text-[var(--color-ink)]">
            {categoria}
          </h3>
          <ul>
            {items.map((producto) => (
              <CompraItem
                key={producto.id}
                producto={producto}
                onToggle={() => onToggle(producto.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
