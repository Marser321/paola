# Tarea 00 — Scaffold del proyecto

## Objetivo
Dejar el proyecto Vite funcionando con las dependencias exactas y la estructura de
carpetas del plan.

## Archivos a crear/editar
- `package.json`, `vite.config.js`, `index.html` (generados por Vite, luego limpiados)
- `src/main.js` (reemplazar contenido del template)
- Borrar del template: `src/counter.js`, `src/style.css`, `src/javascript.svg`,
  `public/vite.svg`
- Crear carpetas: `src/styles/`, `src/js/core/`, `src/js/webgl/`, `src/js/sections/`,
  `src/data/`, `public/img/`

## Spec

### 1. Scaffold (en la carpeta del proyecto)
```bash
npm create vite@latest . -- --template vanilla
npm install
npm install gsap lenis three
```
> Si el directorio ya contiene archivos (esta documentación), Vite preguntará:
> elegir **"Ignore files and continue"** para NO borrar `PLAN.md`, `tasks/`, etc.

### 2. Limpieza del template
Eliminar: `src/counter.js`, `src/style.css`, `src/javascript.svg`, `public/vite.svg`.
En `index.html` quitar el `<link rel="icon" ...vite.svg>` y dejar el `<div id="app"></div>`
(será reemplazado por completo en la tarea 02).

### 3. `vite.config.js` (literal)
```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // build portable (Netlify/Vercel/GitHub Pages)
  build: {
    target: 'es2020',
  },
})
```

### 4. `src/main.js` (literal — punto de partida mínimo)
```js
// Orquestador principal. Los módulos se añaden tarea a tarea (ver tasks/README.md).
// NO importar módulos que aún no existen: cada tarea indica la línea exacta a añadir.

console.log('[paola] scaffold ok')
```

### 5. Crear carpetas vacías
`src/styles/` · `src/js/core/` · `src/js/ui/` · `src/js/webgl/` · `src/js/sections/` ·
`src/data/` · `public/img/`

> `src/js/ui/` alberga los consumidores visuales del tracker (HUD y toasts, tareas 32-33).
> Se separan de `core/` a propósito: `core/` calcula, `ui/` pinta.

## Criterios de aceptación
- [ ] `npm run dev` arranca en `http://localhost:5173` sin errores de consola.
- [ ] La consola del navegador muestra `[paola] scaffold ok`.
- [ ] `package.json` contiene `gsap`, `lenis`, `three` en dependencies y `vite` en devDependencies.
- [ ] Existen las 7 carpetas nuevas y se borraron los 4 archivos del template.

## Verificación
```bash
npm run dev
# abrir http://localhost:5173 → página en blanco, consola limpia con el log
```

## ⚠ No hacer
- No crear aún estilos, secciones HTML ni módulos JS (tareas siguientes).
- No instalar NINGÚN paquete adicional.
- No tocar `PLAN.md`, `DESIGN.md`, `CONTENT.md` ni otros archivos de `tasks/`.
