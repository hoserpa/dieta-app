# AUDIT.md — Correcciones de sobre-ingeniería

Roadmap para aplicar las correcciones detectadas en la auditoría de sobre-ingeniería.
Claves de estado: `[x]` hecho · `[~]` descartado (no aplicaba) · `[ ]` pendiente.

---

## Fase 1 — Eliminar código muerto

- [x] `delete` → eliminado el bloque "Datos ficticios usados" (validaba los mocks, no la app). [tests/e2e/flujo.spec.ts]
- [x] `delete` → eliminado `capturarDiagnostico` + try/catch de volcado de body en el smoke test. [tests/e2e/carga.spec.ts]
- [x] `delete` → eliminados los tipos `FilaPerfil` y `FilaDieta`, sin uso. [src/types/dominio.ts]
- [x] `delete` → eliminada `--font-sans`. [src/index.css]
- [x] `delete` → eliminado `console.log(sql)` de depuración. [scripts/importar-compra.ts]
- [x] `delete` → eliminado el `try/finally` con cierre manual de contextos en e2e. [tests/e2e/sincronizacion.spec.ts]
- [x] `delete` → eliminado el directorio vacío `src/styles/` (no versionado por git).

## Fase 2 — Reemplazar lo redundante con lo nativo

- [x] `native` → eliminados `--animate-spin` y `@keyframes spin`; Tailwind v4 los incluye y `animate-spin` no se usaba. [src/index.css]
- [x] `stdlib` → eliminada la dependencia `dotenv` en favor de `process.loadEnvFile()` (nativo, Node 22) en `playwright.config.ts` y `scripts/auditar-lighthouse.mjs`. Nota: `playwright.config.ts` necesitaba cargar `.env` porque `sembrarSesion` (mocks e2e) deriva la clave de sesión de `VITE_SUPABASE_URL`; sin la carga, la sesión no se sembraba y los e2e quedaban en login. Se sustituyó por la llamada nativa sin reintroducir la dependencia. [package.json, playwright.config.ts, scripts/auditar-lighthouse.mjs]

## Fase 3 — Reducir duplicación

- [~] `shrink` → fusionar los configs de vitest/vite. **Descartado:** vitest trae su propia copia de vite, y la versión embebida hace incompatibles los tipos `Plugin`, rompiendo `tsc`. Se mantienen dos archivos, pero se recortó la duplicación que sí era segura (se quitaron `base` y los plugins de react/tailwind de `vitest.config.ts`, que no hacían falta en jsdom). [vite.config.ts / vitest.config.ts]
- [x] `shrink` → `CompraLista.tsx` ahora importa `ProductoCompra` en vez de redeclarar `Producto`. [src/features/compra/CompraLista.tsx]
- [x] `shrink` → `categorias` deriva de `Object.keys(MAPEO_CATEGORIAS)` en vez de re-listar las 7 claves. [scripts/importar-compra.ts]
- [x] `yagni` → `ingredienteSchema` aplanado (usado una sola vez). [scripts/esquemas.ts]

## Fase 4 — Ajustar dependencias

- [x] `shrink` → `zod` movido de `dependencies` a `devDependencies` (solo se usa en scripts de build/importación). [package.json]

## Fase 5 — Consolidar estructura (opcional)

- [~] `yagni` → fusionar el contexto de auth en 2 archivos. **Descartado:** el split de 3 archivos (`ctx.ts` + `contexto-auth.tsx` + `uso-auth.ts`) es **obligatorio** por la regla `react/only-export-components` (Fast Refresh): exportar el `ContextoAuth` o el hook junto al componente dispara `warning`. No es sobre-ingeniería; se mantiene tal cual. [src/features/auth/]

---

## Correcciones en los tests e2e (tras los cambios)

Al eliminar `dotenv`, los e2e dejaron de sembrar la sesión (`sembrarSesion` deriva la clave de `VITE_SUPABASE_URL` leída de `process.env`). Se corrigió restaurando la carga de `.env` vía `process.loadEnvFile()` en `playwright.config.ts` (nativo, sin dependencia).

Además se arreglaron dos defectos de los propios tests (preexistentes, dependientes de la fecha / del DOM real):

- `flujo.spec.ts` — "Pan Integral" se asumía visible el día por defecto, pero el mock solo tiene comidas en Lunes; hoy (Martes) fallaba. Se movió el assert tras seleccionar Lunes (`L`).
- `viewport.spec.ts` — el test buscaba `getByText('Lunes')`, pero el selector muestra iniciales ("L", "M"). Y el `getByRole('heading', { name: 'Dieta' })` matcheaba por substring el banner "Dieta & Compra" sin esperar a que cargara la dieta (carrera). Se espera al primer botón `button[aria-pressed]` visible.

Estado final: 8/8 e2e en verde.

## Verificación

La CADENA completa pasó tras aplicar los cambios: `typecheck` → `lint` → `test:run` (38 tests) → `build` → `test:e2e` (8 tests).

## Resumen objetivo

- Líneas eliminadas: ~110
- Dependencias eliminadas: 1 (`dotenv`)
- `zod` reubicado a devDependencies (no se elimina)
- 2 ítems descartados (tests de vitest fusionados y split de auth): causaban conflicto de tipos / violaban la regla de Fast Refresh
