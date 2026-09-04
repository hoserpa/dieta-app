import { useEffect, useState } from 'react'
import type { DiaDieta } from '@/types/dominio'
import { obtenerDiasDieta } from '@/data/repositorios/repositorio-dieta'

type EstadoDieta =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'exito'; dias: DiaDieta[] }

export function useDieta() {
  const [estado, setEstado] = useState<EstadoDieta>({ estado: 'cargando' })

  useEffect(() => {
    let cancelado = false

    obtenerDiasDieta()
      .then((dias) => {
        if (!cancelado) setEstado({ estado: 'exito', dias })
      })
      .catch(() => {
        if (!cancelado) {
          setEstado({
            estado: 'error',
            mensaje:
              'No se han podido cargar los datos. Comprueba tu conexión e inténtalo de nuevo.',
          })
        }
      })

    return () => {
      cancelado = true
    }
  }, [])

  return estado
}
