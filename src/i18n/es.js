// Diccionario ES — fuente: CONTENT.md. Es el idioma por defecto y el canónico:
// si una clave falta en en.js, se cae aquí.

export const es = {
  htmlLang: 'es-ES',
  title: 'PAOLA — Meta Ads Specialist · Performance Marketing',
  description:
    'Especialista en Meta Ads (Facebook e Instagram). Escala tu e-commerce o negocio digital con campañas de performance medibles: ROAS medio 4.2x, +$2M gestionados.',

  preloader: { label: 'Iniciando campaña', status: 'Campaña 2026 · Objetivo: conversión', delivering: 'Entregando impresión' },

  nav: { projects: 'Proyectos', services: 'Servicios', process: 'Proceso', plans: 'Planes', about: 'Sobre mí', contact: 'Contacto' },

  hero: {
    label: 'Meta Ads Specialist — Performance Marketing',
    meta: ['ROAS medio 4.2x', '+$2M gestionados', 'FB · IG'],
    scroll: 'Scroll',
  },

  // Las dos variantes del test A/B (CONTENT.md §3.1), traducidas ambas.
  variants: {
    A: 'Convierto presupuesto publicitario en <span class="accent-text">crecimiento medible</span>.',
    B: 'Cada dólar invertido tiene que <span class="accent-text">volver acompañado</span>.',
  },

  // Rótulo de cada sección. Hasta el 2026-08-16 iba precedido de «Etapa 0X ·
  // Interés»: el embudo se retiró con el resto del concepto de campaña.
  labels: {
    results: 'Resultados', cases: 'Creatividades',
    services: 'Servicios', process: 'Proceso',
    about: 'Quién lo opera', testimonials: 'Prueba social',
    plans: 'Trabajar juntos', calculator: 'Calculadora', faq: 'Preguntas',
    contact: 'Contacto',
  },

  metrics: ['ROAS medio', 'Ad spend gestionado', 'Retención de clientes', 'Campañas lanzadas'],

  projects: {
    title: 'Proyectos que <span class="accent-text">escalan</span>',
    hint: 'Arrastra el scroll →',
    delta: 'De {before} a {after}',
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
      { title: 'Meta Ads', desc: 'Campañas que no dependen de que una creatividad tenga suerte: estructura por fase, pujas revisadas y una escala que aguanta cuando sube el presupuesto.', tags: 'FB · IG · Advantage+',
        samples: ['Estructura de campaña por fase de funnel', 'Anuncio de catálogo en Reels', 'Panel de escala con ROAS por conjunto'] },
      { title: 'Paid Social', desc: 'Salir de Meta solo cuando los números lo piden, y hacerlo con piezas nativas de cada plataforma en vez de reciclar las mismas.', tags: 'TikTok · Pinterest · LinkedIn',
        samples: ['Misma campaña adaptada a tres plataformas', 'Creatividad nativa de TikTok', 'Comparativa de coste por canal'] },
      { title: 'Funnels &amp; CRO', desc: 'Que lo que pagas por traer no se caiga al llegar: medición sin agujeros, páginas probadas y el punto exacto donde se pierde la venta.', tags: 'Landings · A/B · Tracking',
        samples: ['Landing antes y después del rediseño', 'Embudo con caída por paso', 'Test A/B con la variante ganadora'] },
      { title: 'UGC &amp; Creatividades', desc: 'Creatividad nueva cada semana y con una hipótesis detrás, para que ganar deje de depender de haber acertado una vez.', tags: 'Guiones · Hooks · Testing',
        samples: ['Guion de UGC con sus tres hooks', 'Tanda de creatividades de una semana', 'Ranking de ángulos por retención'] },
      { title: 'Auditorías &amp; Consultoría', desc: 'Saber qué está fallando en tu cuenta y en qué orden arreglarlo, con un plan de 90 días que puedes ejecutar sin mí.', tags: 'Audit · Roadmap · Mentoring',
        samples: ['Diagnóstico de cuenta con fugas marcadas', 'Roadmap a 90 días por prioridad', 'Revisión de eventos y CAPI'] },
    ],
  },

  process: {
    title: 'Método de trabajo',
    steps: [
      { title: 'Auditoría', desc: 'Salimos con la lista de por dónde se está yendo el presupuesto hoy y con qué se puede recuperar en las dos primeras semanas.' },
      { title: 'Estrategia', desc: 'Sales sabiendo cuánto va a cada fase del embudo y qué hipótesis estamos comprando con ese dinero.' },
      { title: 'Creatividades', desc: 'Cada anuncio nace de un ángulo concreto, no de una idea suelta: gancho, prueba y llamada, listos para medirse por separado.' },
      { title: 'Lanzamiento', desc: 'Se publica con la medición limpia: eventos que cuadran, catálogo en orden y un test que se puede leer sin dudas.' },
      { title: 'Optimización', desc: 'Cada semana se retira lo que no rinde y se refuerza lo que sí — y te llega dicho por qué, no solo qué.' },
      { title: 'Escala', desc: 'Subir el presupuesto sin que el retorno se caiga: más audiencias, más canales y más mercados, en ese orden.' },
    ],
  },

  about: {
    title: 'Hola, soy Paola',
    imgAlt: 'Retrato de Paola',
    imgLabel: 'Foto — 4:5',
    p1: 'Llevo más de 6 años gestionando campañas de paid social para marcas que quieren crecer con datos, no con intuición. Mi obsesión: que cada dólar invertido tenga un retorno medible.',
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

  // ⚠ AQUÍ VIVÍA LA UI DEL CONCEPTO «LA CAMPAÑA ERES TÚ» (CONTENT.md §12-14):
  // el panel de sesión, las glosas de las señales de Ads Manager, el título de
  // retargeting y el informe entero. Se retiró el 2026-08-16: no se entendía y
  // no vendía. Su hueco lo ocupa el bloque de venta que empieza aquí.

  // --- BLOQUE DE VENTA: planes, calculadora y preguntas ---
  plans: {
    title: 'Tres formas de <span class="accent-text">empezar</span>',
    intro: 'Ninguna empieza con un contrato. Las tres empiezan con la misma llamada de 30 minutos, en la que miramos tu cuenta y te digo cuál de ellas te hace falta — o si no te hace falta ninguna.',
    cta: 'Pedir propuesta',
    // El <strong> con el que arranca cada «te llevas». Va suelto porque el resto
    // de la frase cambia por plan y esta palabra no.
    takeWord: 'Te llevas',
    items: [
      {
        tag: 'Puntual · 2 semanas',
        title: 'Auditoría',
        who: 'Tienes campañas en marcha y sospechas que se te está yendo presupuesto, pero no sabes por dónde.',
        list: [
          'Revisión completa de la cuenta publicitaria',
          'Diagnóstico de medición: píxel, CAPI y eventos duplicados',
          'Análisis de creatividades, audiencias y estructura',
          'Roadmap priorizado a 90 días',
        ],
        take: ' un documento con lo que hay que arreglar, en orden y con cuánto pesa cada cosa. Es tuyo, lo apliques conmigo o sin mí.',
      },
      {
        tag: 'Continuo · mínimo 3 meses',
        title: 'Gestión mensual',
        who: 'Ya inviertes cada mes y quieres a alguien dentro de la cuenta, no un informe cuando el mes ya ha pasado.',
        list: [
          'Estrategia y estructura de campañas por fase del funnel',
          'Sistema de testing creativo con tanda nueva cada semana',
          'Optimización y escala protegiendo el ROAS',
          'Revisión quincenal en llamada, no en PDF',
        ],
        take: ' una cuenta que crece con decisiones explicadas: qué se cambió, por qué y qué pasó después.',
      },
      {
        tag: 'Puntual · 6 semanas',
        title: 'Sprint de escala',
        who: 'La cuenta ya funciona y quieres subir el presupuesto sin que el ROAS se caiga por el camino.',
        list: [
          'Plan de escalado por fases, con su techo calculado',
          'Apertura de audiencias, mercados y canales',
          'Sistema de refresco creativo que aguante el ritmo',
          'Traspaso documentado a tu equipo interno',
        ],
        take: ' un método de escalado que tu equipo sigue usando cuando yo ya no estoy.',
      },
    ],
  },

  calc: {
    title: 'Echa la cuenta <span class="accent-text">antes</span> de invertir',
    intro: 'Mueve los controles con tus propios números. Esto no predice nada: es la misma aritmética que vas a ver en cada reporte, y sirve para saber si lo que te propones se sostiene.',
    fields: {
      spend: 'Inversión publicitaria al mes',
      roas: 'ROAS objetivo',
      ticket: 'Ticket medio',
    },
    rows: {
      revenue: 'Retorno estimado',
      profit: 'Sobre lo invertido',
      sales: 'Ventas al mes',
      cpa: 'Coste máximo por venta',
    },
    // Rótulos de las barras «a escala». El bloque va aria-hidden: son etiquetas
    // que se LEEN, no que se anuncien.
    viz: {
      spend: 'Inviertes',
    },
    noteStrong: 'Multiplicar es la parte fácil.',
    note: ' Llegar a ese ROAS con ese ticket es todo lo demás de esta página: la estructura, las creatividades y las semanas de testing. Y el cálculo se hace en tu navegador — no se envía a ninguna parte.',
    // Solo para lector de pantalla, al soltar el control.
    announce: 'Con {spend} al mes y un ROAS de {roas}: retorno estimado {revenue}, {sales} ventas al mes, coste máximo por venta {cpa}.',
  },

  faq: {
    title: 'Antes de escribirme',
    items: [
      {
        q: '¿Cuánto hay que invertir para que esto tenga sentido?',
        a: 'Por debajo de unos $3.000 al mes de inversión publicitaria, el algoritmo no reúne datos suficientes para optimizar y cualquier test tarda semanas en concluir. Si estás por debajo, te lo digo en la primera llamada y te propongo qué hacer antes de empezar.',
      },
      {
        q: '¿Cuánto tarda en verse algo?',
        a: 'Las primeras señales, entre dos y tres semanas: es lo que tarda una tanda de creatividades en dar datos concluyentes. Un cambio de tendencia sostenido, entre 60 y 90 días. Cualquiera que te prometa resultados la primera semana está hablando de suerte, no de método.',
      },
      {
        q: '¿Hay permanencia?',
        a: 'La gestión mensual pide tres meses de compromiso inicial, y no es para atarte: en menos tiempo no da tiempo a auditar, corregir y medir el efecto de lo corregido. A partir del cuarto mes es mes a mes, sin preaviso.',
      },
      {
        q: '¿Trabajas con mi sector?',
        a: 'Sobre todo e-commerce, formación e infoproductos y servicios con venta digital. Si vendes offline o con ciclos de decisión de meses, el trabajo cambia bastante y hay perfiles mejores que el mío: te lo diré antes de aceptar el proyecto, no después.',
      },
      {
        q: '¿Quién produce las creatividades?',
        a: 'El sistema, los ángulos y los guiones, yo. La producción depende del caso: tu equipo, creadores UGC o producción externa. Lo que no cambia es el criterio — cada pieza sale con una hipótesis detrás y se mide por separado.',
      },
      {
        q: '¿Qué necesito tener montado antes de empezar?',
        a: 'Píxel y API de conversiones funcionando, catálogo si vendes producto y acceso de administrador a tu cuenta publicitaria. Si falta algo, no es un problema: la auditoría empieza justo ahí.',
      },
    ],
  },

  contact: {
    pre: '¿Tienes un proyecto entre manos?',
    cta: '¿Escalamos?',
    time: 'Hora local —',
    // Rótulo de la barra fija de móvil (PROPUESTAS-NIVEL.md §C3).
    mobileCta: 'Escríbeme',
    // El formulario. Los `value` del <select> NO se traducen — viajan a Netlify y
    // los lee la clienta, que trabaja en español; lo que cambia de idioma es el
    // rótulo visible. Ver sections/plans.js, que precualifica por ese mismo value.
    form: {
      name: 'Nombre',
      email: 'Email',
      plan: 'Qué te interesa',
      planOptions: ['Todavía no lo sé', 'Auditoría', 'Gestión mensual', 'Sprint de escala'],
      message: 'Cuéntame el proyecto',
      // {link} se sustituye por el enlace a la política, que conserva su href.
      consent: 'He leído y acepto la {link}.',
      consentLink: 'política de privacidad',
      submit: 'Enviar mensaje',
      honeypot: 'No rellenar:',
    },
    status: {
      sending: 'Enviando…',
      ok: 'Mensaje enviado. Te respondo en menos de 24 h.',
      error: 'No he podido enviar el formulario. Escríbeme directamente a hola@paola-ads.com.',
    },
  },

  footer: {
    rights: '© 2026 Paola — Todos los derechos reservados',
    top: 'Volver arriba ↑',
    marquee: ['Trabajemos juntos', "Let's work together"],
  },

  langSwitch: { label: 'Cambiar idioma', to: 'EN' },
  // Igual que el de idioma, el botón anuncia a DÓNDE se va, no dónde estás.
  theme: { label: 'Cambiar tema', toLight: 'Claro', toDark: 'Oscuro' },
}
