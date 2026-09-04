import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { obtenerProductosCompra, toggleChecked } from '@/data/repositorios/repositorio-compra'
import type { ProductoCompra } from '@/types/dominio'

const CLAVE_COMPRA = ['compra', 'productos'] as const

// La compra se consulta con frecuencia pero puede cambiar
const STALE_TIME_COMPRA = 5 * 60 * 1000 // 5 minutos

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
      // Cancelar queries en curso para evitar sobreescribir el optimista
      await queryClient.cancelQueries({ queryKey: CLAVE_COMPRA })

      // Snapshot del estado anterior para rollback
      const anterior = queryClient.getQueryData<ProductoCompra[]>(CLAVE_COMPRA)

      // Actualización optimista
      queryClient.setQueryData<ProductoCompra[]>(CLAVE_COMPRA, (viejo) =>
        (viejo ?? []).map((p) => (p.id === id ? { ...p, checked } : p)),
      )

      return { anterior }
    },

    onError: (_err, _vars, contexto) => {
      // Rollback al estado anterior
      if (contexto?.anterior) {
        queryClient.setQueryData(CLAVE_COMPRA, contexto.anterior)
      }
    },

    onSettled: () => {
      // Invalidar para sincronizar con el servidor
      void queryClient.invalidateQueries({ queryKey: CLAVE_COMPRA })
    },
  })

  const alternarChecked = (id: string) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return
    mutation.mutate({ id, checked: !producto.checked })
  }

  return {
    productos,
    isLoading,
    isError,
    mensajeError,
    alternarChecked,
    reintentar: refetch,
  }
}
