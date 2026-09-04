import { useQuery } from '@tanstack/react-query'
import { obtenerDiasDieta } from '@/data/repositorios/repositorio-dieta'

const CLAVE_DIETA = ['dieta', 'dias'] as const

// La dieta es inmutable desde la app → cache indefinido
const STALE_TIME_DIETA = Infinity

export function useDieta() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: CLAVE_DIETA,
    queryFn: obtenerDiasDieta,
    staleTime: STALE_TIME_DIETA,
  })

  const dias = data ?? []

  const mensajeError =
    error instanceof Error
      ? error.message
      : 'No se han podido cargar los datos. Comprueba tu conexión e inténtalo de nuevo.'

  return { dias, isLoading, isError, mensajeError, reintentar: refetch }
}
