import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

export const supabase = createClient(url, clave)
