# Tarea 02 — Markup HTML completo

## Objetivo
`index.html` con los 11 bloques semánticos (10 secciones en `<main>` + footer) y
`sections.css` con los estilos estructurales (sin animaciones todavía). Todos los textos
se copian de `CONTENT.md`.

Esta tarea materializa dos piezas del concepto "LA CAMPAÑA ERES TÚ" (`PLAN.md` §1):

- Las **etapas del embudo** sustituyen a los índices genéricos `01 —`, `02 —`
  (`CONTENT.md` §5). Cada sección lleva además un `data-stage` que el tracker lee.
- La sección **`#informe`**, entre testimonios y contacto.

El HUD y los toasts **no** van en el HTML: los crea JS (tareas 32 y 33), igual que el
cursor.

## Archivos a crear/editar
- **Editar** `index.html` (reemplazo completo)
- **Crear** `src/styles/sections.css`
- **Editar** `src/main.js` (añadir import de `sections.css`)

## Spec

### 1. `index.html` (literal completo)
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PAOLA — Meta Ads Specialist · Performance Marketing</title>
    <meta name="description" content="Especialista en Meta Ads (Facebook e Instagram). Escala tu e-commerce o negocio digital con campañas de performance medibles: ROAS medio 4.2x, +2M€ gestionados." />
    <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <!-- PRELOADER — arranque de campaña (CONTENT.md §1) -->
    <div id="preloader" aria-hidden="true">
      <p class="preloader__label mono">Iniciando campaña</p>
      <p class="preloader__status mono">PAOLA_2026 · Objetivo: conversión</p>
      <p class="preloader__counter">0%</p>
      <div class="preloader__bar"><span class="preloader__bar-fill"></span></div>
    </div>

    <!-- HEADER -->
    <header class="site-header">
      <a href="#hero" class="site-header__logo" data-scroll data-hover>PAOLA<sup>®</sup></a>
      <nav class="site-nav" aria-label="Navegación principal">
        <a href="#proyectos" data-scroll data-hover>Proyectos</a>
        <a href="#servicios" data-scroll data-hover>Servicios</a>
        <a href="#proceso" data-scroll data-hover>Proceso</a>
        <a href="#sobre-mi" data-scroll data-hover>Sobre mí</a>
        <a href="#contacto" class="site-nav__cta" data-scroll data-hover>Contacto</a>
      </nav>
    </header>

    <main>
      <!-- ETAPA 01 · ALCANCE — HERO -->
      <section id="hero" class="hero" data-stage="alcance">
        <canvas id="hero-canvas" aria-hidden="true"></canvas>
        <div class="hero__fallback" aria-hidden="true"></div>
        <div class="hero__content container">
          <p class="hero__label mono">Meta Ads Specialist — Performance Marketing</p>
          <h1 class="hero__title" aria-label="Paola">PAOLA</h1>
          <p class="hero__subtitle" data-variant-slot="subtitle">
            Convierto presupuesto publicitario en
            <span class="accent-text">crecimiento medible</span>.
          </p>
          <div class="hero__meta mono">
            <span>ROAS medio 4.2x</span>
            <span>+2M€ gestionados</span>
            <span>FB · IG</span>
          </div>
        </div>
        <p class="hero__scroll mono" aria-hidden="true">
          Scroll<span class="hero__scroll-line"></span>
        </p>
      </section>

      <!-- ETAPA 01 · ALCANCE — MARQUEE -->
      <section class="marquee" aria-hidden="true" data-stage="alcance">
        <div class="marquee__track">
          <div class="marquee__inner">
            <span>Meta Ads</span><i>✦</i><span class="is-outline">Paid Social</span><i>✦</i>
            <span>Funnels</span><i>✦</i><span class="is-outline">CRO</span><i>✦</i>
            <span>UGC Strategy</span><i>✦</i><span class="is-outline">Media Buying</span><i>✦</i>
          </div>
          <div class="marquee__inner">
            <span>Meta Ads</span><i>✦</i><span class="is-outline">Paid Social</span><i>✦</i>
            <span>Funnels</span><i>✦</i><span class="is-outline">CRO</span><i>✦</i>
            <span>UGC Strategy</span><i>✦</i><span class="is-outline">Media Buying</span><i>✦</i>
          </div>
        </div>
      </section>

      <!-- ETAPA 01 · ALCANCE — MÉTRICAS -->
      <section id="metricas" class="metrics section-pad" data-stage="alcance">
        <div class="container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 01 · Alcance</span>
            <span class="section-label__name">Resultados</span>
          </p>
          <div class="metrics__grid">
            <div class="metric">
              <p class="metric__value" data-count="4.2" data-decimals="1" data-suffix="x">0</p>
              <span class="metric__spark" data-spark="2.1,2.8,3.3,3.6,4.0,4.2" aria-hidden="true"></span>
              <p class="metric__label mono">ROAS medio</p>
            </div>
            <div class="metric">
              <p class="metric__value" data-count="2" data-prefix="+" data-suffix="M€">0</p>
              <span class="metric__spark" data-spark="0.3,0.7,1.0,1.4,1.7,2.0" aria-hidden="true"></span>
              <p class="metric__label mono">Ad spend gestionado</p>
            </div>
            <div class="metric">
              <p class="metric__value" data-count="98" data-suffix="%">0</p>
              <span class="metric__spark" data-spark="88,91,93,95,97,98" aria-hidden="true"></span>
              <p class="metric__label mono">Retención de clientes</p>
            </div>
            <div class="metric">
              <p class="metric__value" data-count="120" data-suffix="+">0</p>
              <span class="metric__spark" data-spark="20,45,68,84,103,120" aria-hidden="true"></span>
              <p class="metric__label mono">Campañas lanzadas</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ETAPA 02 · INTERÉS — PROYECTOS / CREATIVIDADES -->
      <section id="proyectos" class="projects" data-stage="interes">
        <div class="projects__header container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 02 · Interés</span>
            <span class="section-label__name">Creatividades</span>
          </p>
          <h2 class="section-title">Proyectos que <span class="accent-text">escalan</span></h2>
          <p class="projects__hint mono">Arrastra el scroll →</p>
          <div class="projects__progress"><span class="projects__progress-fill"></span></div>
        </div>
        <div class="projects__viewport">
          <div class="projects__track"><!-- Las cards se renderizan por JS (tarea 11) desde src/data/projects.js --></div>
        </div>
      </section>

      <!-- ETAPA 03 · CONSIDERACIÓN — SERVICIOS -->
      <section id="servicios" class="services section-pad" data-stage="consideracion">
        <div class="container">
          <div class="services__header">
            <p class="section-label mono">
              <span class="section-label__stage">Etapa 03 · Consideración</span>
              <span class="section-label__name">Servicios</span>
            </p>
            <h2 class="section-title">Lo que hago</h2>
          </div>
          <ul class="services__list">
            <li class="service" data-hover>
              <span class="service__index mono">01</span>
              <h3 class="service__title">Meta Ads</h3>
              <p class="service__desc">Campañas de conversión en Facebook e Instagram: estructura, segmentación, pujas y escala horizontal y vertical.</p>
              <span class="service__tags mono">FB · IG · Advantage+</span>
            </li>
            <li class="service" data-hover>
              <span class="service__index mono">02</span>
              <h3 class="service__title">Paid Social</h3>
              <p class="service__desc">Expansión multicanal cuando el funnel lo justifica, con creatividades nativas por plataforma.</p>
              <span class="service__tags mono">TikTok · Pinterest · LinkedIn</span>
            </li>
            <li class="service" data-hover>
              <span class="service__index mono">03</span>
              <h3 class="service__title">Funnels &amp; CRO</h3>
              <p class="service__desc">Páginas y flujos que convierten: CAPI, píxel, eventos, tests A/B y análisis de drop-off.</p>
              <span class="service__tags mono">Landings · A/B · Tracking</span>
            </li>
            <li class="service" data-hover>
              <span class="service__index mono">04</span>
              <h3 class="service__title">UGC &amp; Creatividades</h3>
              <p class="service__desc">Sistema de producción y testing creativo: hooks, ángulos y iteración semanal basada en datos.</p>
              <span class="service__tags mono">Guiones · Hooks · Testing</span>
            </li>
            <li class="service" data-hover>
              <span class="service__index mono">05</span>
              <h3 class="service__title">Auditorías &amp; Consultoría</h3>
              <p class="service__desc">Auditoría completa de la cuenta publicitaria con roadmap accionable a 90 días.</p>
              <span class="service__tags mono">Audit · Roadmap · Mentoring</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ETAPA 03 · CONSIDERACIÓN — PROCESO -->
      <section id="proceso" class="process section-pad" data-stage="consideracion">
        <div class="container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 03 · Consideración</span>
            <span class="section-label__name">Proceso</span>
          </p>
          <h2 class="section-title">Método de trabajo</h2>
          <div class="process__timeline">
            <span class="process__line" aria-hidden="true"></span>
            <ol class="process__steps">
              <li class="step">
                <span class="step__number mono">01</span>
                <h3 class="step__title">Auditoría</h3>
                <p class="step__desc">Análisis de cuenta, tracking y competencia. Detectamos fugas de presupuesto y oportunidades rápidas.</p>
              </li>
              <li class="step">
                <span class="step__number mono">02</span>
                <h3 class="step__title">Estrategia</h3>
                <p class="step__desc">Hipótesis, ángulos, estructura de campañas y presupuesto por fase del funnel.</p>
              </li>
              <li class="step">
                <span class="step__number mono">03</span>
                <h3 class="step__title">Creatividades</h3>
                <p class="step__desc">Producción de anuncios (UGC, estáticos, vídeo) orientados a hook + prueba social + CTA.</p>
              </li>
              <li class="step">
                <span class="step__number mono">04</span>
                <h3 class="step__title">Lanzamiento</h3>
                <p class="step__desc">Setup técnico impecable: CAPI, eventos, catálogos y estructura de testing.</p>
              </li>
              <li class="step">
                <span class="step__number mono">05</span>
                <h3 class="step__title">Optimización</h3>
                <p class="step__desc">Iteración semanal: kill de perdedores, escala de ganadores, refresco creativo.</p>
              </li>
              <li class="step">
                <span class="step__number mono">06</span>
                <h3 class="step__title">Escala</h3>
                <p class="step__desc">Crecimiento sostenible protegiendo el ROAS: más presupuesto, más canales, más mercados.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ETAPA 04 · INTENCIÓN — SOBRE MÍ -->
      <section id="sobre-mi" class="about section-pad" data-stage="intencion">
        <div class="container about__grid">
          <div class="about__media" data-hover>
            <div class="about__img" role="img" aria-label="Retrato de Paola">
              <span class="about__img-label mono">Foto — 4:5</span>
            </div>
          </div>
          <div class="about__content">
            <p class="section-label mono">
              <span class="section-label__stage">Etapa 04 · Intención</span>
              <span class="section-label__name">Quién lo opera</span>
            </p>
            <h2 class="section-title">Hola, soy Paola</h2>
            <p class="about__text">Llevo más de 6 años gestionando campañas de paid social para marcas que quieren crecer con datos, no con intuición. Mi obsesión: que cada euro invertido tenga un retorno medible.</p>
            <p class="about__text">Trabajo con un número reducido de clientes para estar dentro de cada cuenta, cada semana. Sin humo: reporting claro, testing constante y decisiones basadas en números.</p>
            <ul class="about__cv mono">
              <li>2019 — Media Buyer · Agencia Performance (BCN)</li>
              <li>2021 — Senior Media Buyer · E-commerce Group</li>
              <li>2023 — Freelance · Meta Ads Specialist</li>
              <li>2026 — +40 marcas acompañadas</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ETAPA 04 · INTENCIÓN — TESTIMONIOS -->
      <section id="testimonios" class="testimonials section-pad" data-stage="intencion">
        <div class="container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 04 · Intención</span>
            <span class="section-label__name">Prueba social</span>
          </p>
          <div class="testimonials__stack">
            <blockquote class="testimonial">
              <p class="testimonial__quote">«Paola duplicó nuestro ROAS en 90 días y por fin entendimos qué campañas funcionaban y por qué.»</p>
              <footer class="testimonial__author mono">Marta G. — CEO · Atelier Nord</footer>
            </blockquote>
            <blockquote class="testimonial">
              <p class="testimonial__quote">«Reporting impecable y una velocidad de testing que no habíamos visto en ninguna agencia.»</p>
              <footer class="testimonial__author mono">Daniel R. — CMO · Flowstack</footer>
            </blockquote>
            <blockquote class="testimonial">
              <p class="testimonial__quote">«Pasamos de quemar presupuesto a escalar con control total. La mejor inversión del año.»</p>
              <footer class="testimonial__author mono">Lucía P. — Fundadora · Glow Skin</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <!-- ETAPA 05 · CONVERSIÓN — INFORME DE SESIÓN (CONTENT.md §14) -->
      <!-- El panel debe ser legible SIN JS: los valores arrancan en "—". -->
      <section id="informe" class="report section-pad" data-stage="conversion">
        <div class="container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 05 · Conversión</span>
            <span class="section-label__name">Tu informe</span>
          </p>
          <h2 class="section-title">La campaña <span class="accent-text">eres tú</span></h2>
          <p class="report__intro">Mientras leías, esta página hacía lo mismo que hago cada día con las cuentas que gestiono: medir. Este es el informe de tu visita.</p>

          <div class="report__panel" aria-describedby="report-note">
            <header class="report__head mono">
              <span class="report__dot" aria-hidden="true"></span>
              <span class="report__title">Informe de sesión</span>
              <span class="report__status" data-report="status">En espera</span>
            </header>

            <dl class="report__grid">
              <div class="report__row"><dt class="mono">Tiempo en sesión</dt><dd class="mono" data-report="elapsed">—</dd></div>
              <div class="report__row"><dt class="mono">Profundidad</dt><dd class="mono" data-report="depth">—</dd></div>
              <div class="report__row"><dt class="mono">Señales emitidas</dt><dd class="mono" data-report="signals">—</dd></div>
              <div class="report__row"><dt class="mono">Etapa alcanzada</dt><dd class="mono" data-report="stage">—</dd></div>
              <div class="report__row"><dt class="mono">Creatividades vistas</dt><dd class="mono" data-report="cases">—</dd></div>
              <div class="report__row"><dt class="mono">Más atención</dt><dd class="mono" data-report="topcase">—</dd></div>
              <div class="report__row"><dt class="mono">Variante servida</dt><dd class="mono" data-report="variant">—</dd></div>
            </dl>

            <div class="report__score">
              <p class="report__score-head mono">
                Probabilidad de conversión
                <span class="report__score-tag">Estimación heurística</span>
                <button type="button" class="report__formula-btn mono" aria-expanded="false" aria-controls="report-formula">ver fórmula</button>
              </p>
              <p class="report__score-value" data-report="score">—</p>
              <div class="report__score-bar"><span data-report="scorebar"></span></div>
              <p class="report__formula mono" id="report-formula" hidden>Heurística local: profundidad ×30 + permanencia ×20 + creatividades ×20 + señales ×15 + conversión ×15. Máximo 99: ninguna estimación honesta dice 100%.</p>
            </div>
          </div>

          <p id="report-note" class="report__note">
            <strong>Nada de esto ha salido de tu navegador.</strong> Sin cookies, sin píxel y sin servidor: se ha calculado aquí y desaparece cuando cierres la pestaña.
          </p>
          <p class="report__note">
            Medir bien no es recoger más datos. Es recoger los justos y saber leerlos. Eso es exactamente lo que hago con las cuentas que gestiono.
          </p>
        </div>
      </section>

      <!-- ETAPA 05 · CONVERSIÓN — CONTACTO -->
      <section id="contacto" class="contact section-pad" data-stage="conversion">
        <div class="container">
          <p class="section-label mono">
            <span class="section-label__stage">Etapa 05 · Conversión</span>
            <span class="section-label__name">Contacto</span>
          </p>
          <p class="contact__pre mono">¿Tienes un proyecto entre manos?</p>
          <a href="mailto:hola@paola-ads.com" class="contact__cta" data-hover data-magnetic>
            <span class="contact__cta-text">¿Escalamos?</span>
          </a>
          <a class="contact__email" href="mailto:hola@paola-ads.com" data-hover>hola@paola-ads.com</a>
          <p class="contact__time mono">Hora local — <span id="local-time">00:00:00</span></p>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer__marquee marquee marquee--reverse" aria-hidden="true">
        <div class="marquee__track">
          <div class="marquee__inner">
            <span>Trabajemos juntos</span><i>✦</i><span class="is-outline">Let's work together</span><i>✦</i>
          </div>
          <div class="marquee__inner">
            <span>Trabajemos juntos</span><i>✦</i><span class="is-outline">Let's work together</span><i>✦</i>
          </div>
        </div>
      </div>
      <div class="footer__bottom container mono">
        <span>© 2026 Paola — Todos los derechos reservados</span>
        <div class="footer__social">
          <a href="#" data-hover>LinkedIn</a>
          <a href="#" data-hover>Instagram</a>
          <a href="#" data-hover>X</a>
        </div>
        <button id="hud-toggle" data-hover hidden>Reactivar panel de sesión</button>
        <button id="back-to-top" data-hover>Volver arriba ↑</button>
      </div>
    </footer>

    <div class="grain" aria-hidden="true"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

> `#hud-toggle` nace con `hidden`: solo aparece si el visitante ha desactivado el panel
> (tarea 32) o si está en móvil, donde el HUD está oculto por defecto. En esta tarea es
> solo el hueco.

### 2. `src/styles/sections.css` (literal — estilos estructurales)
```css
/* ============================================================
   SECTIONS.CSS — estilos por sección. Sin animaciones JS aquí
   (cada tarea de animación solo añade clases/estados si las necesita).
   La UI del tracker (HUD, toasts, informe, chrome de anuncio) NO va aquí:
   vive en tracker.css (tarea 32).
   ============================================================ */

/* ===== LABEL DE ETAPA (sobrescribe el display:block de base.css) ===== */
.section-label {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
}
.section-label__stage { color: var(--text); }
.section-label__name { color: var(--muted); }

/* ===== PRELOADER ===== */
#preloader {
  position: fixed; inset: 0; z-index: var(--z-preloader);
  background: var(--bg);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 4vw; gap: 1rem;
}
.preloader__status { opacity: 0.5; }
.preloader__counter {
  font-family: var(--font-display); font-weight: 600;
  font-size: var(--fs-hero); line-height: 0.9; letter-spacing: -0.02em;
}
.preloader__bar { height: 2px; background: var(--line); overflow: hidden; }
.preloader__bar-fill {
  display: block; height: 100%; width: 100%;
  background: var(--gradient-meta);
  transform: scaleX(0); transform-origin: left;
}

/* ===== HEADER ===== */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-header);
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.25rem 4vw;
  mix-blend-mode: difference;
}
.site-header__logo {
  font-family: var(--font-display); font-weight: 700;
  font-size: 1.25rem; letter-spacing: -0.02em;
}
.site-header__logo sup { font-size: 0.5em; }
.site-nav { display: flex; gap: 2rem; }
.site-nav a {
  font-family: var(--font-mono); font-size: var(--fs-label);
  text-transform: uppercase; letter-spacing: 0.08em;
  opacity: 0.8; transition: opacity var(--dur-fast) var(--ease-out);
}
.site-nav a:hover { opacity: 1; }
.site-nav__cta { border-bottom: 1px solid var(--accent-pink); }

/* ===== HERO ===== */
.hero {
  position: relative; min-height: 100svh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding-bottom: 8vh; overflow: clip;
}
#hero-canvas, .hero__fallback {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.hero__fallback {
  background:
    radial-gradient(60% 50% at 20% 30%, rgba(123, 25, 200, 0.25), transparent 70%),
    radial-gradient(50% 40% at 80% 70%, rgba(245, 115, 39, 0.18), transparent 70%),
    var(--bg);
  display: none; /* visible solo si WebGL no se inicializa (tarea 08) */
}
.hero.no-webgl .hero__fallback { display: block; }
.hero__content { position: relative; z-index: 1; }
.hero__label { margin-bottom: 1.5rem; }
.hero__title {
  font-size: var(--fs-hero); font-weight: 700;
  margin-left: -0.04em; /* compensación óptica */
}
.hero__title .char { display: inline-block; will-change: transform; }
.hero__subtitle {
  max-width: 34ch; margin-top: 2rem;
  min-height: 2.6em; /* reserva para la variante más larga (tarea 36) */
  font-size: clamp(1.25rem, 2.4vw, 2rem); line-height: 1.3;
}
.hero__meta {
  display: flex; gap: 2.5rem; margin-top: 3rem;
  padding-top: 1.25rem; border-top: 1px solid var(--line);
}
.hero__scroll {
  position: absolute; right: 4vw; bottom: 8vh; z-index: 1;
  display: flex; align-items: center; gap: 0.75rem;
  writing-mode: vertical-rl;
}
.hero__scroll-line {
  width: 1px; height: 48px; background: var(--muted);
  transform-origin: top; animation: scroll-hint 1.8s var(--ease-out) infinite;
}
@keyframes scroll-hint {
  0% { transform: scaleY(0); } 50% { transform: scaleY(1); }
  100% { transform: scaleY(1); opacity: 0; }
}

/* ===== MARQUEE ===== */
.marquee {
  border-block: 1px solid var(--line);
  padding-block: 1.5rem; overflow: clip; white-space: nowrap;
}
.marquee__track { display: flex; width: max-content; will-change: transform; }
.marquee__inner {
  display: flex; align-items: center; gap: 3rem; padding-right: 3rem;
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(2.5rem, 6vw, 5rem); text-transform: uppercase;
  line-height: 1; letter-spacing: -0.02em;
}
.marquee__inner i { font-style: normal; font-size: 0.4em; color: var(--accent-pink); }
.marquee__inner .is-outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--muted);
}

/* ===== MÉTRICAS ===== */
.metrics__grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
}
.metric { padding: 2.5rem 2rem 2rem 0; border-right: 1px solid var(--line); }
.metric:last-child { border-right: 0; }
.metric__value {
  font-family: var(--font-mono); font-weight: 500;
  font-size: var(--fs-metric); line-height: 1; letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.metric__spark {
  display: block; height: 24px; margin-top: 0.75rem;
  color: var(--muted); /* el path del sparkline usa currentColor */
  /* el <svg> lo inyecta la tarea 10 */
}
.metric__label { margin-top: 1rem; }

/* ===== PROYECTOS ===== */
.projects { overflow: clip; }
.projects__header { padding-top: var(--section-pad); position: relative; }
.projects__hint { margin-top: 2rem; }
.projects__progress {
  height: 2px; background: var(--line); margin-top: 2rem; overflow: hidden;
}
.projects__progress-fill {
  display: block; height: 100%; width: 100%;
  background: var(--gradient-meta);
  transform: scaleX(0); transform-origin: left;
}
.projects__viewport { padding-block: 4rem var(--section-pad); }
.projects__track {
  display: flex; gap: 4vw; padding-inline: 4vw; width: max-content;
}
.project-card {
  position: relative; flex-shrink: 0;
  width: min(70vw, 560px);
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); overflow: hidden;
  transform-style: preserve-3d; will-change: transform;
}
.project-card__visual {
  aspect-ratio: 16 / 10; position: relative; overflow: hidden;
}
.project-card__gradient {
  position: absolute; inset: -10%;
  transition: transform var(--dur-med) var(--ease-out);
}
.project-card:hover .project-card__gradient { transform: scale(1.06); }
.project-card__body { padding: 1.75rem; }
.project-card__index { color: var(--muted); }
.project-card__title { font-size: var(--fs-h3); margin-top: 0.5rem; }
.project-card__tags { margin-top: 0.75rem; }
.project-card__kpis {
  display: flex; gap: 2.5rem; margin-top: 1.5rem;
  padding-top: 1.25rem; border-top: 1px solid var(--line);
}
.project-card__kpi-value {
  font-family: var(--font-mono); font-size: 1.5rem; font-weight: 500;
}
.project-card__kpi-label { color: var(--muted); font-size: 0.65rem; }
.project-card__desc { margin-top: 1.25rem; color: var(--muted); font-size: 0.95rem; }

/* ===== SERVICIOS ===== */
.services__header { position: sticky; top: 15vh; }
.services__list { margin-top: 4rem; }
.service {
  display: grid; grid-template-columns: 4rem 1fr 1.2fr auto;
  align-items: baseline; gap: 2rem;
  padding-block: 2.5rem; border-top: 1px solid var(--line);
  transition: padding-left var(--dur-med) var(--ease-out);
}
.service:last-child { border-bottom: 1px solid var(--line); }
.service:hover { padding-left: 1.5rem; }
.service__title { font-size: var(--fs-h3); }
.service__desc { color: var(--muted); max-width: 48ch; }

/* ===== PROCESO ===== */
.process__timeline { position: relative; margin-top: 4rem; padding-left: 3rem; }
.process__line {
  position: absolute; left: 0; top: 0; bottom: 0; width: 1px;
  background: var(--gradient-meta);
  transform: scaleY(0); transform-origin: top;
}
.step {
  display: grid; grid-template-columns: 5rem 1fr 1.5fr; gap: 2rem;
  align-items: baseline; padding-block: 2rem;
  border-top: 1px solid var(--line);
}
.step__desc { color: var(--muted); }

/* ===== SOBRE MÍ ===== */
.about__grid {
  display: grid; grid-template-columns: 1fr 1.4fr; gap: 6vw; align-items: start;
}
.about__media { position: sticky; top: 15vh; }
.about__img {
  aspect-ratio: 4 / 5; border-radius: var(--radius);
  border: 1px solid var(--line); overflow: hidden; position: relative;
  background: linear-gradient(160deg, #2B0A4A, var(--bg));
}
.about__img-label { position: absolute; bottom: 1rem; left: 1rem; }
.about__text { margin-top: 1.5rem; max-width: 52ch; }
.about__cv { margin-top: 2.5rem; border-top: 1px solid var(--line); }
.about__cv li { padding-block: 0.9rem; border-bottom: 1px solid var(--line); }

/* ===== TESTIMONIOS ===== */
.testimonials__stack { display: grid; gap: 2rem; margin-top: 2rem; }
.testimonial {
  position: sticky; top: 20vh;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: clamp(2rem, 5vw, 4rem);
}
.testimonial:nth-child(2) { top: 23vh; }
.testimonial:nth-child(3) { top: 26vh; }
.testimonial__quote {
  font-family: var(--font-display); font-weight: 600;
  font-size: var(--fs-h3); line-height: 1.15; letter-spacing: -0.02em;
}
.testimonial__author { margin-top: 2rem; }

/* ===== INFORME (estructura mínima; el detalle va en tracker.css, tarea 32) ===== */
.report__intro { max-width: 52ch; margin-top: 1.5rem; color: var(--muted); }
.report__note { max-width: 52ch; margin-top: 1.5rem; color: var(--muted); }
.report__note strong { color: var(--text); font-weight: 500; }

/* ===== CONTACTO ===== */
.contact { text-align: center; }
.contact .section-label { text-align: left; }
.contact__pre { margin-bottom: 2rem; }
.contact__cta { display: inline-block; }
.contact__cta-text {
  font-family: var(--font-display); font-weight: 700;
  font-size: var(--fs-cta); line-height: 0.95; letter-spacing: -0.02em;
  text-transform: uppercase;
  background: var(--gradient-meta);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.contact__email {
  display: inline-block; margin-top: 3rem;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  border-bottom: 1px solid var(--muted);
  padding-bottom: 0.25rem;
  transition: border-color var(--dur-fast) var(--ease-out);
}
.contact__email:hover { border-color: var(--accent-pink); }
.contact__time { margin-top: 2rem; }

/* ===== FOOTER ===== */
.footer { border-top: 1px solid var(--line); }
.footer__marquee { border-block: 0; border-bottom: 1px solid var(--line); }
.footer__bottom {
  display: flex; justify-content: space-between; align-items: center;
  gap: 2rem; padding-block: 1.5rem; flex-wrap: wrap;
}
.footer__social { display: flex; gap: 1.5rem; }
.footer__social a { transition: color var(--dur-fast) var(--ease-out); }
.footer__social a:hover { color: var(--accent-pink); }
#hud-toggle, #back-to-top { text-transform: uppercase; letter-spacing: 0.08em; }
```

### 3. Editar `src/main.js` (literal completo)
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

console.log('[paola] markup ok')
```

## Criterios de aceptación
- [ ] `npm run dev` sin errores; las 10 secciones de `<main>` visibles y apiladas en orden,
  con `#informe` **entre** `#testimonios` y `#contacto`.
- [ ] Las 8 secciones etiquetadas muestran su label de etapa en dos partes: la etapa en
  `--text` y el nombre de sección en `--muted`.
- [ ] Las 10 secciones de `<main>` tienen `data-stage` con uno de estos 5 valores:
  `alcance`, `interes`, `consideracion`, `intencion`, `conversion`.
- [ ] A 360px de ancho, ningún label de etapa desborda: envuelve a dos líneas gracias al
  `flex-wrap`. **Comprobarlo explícitamente**: el label pasa de ~18 a ~40 caracteres.
- [ ] El panel del informe es legible sin JS: las 7 filas muestran `—` y la nota final
  se lee entera.
- [ ] Las 4 métricas tienen `data-spark` y su último valor coincide con `data-count`.
- [ ] Fuentes aplicadas: titulares en Clash Display, labels en JetBrains Mono
  (Network: las 2 hojas de CDN cargan con 200).
- [ ] Sin scroll horizontal (el body usa `overflow-x: clip`).
- [ ] El preloader cubre la pantalla y dice "Iniciando campaña" (se quedará visible hasta
  la tarea 06 — normal).
- [ ] Header fijo con mix-blend-difference; grano visible sutilmente.

## Verificación
```bash
npm run dev
# 1) Scroll manual por toda la página: 10 secciones presentes, #informe antes de #contacto
# 2) DevTools → Network → fontshare + googleapis en 200
# 3) DevTools → Computed: h1 usa "Clash Display"
# 4) DevTools → responsive 360px: ningún label de etapa desborda
```

En la consola del navegador:
```js
// 10 secciones, todas con una etapa válida
const s = [...document.querySelectorAll('main section')]
s.length === 10 && s.every(el => ['alcance','interes','consideracion','intencion','conversion'].includes(el.dataset.stage))
// → true
```

## ⚠ No hacer
- No añadir ningún JS de animación ni importar gsap/three todavía.
- No cambiar textos: vienen de `CONTENT.md`.
- **No añadir el HUD ni los toasts al HTML.** Los crea JS (tareas 32 y 33), igual que el
  cursor. Aquí solo existe el hueco `#hud-toggle` del footer.
- No estilizar estados de animación (opacity:0 etc.): los reveals los aplica GSAP
  en sus tareas (evita contenido invisible si JS falla).
- No poner el CSS del panel del informe aquí más allá de lo estructural: el detalle
  (borde, cabecera, `<dl>`, barra de probabilidad) va en `tracker.css`, tarea 32.
- Para ver la página sin el preloader bloqueando, en DevTools: `#preloader { display:none }`
  temporal (no commitear ese cambio; la tarea 06 lo gestiona).
