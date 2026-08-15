### EDIT
--- old ---
## ⚠ No hacer
- No usar librerías i18n (i18next etc.): el motor de arriba cubre el caso.
- No traducir "PAOLA", nombres de clientes ni tags técnicos ya ingleses.
--- new ---
## Ajustes obligatorios por la fase E

1. **Añadir a los diccionarios**: los 5 nombres de etapa (`CONTENT.md` §5), los labels del
   HUD (§12), las glosas de los toasts (§13), el copy completo del informe (§14) y **las
   dos variantes A/B del hero** (§3.1) en cada idioma.
2. **Los nombres de señal NO se traducen.** `PageView`, `ViewContent`, `Scroll75`,
   `ContentEngagement`, `Dwell60`, `Retargeting`, `Conversion` son vocabulario literal de
   Ads Manager y esa es precisamente la gracia: son iguales en todos los idiomas porque
   así es como los ve quien trabaja con la herramienta. Solo se traducen las glosas.
3. **Llamar a `tracker.refresh()` tras el cambio de idioma.** `renderProjects()` destruye
   y recrea los nodos `.project-card`, dejando al `IntersectionObserver` del tracker
   observando elementos que ya no están en el DOM. Sin este `refresh()`, el dwell por
   creatividad deja de contar en silencio.
4. **`document.title`.** El retargeting del tracker captura el título **vigente** en el
   momento del blur, no una constante, precisamente para que funcione tras cambiar de
   idioma. Verificarlo: cambiar a inglés, salir de la pestaña 25 s, volver → el título
   restaurado debe ser el inglés.
5. **El título de retargeting** (`← Esto es retargeting · PAOLA`) sí se traduce.

## ⚠ No hacer
- No usar librerías i18n (i18next etc.): el motor de arriba cubre el caso.
- No traducir "PAOLA", nombres de clientes ni tags técnicos ya ingleses.
- **No traducir los nombres de señal.** `Scroll75` no es `Desplazamiento75`.
- No olvidar `tracker.refresh()`: el fallo es silencioso y solo se nota en el informe.

### EDIT
--- old ---
  labels: {
    results: '01 — Resultados', cases: '02 — Casos de éxito',
    services: '03 — Servicios', process: '04 — Proceso',
    about: '05 — Sobre mí', testimonials: '06 — Testimonios',
    contact: '07 — Contacto',
  },
  projects: { title: 'Proyectos que <span class="accent-text">escalan</span>', hint: 'Desliza para explorar →' },
--- new ---
  // Etapas del embudo (CONTENT.md §5). Se traduce el NOMBRE de la etapa;
  // la palabra "Etapa" y el número los compone la plantilla.
  stages: {
    alcance: 'Alcance', interes: 'Interés', consideracion: 'Consideración',
    intencion: 'Intención', conversion: 'Conversión',
  },
  labels: {
    results: 'Resultados', cases: 'Creatividades',
    services: 'Servicios', process: 'Proceso',
    about: 'Quién lo opera', testimonials: 'Prueba social',
    report: 'Tu informe', contact: 'Contacto',
  },
  projects: { title: 'Proyectos que <span class="accent-text">escalan</span>', hint: 'Arrastra el scroll →', backstage: 'Ver backstage' },

### EDIT
--- old ---
  testimonials: [ /* 3 objetos {quote, author} de CONTENT.md §11 */ ],
  contact: { pre: '¿Tienes un proyecto entre manos?', cta: '¿Escalamos?', time: 'Hora local —' },
--- new ---
  testimonials: [ /* 3 objetos {quote, author} de CONTENT.md §11 */ ],

  // --- UI del concepto (CONTENT.md §12, §13, §14) ---
  hud: {
    title: 'Sesión en curso',
    elapsed: 'Tiempo', depth: 'Profundidad', stage: 'Etapa',
    signals: 'Señales', variant: 'Variante', last: 'Última señal',
    switch: 'Cambiar', off: 'Desactivar panel',
    reactivate: 'Reactivar panel de sesión', disabled: 'Panel desactivado',
  },
  // ⚠ Las CLAVES de este objeto son nombres de señal de Ads Manager y NO se
  // traducen nunca, en ningún idioma. Solo se traducen los valores (las glosas).
  signals: {
    PageView: 'impresión servida',
    ViewContent: 'contenido visto',
    Scroll75: '75% de profundidad',
    ContentEngagement: 'interés en {case}',
    Dwell60: '60 s en página',
    Retargeting: 'has vuelto',
    Conversion: 'objetivo cumplido',
  },
  retargetTitle: '← Esto es retargeting · PAOLA',
  report: {
    title: 'La campaña <span class="accent-text">eres tú</span>',
    intro: 'Mientras leías, esta página hacía lo mismo que hago cada día…',
    panelTitle: 'Informe de sesión',
    status: { idle: 'En espera', compiling: 'Compilando…', done: 'Compilado',
              converted: 'Objetivo cumplido', off: 'Panel desactivado' },
    rows: { elapsed: 'Tiempo en sesión', depth: 'Profundidad', signals: 'Señales emitidas',
            stage: 'Etapa alcanzada', cases: 'Creatividades vistas',
            topcase: 'Más atención', variant: 'Variante servida' },
    forced: ' · cambiada manualmente',
    scoreLabel: 'Probabilidad de conversión', scoreTag: 'Estimación heurística',
    formulaShow: 'ver fórmula', formulaHide: 'ocultar fórmula',
    formula: 'Heurística local: profundidad ×30 + …',
    note1: 'Nada de esto ha salido de tu navegador…',
    note2: 'Medir bien no es recoger más datos…',
    announce: 'Informe de tu visita listo',
  },
  // Las dos variantes del test A/B (CONTENT.md §3.1), traducidas ambas.
  variants: {
    A: 'Convierto presupuesto publicitario en <span class="accent-text">crecimiento medible</span>.',
    B: 'Cada euro invertido tiene que <span class="accent-text">volver acompañado</span>.',
  },
  backstage: {
    title: 'Backstage', audience: 'Audiencia', budget: 'Presupuesto',
    objective: 'Objetivo', test: 'Test A/B', winner: 'Ganadora',
  },

  contact: { pre: '¿Tienes un proyecto entre manos?', cta: '¿Escalamos?', time: 'Hora local —' },