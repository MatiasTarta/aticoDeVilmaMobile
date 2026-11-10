# Catálogo completo, ficha y alta — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar los 24 instrumentos del backend en la app móvil, abrir una ficha por instrumento y permitir crear uno nuevo que se guarde en el backend.

**Architecture:** El backend Express se separa en una fábrica `createApp()` testeable y un `server.js` que solo escucha. La app consume el flag `incluirEnDesarrollo=1` para recibir los 24, agrega dos rutas de expo-router (`/instrumento/[id]` y `/crear`) y refresca la grilla al recuperar foco.

**Tech Stack:** Expo SDK 56, React Native 0.85, React 19, expo-router 56, TypeScript estricto, Express, `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-10-catalogo-completo-ficha-alta-design.md`

## Global Constraints

- Leer la documentación versionada antes de escribir código: https://docs.expo.dev/versions/v56.0.0/
- TypeScript estricto; sin dependencias nuevas.
- Copy, código y UI en español.
- Backend en memoria; los datos se reinician con el proceso.
- La lista sin parámetros sigue devolviendo los 3 funcionales (compatibilidad).
- La app móvil pide `incluirEnDesarrollo=1` para recibir los 24.
- `.interface-design/system.md` es el contrato visual vinculante.
- No hacer `git push`.
- Commits convencionales en español.

## Review Focus

- `/instrumento/4` o `/crear` abiertos directo o recargados, sin historial: “atrás” debe volver al catálogo, no dejar la pantalla muerta. (Task 3, Task 4)
- Alta exitosa y vuelta a la grilla: el contador y la lista deben pasar a 25 sin reiniciar la app. (Task 5)
- Backend apagado con la ficha o el alta abiertos: error legible y reintento, sin crash ni pantalla en blanco. (Task 3, Task 4, Task 6)
- Instrumento sin imagen local (21 de 24): debe verse el placeholder, nunca una imagen rota. (Task 3, Task 6)
- `/instrumento/9999` o `/instrumento/abc`: estado “No encontramos ese instrumento”, no el 404 global. (Task 3)

---

### Task 1: Backend testeable y todos los instrumentos accesibles

**Files:**
- Create: `backend/app.js`
- Modify: `backend/server.js`
- Test: `backend/app.test.js`

**Interfaces:**
- Consumes: `esFuncional(instrumento)` de `backend/funcional.js`; `instrumentos` y `nextId` de `backend/DDBBnt/instrumentos.js`.
- Produces: `createApp({ instrumentos, nextId }): express.Express`.
- Endpoints: `GET /api/instrumentos` (filtra por defecto), `GET /api/instrumentos?incluirEnDesarrollo=1` (todos), `GET /api/instrumentos/:id` (cualquier id existente), `POST /api/instrumentos`, `PUT /api/instrumentos/:id`.

- [ ] **Step 1: Escribir los tests de endpoints que fallan**

Crear `backend/app.test.js` con este contenido:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { createApp } = require('./app');

const FIXTURES = [
  { id: 1, nombre: 'Piano Clásico', tipoSonido: 'acustico', escala: 'ninguna', categoria: 'teclado', imagen: '../assets/img/piano.png', link: './individualPiano.html', carpetaSonidos: '../assets/sonidos/piano/' },
  { id: 2, nombre: 'Batería Rock', tipoSonido: 'rock', escala: 'ninguna', categoria: 'percusion', imagen: '../assets/img/bateria.png', link: './individualBateria.html', carpetaSonidos: '../assets/sonidos/drumkit/' },
  { id: 3, nombre: 'Piano Psicodélico', tipoSonido: 'psicodelico', escala: 'ninguna', categoria: 'teclado', imagen: '../assets/img/pianoPsicodelico.png', link: './individualPianoSonidos.html', carpetaSonidos: '../assets/sonidos/pianoPsico/' },
  { id: 4, nombre: 'Guitarra Acústica', tipoSonido: 'acustico', escala: 'ninguna', categoria: 'cuerda', imagen: '../assets/img/guitarra.png', link: './enDesarrollo.html', carpetaSonidos: '../assets/sonidos/guitarra/' },
];

async function conServidor(fn) {
  const app = createApp({ instrumentos: FIXTURES, nextId: 5 });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('la lista por defecto mantiene solo los funcionales', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos?cantidad=50&from=0`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.total, 3);
    assert.deepEqual(body.datos.map((i) => i.id), [1, 2, 3]);
  }));

test('la lista con incluirEnDesarrollo=1 devuelve todos', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`);
    const body = await res.json();
    assert.equal(body.total, 4);
    assert.ok(body.datos.some((i) => i.id === 4));
  }));

test('el detalle devuelve un instrumento en desarrollo', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/4`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.nombre, 'Guitarra Acústica');
  }));

test('el detalle inexistente devuelve 404', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/9999`);
    assert.equal(res.status, 404);
  }));

test('el detalle no numérico devuelve 400', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/abc`);
    assert.equal(res.status, 400);
  }));

test('POST crea y el instrumento se puede pedir por id', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Theremin', tipoSonido: 'electronico', categoria: 'electronico' }),
    });
    const creado = await res.json();
    assert.equal(res.status, 201);
    assert.equal(creado.id, 5);
    assert.equal(creado.escala, 'ninguna');

    const lista = await fetch(`${base}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`).then((r) => r.json());
    assert.equal(lista.total, 5);

    const detalle = await fetch(`${base}/api/instrumentos/5`).then((r) => r.json());
    assert.equal(detalle.nombre, 'Theremin');
  }));

test('POST sin nombre devuelve 400 con detalles', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipoSonido: 'rock', categoria: 'cuerda' }),
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.ok(body.detalles.some((mensaje) => mensaje.includes("'nombre'")));
  }));

test('PUT recalcula funcional y lo hace visible por defecto', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/4`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: './individualGuitarra.html' }),
    });
    assert.equal(res.status, 200);

    const lista = await fetch(`${base}/api/instrumentos?cantidad=50&from=0`).then((r) => r.json());
    assert.equal(lista.total, 4);
  }));
```

- [ ] **Step 2: Correr los tests y confirmar que fallan**

Run: `node --test backend/app.test.js`

Expected: FAIL con `Cannot find module './app'`.

- [ ] **Step 3: Crear `backend/app.js` con la fábrica**

Mover a `backend/app.js` toda la lógica de rutas que hoy está en `server.js`, dentro de `createApp({ instrumentos, nextId })`:

- `app.use(cors())` y `app.use(express.json())`.
- Copiar los instrumentos a un arreglo local y calcular `funcional` con `esFuncional`.
- `let idCounter = nextId`.
- `GET /api/instrumentos`: conservar la validación actual de `cantidad`/`from` y el filtro por defecto `funcional`; con `req.query.incluirEnDesarrollo === '1'` devolver todos.
- `GET /api/instrumentos/:id`: buscar por id **sin** exigir `funcional`.
- `POST` y `PUT`: conservar exactamente las validaciones y respuestas actuales.
- Exportar `module.exports = { createApp }`.

- [ ] **Step 4: Reducir `backend/server.js` al arranque**

`server.js` debe quedar así:

```js
const dbnt = require('./DDBBnt/instrumentos.js');
const { createApp } = require('./app');

const app = createApp({
  instrumentos: dbnt.instrumentos,
  nextId: dbnt.nextId,
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
```

- [ ] **Step 5: Correr los tests nuevos y los existentes**

Run: `node --test backend/app.test.js backend/funcional.test.js`

Expected: PASS en los 8 tests de endpoints y en los 3 de `esFuncional`.

- [ ] **Step 6: Commit**

```bash
git add backend/app.js backend/server.js backend/app.test.js
git commit -m "feat(backend): exponer todos los instrumentos y testear endpoints"
```

---

### Task 2: Servicios de detalle/alta, tipos y presentación compartida

**Files:**
- Modify: `types/instrumento.ts`
- Modify: `services/instrumentos.ts`
- Create: `components/instrumentos/presentacion.ts`
- Modify: `components/instrumentos/InstrumentoCard.tsx`

**Interfaces:**
- Produces:
  - `NuevoInstrumento` con `nombre: string`, `tipoSonido: string`, `categoria: Categoria`, `escala?`, `imagen?`, `link?`, `carpetaSonidos?`.
  - `getInstrumento(id: number): Promise<Instrumento | null>`.
  - `crearInstrumento(datos: NuevoInstrumento): Promise<Instrumento>`.
  - `resolveImagen(imagen: string): ImageSourcePropType`.
  - `serial(id: number): string`.
  - `tipoSonidoLegible(tipo: string): string`.

- [ ] **Step 1: Agregar el tipo de entrada del alta**

En `types/instrumento.ts`, después de `Instrumento`:

```ts
export interface NuevoInstrumento {
  nombre: string;
  tipoSonido: string;
  categoria: Categoria;
  escala?: string;
  imagen?: string;
  link?: string;
  carpetaSonidos?: string;
}
```

- [ ] **Step 2: Sumar el flag, el detalle y el alta al servicio**

En `services/instrumentos.ts`:

- `getInstrumentos()` usa `${API_BASE_URL}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`.
- `getInstrumento(id)` hace `GET /api/instrumentos/${id}`; devuelve `null` solo si `res.status === 404`; cualquier otro `!res.ok` lanza `Error('No se pudo cargar el instrumento.')`.
- `crearInstrumento(datos)` hace `POST` con `Content-Type: application/json` y `JSON.stringify(datos)`. Si la respuesta es 201, devuelve el JSON. Si no, intenta leer `{ error?, detalles? }` y lanza un `Error` con `error` más los `detalles` unidos por espacio; si no hay cuerpo, `'No se pudo crear el instrumento.'`.

- [ ] **Step 3: Extraer los helpers de presentación**

Crear `components/instrumentos/presentacion.ts` moviendo desde `InstrumentoCard.tsx`:

- `IMAGENES_LOCALES` con las cuatro imágenes actuales.
- `resolveImagen(imagen)`.
- `serial(id)`.
- `TIPOS_ACENTUADOS` y `tipoSonidoLegible(tipo)`.

Actualizar `InstrumentoCard.tsx` para importarlos y borrar las definiciones locales. No cambiar el JSX ni los estilos.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`

Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add types/instrumento.ts services/instrumentos.ts components/instrumentos/presentacion.ts components/instrumentos/InstrumentoCard.tsx
git commit -m "refactor(app): compartir presentación y sumar servicios de detalle y alta"
```

---

### Task 3: Ficha `/instrumento/[id]`

**Files:**
- Create: `app/instrumento/[id].tsx`
- Create: `hooks/useVolverAlCatalogo.ts`
- Modify: `components/ui/StateView.tsx`

**Interfaces:**
- Consumes: `getInstrumento(id)` y `resolveImagen`, `serial`, `tipoSonidoLegible` de Task 2; `Screen`, `ScreenHeader`, `Tag`, `Button`, `StateView`.
- Produces: hook `useVolverAlCatalogo(): () => void`; prop `StateView.stampLabel?: string`.

- [ ] **Step 1: Extender `StateView` con sello configurable**

Agregar `stampLabel?: string` a `StateViewProps` y usar `stampLabel ?? (isError ? 'Error de conexión' : 'Catálogo vacío')` en el texto del sello. El resto no cambia.

- [ ] **Step 2: Crear el hook de vuelta segura**

`hooks/useVolverAlCatalogo.ts`:

```ts
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useVolverAlCatalogo() {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/cuadriculada');
    }
  }, [router]);
}
```

- [ ] **Step 3: Crear la pantalla de ficha**

`app/instrumento/[id].tsx`:

- `useLocalSearchParams<{ id: string }>()`; convertir con `Number(id)` y considerar inválido si no es entero positivo.
- Estado: `instrumento`, `cargando`, `error`.
- `cargar` en `useCallback`: si el id es inválido, deja `instrumento` en `null` y termina; si no, llama a `getInstrumento(idNum)`; `catch` setea `'No se pudo cargar el instrumento.'`.
- `useEffect` dispara `cargar`.
- `ScreenHeader` con `title="Ficha"`, `backLabel="← Catálogo"` y `onBack={volver}`.
- Render:
  - `cargando` → `StateView variant="loading"`.
  - `error` → `StateView variant="error"` con `action={{ label: 'Reintentar', onPress: cargar }}`.
  - `!instrumento` → `StateView variant="empty" stampLabel="Sin registro" message="No encontramos ese instrumento."` y `action={{ label: 'Volver al catálogo', onPress: volver }}`.
  - Con datos, `ScrollView` centrado y ficha de papel `maxWidth: 560`, padding 20, con: serial + `Tag` de categoría, imagen 4:3 con `resolveImagen` y filete, nombre Fraunces 26/31, regla, filas mono “Tipo de sonido” y “Escala” con `tipoSonidoLegible`, y `Button variant="ink" label="Volver al catálogo"`.
- No mostrar `funcional`, `link` ni `carpetaSonidos`.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`

Expected: sin errores.

- [ ] **Step 5: Verificar la ficha real en web**

Con backend en `:3000` y Expo web en `:8082`, abrir `/instrumento/4`.

Expected: “Guitarra Acústica”, sello “cuerda”, placeholder en lugar de imagen, tipo de sonido “acústico” y escala “ninguna”. Captura a 375 y 1280 sin scroll horizontal.

- [ ] **Step 6: Verificar ids inválidos y error de red**

- Abrir `/instrumento/9999` y `/instrumento/abc`.
  Expected: “No encontramos ese instrumento.” con botón “Volver al catálogo”; nunca el 404 global.
- Apagar el backend y abrir `/instrumento/4`.
  Expected: estado de error con “Reintentar”; al encender el backend y reintentar, carga la ficha.

- [ ] **Step 7: Verificar la vuelta sin historial**

Abrir `/instrumento/4` directo en una pestaña nueva y tocar “← Catálogo”.

Expected: llega a la grilla (`/cuadriculada`), no queda en una pantalla muerta.

- [ ] **Step 8: Commit**

```bash
git add app/instrumento/[id].tsx hooks/useVolverAlCatalogo.ts components/ui/StateView.tsx
git commit -m "feat(ui): implementar ficha de instrumento"
```

---

### Task 4: Alta `/crear`

**Files:**
- Create: `app/crear.tsx`

**Interfaces:**
- Consumes: `crearInstrumento(datos)` y `NuevoInstrumento` de Task 2; `useVolverAlCatalogo` de Task 3; `Screen`, `ScreenHeader`, `Button`, `Tag`, `colors`, `fonts`, `spacing`, `radii`.

- [ ] **Step 1: Crear la pantalla de alta**

`app/crear.tsx`:

- Estado: `nombre`, `tipoSonido`, `categoria: Categoria | null`, `escala`, `errores` (`{ nombre?, tipoSonido?, categoria? }`), `errorServidor`, `enviando`.
- `CATEGORIAS`: `teclado`, `percusion`, `cuerda`, `viento`, `electronico` con etiquetas acentuadas.
- Header `ScreenHeader title="Nueva ficha" backLabel="← Catálogo"` con `useVolverAlCatalogo()`.
- `KeyboardAvoidingView` (`behavior` `padding` solo en iOS) + `ScrollView`; ficha de papel `maxWidth: 560`, padding 20.
- Campos con etiqueta visible en mono:
  - Nombre: `TextInput`, `autoCapitalize="words"`, `testID="crear-nombre"`.
  - Tipo de sonido: `TextInput`, placeholder “acústico, rock, jazz…”, `testID="crear-tipoSonido"`.
  - Categoría: cinco `Pressable` con `accessibilityRole="radio"`, `accessibilityState={{ selected }}` y `testID="crear-categoria-<valor>"`; seleccionado con fondo tinta y texto papel, no seleccionado con borde `paperEdge`.
  - Escala: `TextInput`, placeholder “ninguna”, `testID="crear-escala"`.
- Nota mono: “La imagen se asigna al catálogo; por ahora se usa el placeholder.”
- `handleGuardar`:
  - Recortar valores.
  - Armar `errores`: nombre vacío, tipo vacío, categoría nula.
  - Si hay errores, setearlos y no llamar a la API.
  - Si no, usar una variable local ya estrecha (`const categoriaFinal = categoria;` después de comprobar que no es `null`) para que TypeScript acepte `NuevoInstrumento`, `setEnviando(true)`, `crearInstrumento({ nombre, tipoSonido, categoria: categoriaFinal, escala: escala || undefined })`, y en éxito `router.replace(\`/instrumento/${creado.id}\` as any)`.
  - En error, `setErrorServidor(mensaje)` y mantener los campos.
- Botón primary “Guardar ficha” con `disabled={enviando}` y `testID="crear-guardar"`.
- Cada error de campo se muestra debajo en `dangerInk` con `accessibilityLiveRegion="polite"`; el error del servidor va en un banner de papel con borde `dangerInk`.

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`

Expected: sin errores.

- [ ] **Step 3: Verificar validación vacía**

Abrir `/crear` y tocar “Guardar ficha” sin completar nada.

Expected: errores inline en nombre, tipo de sonido y categoría; no se crea nada (el contador del backend sigue igual).

- [ ] **Step 4: Verificar el alta real desde la UI**

Completar “Theremin”, “electrónico”, categoría “electrónico”, escala vacía y guardar.

Expected: navega a `/instrumento/25` (o el id siguiente), muestra la ficha con los datos cargados y placeholder. El backend registra el POST.

- [ ] **Step 5: Verificar error del servidor**

Apagar el backend, completar el formulario y guardar.

Expected: banner legible con el error; los campos conservan lo escrito y no hay crash.

- [ ] **Step 6: Verificar la vuelta sin historial**

Abrir `/crear` directo y tocar “← Catálogo”.

Expected: llega a `/cuadriculada`.

- [ ] **Step 7: Commit**

```bash
git add app/crear.tsx
git commit -m "feat(ui): implementar alta de instrumento"
```

---

### Task 5: Refresco de la grilla, estado vacío y documentación visual

**Files:**
- Modify: `app/(tabs)/cuadriculada.tsx`
- Modify: `.interface-design/system.md`

**Interfaces:**
- Consumes: `useFocusEffect` de `expo-router`; `StateView` con `action`.
- Produces: grilla que se recarga al recuperar foco y estado vacío con acción.

- [ ] **Step 1: Reemplazar la carga por foco**

En `app/(tabs)/cuadriculada.tsx`:

- Importar `useFocusEffect` desde `expo-router` y quitar `useEffect`.
- Reemplazar el `useEffect` de carga por:

```tsx
useFocusEffect(
  useCallback(() => {
    cargarInstrumentos();
  }, [cargarInstrumentos]),
);
```

- [ ] **Step 2: Dar salida al estado vacío**

Cambiar `ListEmptyComponent` por:

```tsx
<StateView
  variant="empty"
  action={{ label: 'Crear ficha', onPress: () => router.push('/crear') }}
/>
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`

Expected: sin errores.

- [ ] **Step 4: Verificar el ciclo completo**

Con backend y web encendidos:

1. Abrir la grilla: “24 piezas”.
2. Entrar a “Guitarra Acústica”, volver: sigue en 24.
3. Crear un instrumento y llegar a su ficha.
4. Tocar “← Catálogo”: la grilla muestra “25 piezas” y la ficha nueva.

- [ ] **Step 5: Actualizar `.interface-design/system.md`**

- Quitar `/crear` e `/instrumento/[id]` de “Fuera de alcance”.
- Agregar el patrón **Ficha**: serial, sello, imagen 4:3 con placeholder, nombre Fraunces, metadatos mono, botón ink de vuelta.
- Agregar el patrón **Alta**: ficha de papel de 560, campos con etiqueta mono, chips de categoría, errores en `dangerInk`, botón primary.
- En “Estados”, indicar que el vacío ofrece “Crear ficha”.
- Mantener el resto del sistema y la sección de verificación.

- [ ] **Step 6: Commit**

```bash
git add "app/(tabs)/cuadriculada.tsx" .interface-design/system.md
git commit -m "feat(ui): refrescar catálogo al volver y documentar ficha y alta"
```

---

### Task 6: Verificación integral

**Files:**
- Sin archivos nuevos; corregir lo que falle.

- [ ] **Step 1: Tipos y tests**

```bash
npx tsc --noEmit
node --test backend/app.test.js backend/funcional.test.js
```

Expected: sin errores de TypeScript y todos los tests en PASS.

- [ ] **Step 2: Backend real**

Con el backend reiniciado:

```bash
curl -s "http://localhost:3000/api/instrumentos?cantidad=50&from=0" | head -c 200
curl -s "http://localhost:3000/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1" | head -c 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/instrumentos/4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/instrumentos/9999
```

Expected: `total: 3`; `total: 24`; `200`; `404`.

- [ ] **Step 3: Exports**

```bash
npx expo export -p web
npx expo export -p android
```

Expected: ambos exports terminan sin errores.

- [ ] **Step 4: Capturas web**

Con Metro limpio (`CI=1 npx expo start --web --port 8082 --clear`) y el backend encendido, capturar a 375, 768 y 1280:

- Grilla con 24 fichas y contador “24 piezas”, sin scroll horizontal.
- Ficha de id 4 con placeholder.
- `/crear` con el formulario completo.
- Ficha de un instrumento creado.
- Estado de faltante de `/instrumento/9999`.
- Estado de error con el backend apagado.

Expected: todas las pantallas legibles, sin desbordes ni imágenes rotas.

- [ ] **Step 5: Commit de correcciones (si hubo)**

Si la verificación obligó a corregir algo:

```bash
git add -A
git commit -m "fix: corregir detalles detectados en la verificación"
```

Si no hubo cambios, no crear commit.
