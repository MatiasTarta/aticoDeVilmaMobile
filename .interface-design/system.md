# Sistema visual — El Ático de Vilma Mobile

## Dirección

**Ático editorial.** La app es el catálogo de una colección privada guardada en una
buhardilla al atardecer: papel crema, tinta cálida y un solo haz de luz. No es un
dashboard oscuro con acentos neón; es una ficha de archivo que se puede tocar.

- **Sensación:** cálida, literaria, de inventario; penumbra con luz de tungsteno.
- **Foco:** el título de la portada y, en la grilla, la ficha de cada instrumento.
- **Regla de color:** ~60% penumbra, ~30% papel, ~10% ámbar. El teal queda como luz
  secundaria, nunca como acento de acción.
- **Profundidad:** solo bordes y contraste de superficie. Sin sombras dramáticas.
- **Jerarquía:** familia tipográfica + peso + color, no solo tamaño.

## Tokens

### Color

| Token | Valor | Uso |
| --- | --- | --- |
| `bg` | `#0b0908` | Fondo de la app |
| `bgDeep` | `#070605` | Reserva para capas profundas |
| `surface` | `#14100d` | Header y superficies oscuras |
| `surfaceRaised` | `#1c1713` | Reserva para elevar una superficie |
| `border` | `rgba(239,230,214,0.10)` | Hairlines |
| `borderStrong` | `rgba(239,230,214,0.20)` | Separadores con más presencia |
| `text` | `#f4ece1` | Texto sobre penumbra |
| `textMuted` | `#a3947f` | Texto secundario sobre penumbra |
| `cream` | `#efe6d6` | Títulos sobre penumbra |
| `muted` | `#7d6f5e` | Metadatos sobre penumbra |
| `amber` | `#d9a05b` | Única acción / luz de tungsteno |
| `amberSoft` | `rgba(217,160,91,0.14)` | Hover de iconos, líneas |
| `teal` | `#4ecdc4` | Luz secundaria (reservado) |
| `green` | `#7fbf7f` | Reserva semántica |
| `danger` | `#c96a5a` | Reserva sobre penumbra |
| `dangerInk` | `#8c3a2f` | Error estampado sobre papel |
| `paper` | `#efe6d6` | Ficha |
| `paperAlt` | `#e3d6c1` | Reserva para papel sombreado |
| `paperEdge` | `#cbbba1` | Borde de la ficha |
| `ink` | `#2b2119` | Texto sobre papel |
| `inkMuted` | `#6d5c47` | Metadatos sobre papel |
| `imageBg` | `#171310` | Fondo de imagen faltante |

### Tintas de categoría (sellos sobre papel)

`teclado #2f6f6b` · `percusión #8a5a12` · `cuerda #8c2f2f` ·
`viento #6a3d75` · `electrónico #2b5f8a`.

`getCategoriaColor()` normaliza mayúsculas y acentos y devuelve `inkMuted` si no
conoce la categoría.

### Tipografía

- **Display:** Fraunces 600 (`Fraunces_600SemiBold`) para títulos.
- **Editorial:** Fraunces 400 itálica (`Fraunces_400Regular_Italic`) para el
  subtítulo de portada.
- **Etiquetas:** SpaceMono (`SpaceMono`) para seriales, sellos, botones y metadatos.
- **Cuerpo:** sans del sistema.

Escala base 15 con razón ~1.25: `10 · 11 · 15 · 17 · 18 · 21 · 26 · 33`.
Portada: `min(width × 0.17, 88)` con line-height `0.97` y tracking negativo
`-0.02 × tamaño`.

### Espaciado

Base 4: `4 · 8 · 12 · 16 · 24 · 32 · 48`.

- Portada: aireada, bloques separados por 16–24.
- Grilla: padding 16, gap 14.
- Ficha: padding 10.

### Radios

`2` papel y sellos · `4` controles · `6` medios · `10` grandes · `100` pill.
No mezclar esquinas rectas y suaves al azar: el papel es recto, los controles
apenas redondeados.

### Anchos y grilla

- Contenido máximo: 1100.
- 375 px → 2 columnas (~164 px).
- 768 px → 3 columnas (~231 px).
- 1280 px → 4 columnas (~257 px).
- Última fila sin estirar tarjetas.

## Patrones

### Ficha de instrumento

- Fondo `paper`, borde 1 `paperEdge`, radio 2, padding 10.
- Fila superior: serial `N.º 001` en mono 9 y sello de categoría a la derecha.
- Imagen 4:3, borde 1 `rgba(43,33,25,0.18)`, radio 2, `resizeMode="cover"`.
- Nombre Fraunces 600, 19/22, 2 líneas, alto mínimo 44 para alinear metadatos.
- Meta mono 9/12, mayúscula, tracking 1.2, punto de 5 px con la tinta de categoría.
- Hover: fondo `#f5eddf` y borde ámbar. Press: `scale(0.985)`.
- Entrada: fade + 10 px, 340 ms, escalón de 45 ms (máximo 8 fichas).

### Ficha de detalle (`/instrumento/[id]`)

- Ficha de papel de 560 px máximo, borde `paperEdge`, radio 2, padding 20.
- Fila superior: serial `N.º 001` en mono 9 y sello de categoría a la derecha.
- Imagen 4:3 con `resizeMode="cover"` y placeholder si el archivo no existe.
- Nombre Fraunces 600 26/31; regla hairline y metadatos en filas
  etiqueta mono 9 / valor alineado a la derecha.
- Acción “Volver al catálogo” con botón **ink**.
- Sin imagen, sin link y sin carpeta de sonidos: la ficha no expone datos técnicos.

### Alta (`/crear`)

- Ficha de papel de 560 px máximo, padding 20, misma jerarquía editorial.
- Campos con etiqueta mono 9 en mayúscula y tracking 1.4.
- Categoría con chips de 44 px de alto: borde `paperEdge`; activo tinta sobre papel.
- Errores inline en `dangerInk`; error de servidor en banner con borde `dangerInk`.
- Acción principal **primary** (“Guardar ficha”); al guardar navega a la ficha nueva.

### Sello de categoría (`Tag`)

Mono 9, tracking 1.2, borde 1.5, radio 2, rotación `-2deg`. Nunca usar la versión
viva del color de categoría sobre papel: no contrasta.

### Botones

- **primary:** ámbar, texto tinta, mono 12 con tracking 1.6, alto mínimo 44, radio 4,
  borde inferior de 2 px más oscuro.
- **ink:** tinta sobre papel para acciones dentro de fichas y 404.
- **icon:** 44 × 44, borde ámbar, fondo transparente, hover `amberSoft`.
- **ghost:** mono 11 ámbar, alto mínimo 40.
- Press: `scale(0.97)`. Disabled: opacidad 0.4.

### Header

- 60 px + área segura, fondo `surface`, hairline inferior, línea ámbar superior de 2 px.
- Título mono 13, tracking 3, mayúscula, centrado.
- Columnas laterales de 80 px para que el título quede ópticamente centrado.

### Estados

- Ficha de papel de 420 px máximo, centrada, con serial `N.º —`, sello, regla y mensaje.
- Mensajes por defecto: “No se pudo conectar al servidor.” / “No hay instrumentos.”
- Error: sello `dangerInk` “ERROR DE CONEXIÓN”, ayuda y botón “Reintentar”.
- Vacío: sello “CATÁLOGO VACÍO” y acción “Crear ficha”.
- Loading: spinner ámbar + mono 10 con tracking 2.
- El vacío se centra con `flexGrow: 1` en el contenido de la `FlatList`.

### 404

Ficha de 440 px máximo: serial `N.º —`, sello “EXTRAVIADA”, marco punteado 16:9 con
“SIN IMAGEN”, título Fraunces 26/31, cuerpo y botón ink “Volver al inicio”.

### Portada

- Fondo: `assets/images/attico-fondo.jpg` (copia optimizada, 1600 px) a opacidad
  0.42, velo `rgba(11,9,8,0.6)` y haz oblicuo ámbar al 0.05.
- Marco interior de 16 px a partir de 900 px de ancho.
- Metadatos `N.º 001` / `ÁTICO · EST. 2025` en mono.
- Título Fraunces en dos líneas, subtítulo itálico en dos líneas deliberadas.
- CTA ámbar y pie “EST. 2025 · LABORATORIO DE INTERFACES”.

## Movimiento

- Solo `transform` y `opacity`; nada de animar layout.
- Entradas de 340 ms; stagger 45 ms; press 0.97.
- `useReducedMotion` respeta `prefers-reduced-motion` en web y el ajuste del sistema
  en nativo: con reducción activa, todo aparece sin desplazamiento.

## Accesibilidad

- Áreas táctiles de 44 × 44 como mínimo.
- `accessibilityRole="button"` + `accessibilityLabel` en botones, fichas y acciones.
- El fondo decorativo queda fuera del árbol accesible.
- Contraste: tinta sobre papel y crema sobre penumbra; el ámbar se usa como acción,
  no como texto pequeño sobre papel.

## Verificación

`npx tsc --noEmit` · `node --test backend/funcional.test.js` ·
`npx expo export -p web` · `npx expo export -p android` · capturas a 375/768/1280 ·
estados vacío, error, reintento y 404.
