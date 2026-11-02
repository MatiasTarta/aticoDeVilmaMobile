# Refactor de componentes compartidos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar la duplicación de componentes y estilos extrayendo una capa compartida, y dejar la app responsive y filtrada a los instrumentos funcionales sin cambiar su estética ni su flujo.

**Architecture:** El backend filtra los instrumentos en desarrollo y habilita CORS. En el frontend se agregan tokens de tema, tipos, servicio de API y un hook de responsive; sobre esa base se crean primitivas (`Screen`, `ScreenHeader`, `Button`, `Tag`, `StateView`) y una tarjeta memoizada. Las pantallas existentes se reescriben para consumir esas piezas y se elimina el código de plantilla que no se usa.

**Tech Stack:** Expo SDK 56, React Native 0.85.3, React 19.2.3, expo-router 56, TypeScript estricto, Express 5, `react-native-safe-area-context`, `cors`.

**Spec:** `docs/superpowers/specs/2026-11-02-refactor-componentes-compartidos-design.md`

## Global Constraints

- No actualizar Expo SDK, React Native, React ni expo-router.
- Trabajar directamente sobre `master`.
- UI y código en español; conservar el tono actual.
- Mantener exactamente la paleta actual: `#0a0a0a`, `#151515`, `#222`, `#fff`, `#888`, `#e8e0d5`, `#7a7068`, `#4ecdc4`, `#51cf66`, `#ef5350`, `#1a1a1a`.
- Colores por categoría: teclado `#4ecdc4`, percusión `#f9a825`, cuerda `#ef5350`, viento `#ab47bc`, electrónico `#42a5f5`.
- No agregar dependencias nuevas; usar `cors` y `react-native-safe-area-context`, ya declaradas.
- No crear `/instrumento/[id]` ni `/crear`; su navegación actual queda como está.
- No implementar audio, persistencia ni login.
- Backend en memoria, puerto 3000.
- TypeScript estricto: `npx tsc --noEmit` debe pasar al final de cada tarea de frontend.
- No agregar un framework de tests; para el helper del backend se usa `node:test` integrado.

## Review Focus

- **API apagada o inaccesible:** la grilla debe mostrar el estado de error con “No se pudo conectar al servidor.”, no una pantalla vacía ni un crash.
- **API responde 200 con `datos: []`:** debe verse el estado vacío “No hay instrumentos.”, no un espacio en blanco.
- **Nombre de instrumento largo:** la tarjeta debe envolver el nombre en dos líneas sin desbordar ni empujar los tags.
- **Imagen faltante o ruta desconocida:** la tarjeta debe caer al `placeholder.png` local sin romper el render.
- **Redimensionar la web entre breakpoints y dentro de un breakpoint:** deben cambiar columnas y ancho de tarjeta, sin scroll horizontal.

---

### Task 1: Backend — filtro de funcionales y CORS

**Files:**
- Create: `backend/funcional.js`
- Create: `backend/funcional.test.js`
- Modify: `backend/server.js`

**Interfaces:**
- Consumes: `backend/DDBBnt/instrumentos.js` (`instrumentos`, `nextId`).
- Produces: `esFuncional(instrumento: { link?: string }) => boolean`.
- Produces: `GET /api/instrumentos` devuelve solo funcionales por defecto; `?incluirEnDesarrollo=1` devuelve todos.
- Produces: `GET /api/instrumentos/:id` responde 404 para instrumentos en desarrollo.
- Produces: `POST` y `PUT` calculan `funcional` con `esFuncional`.

- [ ] **Step 1: Instalar dependencias del backend**

Run: `cd backend && npm install`
Expected: termina sin errores y crea `backend/node_modules`.

- [ ] **Step 2: Escribir el test que falla**

Create `backend/funcional.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { esFuncional } = require('./funcional');

test('un instrumento en desarrollo no es funcional', () => {
  assert.equal(esFuncional({ link: './enDesarrollo.html' }), false);
});

test('un instrumento con su propia página es funcional', () => {
  assert.equal(esFuncional({ link: './individualPiano.html' }), true);
});

test('un instrumento sin link es funcional', () => {
  assert.equal(esFuncional({ link: '' }), true);
});
```

- [ ] **Step 3: Correr el test para verificar que falla**

Run: `node --test backend/funcional.test.js`
Expected: FAIL con `Cannot find module './funcional'`.

- [ ] **Step 4: Implementar el helper**

Create `backend/funcional.js`:

```js
function esFuncional(instrumento) {
  return instrumento?.link !== './enDesarrollo.html';
}

module.exports = { esFuncional };
```

- [ ] **Step 5: Correr el test para verificar que pasa**

Run: `node --test backend/funcional.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 6: Modificar `backend/server.js`**

- Agregar `const cors = require('cors');` y `const { esFuncional } = require('./funcional');`.
- Agregar `app.use(cors());` antes de las rutas.
- Al cargar la base, mapear cada instrumento a `{ ...instrumento, funcional: esFuncional(instrumento) }` y guardar el resultado en `instrumentos`.
- Quitar `app.use(express.static('public'));`.
- En `GET /api/instrumentos`, construir `const visibles = req.query.incluirEnDesarrollo === '1' ? instrumentos : instrumentos.filter((i) => i.funcional);` y paginar sobre `visibles`. El `total` debe ser `visibles.length`.
- En `GET /api/instrumentos/:id`, buscar solo entre funcionales: `instrumentos.find((inst) => inst.id === id && inst.funcional)`.
- En `POST`, destructurar también `link`, usar `link || ''` como valor por defecto y agregar `funcional: esFuncional({ link: link || '' })` al objeto nuevo.
- En `PUT`, destructurar y validar `link` como string opcional, actualizarlo si viene, y después recalcular `instrumentos[index].funcional = esFuncional(instrumentos[index]);`.
- Mantener los logs y el puerto 3000.

- [ ] **Step 7: Verificar la API**

Run en una terminal: `cd backend && node server.js`
Expected: `Servidor corriendo en http://localhost:3000`.

En otra terminal:

```bash
curl -s http://localhost:3000/api/instrumentos
```

Expected: JSON con `"total": 3` y solo Piano Clásico, Batería Rock y Piano Psicodélico.

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/instrumentos/4
```

Expected: `404`.

```bash
curl -s http://localhost:3000/api/instrumentos?incluirEnDesarrollo=1
```

Expected: `"total": 24`.

```bash
curl -s -X POST http://localhost:3000/api/instrumentos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Prueba","tipoSonido":"demo","categoria":"teclado"}'
```

Expected: objeto con `"link": ""` y `"funcional": true`.

- [ ] **Step 8: Commit**

```bash
git add backend/funcional.js backend/funcional.test.js backend/server.js backend/package-lock.json
git commit -m "fix(backend): filtrar instrumentos en desarrollo y habilitar CORS"
```

---

### Task 2: Fundaciones — tema, tipos, servicio y hook responsive

**Files:**
- Create: `constants/theme.ts`
- Create: `types/instrumento.ts`
- Create: `services/instrumentos.ts`
- Create: `hooks/useResponsive.ts`

**Interfaces:**
- Produces: `colors`, `categoriaColors`, `spacing`, `radii`, `typography` desde `constants/theme.ts`.
- Produces: `getCategoriaColor(categoria: string): string`.
- Produces: `Categoria`, `Instrumento`, `ApiResponse` desde `types/instrumento.ts`.
- Produces: `API_BASE_URL: string` y `getInstrumentos(): Promise<Instrumento[]>` desde `services/instrumentos.ts`.
- Produces: `useResponsive(): { width: number; height: number; columns: number; cardWidth: number; titleFontSize: number; isWeb: boolean }`.

- [ ] **Step 1: Instalar dependencias del frontend**

Run: `npm install`
Expected: termina sin errores y crea `node_modules`.

- [ ] **Step 2: Crear los tipos**

Create `types/instrumento.ts`:

```ts
export type Categoria = 'teclado' | 'percusion' | 'cuerda' | 'viento' | 'electronico';

export interface Instrumento {
  id: number;
  nombre: string;
  tipoSonido: string;
  escala: string;
  categoria: Categoria | string;
  imagen: string;
  link: string;
  carpetaSonidos: string;
  funcional?: boolean;
}

export interface ApiResponse {
  total: number;
  cantidad: number;
  from: number;
  datos: Instrumento[];
}
```

- [ ] **Step 3: Crear el tema**

Create `constants/theme.ts` con estos valores exactos:

```ts
export const colors = {
  bg: '#0a0a0a',
  surface: '#151515',
  border: '#222',
  text: '#fff',
  textMuted: '#888',
  cream: '#e8e0d5',
  muted: '#7a7068',
  teal: '#4ecdc4',
  green: '#51cf66',
  danger: '#ef5350',
  imageBg: '#1a1a1a',
} as const;

export const categoriaColors: Record<string, string> = {
  teclado: '#4ecdc4',
  percusion: '#f9a825',
  cuerda: '#ef5350',
  viento: '#ab47bc',
  electronico: '#42a5f5',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { sm: 12, md: 18, pill: 100 } as const;
export const typography = {
  eyebrow: 11,
  caption: 11,
  body: 14,
  button: 16,
  subtitle: 16,
  title: 24,
} as const;

export function getCategoriaColor(categoria: string): string {
  const key = categoria
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return categoriaColors[key] ?? colors.textMuted;
}
```

- [ ] **Step 4: Crear el servicio de instrumentos**

Create `services/instrumentos.ts` con estas firmas y reglas:

```ts
import Constants from 'expo-constants';
import type { ApiResponse, Instrumento } from '@/types/instrumento';

const API_PORT = 3000;

export function resolveApiBaseUrl(): string {
  // 1. process.env.EXPO_PUBLIC_API_URL
  // 2. host de Constants.expoConfig?.hostUri + :3000
  // 3. http://localhost:3000
}

export const API_BASE_URL = resolveApiBaseUrl();

export async function getInstrumentos(): Promise<Instrumento[]> {
  // fetch a `${API_BASE_URL}/api/instrumentos?cantidad=50&from=0`
  // si !res.ok, throw new Error('No se pudo conectar al servidor.')
  // devolver data.datos ?? []
}
```

La URL del entorno debe quitar la barra final si existe. El host de Expo se obtiene con `Constants.expoConfig?.hostUri?.split(':')[0]`.

- [ ] **Step 5: Crear el hook responsive**

Create `hooks/useResponsive.ts` con estas constantes y firma:

```ts
import { Platform, useWindowDimensions } from 'react-native';

export const BREAKPOINTS = { tablet: 600, desktop: 900 } as const;
export const MAX_CONTENT_WIDTH = 1100;
export const GRID_PADDING = 10;
export const GRID_GAP = 12;

export function useResponsive() {
  // columns: 2 si width < 600, 3 si width < 900, 4 si width >= 900
  // contentWidth = min(width, MAX_CONTENT_WIDTH) - GRID_PADDING * 2
  // cardWidth = max(0, (contentWidth - GRID_GAP * (columns - 1)) / columns)
  // titleFontSize = min(width * 0.18, 72)
  // isWeb = Platform.OS === 'web'
}
```

- [ ] **Step 6: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores. Si `process.env` no está tipado, usar `const envUrl = process.env.EXPO_PUBLIC_API_URL;` y resolver el tipado antes de continuar.

- [ ] **Step 7: Commit**

```bash
git add constants/theme.ts types/instrumento.ts services/instrumentos.ts hooks/useResponsive.ts package-lock.json
git commit -m "refactor(ui): agregar tema, tipos, servicio y hook responsive"
```

---

### Task 3: Primitivas UI compartidas

**Files:**
- Create: `components/ui/Screen.tsx`
- Create: `components/ui/ScreenHeader.tsx`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Tag.tsx`
- Create: `components/ui/StateView.tsx`

**Interfaces:**
- Consumes: `colors`, `spacing`, `radii`, `typography` de `constants/theme.ts`.
- Produces: `Screen({ children, header?, style?, contentStyle?, maxWidth? })`.
- Produces: `ScreenHeader({ title, onBack?, backLabel?, rightAction?, style? })`.
- Produces: `Button({ label, onPress, variant?, disabled?, accessibilityLabel?, style? })` con `variant: 'primary' | 'icon' | 'ghost'`.
- Produces: `Tag({ label, color, style? })`.
- Produces: `StateView({ variant, message?, style? })` con `variant: 'loading' | 'error' | 'empty'`.

- [ ] **Step 1: Crear `Button`**

Implementar las tres variantes con `Pressable`:

- `primary`: fondo `colors.teal`, texto `colors.bg`, padding vertical 14, horizontal 32, radio `radii.pill`, texto 16/600.
- `icon`: 36×36, radio 18, fondo `colors.green`, texto 18/700 color `colors.bg`, centrado.
- `ghost`: sin fondo, texto `colors.teal`, 14.5/500.
- En todas, `pressed` aplica `opacity: 0.8`.
- `disabled` aplica `opacity: 0.5` y desactiva `onPress`.
- `accessibilityRole="button"`, `accessibilityLabel` y `accessibilityState={{ disabled }}`.

- [ ] **Step 2: Crear `Tag`**

Pill con `borderWidth: 1`, `borderRadius: radii.pill`, `paddingHorizontal: 7`, `paddingVertical: 2`, fondo `rgba(255,255,255,0.03)`. El borde y el texto usan la prop `color`; el texto es 10/700 en mayúsculas.

- [ ] **Step 3: Crear `StateView`**

Contenedor `flex: 1`, centrado, padding 40.

- `loading`: `ActivityIndicator size="large" color={colors.teal}` y texto “Cargando…” en `colors.teal`, 14.
- `error`: texto con `colors.danger`, itálico, 15, centrado. Mensaje por defecto: “No se pudo conectar al servidor.”
- `empty`: texto `colors.textMuted`, itálico, 15, centrado. Mensaje por defecto: “No hay instrumentos.”

- [ ] **Step 4: Crear `Screen`**

- `View` raíz `flex: 1`, fondo `colors.bg`.
- Si recibe `header`, renderizarlo full-bleed antes del contenido.
- Contenido interno: `flex: 1`, `width: '100%'`, `maxWidth` (1100 por defecto), `alignSelf: 'center'`.
- Props tipadas con `StyleProp<ViewStyle>`.

- [ ] **Step 5: Crear `ScreenHeader`**

- Barra full-bleed con fondo `colors.surface`, borde inferior `colors.border`.
- `useSafeAreaInsets()` de `react-native-safe-area-context`; padding superior `insets.top + spacing.sm`.
- Contenido interno con `maxWidth: MAX_CONTENT_WIDTH` (importar de `hooks/useResponsive`), `alignSelf: 'center'`, `width: '100%'`, fila, `justifyContent: 'space-between'`, `alignItems: 'center'`.
- Columna izquierda de mínimo 80 px: si `onBack` existe, `Button variant="ghost" label={backLabel ?? '← Inicio'}`; si no, un `View` de 80 px.
- Título centrado con tipografía `typography.title`, color `colors.text`, `flex: 1`, `textAlign: 'center'`.
- Columna derecha de mínimo 80 px, alineada al final: `rightAction` o un `View` de 80 px.

- [ ] **Step 6: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
git add components/ui
git commit -m "refactor(ui): extraer primitivas de pantalla, header, botón, tag y estados"
```

---

### Task 4: Tarjeta de instrumento memoizada

**Files:**
- Create: `components/instrumentos/InstrumentoCard.tsx`

**Interfaces:**
- Consumes: `Instrumento` de `types/instrumento.ts`; `Tag`; `getCategoriaColor`; `colors`, `spacing`, `radii`.
- Produces: `InstrumentoCard({ instrumento, onPress, width })`, memoizado.
- `onPress: (id: number) => void`.

- [ ] **Step 1: Crear el resolvedor de imágenes**

Dentro de `InstrumentoCard.tsx`, crear un mapa con `require`:

```ts
const IMAGENES_LOCALES = {
  'piano.png': require('../../assets/images/piano.png'),
  'bateria.png': require('../../assets/images/bateria.png'),
  'pianoPsicodelico.png': require('../../assets/images/pianoPsicodelico.png'),
  'placeholder.png': require('../../assets/images/placeholder.png'),
};
```

La función `resolveImagen(imagen: string): ImageSourcePropType` toma el nombre de archivo con `imagen.split('/').pop()` y devuelve la imagen local o `placeholder.png`.

- [ ] **Step 2: Implementar la tarjeta**

- `Pressable` con `width` recibido, `marginBottom: spacing.md`, fondo `colors.surface`, borde `colors.border`, radio `radii.sm`, `overflow: 'hidden'`.
- Imagen en contenedor `aspectRatio: 1`, fondo `colors.imageBg`, `resizeMode="cover"`.
- Info con padding 10, gap 6.
- Nombre 14/600, color `colors.text`, `lineHeight: 18`, `numberOfLines={2}`.
- Fila de tags con gap 6: `Tag` con `getCategoriaColor(instrumento.categoria)` y texto `instrumento.tipoSonido` en 11, `colors.textMuted`, itálico.
- `onPress={() => onPress(instrumento.id)}`.
- `accessibilityRole="button"` y `accessibilityLabel={instrumento.nombre}`.

- [ ] **Step 3: Memoizar**

Exportar con `memo` comparando `instrumento.id`, `instrumento.nombre`, `instrumento.tipoSonido`, `instrumento.categoria`, `instrumento.imagen`, `onPress` y `width`. Si alguna cambia, re-renderiza.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add components/instrumentos
git commit -m "refactor(ui): extraer tarjeta de instrumento memoizada"
```

---

### Task 5: Refactor de la portada, layout y HTML

**Files:**
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/+html.tsx`

**Interfaces:**
- Consumes: `Screen`, `Button`, `useResponsive`, `useSafeAreaInsets`.
- Produces: portada sin `Dimensions` a nivel de módulo y con título limitado a 72 px.

- [ ] **Step 1: Envolver la app en `SafeAreaProvider`**

En `app/_layout.tsx`, importar `SafeAreaProvider` de `react-native-safe-area-context` y envolver el `<Stack>` existente. Mantener la carga de `SpaceMono` y el splash sin cambios.

- [ ] **Step 2: Reescribir `app/(tabs)/index.tsx`**

- Usar `Screen` como contenedor y `useResponsive()` para `titleFontSize`.
- Mantener el glow, el eyebrow, el título, el subtítulo, el botón y el footer.
- Título: `fontSize: titleFontSize`, `lineHeight: titleFontSize * 1.05`.
- Bloque central con `maxWidth: 720`.
- Botón: `<Button label="Ver Instrumentos  →" onPress={handleStart} style={{ marginTop: spacing.md }} />`.
- `handleStart` con `useCallback(() => router.push('/cuadriculada'), [router])`.
- Footer: `bottom: spacing.xl + insets.bottom`, usando `useSafeAreaInsets`.
- Conservar los estilos visuales actuales (colores, letterSpacing, itálicas, tamaños 11/16, opacidades).

- [ ] **Step 3: Ajustar `app/+html.tsx`**

- Cambiar `lang="en"` por `lang="es"`.
- Reemplazar el bloque `responsiveBackground` por un fondo único `#0a0a0a` para body, sin media query de modo claro.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Verificar la portada en web**

Run: `npm run web`
Expected: abre la app en el navegador.

Revisar a 375 px, 768 px y 1280 px:

- El título se mantiene proporcionado (no gigante en 1280).
- No aparece scroll horizontal.
- El footer no queda tapado por el borde inferior.

- [ ] **Step 6: Commit**

```bash
git add app/_layout.tsx "app/(tabs)/index.tsx" app/+html.tsx
git commit -m "refactor(home): usar componentes compartidos y layout responsive"
```

---

### Task 6: Refactor de la grilla de instrumentos

**Files:**
- Modify: `app/(tabs)/cuadriculada.tsx`

**Interfaces:**
- Consumes: `getInstrumentos`, `Instrumento`, `useResponsive`, `Screen`, `ScreenHeader`, `Button`, `StateView`, `InstrumentoCard`, `GRID_PADDING`, `GRID_GAP`.
- Produces: grilla responsive con 2/3/4 columnas, estados de carga/error/vacío y tarjetas memoizadas.

- [ ] **Step 1: Reemplazar datos y tipos locales**

- Borrar `interface Instrumento`, `interface ApiResponse`, `API_URL` y `CATEGORIA_COLOR`.
- Importar `useState`, `useEffect`, `useCallback` y `Platform` desde React Native.
- Importar `getInstrumentos` y `Instrumento` desde las nuevas capas.
- Estado: `instrumentos`, `cargando`, `error`.

- [ ] **Step 2: Reescribir la carga**

```ts
const cargarInstrumentos = useCallback(async () => {
  setCargando(true);
  setError('');
  try {
    setInstrumentos(await getInstrumentos());
  } catch {
    setError('No se pudo conectar al servidor.');
  } finally {
    setCargando(false);
  }
}, []);
```

Mantener el `useEffect` de carga inicial.

- [ ] **Step 3: Componer la pantalla**

- `<Screen header={<ScreenHeader title="Instrumentos" onBack={() => router.back()} rightAction={<Button variant="icon" label="＋" onPress={() => router.push('/crear')} accessibilityLabel="Crear instrumento" />} />}>`.
- Si `error`, `<StateView variant="error" message={error} />`.
- Si `cargando && instrumentos.length === 0`, `<StateView variant="loading" />`.
- Si no, `FlatList` con:
  - `data={instrumentos}`
  - `key={columns}`
  - `numColumns={columns}`
  - `extraData={cardWidth}`
  - `renderItem` memoizado con `useCallback`
  - `keyExtractor={(item) => String(item.id)}` con `useCallback`
  - `contentContainerStyle={{ padding: GRID_PADDING }}`
  - `columnWrapperStyle={{ gap: GRID_GAP }}`
  - `ListEmptyComponent={<StateView variant="empty" />}`
  - `removeClippedSubviews={Platform.OS !== 'web'}`
  - `initialNumToRender={6}`, `maxToRenderPerBatch={8}`, `windowSize={7}`

- [ ] **Step 4: Estabilizar callbacks**

```ts
const handlePress = useCallback((id: number) => {
  router.push(`/instrumento/${id}` as any);
}, []);

const renderItem = useCallback(
  ({ item }: { item: Instrumento }) => (
    <InstrumentoCard instrumento={item} onPress={handlePress} width={cardWidth} />
  ),
  [handlePress, cardWidth]
);
```

- [ ] **Step 5: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Verificar la grilla con el backend**

Run en una terminal: `cd backend && node server.js`
Run en otra: `npm run web`

Expected:

- Se ven 3 tarjetas: Piano Clásico, Batería Rock y Piano Psicodélico.
- A 375 px: 2 columnas; a 768 px: 3; a 1280 px: 4.
- No hay scroll horizontal ni tarjetas estiradas en la última fila.
- Las imágenes locales se ven (no el placeholder).

- [ ] **Step 7: Verificar el estado de error**

Detener el backend y recargar la web.
Expected: mensaje “No se pudo conectar al servidor.” centrado, sin crash.

Volver a levantar el backend.

- [ ] **Step 8: Verificar nombre largo e imagen faltante**

Con el backend corriendo:

```bash
curl -s -X POST http://localhost:3000/api/instrumentos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Instrumento con un nombre extremadamente largo para probar el wrap de la tarjeta","tipoSonido":"prueba","categoria":"teclado","imagen":"../assets/img/no-existe.png"}'
```

Recargar la web.
Expected: la tarjeta nueva muestra el nombre en dos líneas sin desbordar y la imagen placeholder.

Reiniciar el backend para limpiar la memoria.

- [ ] **Step 9: Verificar el estado vacío**

Cambiar temporalmente en `services/instrumentos.ts` el query `from=0` por `from=999`, recargar la web.
Expected: “No hay instrumentos.” centrado.

Revertir el cambio a `from=0`.

- [ ] **Step 10: Commit**

```bash
git add "app/(tabs)/cuadriculada.tsx"
git commit -m "refactor(instrumentos): usar componentes compartidos y grilla responsive"
```

---

### Task 7: Limpieza de plantillas y 404 en español

**Files:**
- Modify: `app/+not-found.tsx`
- Delete: `app/(tabs)/two.tsx`
- Delete: `app/modal.tsx`
- Delete: `components/EditScreenInfo.tsx`
- Delete: `components/ExternalLink.tsx`
- Delete: `components/StyledText.tsx`
- Delete: `components/Themed.tsx`
- Delete: `components/useClientOnlyValue.ts`
- Delete: `components/useClientOnlyValue.web.ts`
- Delete: `components/useColorScheme.ts`
- Delete: `components/useColorScheme.web.ts`
- Delete: `constants/Colors.ts`

**Interfaces:**
- Consumes: `Screen`, `Button`, `useRouter`, `colors`, `typography`.
- Produces: 404 en español sin componentes de plantilla.

- [ ] **Step 1: Reescribir `app/+not-found.tsx`**

- Mantener `Stack.Screen options={{ title: 'Oops!' }}` o cambiarlo a `'No encontrado'`.
- Usar `Screen` como contenedor centrado.
- Texto: “Esta pantalla no existe.” con `typography.title`, color `colors.text`.
- `<Button label="Volver al inicio" onPress={() => router.replace('/')} style={{ marginTop: spacing.lg }} />`.
- `useRouter` de expo-router.

- [ ] **Step 2: Eliminar los archivos de plantilla**

```bash
git rm "app/(tabs)/two.tsx" app/modal.tsx \
  components/EditScreenInfo.tsx components/ExternalLink.tsx \
  components/StyledText.tsx components/Themed.tsx \
  components/useClientOnlyValue.ts components/useClientOnlyValue.web.ts \
  components/useColorScheme.ts components/useColorScheme.web.ts \
  constants/Colors.ts
```

- [ ] **Step 3: Verificar que no queden referencias**

Run:

```bash
grep -rn "EditScreenInfo\|ExternalLink\|StyledText\|components/Themed\|useClientOnlyValue\|useColorScheme\|constants/Colors" app components constants services hooks types || true
```

Expected: sin resultados (o solo referencias internas ya eliminadas).

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Verificar en web**

Run: `npm run web`
Expected:

- `/` y `/cuadriculada` siguen funcionando.
- Una URL inexistente muestra el 404 en español con el botón “Volver al inicio”.

- [ ] **Step 6: Commit**

```bash
git add app/+not-found.tsx
git commit -m "chore: limpiar pantallas y componentes de plantilla"
```

---

### Task 8: Verificación final Android + web

**Files:**
- Modify only if a verification reveals a defect.

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: evidencia de que Android Expo Go y web responsive funcionan.

- [ ] **Step 1: Verificar tipos y build web**

Run:

```bash
npx tsc --noEmit
npx expo export -p web
```

Expected: sin errores; se genera `dist/`.

- [ ] **Step 2: Verificar web con backend**

Run en una terminal: `cd backend && node server.js`
Run en otra: `npm run web`

Revisar 375 px, 768 px y 1280 px:

- 3 tarjetas funcionales.
- 2/3/4 columnas.
- Header full-bleed con contenido alineado a 1100 px.
- Sin scroll horizontal.
- Error state al apagar el backend.
- 404 en español.

- [ ] **Step 3: Verificar Android con Expo Go**

Run: `npm start`

Escanear el QR con Expo Go en el celular, en la misma red que la máquina.

Expected:

- La API responde usando el host de Expo (3 tarjetas).
- Las imágenes se ven.
- El header respeta la barra de estado.
- El footer de la portada respeta el área segura inferior.
- La grilla scrollea sin saltos.

Si el celular no está en la misma red:

```bash
EXPO_PUBLIC_API_URL=http://<IP-de-la-máquina>:3000 npm start
```

- [ ] **Step 4: Corregir defectos y commitear solo si hubo cambios**

Si todo pasa, no hay commit en esta tarea. Si se corrige algo:

```bash
git add <archivos>
git commit -m "fix: corregir detalle detectado en verificación final"
```
