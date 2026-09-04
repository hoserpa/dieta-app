import { Outlet, useLocation } from 'react-router'
import { UtensilsCrossed, ShoppingCart, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import { useLogin } from '@/features/auth/use-login'

const NAV_ITEMS = [
  { to: '/app/dieta', icon: UtensilsCrossed, label: 'Dieta' },
  { to: '/app/compra', icon: ShoppingCart, label: 'Compra' },
]

export function ShellApp() {
  const { logout } = useLogin()
  const location = useLocation()

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

      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-0 right-0 flex border-t border-[var(--color-ink)] bg-[var(--color-paper)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map(({ to, icon: Icono, label }) => {
          const activo = location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              aria-current={activo ? 'page' : undefined}
              className={`focus-ring flex flex-1 flex-col items-center gap-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                activo
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                  : 'text-[var(--color-ink)] hover:bg-[var(--color-muted)]'
              }`}
            >
              <Icono size={20} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
