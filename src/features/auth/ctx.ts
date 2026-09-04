import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface EstadoAuth {
  sesion: Session | null
  cargando: boolean
}

export const ContextoAuth = createContext<EstadoAuth>({ sesion: null, cargando: true })
