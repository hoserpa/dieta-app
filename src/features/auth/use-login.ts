import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'

export function useLogin() {
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function login(email: string, contrasena: string) {
    setError(null)
    setCargando(true)

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password: contrasena,
    })

    setCargando(false)

    if (err) {
      setError('No se ha podido iniciar sesión. Comprueba tus credenciales.')
      return
    }

    navigate('/app/dieta', { replace: true })
  }

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return { login, logout, error, cargando }
}
