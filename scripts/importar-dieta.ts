import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { schemaPlanDieta, type PlanDieta } from './esquemas'

const RAIZ = resolve(import.meta.dirname, '..')
const SALIDA = resolve(RAIZ, 'supabase', 'migrations', '002_datos_dieta.sql')

const ORDEN_COMIDAS = ['desayuno', 'comida', 'merienda', 'cena'] as const

const ETIQUETAS_DIAS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

function uuid(prefijo: string, n: number): string {
  return `${prefijo}${n.toString(16).padStart(12, '0')}`
}

function parsearNombre(clave: string): { nombre: string; unidad: string | null } {
  const coincidencia = clave.match(/^(.+?)_(g|ml|ud|unidades)$/)
  if (coincidencia) {
    const [, base, unidad] = coincidencia
    return {
      nombre: base.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      unidad,
    }
  }
  return {
    nombre: clave.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    unidad: null,
  }
}

function escapeSql(valor: string): string {
  return valor.replace(/'/g, "''")
}

function esIngredientes(valor: unknown): valor is Record<string, number | string> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

const DIETA_ID = '00000000-0000-0000-0000-000000000001'
const PREFIJO_DIA = '00000000-0000-0000-0000-0000000000d'
const PREFIJO_COMIDA = 'a0000000-0000-0000-0000-'

function generarSql(datos: PlanDieta): string {
  const lineas: string[] = []
  let contadorComidas = 0
  let contadorAlimentos = 0

  lineas.push('-- Datos de dieta importados desde plan_semanal_comidas.json')
  lineas.push('-- Ejecutar después de 001_esquema_inicial.sql')
  lineas.push('')

  // ── 1. Insertar dieta ────────────────────────────────────────
  lineas.push(`insert into public.diets (id, name) values ('${DIETA_ID}', 'Plan semanal');`)
  lineas.push('')

  // ── 2. Insertar días ─────────────────────────────────────────
  const dias = Object.keys(datos.plan)
  lineas.push('insert into public.diet_days (id, diet_id, day_order, label) values')
  const diasValues = dias.map((dia, i) => {
    const id = `${PREFIJO_DIA}${i + 1}`
    const etiqueta = ETIQUETAS_DIAS[dia] ?? dia
    return `  ('${id}', '${DIETA_ID}', ${i + 1}, '${escapeSql(etiqueta)}')`
  })
  lineas.push(diasValues.join(',\n'))
  lineas.push(';')
  lineas.push('')

  // ── 3. Insertar comidas ─────────────────────────────────────
  lineas.push('-- Comidas')
  lineas.push('insert into public.meals (id, diet_day_id, meal_order, meal_type, name, notes) values')

  const mealsValues: string[] = []

  for (let i = 0; i < dias.length; i++) {
    const dia = dias[i]
    const diaId = `${PREFIJO_DIA}${i + 1}`
    const diaDatos = datos.plan[dia]

    for (let j = 0; j < ORDEN_COMIDAS.length; j++) {
      const tipoComida = ORDEN_COMIDAS[j]
      const comidaDatos = diaDatos[tipoComida]
      contadorComidas++
      const comidaId = uuid(PREFIJO_COMIDA, contadorComidas)

      const nombre = escapeSql(comidaDatos.plato)
      mealsValues.push(
        `  ('${comidaId}', '${diaId}', ${j + 1}, '${tipoComida}', '${nombre}', null)`,
      )
    }
  }

  lineas.push(mealsValues.join(',\n'))
  lineas.push(';')
  lineas.push('')

  // ── 4. Insertar alimentos ────────────────────────────────────
  lineas.push('-- Alimentos')
  lineas.push('insert into public.meal_items (meal_id, item_order, name, quantity, unit) values')

  const itemsValues: string[] = []
  contadorComidas = 0

  for (let i = 0; i < dias.length; i++) {
    const dia = dias[i]
    const diaDatos = datos.plan[dia]

    for (let j = 0; j < ORDEN_COMIDAS.length; j++) {
      const tipoComida = ORDEN_COMIDAS[j]
      const comidaDatos = diaDatos[tipoComida]
      contadorComidas++
      const comidaId = uuid(PREFIJO_COMIDA, contadorComidas)

      const persona2 = comidaDatos.persona_2

      if (typeof persona2 === 'string') {
        itemsValues.push(
          `  ('${comidaId}', 1, '${escapeSql(comidaDatos.plato)}', null, null)`,
        )
        contadorAlimentos++
        continue
      }

      if (!esIngredientes(persona2)) continue

      let orden = 0
      for (const [clave, valor] of Object.entries(persona2)) {
        orden++
        contadorAlimentos++
        const { nombre, unidad } = parsearNombre(clave)
        const cantidad = String(valor)
        itemsValues.push(
          `  ('${comidaId}', ${orden}, '${escapeSql(nombre)}', '${escapeSql(cantidad)}', ${unidad ? `'${unidad}'` : 'null'})`,
        )
      }
    }
  }

  lineas.push(itemsValues.join(',\n'))
  lineas.push(';')
  lineas.push('')

  // ── 5. Resumen ───────────────────────────────────────────────
  lineas.push(`-- Resumen: ${dias.length} días, ${contadorComidas} comidas, ${contadorAlimentos} alimentos`)

  return lineas.join('\n')
}

// ── Main ────────────────────────────────────────────────────────

const rutaJson = resolve(RAIZ, 'plan_semanal_comidas.json')
const raw = readFileSync(rutaJson, 'utf-8')
const datos = schemaPlanDieta.parse(JSON.parse(raw))

const sql = generarSql(datos)
writeFileSync(SALIDA, sql, 'utf-8')

console.log(`Dieta importada → ${SALIDA}`)
