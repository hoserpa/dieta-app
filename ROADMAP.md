# ROADMAP.md — App de Dieta y Lista de la Compra

Hoja de ruta basada en `SPECS.md`, organizada en fases secuenciales hasta el MVP.

## Fase 1 — Proyecto base
- Crear proyecto con Vite + React + TypeScript
- Configurar ESLint y Prettier
- Configurar TypeScript en modo strict
- Crear repositorio en GitHub
- Configurar GitHub Actions (CI/CD)
- Configurar GitHub Pages como destino de despliegue

## Fase 2 — Supabase
- Crear proyecto en Supabase
- Activar autenticación por email/contraseña
- Crear las dos cuentas de usuario (sin registro público)
- Diseñar y crear las tablas de la base de datos
- Configurar Row Level Security (RLS) en todas las tablas
- Crear migraciones versionadas

## Fase 3 — Datos e importación
- Analizar los JSON reales de dieta y compra
- Definir schemas/tipos (`Meal`, `FoodItem`, `ShoppingItem`, etc.)
- Crear scripts/importadores JSON → PostgreSQL
- Importar datos de dieta (`diet_days`, comidas, alimentos)
- Importar datos de compra (`shopping_items`)
- Verificar conteos tras la importación (días, comidas, alimentos, productos)

## Fase 4 — Autenticación
- Construir pantalla `/login` (email, contraseña, botón, error, loading)
- Implementar login contra Supabase Auth
- Persistir la sesión al recargar la página
- Implementar logout
- Proteger rutas privadas (`/app`) frente a usuarios no autenticados

## Fase 5 — Sección Dieta
- Construir shell `/app` (header, contenido, nav inferior)
- Implementar `DaySelector` (lista horizontal L M X J V S D)
- Implementar `DietDay` para mostrar comidas de un día
- Implementar `MealCard` (nombre, alimentos, cantidades, notas)
- Implementar `MealItem` para cada alimento
- Soportar cualquier número/orden de comidas por día

## Fase 6 — Sección Compra
- Implementar `ShoppingList` agrupada por categoría
- Implementar `ShoppingItem` con checkbox
- Implementar mutación del estado `checked` contra Supabase
- Añadir rollback ante error en la mutación
- Verificar que el estado se comparte entre ambos usuarios

## Fase 7 — UX y accesibilidad
- Implementar `BottomNav` fijo (Dieta / Compra) compatible con `safe-area-inset-bottom`
- Ajustar layout responsive mobile-first (desde 360 px)
- Añadir estados de carga (loading states)
- Añadir estados de error / disponibilidad limitada de Supabase
- Revisar accesibilidad (no depender solo del color, jerarquía tipográfica clara)

## Fase 8 — Sincronización
- Integrar React Query para fetching/cache
- Configurar invalidación de queries tras mutaciones
- Evaluar y, opcionalmente, integrar Supabase Realtime para sincronizar cambios entre usuarios

## Fase 9 — Calidad
- Tests unitarios: parsers JSON, mappers, ordenación de días/comidas, formato de cantidades, estados `checked`
- Tests de componentes: Login, DaySelector, MealCard, ShoppingItem, BottomNav
- Tests E2E (Playwright): flujo login → dieta → compra → marcar producto → recarga
- Tests E2E: sincronización entre Usuario A y Usuario B
- Auditoría Lighthouse (`npm run auditar:lighthouse`)
- Revisión de seguridad (sin secretos en el bundle, RLS correctamente restrictivo)

## Fase 10 — Producción
- Configurar variables de entorno (solo clave pública/publishable de Supabase)
- Configurar dominio propio si procede (se mantiene `https://hoserpa.github.io/dieta-app/`)
- Desplegar en GitHub Pages
- Comprobar HTTPS
- Añadir PWA ligera: `manifest.webmanifest`, iconos (192/512/maskable/apple), meta tags (`npm run generar:iconos`)
- Smoke test final con ambas cuentas de usuario

---

## Checklist de aceptación del MVP
- [x] Un usuario no autenticado no puede ver la dieta ni la compra
- [x] Los dos usuarios autorizados pueden iniciar sesión
- [x] La sesión se conserva al recargar
- [x] La dieta muestra todos los días del JSON, con sus comidas y alimentos
- [x] La compra muestra todos los productos y permite marcar/desmarcar
- [x] El estado de compra persiste y se refleja para el otro usuario
- [x] Navegación inferior fija y visible desde 360 px de ancho
- [x] No hay secretos de backend en el bundle ni JSON privados publicados
- [x] RLS impide acceso anónimo
- [x] CI ejecuta lint, typecheck y tests; despliegue automático a `main`

## Fuera de alcance inicial
- Registro público, roles complejos, panel de administración
- Backend propio, pagos, notificaciones push
- Sincronización offline completa
- Edición de la dieta desde la app

---

## Nota de cierre — Versión 1

**Fecha:** 7 de septiembre de 2026

Primera versión finalizada y desplegada en producción:

- **URL:** https://hoserpa.github.io/dieta-app/ (GitHub Pages, HTTPS)
- **Commit final:** `1d67656` en `main`, CI/CD en verde.
- **Alcance entregado:** Fases 1–10 del ROADMAP completadas y checklist de aceptación del MVP marcado.
- **Incluye:** autenticación con las dos cuentas, dieta semanal, lista de la compra compartida, PWA ligera (instalable), estilos "newsprint" responsive móvil y auditoría Lighthouse.
- **Calidad:** lint, typecheck, 38 tests unitarios y 10 tests E2E en verde en CI.

**Pendiente conocido (no bloqueante):** smoke test manual final con ambas cuentas en producción.

**Próximos pasos:** los cambios futuros se abordarán por encima de este hito; queda fuera de alcance la sincronización offline completa y la edición de la dieta desde la app, que podrían considerarse en versiones siguientes.
