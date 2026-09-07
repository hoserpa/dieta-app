import { chromium } from '@playwright/test'
import { config } from 'dotenv'
import { spawn, execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync, rmSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

config()

const RAÍZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const PUERTO_APP = 4173
const ORIGEN = `http://127.0.0.1:${PUERTO_APP}/dieta-app`
const DIR_REPORTES = path.join(RAÍZ, 'reports', 'lighthouse')
const DIR_PERFIL = path.join(DIR_REPORTES, 'perfil')
const BIN_LIGHTHOUSE = path.join(RAÍZ, 'node_modules', '.bin', 'lighthouse')

function esperarPuerto(puerto, ms = 20_000) {
  const fin = Date.now() + ms
  return new Promise((resolve, reject) => {
    const sondeo = () => {
      const socket = net.connect(puerto, '127.0.0.1')
      const ok = () => {
        socket.destroy()
        resolve(true)
      }
      socket.once('connect', ok)
      socket.once('error', () => {
        socket.destroy()
        if (Date.now() > fin) return reject(new Error(`No se escuchó en el puerto ${puerto}`))
        setTimeout(sondeo, 300)
      })
    }
    sondeo()
  })
}

const email = process.env.E2E_EMAIL
const contrasena = process.env.E2E_PASSWORD
if (!email || !contrasena) {
  console.error('Faltan E2E_EMAIL / E2E_PASSWORD en el .env para el login real.')
  process.exit(1)
}

mkdirSync(DIR_REPORTES, { recursive: true })
rmSync(DIR_PERFIL, { recursive: true, force: true })

const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PUERTO_APP)], {
  cwd: RAÍZ,
  shell: true,
  stdio: 'ignore',
})

function matarPuerto(puerto) {
  try {
    const salida = execFileSync('netstat', ['-ano'], { shell: true, encoding: 'utf8' })
    for (const linea of salida.split('\n')) {
      if (linea.includes(`:${puerto}`) && linea.includes('LISTENING')) {
        const pid = linea.trim().split(/\s+/).pop()
        execFileSync('taskkill', ['/F', '/PID', pid], { shell: true, stdio: 'ignore' })
      }
    }
  } catch {
    /* ya no hay proceso */
  }
}

async function main() {
  await esperarPuerto(PUERTO_APP)

  // Login real en un Chromium con perfil persistente (ese perfil lo reutilizará Lighthouse)
  const contexto = await chromium.launchPersistentContext(DIR_PERFIL, { headless: true })
  const pagina = await contexto.newPage()
  await pagina.goto(`${ORIGEN}/#/login`, { waitUntil: 'domcontentloaded' })
  await pagina.getByLabel('Email').fill(email)
  await pagina.getByLabel('Contraseña').fill(contrasena)
  await pagina.getByRole('button', { name: 'Entrar' }).click()
  await pagina.getByRole('heading', { name: 'Dieta' }).waitFor({ timeout: 15_000 })
  await contexto.close()

  const rutas = [
    ['login', '/#/login'],
    ['dieta', '/#/app/dieta'],
    ['compra', '/#/app/compra'],
  ]

  const resultados = []
  for (const [nombre, ruta] of rutas) {
    console.log(`\nAuditando: ${nombre}`)
    const salida = path.join(DIR_REPORTES, nombre)
    execFileSync(
      BIN_LIGHTHOUSE,
      [
        `${ORIGEN}${ruta}`,
        '--output=html',
        '--output=json',
        `--output-path=${salida}`,
        '--quiet',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--disable-storage-reset',
        `--chrome-flags=--headless --user-data-dir=${DIR_PERFIL}`,
      ],
      {
        stdio: 'inherit',
        shell: true,
        timeout: 180_000,
        env: {
          ...process.env,
          CHROME_PATH: chromium.executablePath(),
        },
      },
    )

    const informe = JSON.parse(readFileSync(`${salida}.report.json`, 'utf8'))
    const p = informe.categories
    resultados.push(
      `  ${nombre}: rendimiento ${p.performance.score * 100} | accesibilidad ${p.accessibility.score * 100} | mejores prácticas ${p['best-practices'].score * 100} | SEO ${p.seo.score * 100}`,
    )
  }

  console.log('\n== Puntuaciones Lighthouse ==')
  console.log(resultados.join('\n'))
  console.log(`\nReportes en ${DIR_REPORTES}`)
}

try {
  await main()
} finally {
  preview.kill()
  matarPuerto(PUERTO_APP)
}