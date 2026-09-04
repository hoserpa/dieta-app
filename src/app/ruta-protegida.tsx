import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth/uso-auth'

export function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { sesion, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)]">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-neutral-500)]">
          Cargando…
        </p>
      </div>
    )
  }

  if (!sesion) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
