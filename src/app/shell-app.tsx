import { Outlet } from 'react-router'
import { LogOut } from 'lucide-react'
import { useLogin } from '@/features/auth/use-login'
import { BottomNav } from '@/components/BottomNav'

export function ShellApp() {
  const { logout } = useLogin()

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-paper)]">
      <header className="flex items-center justify-between border-b border-[var(--color-ink)] px-4 py-3">
        <h1 className="font-serif text-xl text-[var(--color-ink)]">Dieta &amp; Compra</h1>
        <button
          onClick={logout}
          aria-label="Cerrar sesión"
          className="focus-ring flex h-11 w-11 items-center justify-center border border-[var(--color-ink)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          <LogOut size={18} strokeWidth={1.5} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}