# CODESTYLE.md — Guía de estilo del proyecto

Estas reglas son de obligado cumplimiento para todo el código del repositorio (frontend, scripts de importación, tests y configuración). El objetivo es mantener una codebase **production-ready**: legible, depurable, consistente y sin ruido.

---

## 1. Idioma

- **Todo el código se escribe en español**: nombres de variables, funciones, componentes, tipos, archivos, carpetas, mensajes de commit, comentarios y documentación.
- Excepción: palabras reservadas del lenguaje/framework, nombres de librerías, y términos técnicos sin traducción natural y ampliamente aceptados en la industria (`fetch`, `hook`, `props`, `props`, `token`, `endpoint`, `query`, `mutation`, `build`, `deploy`).
- No mezclar idiomas dentro de un mismo concepto: si una entidad se llama `Comida`, todo lo relacionado (`ComidaCard`, `useComida`, `comidaService`) debe mantener el mismo término, no alternar con `Meal`.
- Los mensajes visibles para el usuario (UI) siempre en español de España, tono cercano y directo.

```ts
// ❌ Mal
interface Meal {
  name: string;
  foodItems: FoodItem[];
}

// ✅ Bien
interface Comida {
  nombre: string;
  alimentos: Alimento[];
}
```

---

## 2. Comentarios

- Los comentarios son **técnicos**, no narrativos. Explican el **por qué**, nunca el **qué** (el código ya dice el qué).
- Se escriben **solo cuando son necesarios**: cuando hay una decisión no obvia, una limitación externa, un workaround, o una regla de negocio no evidente desde el propio código.
- Prohibido comentar lo obvio o dejar comentarios vacíos de contenido.
- Prohibido dejar comentarios de tipo diario/bitácora (`// arreglado esto`, `// TODO: revisar luego sin contexto`, `// no tocar`).
- Si se necesita un `TODO`, debe llevar contexto y, si aplica, referencia a un issue.

```ts
// ❌ Mal: comentario que no aporta nada
// Esto suma los alimentos
const total = alimentos.length;

// ❌ Mal: comentario vago sin contexto
// TODO: arreglar esto

// ✅ Bien: explica una decisión no evidente
// RLS de Supabase no permite filtrar por fecha en el cliente,
// así que el rango de días se resuelve en el propio SELECT.
const { data } = await supabase
  .from('dietas')
  .select('*')
  .gte('fecha', inicioSemana);

// ✅ Bien: TODO con contexto y referencia
// TODO(#42): soportar comidas sin tipo cuando se active importación libre
```

- La documentación de funciones/hooks complejos usa JSDoc en español, solo cuando el comportamiento no es autoexplicativo por el nombre y la firma de tipos.

```ts
/**
 * Reordena las comidas de un día según el orden cronológico definido
 * en `ORDEN_TIPOS_COMIDA`, ya que la API no garantiza el orden de llegada.
 */
function ordenarComidasPorTipo(comidas: Comida[]): Comida[] { ... }
```

---

## 3. Depurabilidad

El código debe ser fácil de depurar sin necesidad de añadir instrumentación ad-hoc:

- **Sin lógica oculta ni "magia"**: evitar side-effects implícitos, mutaciones fuera de contexto o dependencias no declaradas.
- **Errores explícitos**: nunca silenciar un `catch` vacío. Todo error se captura, se tipa y se propaga o se registra con contexto suficiente para reproducirlo.
- **Estados observables**: loading, error y vacío deben ser estados explícitos y testeables, no deducidos por ausencia de datos.
- **Funciones puras siempre que sea posible**: la lógica de dominio (ordenación, formateo, mapeo JSON → modelo) se separa del acceso a datos y de la UI, para poder testear sin mocks pesados.
- **Nombres descriptivos por encima de nombres cortos**: preferir `obtenerComidasDelDia` a `getData`.
- **Sin `any` ni `unknown` sin justificar**: si se necesita, se documenta el motivo y se acota lo antes posible.

```ts
// ❌ Mal: error silenciado, imposible de depurar en producción
try {
  await marcarComoComprado(id);
} catch {
  // nada
}

// ✅ Bien: error tipado y con contexto
try {
  await marcarComoComprado(id);
} catch (error) {
  throw new ErrorSupabase('No se pudo actualizar el producto de compra', {
    productoId: id,
    causa: error,
  });
}
```

---

## 4. Formato

- El formato **no es negociable ni manual**: se aplica siempre mediante **Prettier** antes de cada commit.
- **ESLint** se ejecuta en cada commit/PR y no se permite mergear con warnings ni errores de lint.
- **TypeScript en modo `strict`** en todo el proyecto. No se desactivan reglas de tipado para "salir del paso".
- Un archivo, un propósito: no mezclar componente + lógica de negocio + acceso a datos en el mismo fichero salvo componentes muy pequeños y autocontenidos.
- Indentación, comillas, punto y coma, longitud de línea, etc. quedan definidos por la configuración de Prettier del repo (`.prettierrc`) — nunca se discuten caso a caso en el código.
- Los imports se ordenan: librerías externas → alias internos (`@/...`) → relativos, con una línea en blanco entre grupos.

```
1. React / librerías externas
2. Módulos internos (@/domain, @/data, @/lib)
3. Componentes/estilos relativos
```

---

## 5. Estructura y organización

- Separación estricta de capas, tal como define `SPECS.md`:
  - **UI** (`components/`, `pages/`): solo presentación e interacción.
  - **Dominio** (`domain/`): tipos y lógica de negocio pura.
  - **Datos** (`data/`): acceso a Supabase, mappers JSON → modelo.
  - **Ningún componente visual accede directamente a Supabase.** Siempre a través de la capa de datos.
- Un componente = una carpeta con su archivo principal, estilos y test (`MealCard/MealCard.tsx`, `MealCard.test.tsx`).
- Componentes pequeños y con una única responsabilidad. Si un componente supera ~150 líneas o mezcla varias responsabilidades, se divide.
- Los tipos de dominio (`Comida`, `Alimento`, `ProductoCompra`) se definen una sola vez en `domain/` y se reutilizan; no se duplican interfaces equivalentes en distintos archivos.
- Sin código muerto: no dejar componentes, funciones o imports sin usar. El propio lint debe bloquearlo.
- Los nombres de archivo y carpeta siguen `PascalCase` para componentes y `camelCase` para el resto, de forma consistente en todo el repo.

---

## 6. Producción / calidad

- Ningún `console.log` de depuración llega a `main`. Si se necesita logging, se usa un logger centralizado y controlado por entorno.
- Ninguna clave `service_role` ni secreto de Supabase se incluye en el frontend, ni siquiera temporalmente durante el desarrollo.
- Todo cambio de comportamiento relevante va acompañado de su test correspondiente (unitario, de componente o E2E, según aplique).
- El código que se mergea a `main` debe pasar, sin excepciones: `lint` → `typecheck` → `tests` → `build`.
- Se prefiere código explícito y ligeramente más largo antes que código "ingenioso" difícil de seguir por otra persona (o por uno mismo dentro de tres meses).

---

## 7. Resumen rápido

| Regla | Obligatorio |
|---|---|
| Código y comentarios en español | ✅ |
| Comentarios solo técnicos y solo si son necesarios | ✅ |
| Prettier + ESLint aplicados siempre | ✅ |
| TypeScript strict, sin `any` sin justificar | ✅ |
| Separación UI / dominio / datos | ✅ |
| Sin `console.log` ni secretos en producción | ✅ |
| Errores nunca silenciados | ✅ |
| Tests acompañando cambios relevantes | ✅ |
