# DESIGN.md — Sistema de diseño

> Referencia visual completa. La implementación literal de los tokens se hace en la
> **tarea 01** (`src/styles/tokens.css`). Este documento explica el sistema y sus reglas.

---

## 1. Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0E0E0E` | Fondo global |
| `--surface` | `#161616` | Cards, paneles |
| `--line` | `rgba(243,242,242,.08)` | Bordes 1px, grid técnico |
| `--text` | `#F3F2F2` | Texto principal |
| `--muted` | `#8A8A8A` | Texto secundario, labels |
| `--accent-violet` | `#7B19C8` | Parada 1 del gradiente |
| `--accent-pink` | `#C559C4` | Parada 2 |
| `--accent-orange` | `#F57327` | Parada 3 |
| `--gradient-meta` | `linear-gradient(90deg,#7B19C8,#C559C4,#F57327)` | Acento único |

**Reglas de color:**
- El gradiente es el ÚNICO acento. Máximo **una aplicación visible por viewport**
  (un titular acentuado, una barra, un CTA… nunca todo a la vez).
- **La UI del concepto no usa el gradiente.** El HUD (§10), los toasts (§11) y la
  compilación del informe (§12) van en `--muted` / `--line`. El concepto gasta su única
  aplicación del gradiente en **la barra de probabilidad del informe** — es el clímax del
  sitio y por eso tiene que estar solo en su viewport. Ver `PLAN.md` §11.4.
- Texto acentuado siempre con la clase `.accent-text`:
  ```css
  .accent-text{
    background: var(--gradient-meta);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
  }
  ```
- Selection: fondo `--accent-violet`, texto `--text`.
- Scrollbar (webkit): track `--bg`, thumb `#2A2A2A`, ancho 10px.

## 2. Tipografía

| Rol | Fuente | Carga | Uso |
|---|---|---|---|
| Display | **Clash Display** 600/700 | Fontshare CDN | h1/h2/h3, marquee, CTA — siempre `text-transform: uppercase` |
| Cuerpo | **Satoshi** 400/500/700 | Fontshare CDN | párrafos, UI |
| Datos | **JetBrains Mono** 400/500 | Google Fonts | KPIs, labels, índices, reloj — siempre uppercase + `letter-spacing: .08em` |

CDN exacto (va en `<head>`, tarea 02):
```html
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Escala (fluida, clamp):**

| Token | Valor | Uso |
|---|---|---|
| `--fs-hero` | `clamp(4rem, 14vw, 13rem)` | Nombre en hero, CTA contacto usa `clamp(3rem, 12vw, 11rem)` |
| `--fs-h2` | `clamp(2.5rem, 6vw, 5.5rem)` | Títulos de sección |
| `--fs-h3` | `clamp(1.4rem, 3vw, 2.4rem)` | Servicios, pasos, cards |
| `--fs-body` | `clamp(1rem, 1.2vw, 1.125rem)` | Párrafos |
| `--fs-label` | `0.75rem` | Mono labels, índices |
| `--fs-metric` | `clamp(3rem, 6vw, 6rem)` | Números de métricas |

Line-height: display `0.95`, cuerpo `1.6`. Tracking display: `-0.02em`.

**Clase utilitaria `.mono`**: aplica fuente mono + uppercase + tracking. Usar en TODA
etiqueta de datos (índices de sección, tags, KPIs, reloj, footer).

## 3. Espaciado y layout

- `--container: min(92vw, 1440px)` centrado con `margin-inline: auto`.
- Padding vertical de sección: `clamp(6rem, 12vw, 10rem)` (clase `.section-pad`).
- Grid base de 12 columnas solo donde se indique; el resto, flex simple.
- Bordes siempre `1px solid var(--line)`. Radios: `--radius: 1.25rem` en cards;
  el resto del sitio es de esquinas rectas (estética terminal).

## 4. Movimiento (motion spec)

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Reveals (GSAP `ease:"power3.out"` ≈ equivalente) |
| `--dur-fast` | `.3s` | Hovers, micro-interacciones CSS |
| `--dur-med` | `.6s` | Transiciones CSS medias |

**Easings GSAP estándar del proyecto:** entradas `power3.out`, scrub `none`,
contadores `power2.out`, cortina preloader `power4.inOut`.

**Duraciones GSAP estándar:** reveal de letras hero `1.2s` stagger `0.04`;
reveals de sección `1s` con `y:60, opacity:0 → visible`; contadores `2s`.

**Regla de oro:** todo lo que se anima con scrub usa `ease:"none"`. Todo reveal
entra una vez (`once:true` o `toggleActions:"play none none none"`).

## 5. Textura de grano

Overlay global (elemento `.grain` al final del `<body>`):
```css
.grain{
  position: fixed; inset: -50%; z-index: var(--z-grain);
  pointer-events: none; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain 8s steps(10) infinite;
}
@keyframes grain{
  0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)}
  30%{transform:translate(3%,-15%)} 50%{transform:translate(12%,9%)}
  70%{transform:translate(9%,4%)} 90%{transform:translate(-1%,7%)}
}
```
Con `prefers-reduced-motion: reduce` → `animation: none`.

## 6. Cursor custom (estados)

| Estado | Dot (8px) | Ring (40px) |
|---|---|---|
| Normal | `--text`, fijo bajo el puntero | borde 1px `--muted`, sigue con lerp .15 |
| `[data-hover]` | escala .5 | escala 1.6, borde `--accent-pink` |
| `[data-hover="audience"]` (cards proyecto) | oculto | **píldora** (no círculo): fondo `--text`, `border-radius: 999px`, y dentro la audiencia del caso en `--bg` mono 10px — p. ej. `MUJERES 25-44 · ES`. Ver §13 y tarea 05 |
| Touch / `(hover:none)` | ambos `display:none`, cursor nativo restaurado | |

Ambos elementos se crean por JS (tarea 05), `mix-blend-mode: difference` en el ring.

## 7. Z-index

```
--z-hud: 90;   --z-header: 100;  --z-grain: 200;
--z-cursor: 300;  --z-toast: 310;  --z-preloader: 400;
```

Dos decisiones deliberadas del orden:

- **`--z-hud` (90) va por debajo de `--z-header` (100):** el panel de sesión no puede
  tapar nunca la navegación. Si hay conflicto, gana el header.
- **`--z-toast` (310) va por encima de `--z-cursor` (300):** un toast tapado por el
  cursor custom sería ilegible durante su segundo y medio de vida.

El banner de consentimiento (tarea 24) usa `--z-cursor` (300), muy por encima del HUD:
por eso no compiten, y por eso en tablet el HUD va **bajo el header** y no abajo.

Nada más usa z-index salvo casos locales (cards apiladas, y el backstage dentro de su
propia card).

## 8. Breakpoints

| Nombre | Rango | Cambios clave |
|---|---|---|
| Desktop | ≥1024px | Todo: pin horizontal, tilt 3D, WebGL completo. **HUD en rail lateral, toasts activos** |
| Tablet | 768–1023px | Sin pin (proyectos en columna), sin tilt; WebGL sí. **HUD en línea única bajo el header, toasts activos** |
| Móvil | <768px | Sin WebGL (fallback gradiente CSS), marquees más lentos, nav colapsada a esenciales. **Sin HUD (reactivable desde el footer) y sin toasts** |

En GSAP usar `gsap.matchMedia()`; en CSS, media queries `min-width` / `max-width`
coherentes con esta tabla.

## 9. Accesibilidad y reduced motion

- `:focus-visible` → `outline: 2px solid var(--accent-pink); outline-offset: 4px;`
- Todo canvas decorativo: `aria-hidden="true"`. El h1 real conserva `aria-label`.
- `@media (prefers-reduced-motion: reduce)`: desactivar grano animado, marquees
  (dejar estáticos), reveals (mostrar todo visible), WebGL off, smooth scroll off.
- Helper JS canónico (usarlo en todos los módulos de animación):
  ```js
  export const shouldReduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ```

---

# UI del concepto "LA CAMPAÑA ERES TÚ"

> Secciones §10–13. Toda esta UI es **aditiva**: no modifica ninguna decisión de §1–§9.
> Es deliberadamente la parte más callada del sitio. Si se nota, está mal.
> Reglas de tono y de contención en `PLAN.md` §11.

## 10. Panel de sesión (HUD)

Rail lateral persistente que muestra el estado de la campaña. Lo crea JS (tarea 32), como
el cursor — no está en el HTML.

**Tokens nuevos** (van a `tokens.css`, tarea 01):

```css
--z-hud: 90;          /* por debajo del header (100): el HUD nunca tapa la nav */
--z-toast: 310;       /* por encima del cursor (300) */
--fs-hud: .6875rem;   /* 11px — --fs-label (12px) es demasiado grande para el rail */
--hud-w: 13rem;
--dur-type: 1.1s;     /* compilación del informe */
```

**Anatomía** (desktop ≥1024px):

| Elemento | Especificación |
|---|---|
| Contenedor | `position: fixed; right: 1.25rem; top: 50%; translateY(-50%)`, ancho `--hud-w`, `border-left: 1px solid var(--line)`, `padding-left: .75rem`, `z-index: var(--z-hud)` |
| Título | `SESIÓN EN CURSO` en `.mono`, `--fs-hud`, `--muted`, `opacity: .6` |
| Filas | 5 filas `display:flex; justify-content:space-between`, label en `--muted`, valor en `--text` |
| Barra de profundidad | 1px de alto, pista `--line`, relleno `--muted`. **Nunca gradiente** |
| Botón apagado | `<button>` con texto (no icono), `--fs-hud`, `--muted`, subrayado en hover |
| Máximo | **6 líneas.** Si una mecánica nueva no cabe en 6 líneas, no entra |

**Estados:**

| Estado | Comportamiento |
|---|---|
| Antes del primer scroll | No existe en el DOM (se construye al primer scroll, por presupuesto de arranque) |
| Entrada | Fade + 8px de desplazamiento, `--dur-med`, `--ease-out` |
| Desactivado | Se destruye el DOM, se purga el storage, y el enlace del footer pasa a `PANEL DESACTIVADO` |
| Conversión | Única celebración permitida: la fila `ETAPA` parpadea una vez a `--text` y se queda |

**Breakpoints** (coherentes con §8):

| Rango | Forma |
|---|---|
| ≥1024px | Rail lateral derecho, 6 líneas |
| 768–1023px | Una sola línea **bajo el header** (nunca abajo: colisiona con el banner de consentimiento): `SESIÓN 01:24 · 47% · INTERÉS · 4 SEÑALES` |
| <768px | **Oculto por defecto.** Activable desde el footer. En móvil compite con la barra del navegador, el banner y el pulgar — y es donde más se percibiría como invasivo |

**Contraste:** mono 11px `--muted` (#8A8A8A) sobre `--bg` (#0E0E0E) ≈ **5.9:1** → cumple
AA. La barra de 1px es decorativa: el porcentaje está en texto justo al lado, nunca es el
único portador de la información.

**Accesibilidad:** `<aside aria-label="Panel de sesión">`. **No es una live region**: los
valores volátiles llevan `aria-hidden="true"`, porque anunciar un número que cambia 4
veces por segundo es inutilizable con lector de pantalla. La superficie accesible
equivalente es el informe (§12). El botón de apagado es un `<button aria-pressed>` real,
tabulable, y se inserta al final del `<body>` → es el último elemento del orden de tab.

**Reduced motion:** aparece sin desplazamiento, la barra salta al valor sin `transition`,
y el temporizador baja a 1 Hz. La profundidad y la etapa siguen a 4 Hz: son datos, no
movimiento. Gana una sexta fila, `ÚLTIMA SEÑAL`, que sustituye a los toasts.

## 11. Toast de señal

La mecánica más fácil de estropear: la distancia entre un guiño y una notificación de app
se mide en milisegundos y en píxeles. Los números de `PLAN.md` §11.3 son spec.

| Propiedad | Valor |
|---|---|
| Posición | Anclado al HUD: encima del rail (desktop), bajo la línea (tablet) |
| Tipografía | `.mono`, `--fs-hud`, `--muted` |
| Formato | `▸ ViewContent — contenido visto` (nombre sin traducir + glosa) |
| Fondo | `--surface` con `border: 1px solid var(--line)`, esquinas rectas |
| Entrada/salida | `opacity` + **8px máximo** de desplazamiento, `--dur-fast` |
| Duración | 1,5 s |
| Throttle | 1 cada 4 s (cola FIFO, nunca se apilan dos en pantalla) |
| Cap | 12 por sesión. Se apagan tras `Conversion` |
| Color de acento | **Ninguno.** Nunca |
| Sonido / icono | **No existen** |
| Móvil / reduced-motion | **No existen** |
| Accesibilidad | `aria-hidden="true"` — 12 interrupciones con vocabulario técnico en inglés harían inusable el lector de pantalla, y el informe da la misma información completa y mejor |

## 12. Panel del informe

El clímax del sitio. Vive en `#informe`, entre testimonios y contacto.

| Elemento | Especificación |
|---|---|
| Panel | `border: 1px solid var(--line)`, fondo `--surface`, `--radius`, **`min-height` reservado** (si crece al compilarse, desplaza `#contacto` y descuadra los ScrollTriggers) |
| Cabecera | Punto de 6px + `INFORME DE SESIÓN` + estado a la derecha, todo `.mono` |
| Filas | `<dl>` semántica (son pares clave/valor, no una matriz), `dt` en `--muted`, `dd` en `--text`, `border-bottom: 1px solid var(--line)` |
| Valor sin JS | `—` en todas las filas. El panel debe ser legible aunque JS falle |
| Barra de probabilidad | **La única aplicación del gradiente en todo el concepto** (§1) |
| Nota final | Cuerpo, `--fs-body`, ancho máximo 52ch, `--muted` salvo la primera frase |

**Compilación:** al entrar en viewport (IntersectionObserver, una sola vez) se escribe con
efecto typing **solo la línea de estado** (`COMPILANDO…` → `COMPILADO`) mientras las filas
entran en cascada con `stagger: .06`. Nunca se teclea el contenido carácter a carácter:
sería costoso e ilegible con lector de pantalla. Un único RAF por lotes, jamás un
`setInterval` por carácter.

**Accesibilidad — esta es la superficie canónica del concepto.** `<dl>` semántica,
contenedor `aria-live="off"`, y **un único** anuncio `polite` al terminar de compilar:
*"Informe de tu visita listo"*. Las actualizaciones posteriores en vivo, incluida la
conversión, **no re-anuncian**. `aria-expanded` en el botón "ver fórmula".

**Móvil:** `.report__grid` pasa de 2 columnas a 1; `dt`/`dd` se apilan por fila.

**Reduced motion:** sin typing y sin cascada. El panel se pinta completo con estado
`COMPILADO`. Los datos siguen en vivo — es información, no animación.

## 13. Chrome de anuncio en las cards

Cada caso se presenta como la creatividad que fue. El chrome enmarca; **no compite** con
el caso.

| Elemento | Especificación |
|---|---|
| Cabecera | Avatar cuadrado de 24px (gradiente del caso) + `PAOLA®` + `Patrocinado` en `.mono` `--muted` |
| Badge de formato | Esquina superior derecha del visual, `.mono` `--fs-hud`, `border: 1px solid var(--line)`, fondo `--bg` a 60% |
| Botón CTA | Barra inferior del visual, `.mono`, fondo `--surface`, `border-top: 1px solid var(--line)`. **Decorativo: no es un `<button>`**, es un `<span>` — no lleva a ninguna parte |
| Backstage | **Overlay dentro del visual** que se desliza sobre la creatividad: audiencia completa, presupuesto, objetivo y el par A/B con la ganadora marcada. Disparado por `<button aria-expanded>` |
| Ganadora | Label `GANADORA` en `.mono` sobre `--text`, texto en `--bg`. La perdedora queda a `opacity: .45` |
| Coste de layout | **Cero.** El backstage es overlay a propósito: la altura de la card no cambia al abrirlo, así que no toca el pin horizontal ni obliga a un `ScrollTrigger.refresh()`. El chrome sí añade ~90px por card, pero se aplica en el render, **antes** de que ScrollTrigger mida nada |

**Accesibilidad:** `PAOLA® · Patrocinado` y el badge de formato son `aria-hidden="true"` —
son atrezo y ensuciarían la lectura del caso real. La audiencia **sí** es contenido: vive
en el backstage textual, nunca solo en el cursor.

**Interacción con la tarea 29:** cuando existan los casos de estudio, **el título navega y
el botón despliega**. El resto de la card no es clicable, para no romper el scrub del pin.
