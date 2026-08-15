# Tarea 21 — Efectos de texto: scramble mono + split de H2

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). El selector de objetivos, los
> "Ajustes obligatorios por la fase E" y el ⚠ No hacer son **literales** del transcript
> (con sus ediciones posteriores). El resto se ha reescrito.

## Objetivo
Dos efectos tipográficos: los labels mono se "resuelven" desde caracteres aleatorios al
entrar en pantalla, y los H2 de sección entran por palabras con máscara.

## Archivos a crear/editar
- **Crear** `src/js/fx/scramble.js`
- **Crear** `src/js/fx/split-titles.js`
- **Editar** `src/styles/sections.css`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/fx/scramble.js` — `initScramble()`

IntersectionObserver a `threshold: 0.6`; cada elemento se desobserva al entrar y se
resuelve de izquierda a derecha a 2,2 caracteres por tick. Los espacios se respetan (si
no, la palabra "salta" de ancho).

```js
// OJO con dos cosas (ver "⚠ No hacer"):
// 1) Se apunta a .section-label__stage / __name, NO a .section-label: ese
//    contenedor tiene DOS hijos <span> y scramblearlo por textContent los
//    destruiría, perdiendo la jerarquía de color del label de etapa.
// 2) La UI del tracker queda excluida: escribe los mismos nodos a 4 Hz.
const targets = document.querySelectorAll(
  '.hero__meta span, .metric__label, .section-label__stage, .section-label__name, .projects__hint'
)
```

Además del selector se añadió un **cinturón** en el callback:
`if (el.closest('.hud, .report, .signal-toast')) return`. Si alguien amplía el selector
en el futuro, la regla se sigue cumpliendo sola.

### 2. `src/js/fx/split-titles.js` — `initSplitTitles()`

Envuelve cada palabra en `.word-mask > .word` **caminando el árbol**, no por `innerHTML`:
así se conservan los `<span>` internos, en particular el `.accent-text`. Entrada
`yPercent: 110 → 0`, `stagger: 0.07`, `once: true`.

Selector: `main section:not(#informe) h2.section-title`.

### 3. CSS
```css
.word-mask { display: inline-block; overflow: clip; vertical-align: bottom; }
.word { display: inline-block; will-change: transform; }
```

> **Corrección encontrada en ejecución.** `.accent-text` pinta el gradiente sobre su caja
> y pone `-webkit-text-fill-color: transparent`. Al meter `.word` dentro, la palabra
> **hereda el relleno transparente pero no el fondo**: "escalan" desaparecía del H2 de
> proyectos. Se le re-aplica el gradiente a `.accent-text .word`. Como el único acento en
> un H2 partido es una sola palabra, el resultado es visualmente idéntico.

## Ajustes obligatorios por la fase E

1. **Excluir la UI del tracker del scramble.** `.hud`, `.report`, `.signal-toast` y sus
   descendientes escriben `textContent` a 4 Hz desde sus consumidores. Un scramble sobre
   esos mismos nodos pelearía por ellos y produciría parpadeo permanente. La exclusión ya
   está aplicada en el selector de arriba (no aparecen), pero **si alguien amplía el
   selector, esta es la regla**: nada dentro de `.hud`, `.report` ni `.signal-toast`.
2. **Apuntar a `.section-label__stage` / `__name`, nunca a `.section-label`.** Ese
   contenedor tiene dos hijos; escribir su `textContent` los borra.
3. **Sustituir el `requestAnimationFrame` propio de `scrambleElement` por
   `gsap.ticker.add()` / `gsap.ticker.remove()`.** `PLAN.md` §9.8 fija un único RAF para
   todo el sitio; el scramble es el último sitio donde quedaba uno suelto. ✅ aplicado

## Criterios de aceptación
- [x] Los labels mono se resuelven al entrar en pantalla y **terminan exactamente** en su
  texto original. Capturado en vuelo: `Etapa // P 77PCC9XY9&TYN` → `Etapa 03 ·
  Considerac614` → `Etapa 03 · Consideración`.
- [x] `.section-label` conserva sus **dos** hijos tras el scramble.
- [x] Ningún nodo dentro de `.hud`, `.report` o `.signal-toast` recibe scramble.
- [x] Los H2 entran por palabras con máscara (`overflow: clip`) y acaban en `y: 0`.
- [x] "escalan" conserva su gradiente.
- [x] El H2 del informe **no** se parte (0 palabras).
- [x] Ni un `requestAnimationFrame` propio: todo cuelga de `gsap.ticker`.
- [ ] Reduced-motion: ambos módulos salen antes. Guard presente, sin pasada end-to-end.

## Verificación
```bash
npm run dev
# 1) Labels mono resolviéndose al entrar
# 2) H2 "Proyectos que escalan": entra por palabras, "escalan" con gradiente
# 3) Subir y bajar: no se repiten
# 4) Reduced-motion: todo estático
```

## ⚠ No hacer
- No aplicar scramble a párrafos ni a KPIs con contador (tarea 10): solo labels
  listados en el selector.
- **No aplicar scramble a nada dentro de `.hud`, `.report` o `.signal-toast`.**
- No hacer split del h1 del hero (ya tiene su propia animación por caracteres).
- No hacer split del H2 del informe: `La campaña eres tú` es el remate del sitio y debe
  leerse limpio, no montado por palabras.
- No re-inicializar el split en resize: las máscaras por palabra son estables.
