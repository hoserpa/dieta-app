# 🍽️ Dieta & Compra

Aplicación web **mobile-first** y privada para gestionar la dieta semanal y la lista de la compra compartida entre dos personas.

> Proyecto de uso exclusivo para dos usuarios autenticados. No es una app pública ni multiusuario genérica.

---

## ✨ Características

- 🔐 **Acceso privado**: solo dos cuentas precreadas pueden entrar. No hay registro público.
- 📅 **Dieta por días**: consulta las comidas de cada día de la semana con un selector rápido (L M X J V S D).
- 🍳 **Comidas en cards**: cada comida (desayuno, media mañana, comida, merienda, cena...) se muestra con sus alimentos, cantidades y notas.
- 🛒 **Lista de la compra compartida**: productos agrupados por categoría, con checkbox para marcar lo comprado.
- 🔄 **Estado sincronizado**: si un usuario marca un producto como comprado, el otro lo ve actualizado.
- 📱 **Diseño mobile-first**: navegación inferior fija, pensada para usarse desde el móvil (funciona desde 360 px de ancho).
- ⚡ **Despliegue automático**: cada cambio en `main` se construye y publica solo, sin pasos manuales.

---

## 📸 Vista previa

### Sección Dieta
```
┌─────────────────────┐
│       DIETA          │
│                      │
│  L M X J V S D       │
│                      │
│  Desayuno            │
│  ┌────────────────┐  │
│  │ Yogur natural   │  │
│  │ Avena     40 g  │  │
│  │ Plátano   1 ud  │  │
│  └────────────────┘  │
│                      │
│  Comida              │
│  ┌────────────────┐  │
│  │ Pollo con arroz │  │
│  └────────────────┘  │
│                      │
├──────────────────────┤
│   Dieta   │  Compra  │
└──────────────────────┘
```

### Sección Compra
```
┌─────────────────────┐
│       COMPRA          │
│                      │
│  Verduras             │
│  ☐ Tomates      6 ud  │
│  ☑ Lechuga      1 ud  │
│                      │
│  Lácteos              │
│  ☐ Yogur        4 ud  │
│                      │
├──────────────────────┤
│   Dieta   │  Compra  │
└──────────────────────┘
```

---

## 🧭 Cómo se usa

1. Entrar en la URL de la aplicación (GitHub Pages).
2. Iniciar sesión con email y contraseña (cuenta precreada).
3. La app abre en la sección **Dieta**, mostrando el día actual.
4. Deslizar el selector de días para consultar otros días de la semana.
5. Cambiar a la sección **Compra** desde la navegación inferior.
6. Marcar/desmarcar productos a medida que se compran; el cambio se guarda y se comparte automáticamente con el otro usuario.
7. Cerrar sesión desde el menú cuando se desee.

---

## 🏗️ Arquitectura

```
┌───────────────────────────────┐
│       Repositorio GitHub       │
│  React + TypeScript + Vite     │
└──────────────┬─────────────────┘
               │ build/deploy (GitHub Actions)
               ▼
┌───────────────────────────────┐
│         GitHub Pages           │
│     Frontend estático HTTPS    │
└──────────────┬─────────────────┘
               │ HTTPS
               ▼
┌───────────────────────────────┐
│            Supabase            │
│  Auth · PostgreSQL · RLS       │
└───────────────────────────────┘
```

El frontend es estático (GitHub Pages) y **no contiene datos privados ni claves sensibles**. Toda la autenticación y el acceso a los datos pasan por Supabase, protegidos con Row Level Security (RLS), de modo que solo los dos usuarios autorizados pueden leer o modificar la información.

---

## 🛠️ Stack tecnológico

**Frontend**
- React + TypeScript + Vite
- CSS moderno, mobile-first
- Supabase JS
- Lucide React (iconos)
- Vitest + Testing Library (tests unitarios/componentes)
- Playwright (tests E2E)

**Backend / infraestructura**
- Supabase Auth (email/contraseña)
- Supabase PostgreSQL + Row Level Security
- GitHub Pages (hosting)
- GitHub Actions (CI/CD: lint, typecheck, tests y despliegue automático)

---

## 📂 Estructura del proyecto (orientativa)

```
├── src/
│   ├── components/
│   │   ├── BottomNav/
│   │   ├── DaySelector/
│   │   ├── MealCard/
│   │   └── ShoppingItem/
│   ├── pages/
│   │   ├── Login/
│   │   └── App/
│   ├── domain/         # tipos y lógica de negocio (Meal, FoodItem, ShoppingItem...)
│   ├── data/            # acceso a Supabase (sin exponerlo directamente a la UI)
│   └── lib/              # utilidades, cliente Supabase
├── scripts/
│   └── import/           # importadores de los JSON originales a PostgreSQL
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
├── .github/workflows/    # CI/CD
└── README.md
```

---

## ✅ Estado de terminado (criterios de aceptación)

- [x] Un usuario no autenticado no puede ver la dieta ni la compra
- [x] Los dos usuarios autorizados pueden iniciar sesión
- [x] La sesión se conserva al recargar la página
- [x] La dieta muestra todos los días con sus comidas y alimentos
- [x] La compra muestra todos los productos y permite marcar/desmarcar
- [x] El estado de compra persiste y se refleja para el otro usuario
- [x] Navegación inferior fija y visible desde 360 px de ancho
- [x] No hay secretos de backend ni JSON privados en el bundle público
- [x] RLS impide cualquier acceso anónimo a los datos
- [x] CI ejecuta lint, typecheck y tests en cada cambio
- [x] El despliegue a producción es automático al hacer merge a `main`

---

## 🚫 Fuera de alcance (por ahora)

- Registro público de usuarios
- Roles o permisos complejos
- Panel de administración web
- Backend propio (más allá de Supabase)
- Pagos
- Notificaciones push
- Sincronización offline completa
- Edición de la dieta desde la propia app

---

## 🔒 Nota sobre privacidad

Aunque el frontend se publica en GitHub Pages (público), **ningún dato privado viaja en el código ni en el bundle**. La dieta y la lista de la compra viven en PostgreSQL, protegidas por Supabase Auth y RLS: solo las dos cuentas autorizadas pueden leerlas o modificarlas.
