# Tarea 01 — Tokens de diseño + base CSS

## Objetivo
Crear la única fuente de verdad visual (`tokens.css`) y la base global (`base.css`)
según `DESIGN.md`.

## Archivos a crear/editar
- **Crear** `src/styles/tokens.css`
- **Crear** `src/styles/base.css`
- **Editar** `src/main.js` → reemplazar el `console.log` por los imports de estilos

## Spec

### 1. `src/styles/tokens.css` (literal)
```css
:root {
  /* Color */
  --bg: #0E0E0E;
  --surface: #161616;
  --line: rgba(243, 242, 242, 0.08);
  --text: #F3F2F2;
  --muted: #8A8A8A;
  --accent-violet: #7B19C8;
  --accent-pink: #C559C4;
  --accent-orange: #F57327;
  --gradient-meta: linear-gradient(90deg, #7B19C8, #C559C4, #F57327);

  /* Tipografía */
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Escala tipográfica (DESIGN.md §2) */
  --fs-hero: clamp(4rem, 14vw, 13rem);
  --fs-cta: clamp(3rem, 12vw, 11rem);
  --fs-h2: clamp(2.5rem, 6vw, 5.5rem);
  --fs-h3: clamp(1.4rem, 3vw, 2.4rem);
  --fs-body: clamp(1rem, 1.2vw, 1.125rem);
  --fs-label: 0.75rem;
  --fs-metric: clamp(3rem, 6vw, 6rem);

  /* Layout */
  --container: min(92vw, 1440px);
  --section-pad: clamp(6rem, 12vw, 10rem);
  --radius: 1.25rem;

  /* Movimiento */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 0.3s;
  --dur-med: 0.6s;
  --dur-type: 1.1s;        /* compilación del informe (tarea 35) */

  /* Z-index */
  --z-hud: 90;             /* bajo el header: el HUD nunca tapa la nav */
  --z-header: 100;
  --z-grain: 200;
  --z-cursor: 300;
  --z-toast: 310;          /* sobre el cursor */
  --z-preloader: 400;

  /* UI del concepto (DESIGN.md §10) */
  --fs-hud: 0.6875rem;     /* 11px — --fs-label es demasiado grande para el rail */
  --hud-w: 13rem;
}
```

> Los tokens de la UI del concepto se definen **aquí y ahora** aunque no se usen hasta la
> fase E (tareas 31→36): `tokens.css` es la única fuente de verdad visual y no puede
> crecer a trozos desde otras tareas.

### 2. `src/styles/base.css` (literal)
```css
/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; } /* Lenis gestiona el scroll */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }

/* ===== BASE ===== */
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
::selection { background: var(--accent-violet); color: var(--text); }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 5px; }

img, canvas, svg, video { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
ul, ol { list-style: none; }

:focus-visible { outline: 2px solid var(--accent-pink); outline-offset: 4px; }

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 0.95;
  letter-spacing: -0.02em;
}

/* ===== UTILIDADES ===== */
.container { width: var(--container); margin-inline: auto; }
.section-pad { padding-block: var(--section-pad); }

.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.accent-text {
  background: var(--gradient-meta);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.section-title { font-size: var(--fs-h2); }

.section-label {
  display: block;
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

/* ===== GRANO GLOBAL (DESIGN.md §5) ===== */
.grain {
  position: fixed;
  inset: -50%;
  z-index: var(--z-grain);
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain 8s steps(10) infinite;
}
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  30% { transform: translate(3%, -15%); }
  50% { transform: translate(12%, 9%); }
  70% { transform: translate(9%, 4%); }
  90% { transform: translate(-1%, 7%); }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .grain { animation: none; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Editar `src/main.js` (literal completo)
```js
import './styles/tokens.css'
import './styles/base.css'
// sections.css se importará en la tarea 02 (cuando exista)

console.log('[paola] tokens + base ok')
```

## Criterios de aceptación
- [ ] `npm run dev` sin errores; consola muestra `[paola] tokens + base ok`.
- [ ] El fondo de la página es `#0E0E0E` (inspeccionar `body`).
- [ ] En DevTools → `:root` aparecen todas las custom properties, **incluidas
  `--z-hud`, `--z-toast`, `--fs-hud`, `--hud-w` y `--dur-type`**.
- [ ] El grano fijo existe cuando haya un `.grain` en el DOM (se añade en tarea 02).

## Verificación
```bash
npm run dev
# DevTools → Elements → body { background } debe ser rgb(14,14,14)
# DevTools → Elements → :root → listar --bg, --gradient-meta, --fs-hero, etc.
```

## ⚠ No hacer
- No crear `sections.css` todavía (tarea 02 lo crea junto al markup).
- No añadir las fuentes en CSS con `@import` (van por `<link>` en el HTML, tarea 02).
- No definir colores fuera de `tokens.css`.
