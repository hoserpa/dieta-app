import { test, expect, Page } from '@playwright/test'
import { mockearSupabase } from './mocks'

async function capturarDiagnostico(page: Page, errores: string[]) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') errores.push(`console.error: ${msg.text()}`)
  })
  page.on('pageerror', (err) => errores.push(`pageerror: ${err.message}`))
  page.on('requestfailed', (req) =>
    errores.push(`requestfailed: ${req.method()} ${req.url()} :: ${req.failure()?.errorText}`),
  )
}

test('carga la página de login', async ({ page }) => {
  const errores: string[] = []
  await capturarDiagnostico(page, errores)
  await mockearSupabase(page)

  const resp = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15_000 })
  expect(resp?.status(), `status != 200. Errores: ${errores.join(' | ')}`).toBe(200)

  try {
    await expect(page.getByRole('heading', { name: 'Dieta & Compra' })).toBeVisible({ timeout: 10_000 })
  } catch (e) {
    const body = await page.evaluate(() => document.body.innerText.slice(0, 500))
    throw new Error(
      `Login no visible. body="${body}" | errores=${errores.join(' || ')} | URL=${page.url()}`,
    )
  }
})
