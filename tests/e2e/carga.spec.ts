import { test, expect } from '@playwright/test'
import { mockearSupabase } from './mocks'

test('carga la página de login', async ({ page }) => {
  await mockearSupabase(page)
  const resp = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15_000 })
  expect(resp?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Dieta & Compra' })).toBeVisible({ timeout: 10_000 })
})
