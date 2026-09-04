import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth/uso-auth'
import { EstadoCargando } from '@/components/EstadoCargando'

export function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { sesion, cargando } = useAuth()

  if (cargando) return <EstadoCargando />

  if (!sesion) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
