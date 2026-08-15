# Tarea 16 — Meta/OG, favicon, build y QA final de la v1

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). Las secciones 4, 5 y 6, los
> criterios de aceptación y el ⚠ No hacer proceden **literales** del transcript. Las
> secciones 1–3 (meta/OG, favicon, README) se han reescrito a partir de lo que las propias
> secciones supervivientes exigen y de `PLAN.md` §10.

## Objetivo
Cerrar la v1: metadatos sociales, favicon, `README.md` raíz que documente el concepto, y
la tabla de QA de `PLAN.md` §10 rellenada con resultados reales.

## Archivos a crear/editar
- **Editar** `index.html` (bloque de meta/OG en el `<head>`)
- **Crear** `public/favicon.svg`
- **Crear** `README.md` (raíz)

## Spec

### 1. Meta y Open Graph en `index.html`
Añadir tras la `<meta name="description">` ya existente:

```html
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
<meta name="theme-color" content="#0E0E0E" />
<meta name="robots" content="index, follow" />

<meta property="og:type" content="website" />
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="PAOLA" />
<meta property="og:title" content="PAOLA — Meta Ads Specialist · Performance Marketing" />
<meta property="og:description" content="Especialista en Meta Ads. La campaña eres tú: esta página mide tu visita y te enseña el informe, sin enviar un solo dato." />
<!-- Sin dominio real todavía: se activan en la tarea 26 (deploy).
<meta property="og:url" content="https://…" />
<meta property="og:image" content="https://…/og.jpg" />
-->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="PAOLA — Meta Ads Specialist" />
<meta name="twitter:description" content="La campaña eres tú. Un portfolio que mide tu visita y te la enseña, sin enviar nada." />
```

> El favicon va con ruta **relativa** (`./favicon.svg`) porque `vite.config.js` usa
> `base: './'` para que el build sea portable (tarea 00).

### 2. `public/favicon.svg`
Wordmark mínimo: la `P` de Clash Display sobre `--bg`, con el gradiente Meta.
Es SVG plano y autocontenido (el set completo de favicons es la tarea 27).

### 3. `README.md` raíz
Debe permitir a alguien que hereda el proyecto arrancarlo y **entender el concepto sin
leer las 38 tareas**. Incluye stack, comandos, estructura, y el apartado del §6.

### 4. QA final (ejecutar y registrar resultados)
```bash
npm run build
npm run preview
```

**Resultados de la ejecución del 2026-08-15** (build `vite v8.2.1`):

| Check | Criterio (PLAN.md §10) | Resultado |
|---|---|---|
| Build | Sin errores ni warnings de Vite | ⚠ Sin errores. **Un warning**: chunk >500 kB. Causa única: `three` en el bundle inicial → lo resuelve la tarea 17 |
| Consola | Sin errores en Chrome/Firefox/Safari | ◐ Chrome: limpia (dev y preview). **Firefox y Safari sin probar** en este entorno → tarea 19 |
| Performance hero+proyectos | 60fps estables | ☐ **No medido** (sin DevTools Performance aquí) → tarea 19 |
| Overflow horizontal | Ninguno 320→1920px | ✅ Verificado en 10 anchos vía iframes al ancho exacto: 320·360·390·767·768·834·1023·1024·1440·1920. Ninguno desborda |
| JS inicial | **< 150KB gzip** (autoridad: tarea 17 §6) | ❌ **190,64 kB gzip.** Es `three` entero. Queda abierto explícitamente para la tarea 17 |
| **Peticiones del tracker** | **0 durante una sesión completa** | ✅ Sesión completa (recorrido + backstage + informe + conversión): **9 recursos en total, 0 del tracker**. Son el JS, el CSS y 7 de tipografías |
| **Informe** | Compila al entrar y sus datos cuadran con la sesión | ✅ Compila con typing solo en la línea de estado; los valores coinciden con la visita real. `#contacto` no se desplaza (offset idéntico antes/después) |
| **Opt-out** | `Desactivar panel` apaga HUD, toasts e informe y purga storage | ✅ HUD destruido, cola vaciada, `paola-session` purgada, `paola-hud=false` persistida, informe congelado con su nota |
| Reduced-motion | Experiencia completa estática | ◐ Guard presente en los **17** módulos de animación (auditado por código; `tracker.js` no lo lleva a propósito: es dato, no movimiento). **Sin emulación end-to-end** en este entorno → tarea 19 |
| Lighthouse Perf/A11y | ≥ 90 / ≥ 95 | ☐ **No ejecutado** (sin Lighthouse en el entorno) → tarea 19 |
| Retargeting | Título cambia >20 s fuera y se restaura al volver | ✅ Observado en el build de preview: `← Esto es retargeting · PAOLA` y restauración exacta del título original |

### Hallazgo bloqueante para el lanzamiento

La sesión contacta con **cuatro hosts de terceros** — `api.fontshare.com`,
`cdn.fontshare.com`, `fonts.googleapis.com` y `fonts.gstatic.com` — mientras el informe
afirma que *"nada de esto ha salido de tu navegador"*. Es exactamente la contradicción que
`PLAN.md` §11.9 marca como el fallo más caro posible del proyecto. **El self-hosting de
fuentes (tarea 17 §5) no es opcional y la tarea 26 no puede cerrarse sin él.**

### 5. Cierre
- [ ] Marcar todas las tareas como hechas en `tasks/README.md`.
- [ ] Entregar a la persona el checklist de reemplazo (`CONTENT.md` §19).
- [ ] Si hubo bloqueos, revisar que `tasks/BLOCKERS.md` esté resuelto o documentado.

### 6. Documentar el tracker en el `README.md` raíz

El README debe explicar, en un apartado propio, qué mide el sitio, dónde lo guarda, que
no envía nada, y cómo se apaga. Quien herede este proyecto tiene que entender el concepto
sin leer las 38 tareas.

## Criterios de aceptación
- [ ] `npm run build` genera `dist/` sin errores.
- [ ] `npm run preview` sirve el sitio completo y funcional (misma experiencia que dev).
- [ ] Favicon visible en la pestaña.
- [ ] `README.md` raíz existe, es exacto y **documenta el tracker y su opt-out**.
- [ ] Tabla QA rellenada, incluida la fila de peticiones de red.

## ⚠ No hacer
- No activar `og:image`/`og:url` sin dominio real (dejar comentados).
- No añadir analytics ni scripts de terceros en v1.
- No optimizar imágenes: no hay imágenes en v1.
- No escribir "200KB" en ninguna parte: la cifra es 150KB y la fija la tarea 17.
