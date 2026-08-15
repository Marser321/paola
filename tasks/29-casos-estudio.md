# Tarea 29 — Casos de estudio (`caso.html`, MPA)

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). Los "Ajustes obligatorios por la
> tarea 34", la nota sobre `data-hover="audience"` y el ⚠ No hacer son **literales** del
> transcript. El resto se ha reescrito.

## Objetivo
Una página de detalle por caso, con la narrativa larga y el backstage completo, sin
convertir el sitio en una SPA.

## Archivos a crear/editar
- **Crear** `caso.html`, `src/js/pages/caso.js`, `src/styles/caso.css`
- **Editar** `vite.config.js` (entrada MPA), `src/js/sections/projects.js` (enlace del
  título), `src/data/projects.js` (extensión `caseStudy`)

## Spec

### 1. Una plantilla, no seis
`caso.html` + `?id=<slug>`. `caso.js` busca el caso en `projects.js` y pinta. Si el `id`
no existe, se queda el **fallback que ya viene en el HTML** ("Caso no encontrado" con
enlace a la home): contenido real, no un hueco en blanco.

### 2. MPA en Vite
```js
rollupOptions: { input: { main: 'index.html', caso: 'caso.html' } }
```
Navegación nativa: ni router ni `pushState`.

### 3. Extensión `caseStudy` en `projects.js`
**Opcional** y no repite nada: `challenge`, `approach` (array de pasos), `outcome` y
`quote`. Los datos de anuncio (`adFormat`, `audience`, `budget`, `objective`, `cta`,
`abTest`, `beforeAfter`) ya estaban desde la tarea 03. Sin `caseStudy`, la página sigue
mostrando KPIs, visual y backstage.

### 4. `noindex` mientras el contenido sea placeholder
`caso.html` lleva `noindex, follow`. Seis páginas de detalle con texto de ejemplo
indexadas harían más daño que bien. Se quita cuando entre el contenido real (t.23), y
entonces se añaden al `sitemap.xml`.

### 5. Escapado
Todo lo que sale de los datos pasa por un `esc()`. Hoy `projects.js` lo escribe una
persona de confianza, pero es una plantilla que interpola datos en HTML y eso se protege
por defecto, no cuando duele.

## Ajustes obligatorios por la tarea 34

1. **Regla de interacción de la card: el título navega, el botón despliega.** Esta tarea
   envuelve el título en un `<a href="caso.html?id=…">` y la 34 ya añadió el botón
   `Ver backstage`. El resto de la card **no es clicable** — un click en toda la card
   rompería el scrub del pin horizontal. Son dos zonas de click y solo dos.
   ✅ Verificado: las únicas zonas clicables de una card son `A: Atelier Nord` y
   `BUTTON: View backstage`, la card no es un enlace, y el pin sigue en `top: 0`.
2. **`caso.html` muestra el backstage completo y desplegado**, sin botón: en la página de
   detalle no hay nada que ocultar. Audiencia, presupuesto, objetivo, formato, el test A/B
   con su ganadora y el antes → después, todo visible de entrada. ✅
3. **`projects.js` ya tiene los campos que necesita** (tarea 03): `adFormat`, `audience`,
   `budget`, `objective`, `cta`, `abTest`, `beforeAfter`. La extensión `caseStudy` de esta
   tarea añade lo demás (narrativa larga, imágenes), no los repite. ✅

**Mantener `data-hover="audience"` en la card.** El cursor sigue mostrando la audiencia
del caso — es información, no una invitación a hacer click. Quien quiere la página de
caso pulsa el título, que es un enlace real y se distingue como tal.

La card entera NO navega: solo el enlace del título, para no romper el scrub horizontal
con taps accidentales. Junto al botón `Ver backstage` de la tarea 34, son las **dos
únicas** zonas interactivas de la card.

## Criterios de aceptación
- [x] `caso.html?id=atelier-nord` pinta el caso completo: KPIs, antes → después, visual,
  reto, qué hicimos, resultado, backstage abierto y navegación a los otros 5 casos.
- [x] Un `id` desconocido muestra el fallback, no una página rota.
- [x] **El tracker no se inicializa**: sin HUD y sin toasts en la página de detalle.
- [x] Dos zonas clicables por card y el pin intacto.
- [x] El build genera `caso.html` con sus propios chunks (3,72 KB JS, 2,58 KB CSS).
- [ ] Contenido real de los 6 casos. **Bloqueado** por la tarea 23.
- [ ] Quitar `noindex` y añadir los casos al `sitemap.xml`. **Al cerrar la 23.**

## Verificación
```bash
npm run build && npm run preview
# /caso.html?id=atelier-nord   → caso completo
# /caso.html?id=noexiste       → "Caso no encontrado"
# /caso.html                   → lo mismo
```

## ⚠ No hacer
- No crear 6 HTML estáticos a mano: plantilla única + query string.
- No añadir router ni historial pushState: navegación nativa.
- **No hacer clicable la card entera** para "facilitar" la navegación: rompe el scrub.
- No inicializar el tracker en `caso.html`: el concepto vive en la one-page. Una página
  de detalle con HUD sería ruido, y el informe no tendría sentido ahí.
