import type { Page } from '@playwright/test'

export const USUARIO = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'usuario@test.com',
  aud: 'authenticated',
  role: 'authenticated',
}

export const ACCESS_TOKEN = 'mocked-access-token'

const DIAS = [
  { id: 'a0000000-0000-0000-0000-000000000001', diet_id: 'dieta1', day_order: 1, date: null, label: 'Lunes' },
  { id: 'a0000000-0000-0000-0000-000000000002', diet_id: 'dieta1', day_order: 2, date: null, label: 'Martes' },
]

const COMIDAS = [
  { id: 'b0000000-0000-0000-0000-000000000001', diet_day_id: DIAS[0].id, meal_order: 1, meal_type: 'desayuno', name: 'Desayuno', notes: null },
  { id: 'b0000000-0000-0000-0000-000000000002', diet_day_id: DIAS[0].id, meal_order: 2, meal_type: 'comida', name: 'Comida principal', notes: 'Cocinar al dente' },
]

const ALIMENTOS = [
  { id: 'c0000000-0000-0000-0000-000000000001', meal_id: COMIDAS[0].id, item_order: 1, name: 'Pan Integral', quantity_p1: '60 g', quantity_p2: '100 g' },
  { id: 'c0000000-0000-0000-0000-000000000002', meal_id: COMIDAS[0].id, item_order: 2, name: 'Huevos', quantity_p1: '2', quantity_p2: '3' },
]

const PRODUCTOS = [
  { id: 'd0000000-0000-0000-0000-000000000001', name: 'Pollo', quantity: '1.3-1.5 kg', unit: null, category: 'Proteínas', item_order: 1, checked: false, created_at: '', updated_at: '' },
  { id: 'd0000000-0000-0000-0000-000000000002', name: 'Arroz', quantity: '500 g', unit: null, category: 'Cereales', item_order: 1, checked: false, created_at: '', updated_at: '' },
]

// Estado mutable compartido entre workers del mock para que el toggle sea persistente
const productosEnMemoria = PRODUCTOS.map((p) => ({ ...p }))

function responderPagina(route: { continue: (opts: unknown) => void; fulfill: (opts: unknown) => void }, body: unknown) {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

function responderError(route: { fulfill: (opts: unknown) => void }, mensaje: string) {
  route.fulfill({
    status: 400,
    contentType: 'application/json',
    body: JSON.stringify({ message: mensaje }),
  })
}

function sesionMock() {
  const now = Math.floor(Date.now() / 1000)
  return {
    access_token: ACCESS_TOKEN,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'refresh-token-mock',
    user: { ...USUARIO },
    provider_token: null,
    provider_refresh_token: null,
  }
}

export async function mockearSupabase(page: Page, opciones?: { loginFallara?: boolean }) {
  // Reiniciar estado mutable para que cada test arranque limpio
  productosEnMemoria.splice(0, productosEnMemoria.length, ...PRODUCTOS.map((p) => ({ ...p })))

  await page.route('**/auth/v1/token**', (ruta) => {
    if (opciones?.loginFallara) {
      responderError(ruta, 'Invalid login credentials')
      return
    }
    responderPagina(ruta, sesionMock())
  })

  await page.route('**/auth/v1/user**', (ruta) => {
    responderPagina(ruta, USUARIO)
  })

  await page.route('**/auth/v1/logout**', (ruta) => {
    responderPagina(ruta, {})
  })

  await page.route('**/rest/v1/diet_days**', (ruta) => responderPagina(ruta, DIAS))
  await page.route('**/rest/v1/meals**', (ruta) => responderPagina(ruta, COMIDAS))
  await page.route('**/rest/v1/meal_items**', (ruta) => responderPagina(ruta, ALIMENTOS))

  await page.route('**/rest/v1/shopping_items**', (ruta) => {
    const metodo = ruta.request().method()
    const url = new URL(ruta.request().url())

    if (metodo === 'PATCH') {
      const id = (url.searchParams.get('id') ?? '').replace(/^eq\./, '')
      const body = ruta.request().postData()
      let checked = false
      if (body) {
        try {
          checked = JSON.parse(body).checked ?? false
        } catch {
          checked = false
        }
      }
      const producto = productosEnMemoria.find((p) => p.id === id)
      if (producto) producto.checked = checked
      responderPagina(ruta, producto ?? [])
      return
    }

    if (metodo === 'POST') {
      const body = ruta.request().postData()
      let datos: Record<string, unknown> = {}
      if (body) {
        try {
          datos = JSON.parse(body)
        } catch {
          datos = {}
        }
      }
      const nuevo = {
        id: `e0000000-0000-0000-0000-0000000000${String(productosEnMemoria.length + 1).padStart(2, '0')}`,
        name: String(datos.name ?? ''),
        quantity: (datos.quantity ?? null) as string | null,
        unit: (datos.unit ?? null) as string | null,
        category: (datos.category ?? null) as string | null,
        item_order: Number(datos.item_order ?? 1),
        checked: Boolean(datos.checked ?? false),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      productosEnMemoria.push(nuevo)
      responderPagina(ruta, nuevo)
      return
    }

    if (metodo === 'DELETE') {
      const id = (url.searchParams.get('id') ?? '').replace(/^eq\./, '')
      const indice = productosEnMemoria.findIndex((p) => p.id === id)
      if (indice !== -1) productosEnMemoria.splice(indice, 1)
      responderPagina(ruta, {})
      return
    }

    const parametroCategoria = url.searchParams.get('category')
    const esConsultaOrden =
      (url.searchParams.get('order') ?? '').includes('item_order.desc') &&
      url.searchParams.get('limit') === '1'

    if (esConsultaOrden) {
      const categoria =
        parametroCategoria && (parametroCategoria.startsWith('eq.') || parametroCategoria.startsWith('is.'))
          ? (parametroCategoria.slice(3) === 'null' ? null : parametroCategoria.slice(3))
          : undefined
      const enCategoria =
        categoria === undefined
          ? productosEnMemoria
          : productosEnMemoria.filter((p) => (p.category ?? null) === categoria)
      const maximo = [...enCategoria].sort((a, b) => b.item_order - a.item_order)[0] ?? null
      responderPagina(ruta, maximo ? [maximo] : [])
      return
    }

    responderPagina(ruta, productosEnMemoria)
  })
}

function claveStorageAuth(): string {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://localhost.supabase.co'
  const ref = new URL(supabaseUrl).hostname.split('.')[0]
  return `sb-${ref}-auth-token`
}

export async function sembrarSesion(page: Page) {
  const now = Math.floor(Date.now() / 1000)
  await page.addInitScript(
    ([clave, token, user, expiresAt]) => {
      window.localStorage.setItem(
        clave,
        JSON.stringify({
          access_token: token,
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: expiresAt,
          refresh_token: 'refresh-token-mock',
          user,
        }),
      )
    },
    [claveStorageAuth(), ACCESS_TOKEN, USUARIO, now + 3600],
  )
}
