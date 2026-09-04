import { useCallback, useEffect, useState } from 'react'
import type { DiaDieta } from '@/types/dominio'
import { obtenerDiasDieta } from '@/data/repositorios/repositorio-dieta'

type EstadoDieta =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'exito'; dias: DiaDieta[] }

export function useDieta() {
  const [estado, setEstado] = useState<EstadoDieta>({ estado: 'cargando' })

  const cargar = useCallback(() => {
    setEstado({ estado: 'cargando' })
    obtenerDiasDieta()
      .then((dias) => setEstado({ estado: 'exito', dias }))
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

  return { estado, reintentar: cargar }
}
