# SPECS.md --- App web móvil para dieta y lista de la compra

## 1. Resumen

Aplicación web **mobile-first**, privada y de uso exclusivo para **dos
personas**, cuyo objetivo es:

1.  Consultar una dieta organizada por días.
2.  Consultar las comidas de cada día.
3.  Consultar una lista de la compra.
4.  Marcar/desmarcar productos comprados.
5.  Mantener el estado de la lista de la compra compartido entre ambos
    usuarios.
6.  Requerir autenticación antes de acceder a los datos.

La interfaz principal tendrá una navegación fija en la parte inferior
con dos secciones:

-   **Dieta**
-   **Compra**

Los datos iniciales de dieta y compra ya existen en dos archivos JSON.

------------------------------------------------------------------------

## 2. Decisión arquitectónica

### 2.1 Arquitectura propuesta

Se utilizará una arquitectura de **frontend estático + backend
gestionado**:

``` text
┌───────────────────────────────┐
│       GitHub Repository       │
│                               │
│ React + TypeScript + Vite     │
│ CSS / UI                      │
│ Tests                         │
└──────────────┬────────────────┘
               │ build/deploy
               ▼
┌───────────────────────────────┐
│         GitHub Pages           │
│                               │
│ Frontend estático HTTPS       │
└──────────────┬────────────────┘
               │ HTTPS
               ▼
┌───────────────────────────────┐
│            Supabase            │
│                               │
│ Auth                          │
│ PostgreSQL                    │
│ Row Level Security (RLS)      │
└───────────────────────────────┘
```

### 2.2 Motivo de no guardar los JSON directamente en GitHub Pages

GitHub Pages sirve archivos estáticos. Si los JSON con la dieta se
publican como parte del frontend, cualquier persona que conozca la URL
puede solicitar directamente esos archivos, aunque la interfaz visual
tenga una pantalla de login.

Por tanto:

**No se debe considerar un login puramente frontend como mecanismo de
seguridad.**

La autenticación y autorización deben producirse en un servicio backend.

La opción recomendada para este proyecto es **Supabase Auth +
PostgreSQL + RLS**.

Supabase permite autenticar mediante email/password y asociar las
peticiones a la sesión autenticada. Sus políticas RLS permiten limitar
qué filas puede consultar cada usuario.

El frontend solo contendrá la clave pública/publishable de Supabase.
**Nunca se debe incluir una `service_role` key en el navegador.**

------------------------------------------------------------------------

## 3. Stack tecnológico

### Frontend

-   React
-   TypeScript
-   Vite
-   CSS moderno
-   Supabase JS
-   React Router, únicamente si se necesitan rutas independientes
-   Lucide React o equivalente para iconos
-   Vitest
-   Testing Library
-   Playwright para tests E2E

### Backend / infraestructura

-   Supabase Auth
-   Supabase PostgreSQL
-   PostgreSQL Row Level Security (RLS)
-   GitHub Pages
-   GitHub Actions para CI/CD

### Gestión del código

-   Git
-   GitHub
-   ESLint
-   Prettier
-   TypeScript strict mode

------------------------------------------------------------------------

## 4. Compatibilidad

Objetivo principal:

-   Móvil Android moderno
-   Móvil iPhone moderno
-   Safari iOS
-   Chrome Android

Compatibilidad secundaria:

-   Chrome desktop
-   Safari desktop
-   Firefox desktop
-   Edge

La aplicación debe funcionar correctamente desde aproximadamente **360
px de ancho** en adelante.

No se diseñará una versión desktop independiente: el layout será
responsive, pero **mobile-first**.

------------------------------------------------------------------------

## 5. Estructura funcional

### 5.1 Pantallas

#### `/login`

Pantalla pública de autenticación.

Elementos:

-   Logo/nombre de la aplicación.
-   Campo email.
-   Campo contraseña.
-   Botón "Entrar".
-   Mensaje de error.
-   Estado de carga.

Opcional:

-   "¿Has olvidado tu contraseña?"

No debe existir registro público.

Las dos cuentas se crearán previamente desde Supabase.

------------------------------------------------------------------------

#### `/app`

Shell principal de la aplicación.

Contendrá:

-   Header.
-   Contenido de la sección activa.
-   Navegación inferior fija.

La navegación tendrá:

``` text
┌─────────────────────────────┐
│                             │
│        CONTENIDO            │
│                             │
│                             │
├──────────────┬──────────────┤
│   🍽 Dieta   │  🛒 Compra   │
└──────────────┴──────────────┘
```

------------------------------------------------------------------------

## 6. Navegación inferior

La navegación inferior será:

-   fija (`position: fixed`)
-   situada en la parte inferior de la ventana
-   compatible con `safe-area-inset-bottom`
-   siempre accesible
-   con estado visual claro para la sección activa

Ejemplo conceptual:

``` css
padding-bottom: env(safe-area-inset-bottom);
```

La aplicación deberá reservar espacio inferior suficiente para que el
último contenido no quede oculto detrás del nav.

------------------------------------------------------------------------

# 7. Sección Dieta

## 7.1 Objetivo

Mostrar la dieta organizada cronológicamente por días.

Ejemplo conceptual:

``` text
Lunes 8
────────────────────

Desayuno
Yogur + fruta + avena

Media mañana
Fruta

Comida
Pollo con arroz

Merienda
Yogur

Cena
Ensalada + pescado
```

------------------------------------------------------------------------

## 7.2 Selector de día

La vista debe permitir cambiar rápidamente de día.

Se recomienda una lista horizontal desplazable:

``` text
[ L ] [ M ] [ X ] [ J ] [ V ] [ S ] [ D ]
```

Cada elemento mostrará:

-   abreviatura del día
-   número
-   estado seleccionado

Ejemplo:

``` text
LUN
8
```

El día activo debe quedar visualmente destacado.

------------------------------------------------------------------------

## 7.3 Contenido diario

Cada día tendrá una colección ordenada de comidas.

Una comida deberá poder contener como mínimo:

-   nombre de la comida
-   alimentos
-   cantidades
-   notas opcionales

Modelo conceptual:

``` ts
interface Meal {
  id: string;
  type: MealType;
  name: string;
  items: FoodItem[];
  notes?: string;
}

interface FoodItem {
  name: string;
  quantity?: number;
  unit?: string;
}
```

Tipos posibles:

``` ts
type MealType =
  | "breakfast"
  | "mid_morning"
  | "lunch"
  | "afternoon"
  | "dinner"
  | "other";
```

No se debe asumir que todos los días tienen exactamente las mismas
comidas.

El renderer deberá soportar cualquier número y orden de comidas.

------------------------------------------------------------------------

## 7.4 Diseño de las comidas

Cada comida se mostrará como una card.

Ejemplo:

``` text
┌─────────────────────────────┐
│ ☀ Desayuno                 │
│                             │
│ Yogur natural        1 ud   │
│ Avena                40 g   │
│ Plátano              1 ud   │
└─────────────────────────────┘
```

Requisitos:

-   cards visualmente separadas
-   jerarquía tipográfica clara
-   cantidades destacadas
-   buena legibilidad en móvil
-   no depender únicamente del color para comunicar información

------------------------------------------------------------------------

# 8. Sección Compra

## 8.1 Objetivo

Mostrar todos los productos de la lista de compra y permitir marcarlos
como comprados.

Ejemplo:

``` text
Compra

Verduras
☐ Tomates             6 ud
☑ Lechuga             1 ud
☐ Zanahorias          500 g

Lácteos
☐ Yogur               4 ud
```

------------------------------------------------------------------------

## 8.2 Estado comprado

Cada producto tendrá:

``` ts
interface ShoppingItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  checked: boolean;
}
```

Al marcar un producto:

-   cambia visualmente
-   aparece tachado
-   mantiene su posición
-   el estado se guarda en backend

Ejemplo:

``` text
☑ Yogur natural   4 ud
```

No se debe depender de `localStorage` como fuente de verdad.

`localStorage` puede utilizarse únicamente como caché optimista.

------------------------------------------------------------------------

## 8.3 Sincronización entre usuarios

Los dos usuarios deben ver el mismo estado de compra.

Ejemplo:

``` text
Usuario A marca:
☑ Leche

        ↓

Backend

        ↓

Usuario B ve:
☑ Leche
```

La fuente de verdad será PostgreSQL.

Opcionalmente se puede añadir Supabase Realtime para que los cambios
aparezcan en el otro dispositivo sin recargar.

Si Realtime no se implementa inicialmente, se deberá refrescar el estado
al:

-   abrir la sección Compra
-   volver a la aplicación
-   recuperar conectividad

------------------------------------------------------------------------

# 9. Modelo de datos

Se recomienda transformar los dos JSON originales a un modelo
normalizado.

## 9.1 Tabla `app_users`

No es necesario duplicar la autenticación.

Los usuarios existirán en:

``` text
auth.users
```

Se podrá crear una tabla pública adicional únicamente si se necesita
metadata:

``` sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

## 9.2 Tabla `diets`

``` sql
create table public.diets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
```

Se espera inicialmente una única dieta.

------------------------------------------------------------------------

## 9.3 Tabla `diet_days`

``` sql
create table public.diet_days (
  id uuid primary key default gen_random_uuid(),
  diet_id uuid not null references public.diets(id) on delete cascade,
  day_order integer not null,
  date date,
  label text,
  unique (diet_id, day_order)
);
```

`day_order` permite mantener el orden definido por el JSON aunque no
exista una fecha real.

------------------------------------------------------------------------

## 9.4 Tabla `meals`

``` sql
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  diet_day_id uuid not null references public.diet_days(id) on delete cascade,
  meal_order integer not null,
  meal_type text not null,
  name text not null,
  notes text,
  unique (diet_day_id, meal_order)
);
```

------------------------------------------------------------------------

## 9.5 Tabla `meal_items`

``` sql
create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  item_order integer not null,
  name text not null,
  quantity numeric,
  unit text,
  notes text,
  unique (meal_id, item_order)
);
```

------------------------------------------------------------------------

## 9.6 Tabla `shopping_items`

``` sql
create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity numeric,
  unit text,
  category text,
  item_order integer not null default 0,
  checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 10. Autorización

La aplicación debe ser una **allowlist de dos usuarios**.

No habrá registro abierto.

Opciones:

### Opción recomendada

Crear manualmente las dos cuentas en Supabase Auth.

Después, las políticas RLS permitirán acceder a la aplicación únicamente
a usuarios autenticados.

Si se quiere máxima restricción, se puede mantener además una tabla:

``` sql
create table public.app_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);
```

Solo los dos UUID autorizados estarán presentes.

Las políticas podrán comprobar:

``` sql
exists (
  select 1
  from public.app_members
  where user_id = auth.uid()
)
```

------------------------------------------------------------------------

# 11. RLS

Todas las tablas de datos privados deberán tener RLS activado.

Ejemplo conceptual:

``` sql
alter table public.diets enable row level security;
alter table public.diet_days enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.shopping_items enable row level security;
```

La aplicación debe garantizar:

-   usuario no autenticado → no puede leer datos
-   usuario autenticado autorizado → puede leer dieta y compra
-   usuario autenticado autorizado → puede modificar `checked`
-   usuario no autorizado → no puede leer ni modificar los datos

La seguridad no debe depender de ocultar componentes React.

------------------------------------------------------------------------

# 12. Permisos

Inicialmente:

  Recurso              Usuario autorizado
  -------------------- --------------------
  Dieta                SELECT
  Días                 SELECT
  Comidas              SELECT
  Alimentos            SELECT
  Compra               SELECT
  Estado `checked`     SELECT + UPDATE
  Crear productos      NO
  Eliminar productos   NO
  Modificar dieta      NO

La carga/actualización de la dieta y lista se hará mediante un proceso
administrativo separado.

------------------------------------------------------------------------

# 13. JSON de origen

Los dos archivos originales serán considerados **fuente de
importación**, no fuente de ejecución del frontend.

Estructura recomendada del proyecto:

``` text
data/
  dieta.json
  compra.json
```

Estos archivos pueden mantenerse fuera del bundle final si contienen
información que no debe publicarse.

Se debe implementar un script de importación:

``` text
scripts/
  import-diet.ts
  import-shopping-list.ts
```

Flujo:

``` text
JSON
 ↓
validación
 ↓
transformación
 ↓
Supabase
```

Nunca se deberá copiar automáticamente el contenido privado de los JSON
a:

``` text
public/
src/assets/
dist/
```

------------------------------------------------------------------------

# 14. Validación de JSON

Se recomienda utilizar Zod.

Ejemplo conceptual:

``` ts
const mealSchema = z.object({
  name: z.string(),
  items: z.array(...)
});
```

El importador debe fallar explícitamente si el JSON:

-   no es válido
-   tiene campos obligatorios ausentes
-   tiene cantidades inválidas
-   tiene tipos inesperados

No se deben introducir datos parcialmente importados.

------------------------------------------------------------------------

# 15. Adaptador de datos

El frontend no debería depender directamente del formato exacto de los
JSON originales.

Crear una capa:

``` text
src/
  domain/
  data/
    repositories/
    mappers/
```

Ejemplo:

``` ts
interface DietRepository {
  getDays(): Promise<DietDay[]>;
}

interface ShoppingRepository {
  getItems(): Promise<ShoppingItem[]>;
  setChecked(id: string, checked: boolean): Promise<void>;
}
```

Esto permite cambiar el backend sin modificar los componentes de UI.

------------------------------------------------------------------------

# 16. Estado de aplicación

No se necesita Redux inicialmente.

Usar:

-   React state
-   Context únicamente para estado global pequeño
-   Supabase session
-   React Query/TanStack Query si se considera necesario para cache,
    invalidación y sincronización

Recomendación:

**TanStack Query** para datos remotos.

Responsabilidades:

-   cache de dieta
-   cache de compra
-   invalidación
-   estados loading/error
-   refetch
-   mutations optimistas

------------------------------------------------------------------------

# 17. Gestión de sesión

Al iniciar la aplicación:

``` text
¿Existe sesión?
    │
    ├── NO → /login
    │
    └── SÍ → /app
```

La aplicación debe escuchar cambios de autenticación.

Al hacer logout:

``` text
signOut()
   ↓
limpiar estado local
   ↓
/login
```

La sesión puede persistirse utilizando el comportamiento estándar del
cliente Supabase.

------------------------------------------------------------------------

# 18. Manejo de errores

La UI debe contemplar:

### Error de login

``` text
No se ha podido iniciar sesión.
Comprueba tus credenciales.
```

### Error de red

``` text
No se han podido cargar los datos.
Comprueba tu conexión e inténtalo de nuevo.
```

### Error al guardar compra

Si una actualización falla:

1.  revertir estado optimista
2.  mostrar mensaje
3.  permitir reintentar

### Estado vacío

Dieta:

``` text
No hay comidas para este día.
```

Compra:

``` text
No hay productos en la lista.
```

------------------------------------------------------------------------

# 19. UX mobile-first

## Principios

-   Interacciones táctiles grandes.
-   Mínimo 44 px para objetivos táctiles.
-   Texto legible.
-   Poco contenido simultáneo.
-   Scroll vertical natural.
-   Navegación inferior siempre disponible.
-   No utilizar modales innecesarios.
-   Evitar tablas en móvil.

------------------------------------------------------------------------

# 20. Diseño visual

La interfaz debe ser sencilla y orientada a uso diario.

Características:

-   fondo neutro
-   cards
-   bordes/radios moderados
-   jerarquía tipográfica clara
-   iconos simples
-   estados activo/completado claramente diferenciados

Evitar:

-   exceso de sombras
-   gradientes decorativos innecesarios
-   animaciones largas
-   navegación tipo dashboard de escritorio

------------------------------------------------------------------------

# 21. Accesibilidad

Requisitos:

-   HTML semántico
-   labels para formularios
-   navegación por teclado
-   focus visible
-   contraste suficiente
-   `aria-label` en botones solo iconográficos
-   checkbox accesible
-   no transmitir información únicamente mediante color

La navegación inferior debe utilizar elementos semánticos:

``` html
<nav aria-label="Navegación principal">
```

------------------------------------------------------------------------

# 22. PWA

Se recomienda convertir la aplicación en una PWA ligera.

Objetivos:

-   instalar en pantalla de inicio
-   icono de aplicación
-   `manifest.webmanifest`
-   splash/iconos adecuados

No es obligatorio implementar funcionamiento offline completo en la
primera versión.

La caché offline de datos privados deberá diseñarse cuidadosamente y no
debe comprometer la privacidad.

------------------------------------------------------------------------

# 23. Seguridad

## Obligatorio

-   HTTPS.
-   Supabase Auth.
-   RLS.
-   No incluir secretos en frontend.
-   No incluir `service_role` key en GitHub.
-   No guardar contraseñas en localStorage.
-   No publicar los JSON privados.
-   Validar permisos en backend.
-   Mantener dependencias actualizadas.

## Variables de entorno

Frontend:

``` env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Estas variables no son secretos equivalentes a una service key, pero
deben configurarse correctamente.

Nunca:

``` env
SUPABASE_SERVICE_ROLE_KEY=...
```

en código ejecutado por el navegador.

------------------------------------------------------------------------

# 24. GitHub Pages

GitHub Pages se utilizará exclusivamente como hosting del frontend
compilado.

Build:

``` bash
npm run build
```

Salida:

``` text
dist/
```

GitHub Actions publicará `dist/` en GitHub Pages.

La configuración debe soportar correctamente la URL de proyecto:

``` text
https://<usuario>.github.io/<repositorio>/
```

Por ello, Vite deberá configurarse con un `base` adecuado.

Si posteriormente se utiliza dominio propio, se podrá adaptar la
configuración.

------------------------------------------------------------------------

# 25. CI/CD

Workflow:

``` text
push main
   ↓
GitHub Actions
   ↓
npm ci
   ↓
lint
   ↓
typecheck
   ↓
tests
   ↓
npm run build
   ↓
deploy GitHub Pages
```

Un fallo de lint, typecheck o tests debe impedir el despliegue.

------------------------------------------------------------------------

# 26. Estructura del proyecto

Propuesta:

``` text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   ├── favicon.svg
│   ├── icons/
│   └── manifest.webmanifest
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   │
│   ├── components/
│   │   ├── BottomNav/
│   │   ├── DaySelector/
│   │   ├── MealCard/
│   │   ├── ShoppingItem/
│   │   └── LoadingState/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── diet/
│   │   └── shopping/
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   ├── data/
│   │   ├── repositories/
│   │   └── mappers/
│   │
│   ├── types/
│   │   └── domain.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   │
│   └── main.tsx
│
├── scripts/
│   ├── import-diet.ts
│   └── import-shopping-list.ts
│
├── supabase/
│   └── migrations/
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Los JSON privados de origen no deben incluirse en el build público.

------------------------------------------------------------------------

# 27. Rutas

Se recomienda mantener una navegación sencilla:

``` text
/login
/app
/app/dieta
/app/compra
```

Alternativamente, dieta y compra pueden gestionarse como estado interno
de `/app`.

Para una aplicación tan pequeña, ambas opciones son válidas.

Recomendación:

**usar rutas `/app/dieta` y `/app/compra`** porque facilitan:

-   navegación directa
-   favoritos
-   historial del navegador
-   deep links
-   tests E2E

------------------------------------------------------------------------

# 28. Deep links en GitHub Pages

GitHub Pages no proporciona por sí mismo un servidor SPA que resuelva
cualquier ruta hacia `index.html`.

Por tanto, si se usa React Router con rutas reales, habrá que configurar
una estrategia compatible con GitHub Pages.

Opciones:

1.  Usar hash routing:

``` text
/#/app/dieta
```

2.  Utilizar una estrategia de fallback de SPA.

Para minimizar problemas de despliegue, se recomienda inicialmente:

**HashRouter**.

Así:

``` text
https://usuario.github.io/repo/#/app/dieta
```

Esto evita errores 404 al recargar una ruta.

------------------------------------------------------------------------

# 29. Rendimiento

Objetivos:

-   First Contentful Paint rápido en móvil.
-   Bundle inicial pequeño.
-   No cargar librerías grandes innecesarias.
-   Imágenes mínimas.
-   Lazy loading de pantallas si crece la aplicación.

La dieta probablemente será un dataset pequeño, por lo que el cuello de
botella principal será la red/autenticación, no el procesamiento de
datos.

------------------------------------------------------------------------

# 30. Caché

Se puede cachear:

-   sesión
-   dieta
-   lista de compra

Pero:

-   la dieta puede tener cache de larga duración
-   la compra debe invalidarse después de mutations
-   no asumir que el estado local es correcto si otro usuario ha
    cambiado la compra

------------------------------------------------------------------------

# 31. Sincronización de compra

Primera versión:

``` text
checkbox
   ↓
mutation optimista
   ↓
Supabase UPDATE
   ↓
éxito → mantener
fallo → rollback
```

Segunda fase opcional:

``` text
Supabase Realtime
       ↓
shopping_items changed
       ↓
invalidate query
       ↓
UI actualizada
```

Esto permite que ambos móviles reflejen inmediatamente los cambios.

------------------------------------------------------------------------

# 32. Importación inicial

Proceso recomendado:

### Paso 1

Analizar los dos JSON reales.

### Paso 2

Definir schemas Zod.

### Paso 3

Validar los JSON.

### Paso 4

Transformarlos al modelo interno.

### Paso 5

Insertar la dieta:

``` text
diet
 └── days
      └── meals
           └── meal_items
```

### Paso 6

Insertar la compra:

``` text
shopping_items
```

### Paso 7

Comprobar conteos.

Ejemplo:

``` text
Días importados: 7
Comidas importadas: 35
Alimentos importados: 120
Productos de compra: 48
```

------------------------------------------------------------------------

# 33. Tests

## Unitarios

Probar:

-   parsers JSON
-   mappers
-   ordenación de días
-   ordenación de comidas
-   formato de cantidades
-   estados checked

## Componentes

Probar:

-   login
-   DaySelector
-   MealCard
-   ShoppingItem
-   BottomNav

## E2E

Escenario principal:

``` text
Abrir aplicación
↓
login
↓
Dieta
↓
seleccionar día
↓
ver comidas
↓
Compra
↓
marcar producto
↓
recargar
↓
producto sigue marcado
```

Segundo escenario:

``` text
Usuario A marca producto
↓
Usuario B actualiza/refresca
↓
producto aparece marcado
```

------------------------------------------------------------------------

# 34. Requisitos no funcionales

### Seguridad

-   Solo usuarios autorizados acceden a datos.
-   Los JSON no son públicos.
-   RLS correctamente configurado.

### Disponibilidad

La aplicación debe mostrar un estado útil cuando Supabase no esté
disponible.

### Mantenibilidad

-   TypeScript strict.
-   Componentes pequeños.
-   Separación UI / dominio / datos.
-   Sin acceso directo a Supabase desde componentes visuales.

### Simplicidad

No introducir infraestructura propia mientras Supabase cubra las
necesidades.

------------------------------------------------------------------------

# 35. Decisiones explícitas

### Se hará

-   React + TypeScript + Vite.
-   GitHub Pages para frontend.
-   Supabase para autenticación y datos privados.
-   Dos usuarios precreados.
-   RLS.
-   Dieta separada por días.
-   Comidas como cards.
-   Lista de compra con checkbox.
-   Estado de compra compartido.
-   Navegación inferior fija.
-   Diseño mobile-first.
-   CI/CD mediante GitHub Actions.

### No se hará inicialmente

-   Registro público.
-   Roles complejos.
-   Panel de administración web.
-   Backend propio.
-   Pagos.
-   Notificaciones push.
-   Sincronización offline completa.
-   Gestión/calendario avanzado.
-   Edición de dieta desde la app.

------------------------------------------------------------------------

# 36. Consideración importante sobre privacidad

Aunque la aplicación sea "privada", el frontend publicado en GitHub
Pages es público.

La privacidad real debe estar garantizada por el backend:

``` text
GitHub Pages
    ↓
código público
    ↓
Supabase Auth
    ↓
RLS
    ↓
datos privados
```

Nunca se debe implementar:

``` text
GitHub Pages
    ↓
JSON privado incluido en JS
    ↓
"ocultarlo" mediante login
```

Eso no proporciona seguridad real porque un visitante podría descargar
el bundle o el JSON directamente.

------------------------------------------------------------------------

# 37. Alternativa si se quiere mantener los JSON como archivos

Si se desea conservar literalmente los dos JSON como archivos en lugar
de normalizarlos en PostgreSQL, pueden almacenarse en **Supabase
Storage** dentro de un bucket privado.

Modelo:

``` text
Supabase Auth
      ↓
usuario autenticado
      ↓
Storage privado
      ↓
dieta.json
compra.json
```

El acceso deberá estar protegido mediante políticas de Storage/RLS.

Esta opción es más sencilla si los datos son completamente estáticos.

Sin embargo, presenta una desventaja importante: el estado `checked` de
la lista de compra tendría que persistirse en otro sitio.

Por ello, para la aplicación final se recomienda:

**PostgreSQL para los datos de la aplicación + JSON únicamente como
formato de importación.**

------------------------------------------------------------------------

# 38. MVP

La primera versión debe contener únicamente:

1.  Login.
2.  Persistencia de sesión.
3.  Dieta.
4.  Selector de días.
5.  Cards de comidas.
6.  Lista de compra.
7.  Checkbox de productos.
8.  Persistencia compartida del checkbox.
9.  Logout.
10. Responsive mobile-first.
11. Deploy automático a GitHub Pages.
12. RLS correctamente configurado.

------------------------------------------------------------------------

# 39. Criterios de aceptación

La aplicación se considera terminada cuando:

-   [ ] Un usuario no autenticado no puede ver la dieta.
-   [ ] Un usuario no autenticado no puede ver la compra.
-   [ ] Los dos usuarios autorizados pueden iniciar sesión.
-   [ ] La sesión se conserva al recargar.
-   [ ] La dieta muestra todos los días del JSON.
-   [ ] Al seleccionar un día aparecen sus comidas.
-   [ ] Cada comida muestra correctamente sus alimentos y cantidades.
-   [ ] La compra muestra todos los productos.
-   [ ] Se puede marcar/desmarcar un producto.
-   [ ] El estado de compra persiste al recargar.
-   [ ] El otro usuario puede ver el estado actualizado.
-   [ ] La navegación inferior permanece visible en móvil.
-   [ ] La aplicación funciona desde 360 px de ancho.
-   [ ] No hay secretos de backend en el bundle.
-   [ ] Los JSON privados no están publicados en GitHub Pages.
-   [ ] Las políticas RLS impiden acceso anónimo.
-   [ ] CI ejecuta lint, typecheck y tests.
-   [ ] El despliegue se realiza automáticamente al hacer merge/push a
    `main`.

------------------------------------------------------------------------

# 40. Orden recomendado de implementación

### Fase 1 --- Proyecto

-   Crear Vite + React + TypeScript.
-   Configurar ESLint/Prettier.
-   Configurar GitHub.
-   Configurar GitHub Actions.
-   Configurar GitHub Pages.

### Fase 2 --- Supabase

-   Crear proyecto.
-   Activar email/password.
-   Crear dos usuarios.
-   Crear tablas.
-   Crear RLS.
-   Crear migraciones.

### Fase 3 --- Datos

-   Analizar JSON reales.
-   Crear schemas.
-   Crear importadores.
-   Importar dieta.
-   Importar compra.

### Fase 4 --- Auth

-   Login.
-   Persistencia de sesión.
-   Logout.
-   Protección de rutas.

### Fase 5 --- Dieta

-   DaySelector.
-   DietDay.
-   MealCard.
-   MealItem.

### Fase 6 --- Compra

-   ShoppingList.
-   ShoppingItem.
-   Mutation de `checked`.
-   Rollback ante error.

### Fase 7 --- UX

-   BottomNav.
-   responsive.
-   safe areas.
-   loading states.
-   error states.
-   accesibilidad.

### Fase 8 --- Sincronización

-   React Query.
-   invalidación.
-   opcionalmente Realtime.

### Fase 9 --- Calidad

-   unit tests
-   component tests
-   E2E
-   Lighthouse
-   revisión de seguridad

### Fase 10 --- Producción

-   variables de entorno
-   dominio si procede
-   GitHub Pages
-   comprobación HTTPS
-   smoke test con ambos usuarios

------------------------------------------------------------------------

# 41. Resultado esperado

El producto final debe sentirse como una pequeña aplicación móvil
privada y no como una web de escritorio adaptada.

La navegación principal será:

``` text
              ┌─────────────────────┐
              │       DIETA         │
              │                     │
              │  L M X J V S D      │
              │                     │
              │  Desayuno           │
              │  ┌───────────────┐  │
              │  │ alimentos...  │  │
              │  └───────────────┘  │
              │                     │
              │  Comida             │
              │  ┌───────────────┐  │
              │  │ alimentos...  │  │
              │  └───────────────┘  │
              │                     │
              ├─────────────────────┤
              │   Dieta   | Compra  │
              └─────────────────────┘
```

Y:

``` text
              ┌─────────────────────┐
              │       COMPRA        │
              │                     │
              │  Verduras           │
              │  ☐ Tomate     6 ud  │
              │  ☑ Lechuga    1 ud  │
              │                     │
              │  Lácteos            │
              │  ☐ Yogur       4 ud │
              │                     │
              ├─────────────────────┤
              │   Dieta   | Compra  │
              └─────────────────────┘
```

La arquitectura queda preparada para mantener los datos compartidos
entre ambos usuarios sin sacrificar la sencillez del despliegue en
GitHub Pages.
