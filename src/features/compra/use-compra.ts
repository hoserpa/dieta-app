import { useCallback, useEffect, useState } from 'react'
import type { ProductoCompra } from '@/types/dominio'
import { obtenerProductosCompra, toggleChecked } from '@/data/repositorios/repositorio-compra'

type EstadoCompra =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'exito'; productos: ProductoCompra[] }

export function useCompra() {
  const [estado, setEstado] = useState<EstadoCompra>({ estado: 'cargando' })

  const cargar = useCallback(() => {
    setEstado({ estado: 'cargando' })
    obtenerProductosCompra()
      .then((productos) => setEstado({ estado: 'exito', productos }))
      .catch(() => {
        setEstado({
          estado: 'error',
          mensaje:
            'No se han podido cargar los datos. Comprueba tu conexión e inténtalo de nuevo.',
        })
      })
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const alternarChecked = useCallback(
    async (id: string) => {
      if (estado.estado !== 'exito') return

      const anterior = estado.productos
      const producto = anterior.find((p) => p.id === id)
      if (!producto) return

      setEstado({
        estado: 'exito',
        productos: anterior.map((p) =>
          p.id === id ? { ...p, checked: !p.checked } : p,
        ),
      })

      try {
        await toggleChecked(id, !producto.checked)
      } catch {
        setEstado({ estado: 'exito', productos: anterior })
      }
    },
    [estado],
  )

  return { estado, alternarChecked, reintentar: cargar }
}
