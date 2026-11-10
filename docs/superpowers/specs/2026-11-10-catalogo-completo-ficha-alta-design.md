# Catálogo completo, ficha y alta — El Ático de Vilma Mobile

**Fecha:** 2026-11-10
**Estado:** propuesto
**Rama:** `master`

## 1. Intento y por qué

Hoy el catálogo móvil muestra 3 de los 24 instrumentos que viven en el backend y
las tarjetas llevan a un 404 porque `/instrumento/[id]` no existe. El botón “+”
también cae en el 404 porque `/crear` no existe. Además, el backend esconde los
21 instrumentos marcados como “en desarrollo”, aunque sus datos están completos
en `backend/DDBBnt/instrumentos.js`.

El objetivo es que el catálogo móvil sea un catálogo real: los 24 instrumentos
visibles, cada uno con su ficha abierta desde el backend, y un alta que guarda en
el backend y muestra la ficha recién creada. Las imágenes faltantes no bloquean
nada: se usa el placeholder existente.

Este trabajo revierte explícitamente la decisión anterior de no implementar
`/crear` ni `/instrumento/[id]`.

## 2. Objetivos

- El backend devuelve los 24 instrumentos a la app móvil, sin romper el
  comportamiento por defecto que ya existe para otros consumidores.
- `GET /api/instrumentos/:id` responde 200 para cualquier id existente,
  incluidos los que tienen `link: './enDesarrollo.html'`.
- La grilla muestra “24 piezas” y ninguna tarjeta lleva a un 404.
- Existe `/instrumento/[id]`, que carga la ficha desde el backend y cubre carga,
  error, id inválido e id inexistente sin salir del flujo.
- Existe `/crear`, con formulario validado que hace `POST /api/instrumentos`,
  guarda en el backend y navega a la ficha creada.
- Al volver a la grilla después de crear, el contador y la lista se actualizan.
- La UI mantiene el sistema visual “ático editorial” ya aprobado.
- `.interface-design/system.md` deja de declarar `/crear` y `/instrumento/[id]`
  como fuera de alcance y documenta los patrones nuevos.

## 3. No objetivos

- Subir o elegir imágenes: el alta usa el placeholder del catálogo.
- Reproducir audio, abrir links legacy o implementar el juego del instrumento.
- Editar instrumentos desde la UI (`PUT` queda en la API, sin pantalla).
- Persistencia real: el backend sigue en memoria y se reinicia con el proceso.
- Autenticación, base de datos, nuevos servicios externos.
- Cambiar la portada, el tema o el sistema visual.
- Implementar un runner de tests para React Native.

## 4. Anti-objetivos

- Que el catálogo vuelva a ocultar instrumentos o que alguna ficha de los 24
  termine en el 404 global.
- Duplicar estilos de ficha entre la tarjeta y el detalle.
- Convertir el alta en un formulario con campos técnicos (`link`,
  `carpetaSonidos`) que no significan nada para quien usa el catálogo.
- Romper el flujo web o Android existente.
- Introducir dependencias nuevas.

## 5. Restricciones

- Expo SDK 56, React Native 0.85, React 19, expo-router 56, TypeScript estricto.
- Express con datos en memoria; sin migraciones ni persistencia.
- Código, copy y UI en español.
- Se trabaja sobre `master`; no se hace push sin pedido explícito.
- Antes de escribir código hay que leer la documentación versionada de Expo:
  https://docs.expo.dev/versions/v56.0.0/ (lo exige `AGENTS.md`).
- El detalle visual vinculante es `.interface-design/system.md`.

## 6. Enfoques considerados

### A. Ficha y alta mínimas (elegido)

Backend expone los 24; ficha de detalle de solo lectura; alta con los campos
obligatorios y `escala` opcional; imagen placeholder; al guardar se navega a la
ficha nueva y la grilla se refresca al recuperar foco.

- **Ventaja:** camino más corto a “no hay 404”, poca superficie nueva, coherente
  con el sistema visual.
- **Costo:** todos los instrumentos creados comparten imagen.

### B. Alta con imagen elegible

Igual que A, pero el formulario permite elegir entre las imágenes ya empaquetadas
(piano, batería, psicodélico, placeholder).

- **Ventaja:** fichas nuevas menos repetitivas.
- **Costo:** más UI y una decisión sobre qué imágenes ofrecer; no resuelve la
  subida real de archivos.

### C. Formulario crudo del backend

Exponer `link`, `imagen` y `carpetaSonidos` como texto.

- **Ventaja:** control total sobre el modelo.
- **Costo:** muestra detalles técnicos del sitio web legacy; no aporta al
  catálogo móvil.

Se elige **A** porque el pedido es que los datos existan y se puedan abrir, no
que el alta gestione archivos. B y C quedan fuera de alcance.

## 7. Diseño

### 7.1 Backend

**Refactor mínimo para testear:** separar la construcción de la app del arranque.

- `backend/app.js` exporta `createApp({ instrumentos, nextId })`.
  - Copia los instrumentos, calcula `funcional` con `esFuncional` y mantiene su
    propio `idCounter`.
  - No escucha en ningún puerto.
- `backend/server.js` requiere `createApp`, le pasa `DDBBnt.instrumentos` y
  `DDBBnt.nextId`, y hace `app.listen(3000)`.

**Cambios de contrato:**

- `GET /api/instrumentos`: conserva el comportamiento por defecto (solo
  funcionales) y el parámetro `incluirEnDesarrollo=1`, que ya existe. La app
  móvil lo envía para recibir los 24. Así no se rompe ningún consumidor legacy
  que dependa del filtro. Se mantiene la respuesta
  `{ total, cantidad, from, datos }` y la validación de `cantidad`/`from`.
- `GET /api/instrumentos/:id`: busca por id sin exigir `funcional`. Sigue
  devolviendo 400 para id no numérico y 404 solo para un id que no existe.
- `POST /api/instrumentos`: sin cambios de contrato. Sigue validando `nombre`,
  `tipoSonido` y `categoria`, y calcula `funcional` con `esFuncional`.
- `PUT /api/instrumentos/:id`: sin cambios.
- El campo `funcional` se conserva en las respuestas como dato, pero **no se usa
  para filtrar en la app ni se muestra en la UI**.

**Tests (TDD, `node:test`):**

- `backend/app.test.js` con una app creada por test y datos de fixture.
- Lista por defecto: mantiene los 3 funcionales (compatibilidad).
- Lista con `incluirEnDesarrollo=1`: devuelve todos, incluido un instrumento con
  `link: './enDesarrollo.html'`.
- Detalle: 200 para un instrumento “en desarrollo”; 404 para id inexistente;
  400 para id no numérico.
- POST: 201, aparece en la lista y se puede pedir por id; validación 400 con
  `detalles` cuando falta un campo obligatorio.
- PUT: actualiza y recalcula `funcional`.
- Se mantienen los tests de `esFuncional` en `backend/funcional.test.js`.

### 7.2 Capa de servicios y tipos

En `types/instrumento.ts`:

- `NuevoInstrumento`: `nombre`, `tipoSonido` y `categoria` obligatorios;
  `escala`, `imagen`, `link` y `carpetaSonidos` opcionales.

En `services/instrumentos.ts`:

- `getInstrumentos()`: sin cambios de firma; agrega `incluirEnDesarrollo=1` a la
  consulta para recibir los 24.
- `getInstrumento(id: number): Promise<Instrumento | null>`: `GET /:id`;
  devuelve `null` solo ante 404; cualquier otro error se propaga.
- `crearInstrumento(datos: NuevoInstrumento): Promise<Instrumento>`: `POST` con
  JSON; ante 400 arma un error legible con `error` y `detalles` del backend.

### 7.3 Helpers compartidos de presentación y navegación

Extraer de `InstrumentoCard` a un módulo compartido:

- `resolveImagen(imagen)`: mantiene el mapa de imágenes locales y el fallback al
  placeholder.
- `serial(id)`: `N.º 001`.
- `tipoSonidoLegible(tipo)`: aplica las tildes conocidas.

La tarjeta y la ficha consumen el mismo módulo, sin duplicar lógica ni estilos de
imagen.

Agregar `hooks/useVolverAlCatalogo.ts`, que devuelve una función de vuelta segura:
`router.back()` si hay historial; si no, `router.replace('/cuadriculada')`. Lo
usan la ficha, el alta y el botón de pie de la ficha.

### 7.4 Ficha `/instrumento/[id]`

Archivo: `app/instrumento/[id].tsx`.

- Lee el id con `useLocalSearchParams` y lo convierte a número.
- Header `ScreenHeader` con título “Ficha”, botón “← Catálogo” y
  `useVolverAlCatalogo()` para la vuelta segura.
- Contenido en `ScrollView` centrado, ficha de papel de 560 px máximo:
  - Serial `N.º 00X` y sello de categoría (`Tag`) arriba.
  - Imagen 4:3 con filete y `resolveImagen`; si falta, placeholder.
  - Nombre en Fraunces 26/31 y regla.
  - Filas de metadatos en mono: **tipo de sonido** y **escala**.
  - Botón ink “Volver al catálogo” al pie.
- Estados:
  - Cargando: `StateView variant="loading"`.
  - Error de red: `StateView variant="error"` con “Reintentar”.
  - Id inválido o inexistente: `StateView variant="empty"` con mensaje
    “No encontramos ese instrumento.” y acción “Volver al catálogo”.
  - Para que el estado de faltante no diga “Catálogo vacío”, `StateView` suma
    una prop opcional `stampLabel`; el valor por defecto no cambia.
- No muestra `funcional`, `link` ni `carpetaSonidos`.

### 7.5 Alta `/crear`

Archivo: `app/crear.tsx`.

- Header `ScreenHeader` con título “Nueva ficha” y `useVolverAlCatalogo()`.
- `KeyboardAvoidingView` + `ScrollView`; ficha de papel de 560 px máximo.
- Campos:
  - **Nombre** (obligatorio, `TextInput`, capitalización de palabras).
  - **Tipo de sonido** (obligatorio, `TextInput`, placeholder “acústico, rock,
    jazz…”).
  - **Categoría** (obligatoria): cinco chips seleccionables —teclado, percusión,
    cuerda, viento, electrónico— con `accessibilityRole="radio"` y estado
    seleccionado. El valor enviado es el de la API (`percusion`, `electronico`).
  - **Escala** (opcional, `TextInput`, placeholder “ninguna”).
- Nota breve mono: “La imagen se asigna al catálogo; por ahora se usa el
  placeholder.”
- Validación al enviar: recorta espacios y exige nombre, tipo de sonido y
  categoría. Los errores se muestran debajo de cada campo en `dangerInk`.
- Envío:
  - Botón primary “Guardar ficha”, deshabilitado mientras guarda.
  - Error del backend: banner de papel con borde `dangerInk` y el mensaje; no se
    pierden los datos cargados.
  - Éxito: `router.replace('/instrumento/' + id)` para que “atrás” vuelva a la
    grilla, no al formulario.
- No hay selector de imagen ni campos técnicos.

### 7.6 Grilla

- `app/(tabs)/cuadriculada.tsx` cambia el `useEffect` de carga por
  `useFocusEffect` (de expo-router), de modo que al volver del alta se vuelve a
  pedir la lista y el contador pasa a “25 piezas”.
- Se mantiene el resto: 2/3/4 columnas, estados, reintento y navegación a la
  ficha.
- El estado vacío gana una acción “Crear ficha” que lleva a `/crear`; ya no es
  un callejón sin salida.
- El “+” sigue navegando a `/crear`.

### 7.7 Estilo y accesibilidad

- Todo sigue `.interface-design/system.md`: papel, tinta, ámbar, mono para
  etiquetas y Fraunces para títulos.
- Campos con etiqueta visible, `accessibilityLabel` y texto de error asociado.
- Chips y botones con área táctil mínima de 44 px.
- Errores con `accessibilityLiveRegion="polite"`.
- Sin sombras nuevas ni acentos fuera de la paleta.

### 7.8 Documentación del sistema visual

Actualizar `.interface-design/system.md`:

- Sacar `/crear` e `/instrumento/[id]` de “Fuera de alcance”.
- Documentar el patrón de ficha (serial, sello, imagen, nombre, metadatos y
  botón de vuelta) y el de alta (campos, chips de categoría, errores y nota de
  imagen).
- Actualizar el estado vacío: ahora ofrece “Crear ficha”.
- Mantener la verificación y las reglas de accesibilidad existentes.

## 8. Lo que queda a criterio de quien implemente

- Espaciados exactos y tamaño final de la ficha (dentro de 560 px), siguiendo la
  escala del sistema.
- Si la fila de categoría se repite en los metadatos o queda solo en el sello.
- Cómo se organiza el helper compartido (nombre del archivo y exports).
- Detalle del banner de error del alta y del foco automático al primer campo
  inválido.

## 9. Verificación

- `npx tsc --noEmit`
- `node --test backend/*.test.js`
- `npx expo export -p web`
- `npx expo export -p android`
- Backend real:
  - `GET /api/instrumentos?cantidad=50&from=0` → `total: 3` (compatibilidad).
  - `GET /api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1` →
    `total: 24`.
  - `GET /api/instrumentos/4` → 200 con “Guitarra Acústica”.
  - `GET /api/instrumentos/9999` → 404.
  - `POST` de prueba → 201 y aparece en la lista con
    `incluirEnDesarrollo=1`.
- Web a 375, 768 y 1280 px:
  - Grilla con 24 fichas, contador “24 piezas”, sin scroll horizontal.
  - Ficha de un instrumento “en desarrollo” (id 4) con imagen o placeholder.
  - Alta real desde la UI: guardar, llegar a la ficha nueva y ver “25 piezas” al
    volver.
  - Id inválido (`/instrumento/9999`) muestra el estado de faltante, no el 404
    global.
  - Error de red con el backend apagado y reintento.
- Android: manifest y bundle Hermes compilan; no se prueba dispositivo físico.

## 10. Fuera de alcance

- `/crear` e `/instrumento/[id]` dejan de estar cancelados por este trabajo; el
  resto del catálogo (audio, links legacy, edición) sigue fuera.
- No se hace push a `origin/master` sin pedido explícito.
