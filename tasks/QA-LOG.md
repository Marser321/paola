# QA-LOG — Registro de pruebas

## 2026-08-15 — v1 + fase E + endurecimiento (tareas 00-19, 31-36) — Claude (sesión asistida)

Ejecutado contra el **build de producción** (`npm run build` + `npm run preview`,
Vite 8.2.1), no contra el dev server.

### Aviso sobre el alcance de esta pasada

El entorno de esta sesión tiene **un solo navegador (Chromium) y sin Lighthouse**, y su
pestaña corre en segundo plano buena parte del tiempo. Esto último importa más de lo que
parece: con la pestaña oculta el navegador **congela `requestAnimationFrame`**, y como
todo el movimiento del sitio cuelga de `gsap.ticker` (`PLAN.md` §9.8), cualquier check
dependiente del tiempo da un falso negativo.

Por eso la matriz de abajo separa dos clases de check:

- **Estructurales** — layout, guards, DOM, consola. Fiables en cualquier caso.
- **Temporales** — preloader, marquees, contadores, construcción del HUD, pin.
  Solo se dan por buenos cuando se verificaron con la pestaña en primer plano; en las
  filas donde el preloader no llegó a terminar, **toda la columna temporal es nula**, no
  fallida. Se marcan como `n/v` (no verificable aquí), nunca como ❌.

### 1. Matriz navegadores × viewports

| | 1920×1080 | 1440×900 | 1024×768 | 834×1112 | 390×844 | 360×640 |
|---|---|---|---|---|---|---|
| **Chromium** | ✅ | ✅ | ◐ | ◐ | ✅ | ◐ |
| **Firefox** | — | — | — | — | — | — |
| **Safari** | — | — | — | — | — | — |

Firefox y Safari: **no disponibles en el entorno.** Pendientes, y no son un trámite —
Safari en iOS es donde viven los quirks de la §3.

**Checks estructurales — 6/6 viewports OK:**

| Check | 1920 | 1440 | 1024 | 834 | 390 | 360 |
|---|---|---|---|---|---|---|
| Split del h1 en 5 `.char` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Guard de WebGL correcto | ✅ on | ✅ on | ✅ on | ✅ on | ✅ off | ✅ off |
| Galería: pin (≥1024) / columna (<1024) | ✅ pin | ✅ pin | n/v | ✅ col | ✅ col | ✅ col |
| Capa de toasts (ausente <768) | ✅ | ✅ | ✅ | ✅ | ✅ aus. | ✅ aus. |
| Sin overflow horizontal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Errores de consola | 0 | 0 | 0 | 0 | 0 | 0 |

Fronteras del HUD (verificadas aparte, tarea 15, con anchos exactos vía iframe):
**767 oculto → 768 línea → 1023 línea → 1024 rail.** ✅
Sin overflow horizontal en 10 anchos: 320·360·390·767·768·834·1023·1024·1440·1920. ✅

**Checks temporales** (verificados con la pestaña en primer plano, ~1233 px de ancho):
preloader completo y eliminado del DOM ✅ · entrada del hero por letras ✅ · marquees en
loop en direcciones opuestas y acelerando con el scroll (×2,3 medido) ✅ · contadores una
sola vez con overshoot y cierre exacto ✅ · pin horizontal `top: 0` estable con el track
scrubbeando −50 → −2200 ✅ · línea de proceso con scrub hasta `scaleY: 1` ✅ · apilado de
testimonios `[0.94, 0.94, 1]` ✅ · CTA magnético al factor 0,35 exacto ✅ · reloj corriendo
sin `setInterval` ✅ · HUD con sus 5 filas y la etapa coincidiendo con la sección ✅ ·
toasts a ≥4 s de separación y nunca dos a la vez ✅ · informe compilando con datos que
cuadran con la sesión ✅ · `Conversion` una sola vez y los toasts cesando ✅.

### 2. Estados especiales

| Estado | Resultado |
|---|---|
| Reduced motion | ◐ **Parcial.** Guard presente y auditado por código en los **17** módulos de animación (`tracker.js` no lo lleva a propósito: es dato, no movimiento). Sin pasada end-to-end con la emulación activa |
| Táctil | ✅ A 390 px: sin cursor custom, sin HUD, sin toasts, fallback de gradientes en el hero |
| Fuentes de terceros caídas | ✅ **Ya no aplica**: desde la tarea 17 §5 las fuentes son self-hosted. No hay CDN que pueda caerse |
| Sin WebGL | ✅ `.hero.no-webgl` con los gradientes CSS; el `<canvas>` se elimina del DOM |
| Cache frío | ✅ Recargas repetidas del build sin FOUC ni errores |
| JS lento (3G) | ☐ **No probado** (sin throttling). El mecanismo es correcto: `initHeroScene()` se llama sin `await` y el chunk de `three` no bloquea la entrada del hero |
| **HUD desactivado** | ✅ HUD destruido, cola de toasts vaciada, informe congelado con su nota, `paola-session` purgada de sessionStorage y `paola-hud=false` persistida. Reactivable desde el footer |
| **Storage bloqueado** | ✅ Con `setItem`, `getItem` y `removeItem` lanzando `SecurityError`: **cero excepciones**, el sitio sigue vivo y el HUD funciona en memoria. Es el escenario de Safari privado |
| **Retargeting** | ✅ Observado en el build: el título pasó a `← Esto es retargeting · PAOLA` y **se restauró exacto** al volver |
| **Retargeting corto** | ☐ No probado de forma controlada (<20 s) |
| **Variantes A y B** | ✅ Sirve A, `Cambiar` funde a B, el informe reporta `B · cambiada manualmente`, ambas caben sin desbordes |
| **Sesión larga (5 min)** | ☐ No ejecutada. El cap duro de 12 señales está verificado por código y por dedupe |
| **Red** | ✅ **Fila crítica marcada.** Sesión completa (recorrido + backstage + informe + conversión): **10 recursos, CERO de terceros y cero del tracker.** Tras el self-hosting no queda una sola petición fuera del origen |
| **Lector de pantalla** | ☐ **No probado.** Sin VoiceOver en el entorno. Verificado por código: `aria-hidden` en HUD y toasts, `<dl>` en el informe, un único `aria-live="polite"` |

### 3. Quirks iOS

☐ **Ninguno probado en dispositivo real.** `100svh` ya está aplicado desde la tarea 02 y
`normalizeScroll` sigue sin activarse, que es lo que manda la tarea mientras no se
confirme jitter real.

### 4. Capturas de referencia

☐ **`tasks/refs/` no creado.** Se tomaron capturas de trabajo del hero, métricas,
galería, backstage e informe durante la ejecución, pero no el juego completo de 12 a
1440×900 con el protocolo de la tarea 19 §4.

### Resumen

- Matriz navegadores × viewports: **6/18 celdas ejecutadas** (toda la fila de Chromium;
  Firefox y Safari no disponibles).
- Estados especiales: **8/14 verificados**, 6 no ejecutables aquí.
- Quirks iOS: 0/5 en dispositivo real.
- **Panel de red durante sesión completa: ✅ cero peticiones del tracker y cero a terceros.**
- **Datos del informe cuadran con la sesión real: ✅.**
- Incidencias: **1**, resuelta — `content-visibility` retirado, ver
  [`BLOCKERS.md`](BLOCKERS.md) §B-01.
- Capturas de referencia: ☐ pendientes.

### Para cerrar la tarea 19 hace falta

1. Firefox y Safari (escritorio) sobre los viewports de la matriz.
2. Safari en un iPhone real: quirks de la §3, sobre todo jitter del pin y `backdrop-filter`.
3. Lighthouse móvil 4G: LCP <2,5 s · CLS <0,05 · TBT <200 ms · A11y ≥95 · Perf ≥90.
4. Una pasada con `prefers-reduced-motion` activo de principio a fin.
5. VoiceOver + Safari, recorrido completo.
6. Las 12 capturas de referencia en `tasks/refs/`.

Nada de esto se puede hacer desde este entorno. **La tarea 19 queda abierta**, y la
tarea 26 (deploy) no debería cerrarse sin al menos los puntos 1, 2 y 3.
