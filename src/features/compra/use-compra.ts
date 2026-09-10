import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import {
  agregarProducto,
  eliminarProducto,
  obtenerProductosCompra,
  toggleChecked,
} from '@/data/repositorios/repositorio-compra'
import type { ProductoCompra } from '@/types/dominio'

const CLAVE_COMPRA = ['compra', 'productos'] as const

// La compra se consulta con frecuencia pero puede cambiar
const STALE_TIME_COMPRA = 5 * 60 * 1000 // 5 minutos

async function cancelarYSnapshot(queryClient: QueryClient): Promise<ProductoCompra[] | undefined> {
  await queryClient.cancelQueries({ queryKey: CLAVE_COMPRA })
  return queryClient.getQueryData<ProductoCompra[]>(CLAVE_COMPRA)
}

function restaurarSnapshot(queryClient: QueryClient, anterior: ProductoCompra[] | undefined) {
  if (anterior) queryClient.setQueryData(CLAVE_COMPRA, anterior)
}

export function useCompra() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: CLAVE_COMPRA,
    queryFn: obtenerProductosCompra,
    staleTime: STALE_TIME_COMPRA,
  })

  const productos = data ?? []

  const mensajeError =
    error instanceof Error
      ? error.message
      : 'No se han podido cargar los datos. Comprueba tu conexión e inténtalo de nuevo.'

  const mutation = useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: boolean }) =>
      toggleChecked(id, checked),

    onMutate: async ({ id, checked }) => {
      const anterior = await cancelarYSnapshot(queryClient)

      queryClient.setQueryData<ProductoCompra[]>(CLAVE_COMPRA, (viejo) =>
        (viejo ?? []).map((p) => (p.id === id ? { ...p, checked } : p)),
      )

      return { anterior }
    },

    onError: (_err, _vars, contexto) => restaurarSnapshot(queryClient, contexto?.anterior),

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CLAVE_COMPRA })
    },
  })

  const mutacionAgregar = useMutation({
    mutationFn: (datos: { nombre: string; categoria?: string }) => agregarProducto(datos),

    onMutate: async (datos) => {
      const anterior = await cancelarYSnapshot(queryClient)

      queryClient.setQueryData<ProductoCompra[]>(CLAVE_COMPRA, (viejo) => {
        const actuales = viejo ?? []
        const enCategoria = actuales.filter((p) => p.categoria === datos.categoria)
        const orden = enCategoria.length
          ? Math.max(...enCategoria.map((p) => p.orden)) + 1
          : 1

        return [
          ...actuales,
          {
            id: `temporal-${Date.now()}`,
            nombre: datos.nombre,
            categoria: datos.categoria,
            orden,
            checked: false,
          },
        ]
      })

      return { anterior }
    },

    onError: (_err, _vars, contexto) => restaurarSnapshot(queryClient, contexto?.anterior),

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CLAVE_COMPRA })
    },
  })

  const mutacionEliminar = useMutation({
    mutationFn: eliminarProducto,

    onMutate: async (id: string) => {
      const anterior = await cancelarYSnapshot(queryClient)

      queryClient.setQueryData<ProductoCompra[]>(CLAVE_COMPRA, (viejo) =>
        (viejo ?? []).filter((p) => p.id !== id),
      )

      return { anterior }
    },

    onError: (_err, _vars, contexto) => restaurarSnapshot(queryClient, contexto?.anterior),

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CLAVE_COMPRA })
    },
  })

  const alternarChecked = (id: string) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return
    mutation.mutate({ id, checked: !producto.checked })
  }

  const agregar = (datos: { nombre: string; categoria?: string }) => {
    mutacionAgregar.mutate(datos)
  }

  const eliminar = (id: string) => {
    mutacionEliminar.mutate(id)
  }

  return {
    productos,
    isLoading,
    isError,
    mensajeError,
    alternarChecked,
    agregar,
    eliminar,
    reintentar: refetch,
  }
}