import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const rutaIconos = new URL('../public/icons/', import.meta.url)

function diseno(escala) {
  return `
    <text x="${96 * escala}" y="${108 * escala}" font-family="'Playfair Display', 'Times New Roman', serif" font-size="${60 * escala}" font-weight="700" fill="#F9F9F7" text-anchor="middle">D&amp;C</text>
    <rect x="${40 * escala}" y="${120 * escala}" width="${112 * escala}" height="${8 * escala}" fill="#CC0000"/>
  `
}

function svgIcono(tamano, maskable = false) {
  const escala = tamano / 192
  const interior = diseno(escala)

  const contenido = maskable
    ? `<g transform="translate(${(tamano * (1 - 0.82)) / 2},${(tamano * (1 - 0.82)) / 2}) scale(0.82)">${interior}</g>`
    : interior

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tamano}" height="${tamano}" viewBox="0 0 ${tamano} ${tamano}">
  <rect width="${tamano}" height="${tamano}" fill="#111111"/>
  ${contenido}
</svg>`
}

async function generarIcono(navegador, nombre, tamano, maskable = false) {
  const svg = svgIcono(tamano, maskable)
  const html = `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/></head><body style="margin:0">${svg}</body></html>`
  const pagina = await navegador.newPage({ viewport: { width: tamano, height: tamano } })
  await pagina.setContent(html)
  await pagina.evaluate(() => document.fonts?.ready)
  await pagina.locator('svg').screenshot({ path: fileURLToPath(new URL(`${nombre}.png`, rutaIconos)), omitBackground: false })
  await pagina.close()
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