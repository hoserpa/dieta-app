import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLogin } from './use-login'

export function PantallaLogin() {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const { login, error, cargando } = useLogin()

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    login(email, contrasena)
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-paper)] px-4">
      <form
        onSubmit={manejarEnvio}
        className="w-full max-w-sm border border-[var(--color-ink)] bg-[var(--color-paper)] p-8"
      >
        <h1 className="mb-8 text-center font-serif text-3xl text-[var(--color-ink)]">
          Dieta &amp; Compra
        </h1>

        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--color-ink)]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="focus-ring mb-4 w-full border-b-2 border-[var(--color-ink)] bg-transparent px-3 py-2 font-mono text-sm text-[var(--color-ink)]"
        />

        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--color-ink)]">
          Contraseña
        </label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          autoComplete="current-password"
          className="focus-ring mb-6 w-full border-b-2 border-[var(--color-ink)] bg-transparent px-3 py-2 font-mono text-sm text-[var(--color-ink)]"
        />

        {error && (
          <p role="alert" className="mb-4 text-sm text-[var(--color-accent)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="focus-ring min-h-[44px] w-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-widest text-[var(--color-paper)] transition-colors hover:bg-transparent hover:text-[var(--color-ink)] disabled:opacity-50"
        >
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
