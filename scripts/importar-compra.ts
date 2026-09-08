import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { schemaListaCompra, type ListaCompra } from './esquemas'

const RAIZ = resolve(import.meta.dirname, '..')
const SALIDA = resolve(RAIZ, 'supabase', 'migrations', '003_datos_compra.sql')

const MAPEO_CATEGORIAS: Record<string, string> = {
  proteinas: 'Proteínas',
  cereales_y_carbohidratos: 'Cereales y carbohidratos',
  lacteos_y_alternativas: 'Lácteos y alternativas',
  frutas: 'Frutas',
  verduras: 'Verduras',
  grasas_y_condimentos: 'Grasas y condimentos',
  otros: 'Otros',
}

function escapeSql(valor: string): string {
  return valor.replace(/'/g, "''")
}

function formatearNombre(clave: string): string {
  return clave
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function generarSql(datos: ListaCompra): string {
  const lineas: string[] = []
  let contador = 0

  lineas.push('-- Datos de compra importados desde lista_compra.json')
  lineas.push('-- Ejecutar después de 002_datos_dieta.sql')
  lineas.push('')
  lineas.push('insert into public.shopping_items (name, quantity, category, item_order) values')

  const valores: string[] = []

  const categorias = Object.keys(MAPEO_CATEGORIAS)

  for (const cat of categorias) {
    const items = datos[cat]
    const nombreCategoria = MAPEO_CATEGORIAS[cat]
    let orden = 0

    for (const [clave, cantidad] of Object.entries(items)) {
      contador++
      orden++
      const nombre = escapeSql(formatearNombre(clave))
      const cantidadLimpia = escapeSql(cantidad)
      valores.push(
        `  ('${nombre}', '${cantidadLimpia}', '${escapeSql(nombreCategoria)}', ${orden})`,
      )
    }
  }

  lineas.push(valores.join(',\n'))
  lineas.push(';')
  lineas.push('')
  lineas.push(`-- Resumen: ${contador} productos de compra`)

  return lineas.join('\n')
}

// ── Main ────────────────────────────────────────────────────────

const rutaJson = resolve(RAIZ, 'lista_compra.json')
const raw = readFileSync(rutaJson, 'utf-8')
const datos = schemaListaCompra.parse(JSON.parse(raw))

const sql = generarSql(datos)
writeFileSync(SALIDA, sql, 'utf-8')

console.log(`Compra importada → ${SALIDA}`)
