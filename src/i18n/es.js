// Diccionario ES — fuente: CONTENT.md. Es el idioma por defecto y el canónico:
// si una clave falta en en.js, se cae aquí.

export const es = {
  htmlLang: 'es-ES',
  title: 'PAOLA — Meta Ads Specialist · Performance Marketing',
  description:
    'Especialista en Meta Ads (Facebook e Instagram). Escala tu e-commerce o negocio digital con campañas de performance medibles: ROAS medio 4.2x, +$2M gestionados.',

  preloader: { label: 'Iniciando campaña', status: 'PAOLA_2026 · Objetivo: conversión', delivering: 'Entregando impresión' },

  nav: { projects: 'Proyectos', services: 'Servicios', process: 'Proceso', about: 'Sobre mí', contact: 'Contacto' },

  hero: {
    label: 'Meta Ads Specialist — Performance Marketing',
    meta: ['ROAS medio 4.2x', '+$2M gestionados', 'FB · IG'],
    scroll: 'Scroll',
  },

  // Las dos variantes del test A/B (CONTENT.md §3.1), traducidas ambas.
  variants: {
    A: 'Convierto presupuesto publicitario en <span class="accent-text">crecimiento medible</span>.',
    B: 'Cada euro invertido tiene que <span class="accent-text">volver acompañado</span>.',
  },

  // Etapas del embudo (CONTENT.md §5). Se traduce el NOMBRE de la etapa;
  // la palabra "Etapa" y el número los compone la plantilla.
  stageWord: 'Etapa',
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

  metrics: ['ROAS medio', 'Ad spend gestionado', 'Retención de clientes', 'Campañas lanzadas'],

  projects: {
    title: 'Proyectos que <span class="accent-text">escalan</span>',
    hint: 'Arrastra el scroll →',
    backstage: 'Ver backstage',
    backstageHide: 'Ocultar backstage',
  },

  backstage: {
    title: 'Backstage', audience: 'Audiencia', budget: 'Presupuesto',
    objective: 'Objetivo', test: 'Test A/B', winner: 'Ganadora',
    sponsored: 'Patrocinado',
  },

  services: {
    title: 'Lo que hago',
    // `samples` = pie de cada muestra de la galería. Hace también de `alt` de la
    // imagen, así que describe QUÉ SE VE, no el servicio en abstracto.
    toggle: 'Ver muestras de este trabajo',
    items: [
      { title: 'Meta Ads', desc: 'Campañas de conversión en Facebook e Instagram: estructura, segmentación, pujas y escala horizontal y vertical.', tags: 'FB · IG · Advantage+',
        samples: ['Estructura de campaña por fase de funnel', 'Anuncio de catálogo en Reels', 'Panel de escala con ROAS por conjunto'] },
      { title: 'Paid Social', desc: 'Expansión multicanal cuando el funnel lo justifica, con creatividades nativas por plataforma.', tags: 'TikTok · Pinterest · LinkedIn',
        samples: ['Misma campaña adaptada a tres plataformas', 'Creatividad nativa de TikTok', 'Comparativa de coste por canal'] },
      { title: 'Funnels &amp; CRO', desc: 'Páginas y flujos que convierten: CAPI, píxel, eventos, tests A/B y análisis de drop-off.', tags: 'Landings · A/B · Tracking',
        samples: ['Landing antes y después del rediseño', 'Embudo con caída por paso', 'Test A/B con la variante ganadora'] },
      { title: 'UGC &amp; Creatividades', desc: 'Sistema de producción y testing creativo: hooks, ángulos e iteración semanal basada en datos.', tags: 'Guiones · Hooks · Testing',
        samples: ['Guion de UGC con sus tres hooks', 'Tanda de creatividades de una semana', 'Ranking de ángulos por retención'] },
      { title: 'Auditorías &amp; Consultoría', desc: 'Auditoría completa de la cuenta publicitaria con roadmap accionable a 90 días.', tags: 'Audit · Roadmap · Mentoring',
        samples: ['Diagnóstico de cuenta con fugas marcadas', 'Roadmap a 90 días por prioridad', 'Revisión de eventos y CAPI'] },
    ],
  },

  process: {
    title: 'Método de trabajo',
    steps: [
      { title: 'Auditoría', desc: 'Análisis de cuenta, tracking y competencia. Detectamos fugas de presupuesto y oportunidades rápidas.' },
      { title: 'Estrategia', desc: 'Hipótesis, ángulos, estructura de campañas y presupuesto por fase del funnel.' },
      { title: 'Creatividades', desc: 'Producción de anuncios (UGC, estáticos, vídeo) orientados a hook + prueba social + CTA.' },
      { title: 'Lanzamiento', desc: 'Setup técnico impecable: CAPI, eventos, catálogos y estructura de testing.' },
      { title: 'Optimización', desc: 'Iteración semanal: kill de perdedores, escala de ganadores, refresco creativo.' },
      { title: 'Escala', desc: 'Crecimiento sostenible protegiendo el ROAS: más presupuesto, más canales, más mercados.' },
    ],
  },

  about: {
    title: 'Hola, soy Paola',
    imgAlt: 'Retrato de Paola',
    imgLabel: 'Foto — 4:5',
    p1: 'Llevo más de 6 años gestionando campañas de paid social para marcas que quieren crecer con datos, no con intuición. Mi obsesión: que cada euro invertido tenga un retorno medible.',
    p2: 'Trabajo con un número reducido de clientes para estar dentro de cada cuenta, cada semana. Sin humo: reporting claro, testing constante y decisiones basadas en números.',
    cv: [
      '2019 — Media Buyer · Agencia Performance (BCN)',
      '2021 — Senior Media Buyer · E-commerce Group',
      '2023 — Freelance · Meta Ads Specialist',
      '2026 — +40 marcas acompañadas',
    ],
  },

  testimonials: [
    { quote: '«Paola duplicó nuestro ROAS en 90 días y por fin entendimos qué campañas funcionaban y por qué.»', author: 'Marta G. — CEO · Atelier Nord' },
    { quote: '«Reporting impecable y una velocidad de testing que no habíamos visto en ninguna agencia.»', author: 'Daniel R. — CMO · Flowstack' },
    { quote: '«Pasamos de quemar presupuesto a escalar con control total. La mejor inversión del año.»', author: 'Lucía P. — Fundadora · Glow Skin' },
  ],

  // --- UI del concepto (CONTENT.md §12, §13, §14) ---
  hud: {
    title: 'Sesión en curso',
    elapsed: 'Tiempo', depth: 'Profundidad', stage: 'Etapa',
    signals: 'Señales', variant: 'Variante', last: 'Última señal',
    switch: 'Cambiar', off: 'Desactivar panel',
    reactivate: 'Reactivar panel de sesión', disabled: 'Panel desactivado',
    aria: 'Panel de sesión',
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
    intro: 'Mientras leías, esta página hacía lo mismo que hago cada día con las cuentas que gestiono: medir. Este es el informe de tu visita.',
    panelTitle: 'Informe de sesión',
    status: { idle: 'En espera', compiling: 'Compilando…', done: 'Compilado', converted: 'Objetivo cumplido', off: 'Panel desactivado' },
    rows: {
      elapsed: 'Tiempo en sesión', depth: 'Profundidad', signals: 'Señales emitidas',
      stage: 'Etapa alcanzada', cases: 'Creatividades vistas',
      topcase: 'Más atención', variant: 'Variante servida',
    },
    forced: ' · cambiada manualmente',
    scoreLabel: 'Probabilidad de conversión',
    scoreTag: 'Estimación heurística',
    formulaShow: 'ver fórmula',
    formulaHide: 'ocultar fórmula',
    formula: 'Heurística local: profundidad ×30 + permanencia ×20 + creatividades ×20 + señales ×15 + conversión ×15. Máximo 99: ninguna estimación honesta dice 100%.',
    note1strong: 'Nada de esto ha salido de tu navegador.',
    note1: ' Sin cookies, sin píxel y sin servidor: se ha calculado aquí y desaparece cuando cierres la pestaña.',
    note2: 'Medir bien no es recoger más datos. Es recoger los justos y saber leerlos. Eso es exactamente lo que hago con las cuentas que gestiono.',
    announce: 'Informe de tu visita listo',
    offNote: 'Has apagado la medición. El informe se queda como estaba.',
  },

  contact: { pre: '¿Tienes un proyecto entre manos?', cta: '¿Escalamos?', time: 'Hora local —' },

  footer: {
    rights: '© 2026 Paola — Todos los derechos reservados',
    top: 'Volver arriba ↑',
    marquee: ['Trabajemos juntos', "Let's work together"],
  },

  langSwitch: { label: 'Cambiar idioma', to: 'EN' },
  // Igual que el de idioma, el botón anuncia a DÓNDE se va, no dónde estás.
  theme: { label: 'Cambiar tema', toLight: 'Claro', toDark: 'Oscuro' },
}
