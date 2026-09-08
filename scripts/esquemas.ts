import { z } from 'zod'

// ── Esquemas para plan_semanal_comidas.json ─────────────────────

const comidasDelDiaSchema = z.object({
  plato: z.string(),
  persona_1: z.union([z.record(z.union([z.number(), z.string()])), z.string()]),
  persona_2: z.union([z.record(z.union([z.number(), z.string()])), z.string()]),
})

const diaPlanSchema = z.object({
  tipo: z.string(),
  desayuno: comidasDelDiaSchema,
  comida: comidasDelDiaSchema,
  merienda: comidasDelDiaSchema,
  cena: comidasDelDiaSchema,
})

export const schemaPlanDieta = z.object({
  tipo: z.string(),
  plan: z.record(diaPlanSchema),
})

export type PlanDieta = z.infer<typeof schemaPlanDieta>

// ── Esquemas para lista_compra.json ─────────────────────────────

const categoriaCompraSchema = z.record(z.string())

export const schemaListaCompra = z.object({
  titulo: z.string(),
  nota: z.string().optional(),
  proteinas: categoriaCompraSchema,
  cereales_y_carbohidratos: categoriaCompraSchema,
  lacteos_y_alternativas: categoriaCompraSchema,
  frutas: categoriaCompraSchema,
  verduras: categoriaCompraSchema,
  grasas_y_condimentos: categoriaCompraSchema,
  otros: categoriaCompraSchema,
})

export type ListaCompra = z.infer<typeof schemaListaCompra>
