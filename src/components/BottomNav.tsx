import { Link, useLocation } from 'react-router'
import { UtensilsCrossed, ShoppingCart } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/app/dieta', icon: UtensilsCrossed, label: 'Dieta' },
  { to: '/app/compra', icon: ShoppingCart, label: 'Compra' },
]

export function BottomNav() {
  const location = useLocation()

  return (
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
  )
}