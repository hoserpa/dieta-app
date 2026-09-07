import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const rutaIconos = new URL('../public/icons/', import.meta.url)

function svgIcono(tamano, maskable = false) {
  const escala = tamano / 192
  const interiorFijo = `
    <rect x="${4 * escala}" y="${4 * escala}" width="${184 * escala}" height="${184 * escala}" fill="#111111"/>
    <rect x="0" y="0" width="${192 * escala}" height="${12 * escala}" fill="#111111"/>
    <text x="${96 * escala}" y="${126 * escala}" font-family="'Playfair Display', 'Times New Roman', serif" font-size="${102 * escala}" font-weight="700" fill="#F9F9F7" text-anchor="middle">D&amp;C</text>
    <rect x="${48 * escala}" y="${148 * escala}" width="${96 * escala}" height="${8 * escala}" fill="#CC0000"/>
  `.trim()

  let interior = interiorFijo
  if (maskable) {
    const factor = 0.82
    const offset = (tamano * (1 - factor)) / 2
    interior = `<g transform="translate(${offset},${offset}) scale(${factor})">${interiorFijo}</g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tamano}" height="${tamano}" viewBox="0 0 ${tamano} ${tamano}">
  <rect width="${tamano}" height="${tamano}" fill="#F9F9F7"/>
  ${interior}
</svg>`
}

async function generarIcono(navegador, nombre, tamano, maskable = false) {
  const svg = svgIcono(tamano, maskable)
  const html = `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/></head><body style="margin:0">${svg}</body></html>`
  const navegador2 = await navegador.newPage({ viewport: { width: tamano, height: tamano } })
  await navegador2.setContent(html)
  await navegador2.evaluate(() => document.fonts?.ready)
  await navegador2.locator('svg').screenshot({ path: fileURLToPath(new URL(`${nombre}.png`, rutaIconos)), omitBackground: false })
  await navegador2.close()
  console.log(`Generado ${nombre}.png`)
}

await mkdir(rutaIconos, { recursive: true })
const navegador = await chromium.launch()
await generarIcono(navegador, 'icon-192', 192)
await generarIcono(navegador, 'icon-512', 512)
await generarIcono(navegador, 'maskable-512', 512, true)
await generarIcono(navegador, 'apple-touch-icon-180', 180)
await navegador.close()
console.log('Iconos generados en public/icons/')