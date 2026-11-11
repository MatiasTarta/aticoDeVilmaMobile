# El Ático de Vilma · Mobile

Catálogo móvil de una colección privada de instrumentos: portada, grilla paginada, ficha de cada pieza y alta de nuevas fichas. La interfaz sigue una dirección editorial de ático: papel crema, tinta cálida y un único acento ámbar.

## Stack

| Parte | Tecnología |
| --- | --- |
| App | Expo SDK 56 · React 19 · React Native 0.85 · Expo Router · TypeScript |
| Backend | Node.js · Express 5 · CORS |
| Datos | En memoria (se reinician con el servidor) |

## Estructura del repositorio

```
.
├── app/                        Proyecto Expo
│   ├── app.json                Configuración de Expo
│   ├── package.json            Dependencias y scripts de la app
│   ├── tsconfig.json           TypeScript y alias @/* -> src/*
│   ├── assets/                 Imágenes y fuentes
│   └── src/
│       ├── app/                Rutas de Expo Router (solo entrada)
│       │   ├── _layout.tsx
│       │   ├── +html.tsx
│       │   ├── +not-found.tsx
│       │   ├── (tabs)/
│       │   ├── crear.tsx
│       │   └── instrumento/[id].tsx
│       ├── Screens/            Pantallas reales
│       │   ├── Inicio/
│       │   ├── Catalogo/
│       │   ├── Ficha/
│       │   ├── Alta/
│       │   └── NoEncontrado/
│       ├── components/         Componentes reutilizables
│       │   ├── Button/
│       │   ├── CategoryPicker/
│       │   ├── ErrorBanner/
│       │   ├── FormField/
│       │   ├── InstrumentoCard/
│       │   ├── Screen/
│       │   ├── ScreenHeader/
│       │   ├── StateView/
│       │   └── Tag/
│       ├── hooks/              Hooks compartidos
│       ├── api/                Cliente HTTP del backend
│       ├── theme/              Tokens visuales y medidas de layout
│       ├── utils/              Formato y resolución de imágenes
│       └── types/              Contratos de datos
├── backend/                    API del catálogo
│   ├── app.js                  Rutas de Express
│   ├── server.js               Arranque del servidor
│   ├── funcional.js            Regla de visibilidad de instrumentos
│   ├── DDBBnt/instrumentos.js  Datos semilla en memoria
│   └── *.test.js               Pruebas
├── docs/sistema-visual.md      Sistema de diseño
├── README.md
└── .gitignore
```

Cada componente y cada pantalla vive en su propia carpeta con dos archivos:

```
Nombre/
├── Nombre.tsx           lógica y render
└── Nombre.styles.ts     solo estilos
```

Los archivos de `src/app/` son envoltorios mínimos que exportan la pantalla correspondiente desde `src/Screens/`. Así las rutas de Expo Router quedan separadas de la implementación.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Para probar en dispositivo: Expo Go, emulador de Android o simulador de iOS

## Instalación

```bash
cd backend
npm install

cd ../app
npm install
```

## Ejecución

> **Importante:** Expo debe ejecutarse desde `app/`, porque ahí está su `package.json`. Si corrés `npx expo start` en la raíz del repositorio, Expo falla con `The expected package.json path ... does not exist`.

### 1. Backend

```bash
cd backend
npm start
```

Queda escuchando en `http://localhost:3000`.

### 2. App

En otra terminal:

```bash
cd app

npm run web       # navegador
npm start         # Expo Dev Server (QR para Expo Go)
npm run android   # emulador Android
npm run ios       # simulador iOS
```

La app detecta el host del servidor de Expo para apuntar al backend en la red local. Para forzar otra URL:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000 npm run web
```

> En un dispositivo físico, la computadora y el teléfono deben estar en la misma red y el puerto `3000` debe ser accesible.

## Scripts

### `app/package.json`

| Script | Qué hace |
| --- | --- |
| `npm start` | Inicia Expo Dev Server |
| `npm run web` | Abre la app en el navegador |
| `npm run android` | Abre la app en Android |
| `npm run ios` | Abre la app en iOS |
| `npm run typecheck` | Verifica TypeScript sin emitir archivos |

### `backend/package.json`

| Script | Qué hace |
| --- | --- |
| `npm start` | Inicia la API en el puerto 3000 |
| `npm test` | Corre las pruebas de la API |

## API

Base: `http://localhost:3000`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/instrumentos` | Lista paginada de instrumentos |
| `GET` | `/api/instrumentos/:id` | Ficha de un instrumento |
| `POST` | `/api/instrumentos` | Crea un instrumento |
| `PUT` | `/api/instrumentos/:id` | Actualiza un instrumento |

Parámetros de listado:

| Parámetro | Por defecto | Descripción |
| --- | --- | --- |
| `cantidad` | `10` | Cantidad de resultados (mínimo 1) |
| `from` | `0` | Desplazamiento desde el inicio |
| `incluirEnDesarrollo` | — | Con `1` incluye instrumentos no funcionales |

Respuesta del listado:

```json
{
  "total": 24,
  "cantidad": 10,
  "from": 0,
  "datos": []
}
```

La app recorre las páginas de 50 en 50 hasta cubrir el `total`, así el catálogo no se trunca si crece.

### Persistencia

Los datos viven en memoria (`backend/DDBBnt/instrumentos.js`). Los instrumentos creados o modificados por la API se pierden al reiniciar el servidor.

## Diseño

- Tokens de color, tipografía, espaciado y radios: `app/src/theme/theme.ts`.
- Breakpoints y medidas de grilla: `app/src/theme/layout.ts`.
- Reglas de uso, jerarquía y accesibilidad: [`docs/sistema-visual.md`](docs/sistema-visual.md).

## Pruebas y verificación

```bash
cd backend && npm test        # 11 pruebas de la API
cd app && npm run typecheck   # TypeScript
cd app && npx expo export --platform web   # build web
```

## Solución de problemas

### `Unable to resolve module ./standard-navigation`

Aparece cuando Metro quedó corriendo mientras se actualizaban las dependencias. La instalación queda a medias y el bundle no resuelve un módulo interno de `expo-router`.

```bash
cd app
pkill -f "expo start" || true
npm ci
npx expo start -c
```

No ejecutes `npm install` con Metro encendido.

### Expo Go queda en una pantalla blanca o con la flecha de recarga

1. Cerrá Expo Go por completo y volvé a abrir el proyecto.
2. Verificá que el teléfono y la computadora estén en la misma red WiFi.
3. Si la red aísla a los dispositivos, usá un túnel:

```bash
cd app
npx expo start --tunnel -c
```

4. Revisá la terminal de Metro: tiene que aparecer `Android Bundled` y las trazas `[arranque]`.

## Notas

- Las imágenes locales se optimizaron a JPEG de hasta 1000 px. Si una ficha no tiene imagen, se usa `placeholder.jpg`.
- `+html.tsx` configura el documento HTML de la versión web (`lang="es"` y fondo oscuro) y `+not-found.tsx` muestra la pantalla de rutas inexistentes.
- Las fuentes se cargan en segundo plano en `app/src/app/_layout.tsx` y sus nombres salen de los tokens de `theme.ts`. Nunca bloquean el arranque: si fallan, se usan las del sistema.

## Licencia

Ver [`LICENSE`](LICENSE).
