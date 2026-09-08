import { test, expect } from '@playwright/test'
import { mockearSupabase, sembrarSesion } from './mocks'

test.use({ viewport: { width: 360, height: 740 } })

test('la navegación inferior es fija y visible desde 360px de ancho', async ({ page }) => {
  await mockearSupabase(page)
  await sembrarSesion(page)
  await page.goto('/#/app/dieta', { waitUntil: 'domcontentloaded' })

  const nav = page.getByRole('navigation', { name: 'Navegación principal' })
  await expect(nav).toBeVisible({ timeout: 10_000 })

  const dieta = page.getByRole('link', { name: 'Dieta' })
  const compra = page.getByRole('link', { name: 'Compra' })
  await expect(dieta).toBeVisible()
  await expect(compra).toBeVisible()
  await expect(dieta).toHaveAttribute('aria-current', 'page')

  const caja = await nav.boundingBox()
  expect(caja).not.toBeNull()
  expect(caja!.width).toBeLessThanOrEqual(360)

  const viewport = page.viewportSize()!
  expect(caja!.y + caja!.height).toBeLessThanOrEqual(viewport.height + 1)

  // La nav sigue visible tras desplazarse por el contenido de la dieta
  await page.evaluate(() => window.scrollTo(0, 800))
  await expect(compra).toBeVisible()
})

test('el seleccionador de días cabe completo a 360px de ancho', async ({ page }) => {
  await mockearSupabase(page)
  await sembrarSesion(page)
  await page.goto('/#/app/dieta', { waitUntil: 'domcontentloaded' })

  const viewport = page.viewportSize()!

  const botones = page.locator('#root button[aria-pressed]')
  await expect(botones.first()).toBeVisible({ timeout: 10_000 })

  const total = await botones.count()
  expect(total).toBeGreaterThan(1)

  for (let i = 0; i < total; i++) {
    const caja = await botones.nth(i).boundingBox()
    expect(caja).not.toBeNull()
    expect(caja!.x).toBeGreaterThanOrEqual(0)
    expect(caja!.x + caja!.width).toBeLessThanOrEqual(viewport.width + 1)
  }
})