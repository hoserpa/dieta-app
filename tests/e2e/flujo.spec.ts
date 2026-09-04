import { test, expect } from '@playwright/test'

const EMAIL = process.env.E2E_EMAIL ?? ''
const PASSWORD = process.env.E2E_PASSWORD ?? ''

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
})

test.describe('Flujo completo', () => {
  test('login → dieta → compra → marcar producto', async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'Variables E2E_EMAIL y E2E_PASSWORD requeridas')

    await expect(page).toHaveURL(/login/)
    await expect(page.getByRole('heading', { name: 'Dieta & Compra' })).toBeVisible()

    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Contraseña').fill(PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).not.toHaveURL(/login/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible()

    const primerBoton = page.getByRole('button', { name: 'L' })
    await expect(primerBoton).toBeVisible()
    await primerBoton.click()
    await expect(primerBoton).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('link', { name: 'Compra' }).click()
    await expect(page.getByRole('heading', { name: 'Compra' })).toBeVisible()

    const checkbox = page.getByRole('checkbox').first()
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  })

  test('login con credenciales incorrectas muestra error', async ({ page }) => {
    await page.getByLabel('Email').fill('noexiste@fake.com')
    await page.getByLabel('Contraseña').fill('contraseña_mala')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 })
  })

  test('recarga mantiene la sesión', async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'Variables E2E_EMAIL y E2E_PASSWORD requeridas')

    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Contraseña').fill(PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).not.toHaveURL(/login/, { timeout: 10_000 })

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible({ timeout: 10_000 })
  })

  test('logout vuelve al login', async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'Variables E2E_EMAIL y E2E_PASSWORD requeridas')

    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Contraseña').fill(PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).not.toHaveURL(/login/, { timeout: 10_000 })

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expect(page).toHaveURL(/login/)
  })
})
