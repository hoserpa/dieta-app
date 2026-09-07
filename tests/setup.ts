import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Evitar crear un cliente real de Supabase en tests unitarios
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
        error: null,
      }),
    },
  },
}))
