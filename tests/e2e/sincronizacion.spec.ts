import { test, expect } from '@playwright/test'
import { mockearSupabase, sembrarSesion } from './mocks'

// Simula dos usuarios conectados al mismo backend compartido (estado del mock en memoria).
test('usuario A marca un producto y usuario B lo ve sincronizado', async ({ browser }) => {
  const contextoA = await browser.newContext()
  const paginaA = await contextoA.newPage()
  const contextoB = await browser.newContext()
  const paginaB = await contextoB.newPage()

  await mockearSupabase(paginaA)
  await mockearSupabase(paginaB)
  await sembrarSesion(paginaA)
  await sembrarSesion(paginaB)

  await paginaA.goto('/#/app/compra', { waitUntil: 'domcontentloaded' })
  await paginaB.goto('/#/app/compra', { waitUntil: 'domcontentloaded' })

  const polloA = paginaA.getByRole('checkbox', { name: 'Pollo' })
  const polloB = paginaB.getByRole('checkbox', { name: 'Pollo' })
  await expect(polloA).toBeVisible()
  await expect(polloB).toBeVisible()
  await expect(polloA).not.toBeChecked()
  await expect(polloB).not.toBeChecked()

  await polloA.check({ force: true })

  // El backend compartido ya tiene el producto marcado; B lo ve al recargar
  await paginaB.reload({ waitUntil: 'domcontentloaded' })
  await expect(polloB).toBeVisible({ timeout: 10_000 })
  await expect(polloB).toBeChecked()

  await expect(polloA).toBeChecked()
})