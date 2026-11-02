# Refactor de componentes compartidos — El Ático de Vilma Mobile

**Fecha:** 2026-11-02
**Estado:** aprobado
**Rama:** `master`

## 1. Intento y por qué

La app funciona y el flujo actual se mantiene. El problema es de mantenimiento y
optimización: la misma estética, los mismos botones, los mismos estados y la
misma tarjeta están definidos dentro de las pantallas, con colores y estilos
repetidos. Cada cambio visual obliga a tocar varios archivos y es fácil que se
desincronicen.

El objetivo es que exista **una sola fuente de verdad** para los componentes de
React y los tokens visuales, y que las pantallas los consuman desde ahí. De paso
se corrige el responsive web y se filtra el contenido que todavía está en
desarrollo.

No se agregan funcionalidades nuevas ni se cambia el flujo.

## 2. Objetivos

- Extraer colores, tipografía, espaciados, radios y colores por categoría a un
  único archivo de tema.
- Crear componentes reutilizables para pantalla, header, botones, tag, estados
  de carga/error/vacío y tarjeta de instrumento.
- Dejar el acceso a la API y los tipos del modelo en una sola capa.
- Memoizar la tarjeta y estabilizar callbacks para evitar re-renders innecesarios.
- Hacer que la grilla y la portada sean responsive usando el ancho real de la
  ventana, no `Dimensions` a nivel de módulo.
- Mostrar únicamente los instrumentos funcionales; hoy se muestran los 24,
  incluidos los 21 que apuntan a `enDesarrollo.html`.
- Limpiar las pantallas y componentes de plantilla que no forman parte del flujo.
- Verificar en Android con Expo Go y en web a varios anchos.

## 3. No objetivos

- No actualizar Expo SDK ni React Native.
- No crear las rutas `/instrumento/[id]` ni `/crear` (hoy están linkeadas pero
  no existen; quedan fuera de este trabajo).
- No implementar audio ni usar los `.wav` existentes.
- No agregar base de datos persistente, login ni backend nuevo.
- No rediseñar la estética: se conservan colores, tipografías, formas y tono.
- No agregar un framework de tests.

## 4. Anti-objetivos

- Que el refactor cambie el aspecto o el flujo visible.
- Sobre-abstraer con un design system que hoy no se necesita.
- Romper Android o la versión web.
- Introducir dependencias nuevas innecesarias.

## 5. Restricciones

- Expo SDK 56, React Native 0.85, React 19, expo-router 56 y TypeScript estricto.
- El backend es Express con datos en memoria; alcanza para la demo.
- El código y la UI se mantienen en español.
- Se trabaja directamente sobre `master`.
- No hay claves ni servicios externos.
- `AGENTS.md` pide consultar la documentación versionada de Expo 56 antes de
  escribir código de Expo.

## 6. Enfoques considerados

### A. Extracción intermedia (elegido)

Tokens + primitivas UI + tarjeta + servicio/tipos + hook responsive, y refactor
de las pantallas existentes.

- **Ventaja:** elimina la duplicación real, mejora performance y responsive sin
  construir una abstracción que la app no necesita.
- **Costo:** toca varios archivos, pero son pocos y acotados.

### B. Design system completo (descartado)

Variantes y tamaños para todo, primitivas genéricas y componentes tipados.

- **Ventaja:** escala si la app crece mucho.
- **Costo:** abstracción de más para tres pantallas; más tiempo y más riesgo de
  sobre-ingeniería.

### C. Extracción mínima (descartado)

Solo tema y tarjeta memoizada.

- **Ventaja:** mínimo riesgo.
- **Costo:** siguen duplicados headers, botones, estados y los estilos de las
  pantallas de plantilla; no cumple “que esté en un solo lugar”.

## 7. Decisiones de implementación

### 7.1 Estructura de archivos

```text
constants/theme.ts
types/instrumento.ts
services/instrumentos.ts
hooks/useResponsive.ts
components/ui/Screen.tsx
components/ui/ScreenHeader.tsx
components/ui/Button.tsx
components/ui/Tag.tsx
components/ui/StateView.tsx
components/instrumentos/InstrumentoCard.tsx
```

Se refactorizan:

```text
app/_layout.tsx
app/(tabs)/index.tsx
app/(tabs)/cuadriculada.tsx
app/+not-found.tsx
app/+html.tsx
backend/server.js
```

Se eliminan por ser restos de la plantilla y no formar parte del flujo:

```text
app/(tabs)/two.tsx
app/modal.tsx
components/EditScreenInfo.tsx
components/ExternalLink.tsx
components/StyledText.tsx
components/Themed.tsx
components/useClientOnlyValue.ts
components/useClientOnlyValue.web.ts
components/useColorScheme.ts
components/useColorScheme.web.ts
constants/Colors.ts
```

`app/_layout.tsx` conserva la carga de la fuente y el splash. Solo se le agrega
`SafeAreaProvider` de `react-native-safe-area-context` (ya instalado) para que
el header respete el área segura en Android y web.

### 7.2 Tema

`constants/theme.ts` exporta objetos con los valores que ya usa la app:

- **Colores:** `bg #0a0a0a`, `surface #151515`, `border #222`, `text #fff`,
  `textMuted #888`, `cream #e8e0d5`, `muted #7a7068`, `teal #4ecdc4`,
  `green #51cf66`, `danger #ef5350`, `imageBg #1a1a1a`.
- **Colores por categoría:** teclado `#4ecdc4`, percusión `#f9a825`,
  cuerda `#ef5350`, viento `#ab47bc`, electrónico `#42a5f5`.
- **Espaciados:** 4, 8, 12, 16, 24, 32.
- **Radios:** 12, 18, 100.
- **Tipografía:** tamaños y pesos usados hoy (11, 14, 16, 18, 24 y el título
  responsive de la portada).

Los nombres de categoría se normalizan con una función `getCategoriaColor` que
tolera mayúsculas y acentos.

### 7.3 Componentes y contratos

**`Screen`**
- `View` con `flex: 1`, fondo del tema a todo el ancho y un contenedor interno
  centrado con `width: '100%'`, `maxWidth` (1100 por defecto) y
  `alignSelf: 'center'`.
- Props: `children`, `style?`, `contentStyle?`, `maxWidth?`.
- En mobile el `maxWidth` no tiene efecto; en web evita que la grilla se estire
  de más.
- **Decisión:** la barra del header es full-bleed (fondo y borde de lado a lado)
  y su contenido interno respeta el mismo `maxWidth` de 1100. Así se conserva el
  aspecto actual del header en pantallas anchas, sin dejar franjas negras a los
  costados.

**`ScreenHeader`**
- Barra superior full-bleed con fondo `surface`, borde inferior y área segura;
  el contenido (volver, título, acción) va dentro de un contenedor centrado con
  `maxWidth` 1100.
- Props: `title`, `onBack?`, `backLabel?` (por defecto “← Inicio”),
  `rightAction?` (`ReactNode`), `style?`.
- Si `onBack` existe, muestra un botón fantasma; si no, deja el espacio.
- Reemplaza el header que hoy vive dentro de `cuadriculada.tsx`.

**`Button`**
- Un solo componente con variantes:
  - `primary`: fondo teal, texto oscuro, forma pill (botón de la portada).
  - `icon`: círculo verde con símbolo (botón “+” del header).
  - `ghost`: texto teal sin fondo (botón “volver”).
- Props: `label`, `onPress`, `variant`, `icon?`, `disabled?`,
  `accessibilityLabel?`, `style?`.
- Usa `Pressable` y el mismo estado `pressed` que hoy.

**`Tag`**
- Pill con borde y texto del color recibido.
- Props: `label`, `color`, `style?`.

**`StateView`**
- Estados de la lista: `loading` (spinner teal + texto), `error` (texto rojo) y
  `empty` (texto muted).
- Props: `variant`, `message?`, `style?`.
- Centraliza los estilos `estadoContainer`, `estadoTexto`, `spinnerTexto` y
  `errorTexto`.

**`InstrumentoCard`**
- `React.memo`; la comparación incluye `id`, `onPress` y `width` (el ancho cambia
  al redimensionar dentro de un mismo breakpoint y la tarjeta debe actualizarse).
- Props: `instrumento`, `onPress(id)`, `width`.
- Muestra imagen, nombre, tag de categoría y `tipoSonido`.
- Resuelve la imagen local de los instrumentos funcionales
  (`piano.png`, `bateria.png`, `pianoPsicodelico.png`) desde
  `assets/images`; si no la encuentra, usa `placeholder.png`.
- El `onPress` lo provee la pantalla con `useCallback`; la tarjeta no navega por
  su cuenta.

### 7.4 Capa de datos

`types/instrumento.ts`:

```ts
export type Categoria = 'teclado' | 'percusion' | 'cuerda' | 'viento' | 'electronico';

export interface Instrumento {
  id: number;
  nombre: string;
  tipoSonido: string;
  escala: string;
  categoria: string;
  imagen: string;
  link: string;
  carpetaSonidos: string;
}

export interface ApiResponse {
  total: number;
  cantidad: number;
  from: number;
  datos: Instrumento[];
}
```

`services/instrumentos.ts`:
- `getInstrumentos()` hace el fetch a `/api/instrumentos?cantidad=50&from=0`.
- Resuelve la URL base en este orden:
  1. `process.env.EXPO_PUBLIC_API_URL`.
  2. El host de `Constants.expoConfig?.hostUri` con puerto 3000 (permite que
     Expo Go en un celular físico encuentre el backend de la máquina de
     desarrollo).
  3. `http://localhost:3000` como fallback.
- Lanza un error legible si la respuesta no es OK.
- La pantalla solo se encarga de estado y render.

### 7.5 Backend

En `backend/server.js`:
- Agregar `cors()` (la dependencia ya está en `package.json`).
- Centralizar la regla `funcional: link !== './enDesarrollo.html'` en un helper
  y aplicarla al cargar los datos, al crear y al actualizar.
- `GET /api/instrumentos` devuelve solo funcionales por defecto. Se acepta
  `?incluirEnDesarrollo=1` para depuración.
- `GET /api/instrumentos/:id` también aplica el filtro: un instrumento en
  desarrollo responde 404. Así “solo funcionales” es una regla de toda la API.
- `POST` crea instrumentos con `link` por defecto `''` (no
  `./enDesarrollo.html`) y calcula `funcional` con el mismo helper; un
  instrumento nuevo sin link queda funcional.
- `PUT` recalcula `funcional` si cambia `link`.
- Quitar `express.static('public')`, porque esa carpeta no existe.
- Mantener el puerto 3000 y los logs actuales.

Con los datos actuales, la API devuelve 3 instrumentos: Piano Clásico, Batería
Rock y Piano Psicodélico.

### 7.6 Responsive

`hooks/useResponsive.ts` usa `useWindowDimensions` y devuelve:

| Ancho de ventana | Columnas | Ancho de tarjeta |
|------------------|----------|------------------|
| < 600 px         | 2        | calculado        |
| 600–899 px       | 3        | calculado        |
| ≥ 900 px         | 4        | calculado        |

- `contentWidth = min(width, 1100) - padding horizontal`.
- `cardWidth = (contentWidth - gap * (columnas - 1)) / columnas`.
- La `FlatList` usa `key={columnas}` para remontarse cuando cambia el número de
  columnas (React Native lo exige), `numColumns`, `extraData={columnas}`,
  `columnWrapperStyle` con gap y tarjetas de ancho fijo para que la última fila
  no se estire. El ancho de tarjeta también se actualiza al redimensionar dentro
  del mismo breakpoint.
- La portada usa el ancho real: el título se limita con
  `fontSize: min(width * 0.18, 72)` y el bloque de texto tiene `maxWidth: 720`.
- El footer de la portada respeta el área segura inferior.

### 7.7 Performance

- `InstrumentoCard` memoizada.
- `renderItem`, `keyExtractor` y `handlePress` con `useCallback`.
- `FlatList` con `initialNumToRender={6}`, `maxToRenderPerBatch={8}` y
  `windowSize={7}`.
- `removeClippedSubviews` solo en Android/iOS, no en web (evita problemas de
  recorte).
- Nada de `Dimensions.get` a nivel de módulo.

### 7.8 Limpieza visual

- `app/+not-found.tsx` se reescribe en español y con los componentes del tema.
- `app/+html.tsx` usa `lang="es"` y fondo `#0a0a0a`, coherente con la app.
- La portada y la grilla conservan exactamente la paleta y las formas actuales.

## 8. Verificación

1. `npm install` en la raíz y en `backend/`.
2. `cd backend && node server.js`.
3. `curl http://localhost:3000/api/instrumentos` debe devolver `total: 3` y
   ningún instrumento con `link: "./enDesarrollo.html"`.
4. `npm run web` y revisar a 375 px, 768 px y 1280 px:
   - sin scroll horizontal,
   - 2/3/4 columnas respectivamente,
   - título de portada proporcionado,
   - última fila sin tarjetas estiradas.
5. `npx tsc --noEmit` sin errores.
6. Android con Expo Go (`npm start`, escanear QR):
   - la API responde usando el host de Expo,
   - se ven 3 tarjetas con sus imágenes,
   - header y footer respetan el área segura.
7. Si el celular no está en la misma red, probar con
   `EXPO_PUBLIC_API_URL=http://<IP-de-la-máquina>:3000 npm start`.

No hay suite automatizada; la verificación es manual más el chequeo de tipos.

## 9. Riesgos y mitigaciones

- **Cambiar `numColumns` remonta la lista:** es el comportamiento esperado y no
  pierde datos porque el estado vive en la pantalla.
- **Filtrar en el backend cambia el contrato de la API:** el único consumidor es
  esta app; se deja `?incluirEnDesarrollo=1` para depuración.
- **Eliminar `/two` y `/modal`:** no están linkeadas desde la UI. Si se las
  necesita, se restauran desde git.
- **`hostUri` no existe en producción:** se usa `EXPO_PUBLIC_API_URL` o el
  fallback `localhost`.
- **SafeAreaProvider en web:** `react-native-safe-area-context` ya es compatible;
  se verifica en la prueba web.

## 10. Fuera de alcance / pendientes conocidos

- `/instrumento/[id]` y `/crear` siguen sin existir; las tarjetas y el botón “+”
  conservan su navegación actual. Si se quiere completar el flujo, es un trabajo
  aparte.
- Los sonidos `.wav` no se usan.
- La persistencia sigue en memoria.
- No se toca el contenido de los 24 instrumentos; solo se filtran los que están
  en desarrollo.

## 11. Lo que queda a criterio de quien implementa

- Nombres exactos de props y archivos dentro de la estructura propuesta.
- Detalles finos de spacing para que el resultado se vea igual al actual.
- Si conviene conservar o no la carga de `SpaceMono` (se deja como está para no
  alterar el splash).
- Estrategia de logs del backend.
