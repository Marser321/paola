# PAOLA — Portfolio Meta Ads Specialist

Portfolio one-page de una especialista en Meta Ads. Sitio estático, sin backend y sin
servicios de terceros.

Documentación del proyecto: [`PLAN.md`](PLAN.md) (plan maestro),
[`DESIGN.md`](DESIGN.md) (sistema de diseño), [`CONTENT.md`](CONTENT.md) (todos los textos)
y [`tasks/`](tasks/) (las 38 micro-tareas de ejecución, con su orden real en
[`tasks/README.md`](tasks/README.md)).

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Stack

Bloqueado. **No añadir librerías.**

| Capa | Elección |
|---|---|
| Build | Vite (template `vanilla`) |
| Animación | `gsap` + ScrollTrigger |
| Smooth scroll | `lenis` |
| 3D | `three` (solo el hero) |
| Fuentes | Clash Display + Satoshi (Fontshare), JetBrains Mono (Google Fonts) |

Dos reglas que se rompen con facilidad y cuestan caro:

- **`src/styles/tokens.css` es la única fuente de verdad visual.** Cero colores, fuentes o
  tamaños literales en cualquier otro archivo (excepciones documentadas: los shaders GLSL
  de `hero-scene.js` y `public/favicon.svg`, que no pueden leer custom properties).
- **Un solo RAF en todo el sitio: `gsap.ticker`.** Ni un `requestAnimationFrame` propio, ni
  un `setInterval`, ni un listener de `scroll`. Hasta el reloj del footer y la cola de
  toasts cuelgan del tick del tracker.

## Estructura

```
src/
├── main.js              ← orquestador; el ORDEN de las llamadas importa (ver abajo)
├── styles/              ← tokens · base · sections · tracker
├── data/projects.js     ← los 6 casos: para cambiar contenido, se edita AQUÍ
└── js/
    ├── core/            ← lenis · cursor · preloader · tracker · ab-test
    ├── ui/              ← hud · signals        (core calcula, ui pinta)
    ├── webgl/           ← hero-scene
    └── sections/        ← una por sección
```

### Tres restricciones de orden en `main.js`

Si se rompen, **no peta nada**: simplemente deja de funcionar en silencio.

1. `initTracker()` va después de `renderProjects()` — si no, no existen las
   `.project-card` que tiene que observar.
2. `initAbTest()` va antes de `initHero()` — si no, se ve el texto del subtítulo cambiar
   durante la animación de entrada.
3. `initReport()` va antes de `initContact()` — el panel del informe debe reservar su
   altura antes de que se midan los offsets de ScrollTrigger.

## El concepto: "LA CAMPAÑA ERES TÚ"

El sitio no cuenta que su autora sabe medir campañas: **lo hace con quien lo visita**. Un
panel de sesión registra la visita con el vocabulario real de Ads Manager, y antes del CTA
el visitante recibe el informe de su propia visita.

### Qué mide

Tiempo de sesión activo, profundidad de scroll, etapa del embudo alcanzada, qué
creatividades ha mirado y cuánto, señales emitidas (`PageView`, `ViewContent`, `Scroll75`,
`ContentEngagement`, `Dwell60`, `Retargeting`, `Conversion`) y qué variante A/B se sirvió.

### Dónde lo guarda

En `sessionStorage` (clave `paola-session`), que muere al cerrar la pestaña. En
`localStorage` solo vive una cosa: `paola-hud`, la preferencia de encendido/apagado del
panel.

### Qué NO hace

- **No hace ni una petición de red.** `src/js/core/tracker.js` no conoce `fetch`,
  `sendBeacon`, `gtag` ni `fbq`. La dependencia va siempre `analytics → tracker`, nunca al
  revés.
- **Cero PII y cero fingerprinting.** No lee user agent, ni idioma, ni resolución, ni
  referrer. No hay ningún identificador que persista entre visitas.
- No juzga a la persona. El panel describe la campaña ("etapa", "señales"), nunca al
  visitante ("interés alto").

### Cómo se apaga

Botón **`Desactivar panel`** en el propio panel (y enlace en el footer). El opt-out es
real: destruye el HUD, vacía la cola de toasts, congela el informe, purga
`sessionStorage` y silencia el emisor de señales. La preferencia se recuerda.

> Regla maestra del proyecto: **si una mecánica del tracker no puede apagarse desde el
> propio panel, no entra.**

### La probabilidad de conversión

Es una **heurística local declarada**, no una predicción. La fórmula está visible en el
propio informe ("ver fórmula") y su tope es **99**: ninguna estimación honesta dice 100%.

## Cambiar el contenido

Todos los textos visibles salen de `CONTENT.md`. Para los casos, se edita **solo**
`src/data/projects.js`. Regla de NDA: los presupuestos van siempre en rango y las
audiencias nunca identifican a un cliente.

Los **nombres de señal** (`PageView`, `ViewContent`…) son vocabulario literal de Ads
Manager y no se traducen nunca, tampoco al añadir i18n. Sus glosas en español sí.

## Pendiente antes de publicar

- **Self-hosting de las fuentes (obligatorio).** El sitio afirma que nada sale del
  navegador mientras carga tipografías desde `api.fontshare.com` y `fonts.googleapis.com`,
  lo que expone la IP del visitante a dos terceros. Ver `PLAN.md` §11.9 y tarea 17 §5.
- Code-splitting de `three` a un chunk dinámico (tarea 17).
- `og:url` y `og:image`, que están comentados hasta tener dominio (tarea 26).
