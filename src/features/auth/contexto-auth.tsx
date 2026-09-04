import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ContextoAuth } from './ctx'

export function ProveedorAuth({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session)
      setCargando(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <ContextoAuth.Provider value={{ sesion, cargando }}>{children}</ContextoAuth.Provider>
}
