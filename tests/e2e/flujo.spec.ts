import { test, expect } from '@playwright/test'
import { mockearSupabase, sembrarSesion } from './mocks'

test.beforeEach(async ({ page }) => {
  await mockearSupabase(page)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
})

test.describe('Flujo completo (con mocks)', () => {
  test('login → dieta → compra → marcar producto', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dieta & Compra' })).toBeVisible()

    await page.getByLabel('Email').fill('usuario@test.com')
    await page.getByLabel('Contraseña').fill('contraseña')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible({ timeout: 10_000 })

    const primerBoton = page.getByRole('button', { name: 'L' })
    await expect(primerBoton).toBeVisible()
    await primerBoton.click()
    await expect(primerBoton).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText('Pan Integral')).toBeVisible()

    await page.getByRole('link', { name: 'Compra' }).click()
    await expect(page.getByRole('heading', { name: 'Compra' })).toBeVisible()
    await expect(page.getByText('Pollo')).toBeVisible()

    const checkbox = page.getByRole('checkbox').first()
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  })

  test('login con credenciales incorrectas muestra error', async ({ page }) => {
    await mockearSupabase(page, { loginFallara: true })
    await page.reload({ waitUntil: 'domcontentloaded' })

    await page.getByLabel('Email').fill('noexiste@fake.com')
    await page.getByLabel('Contraseña').fill('contraseña_mala')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 })
  })

  test('recarga mantiene la sesión', async ({ page }) => {
    await sembrarSesion(page)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible({ timeout: 10_000 })
  })

  test('logout vuelve al login', async ({ page }) => {
    await sembrarSesion(page)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expect(page).toHaveURL(/login/)
  })

  test('añade y elimina un producto en compra', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@test.com')
    await page.getByLabel('Contraseña').fill('contraseña')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('heading', { name: 'Dieta' })).toBeVisible({ timeout: 10_000 })
    await page.getByRole('link', { name: 'Compra' }).click()
    await expect(page.getByRole('heading', { name: 'Compra' })).toBeVisible()

    await page.getByRole('button', { name: 'Añadir producto' }).click()
    await page.getByLabel('Producto nuevo').fill('Leche')
    await page.getByRole('button', { name: 'Añadir', exact: true }).click()

    await expect(page.getByText('Leche')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: 'Eliminar Leche' }).click()
    await expect(page.getByText('Leche')).not.toBeVisible()
  })
})