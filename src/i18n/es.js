// Diccionario ES — fuente: la auditoría del 17 oct 2026 (Ajustes_Web_Paola_Parra.pdf)
// y src/data/perfil.js. Es el idioma por defecto y el canónico: si una clave
// falta en en.js, se cae aquí.
//
// Español NEUTRO de América, no de España: el sitio le habla a negocios
// hispanos en EE. UU. Costo y no coste, video y no vídeo, «ya pasó» y no «ya ha
// pasado». Lo vigila scripts/check-contenido.mjs sobre lo que se publica.
//
// ⚠ Ninguna cifra se escribe aquí que no esté en src/data/perfil.js o en
// src/data/sectores.js. Hasta el 2026-10-17 este archivo decía «ROAS medio
// 4.2x», «+$2M gestionados», seis clientes y tres testimonios que no existían.

export const es = {
  serviceStateAlts: [
  [
    "Aretes dorados sobre papel: producto presentado en el anuncio de ejemplo.",
    "Página de joyería en un portátil: la propuesta del anuncio continúa en la web.",
    "Una clienta y una asesora conversan sobre los aretes en el mostrador."
  ],
  [
    "Teléfono y libreta para registrar una nueva consulta.",
    "Conversación de seguimiento en el teléfono junto a una libreta de notas.",
    "Agenda de citas con un día señalado para confirmar el encuentro."
  ],
  [
    "Una persona envía una consulta desde un formulario en una tableta.",
    "Calendario en pantalla con una cita seleccionada y confirmada.",
    "Verificación de eventos recibidos con indicadores de confirmación en pantalla."
  ],
  [
    "Espacio de consulta que presenta el servicio de la página de ejemplo.",
    "Versión para celular de una página de reservas con formulario y fotografía del espacio.",
    "Confirmación de una reserva en un teléfono con símbolo de calendario."
  ],
  [
    "Frasco ámbar sobre piedra: primera escena para presentar el producto.",
    "Detalle de un gotero y una gota: segunda escena para mostrar el uso del producto.",
    "Frasco ámbar y su empaque: escena final de presentación del producto."
  ],
  [
    "Pantalla de comprobación con un evento pendiente: evidencia ilustrativa de una medición incompleta.",
    "Dos piezas impresas con productos distintos: ejemplo de una propuesta que pierde coherencia.",
    "Proceso de seguimiento con una etapa sin completar: ejemplo de una consulta sin próximo paso."
  ]
],
  htmlLang: 'es-US',
  title: 'Paola Parra — Paid Media Manager · Meta Ads, embudos y CRM',
  description:
    'Paid Media Manager para marcas hispanas en EE. UU.: Meta Ads, embudos y CRM en GoHighLevel que convierten inversión en citas y clientes. +US$1.1M invertidos.',

  // «Clientes potenciales» es el nombre del objetivo en el Ads Manager en
  // español: el de captación, que es el trabajo de verdad. Antes, «conversión».
  preloader: { label: 'Iniciando campaña', status: 'Campaña 2026 · Objetivo: clientes potenciales', delivering: 'Entregando impresión' },

  nav: { projects: 'Sectores', services: 'Servicios', process: 'Proceso', plans: 'Planes', about: 'Sobre mí', contact: 'Contacto' },

  hero: {
    label: 'Paid Media Manager · Meta Ads, embudos y CRM',
    // UNA frase, la de la auditoría. Aquí vivían las dos variantes de un test
    // A/B que nada medía, y la mitad de las visitas leía la de e-commerce.
    subtitle: 'Convierto inversión publicitaria en <span class="accent-text">citas y clientes</span> para marcas hispanas en EE. UU.',
    meta: ['+US$1.1M invertidos', '+40 marcas', '+9 años'],
    scroll: 'Scroll',
  },

  // Rótulo de cada sección. Hasta el 2026-08-16 iba precedido de «Etapa 0X ·
  // Interés»: el embudo se retiró con el resto del concepto de campaña.
  // «En cifras» y no «Resultados»: lo que hay ahí es escala (cuánto, cuántas
  // cuentas, cuántas marcas), no el resultado de una campaña.
  labels: {
    results: 'En cifras', cases: 'Sectores',
    services: 'Servicios', process: 'Proceso',
    about: 'Quién lo opera', testimonials: 'Prueba social',
    plans: 'Trabajar juntos', calculator: 'Calculadora', faq: 'Preguntas',
    contact: 'Contacto',
  },

  metrics: {
    labels: [
      'Invertidos en Meta Ads',
      'Cuentas publicitarias con inversión',
      'Cuentas con más de US$10,000',
      'Marcas hispanas en EE. UU.',
    ],
    sectoresTitulo: 'Dónde se ha invertido, por industria',
    fuente:
      'Fuente: Meta Ads, gasto por cuenta del 1 ene 2025 al 17 oct 2026 (cuentas en USD). No incluye cuentas en otras monedas ni deshabilitadas: la cifra real es mayor.',
  },

  // Nombre de cada sector de src/data/sectores.js y, en los cuatro de las
  // fichas, el evento con el que convierte: lo que la campaña busca conseguir.
  sectores: {
    joyeria: { nombre: 'Joyería y e-commerce', conversion: 'Ventas en línea y visitas a tienda' },
    salud: { nombre: 'Salud, estética y odontología', conversion: 'Citas de valoración' },
    credito: { nombre: 'Crédito, finanzas e impuestos', conversion: 'Consultas por llamada' },
    seguros: { nombre: 'Seguros', conversion: 'Cotizaciones por llamada' },
    tramites: { nombre: 'Trámites' },
    viajes: { nombre: 'Viajes y náutica' },
    'bienes-raices': { nombre: 'Bienes raíces' },
    educacion: { nombre: 'Educación' },
    otras: { nombre: 'Otras sin clasificar' },
  },

  projects: {
    // {pct} lo calcula apply-dom.js desde sectores.js: la cifra no se escribe a mano.
    // Sin espacio antes del %, como lo escribe Intl en es-US (y como se lee en EE. UU.).
    title: 'Cuatro sectores, <span class="accent-text">{pct}%</span> de la inversión',
    hint: 'Explora los sectores →',
    invested: 'invertidos en Meta Ads',
    share: '{pct}% del total',
    delta: 'De {antes} a {despues}',
    caseLink: 'Ver el caso',
  },

  backstage: { sponsored: 'Patrocinado' },

  // Página de caso (caso.html). Solo se ve con un caso publicable.
  caso: {
    title: '{titulo} — Caso · Paola Parra',
    reto: 'El reto',
    queHicimos: 'Qué hicimos',
    resultado: 'Resultado',
    ficha: 'Ficha',
    periodo: 'Periodo',
    inversion: 'Inversión',
    stack: 'Herramientas',
    cta: 'CTA del anuncio',
    antesDespues: 'Antes / después',
    otros: 'Otros casos',
  },

  services: {
    title: 'Lo que hago',
    // El botón de las muestras solo aparece si src/data/media.js declara una
    // galería para ese servicio. Hoy no hay ninguna: las que había eran
    // ilustraciones de los casos de plantilla. Cuando haya capturas reales, su
    // pie (que hace también de `alt`) va en `samples` de cada servicio.
    toggle: 'Ver muestras de este trabajo',
    items: [
  {
    "title": "Meta Ads: del anuncio a la consulta",
    "desc": "Campañas que conectan tu propuesta con personas que pueden escribir, llamar o reservar.",
    "tags": "Facebook · Instagram · TOFU-MOFU-BOFU"
  },
  {
    "title": "CRM: cada consulta, con seguimiento",
    "desc": "Organizo tus contactos y automatizo los mensajes para que cada consulta tenga un siguiente paso.",
    "tags": "GoHighLevel · Pipelines · SMS y correo"
  },
  {
    "title": "Medición: conecta la web, el CRM y Meta",
    "desc": "Conecto las acciones de tu página con el seguimiento del equipo y las señales que recibe Meta.",
    "tags": "Píxel · Eventos · CAPI"
  },
  {
    "title": "Landing pages: una página, una acción clara",
    "desc": "Diseño páginas que explican tu servicio y facilitan el contacto desde cualquier pantalla.",
    "tags": "GHL · WordPress · Shopify"
  },
  {
    "title": "Creativos: del guion a la pieza",
    "desc": "Desarrollo guiones y piezas con IA y edición de video para probar distintos mensajes.",
    "tags": "IA · Guiones · Premiere · Canva"
  },
  {
    "title": "Auditoría: qué corregir y por dónde empezar",
    "desc": "Reviso la cuenta, la medición y el recorrido de contacto para ordenar las próximas decisiones.",
    "tags": "Cuenta · Medición · Roadmap"
  }
],
  },

  experience: {
  "explore": "Explora cómo funciona",
  "replay": "Repetir recorrido",
  "next": "Avanzar consulta",
  "previous": "Sector anterior",
  "following": "Sector siguiente",
  "servicesNav": "Explorar servicios",
  "desktop": "Escritorio",
  "mobile": "Celular",
  "proposal": "Tu propuesta",
  "form": "Datos de contacto",
  "reserve": "Reservar una cita",
  "contact": "Consulta de ejemplo",
  "message": "Mensaje de seguimiento",
  "appointment": "Cita organizada",
  "priority": "Prioridad",
  "finding": "Hallazgo de ejemplo",
  "action": "Siguiente acción",
  "deliverable": "Con qué avanzamos",
  "system": "Tu captación",
  "systemSub": "Cada parte conecta",
  "processHint": "Elige una etapa para ver cómo avanza el trabajo.",
  "heroRoute": [
    "Anuncio",
    "Consulta",
    "Cita"
  ],
  "heroRouteLabel": "De la atención a la conversación",
  "details": [
    [
      "El anuncio presenta una propuesta concreta.",
      "La página amplía la misma propuesta y facilita el contacto.",
      "La persona puede escribir, llamar o reservar."
    ],
    [
      "La consulta entra al CRM con su origen identificado.",
      "Se organiza el seguimiento por SMS y correo.",
      "El contacto avanza a una cita con el equipo."
    ],
    [
      "La web registra la acción que realiza la persona.",
      "El CRM conecta la consulta con lo que pasó después.",
      "Meta recibe señales para orientar las siguientes decisiones."
    ],
    [
      "Una propuesta que se entiende al primer vistazo.",
      "Solo los datos necesarios para continuar la conversación.",
      "Una acción principal, visible también desde el celular."
    ],
    [
      "Un ángulo y un gancho para abrir la pieza.",
      "Una toma que muestra la propuesta de forma directa.",
      "Ritmo, mensaje y llamada a la acción en una misma pieza."
    ],
    [
      "Revisar que se mida la acción que importa.",
      "Conectar el anuncio con la propuesta de la página.",
      "Ordenar cómo se responde y se acompaña cada consulta."
    ]
  ],
  "findings": [
    "Evento sin revisar",
    "Mensaje desconectado",
    "Seguimiento pendiente"
  ],
  "actions": [
    "Comprobar el evento antes de cambiar el presupuesto.",
    "Alinear anuncio, página y llamada a la acción.",
    "Definir responsables, mensajes y etapas del CRM."
  ],
  "deliverables": [
    "Diagnóstico y prioridades",
    "Hipótesis y distribución de inversión",
    "Piezas listas para probar",
    "Campaña y medición conectadas",
    "Decisiones con una explicación",
    "Plan para ampliar lo que funciona"
  ],
  "chapters": [
    "El comienzo en comunicación digital.",
    "El paso a la gestión de campañas publicitarias.",
    "La estrategia conecta las piezas del recorrido.",
    "Dirección de publicidad y coordinación del equipo."
  ],
  "chapterLabel": "Trayectoria",
  "sceneLabels": [
    "Campaña",
    "Seguimiento",
    "Señales conectadas",
    "Página de destino",
    "Mesa de edición",
    "Orden de trabajo"
  ]
},

  studio: {
  "metrics": {
    "title": "La inversión toma forma.",
    "intro": "Explora la distribución por industria.",
    "select": "Selecciona una industria",
    "replay": "Repetir entrada",
    "share": "del total registrado",
    "scale": "Escala común · USD",
    "total": "Inversión registrada",
    "chart": "Distribución de inversión en nueve industrias",
    "hint": "Toca una barra o elige una industria."
  },
  "demo": "Demostración interactiva",
  "example": "Ejemplo ilustrativo",
  "play": "Reproducir",
  "pause": "Pausar",
  "replay": "Repetir",
  "next": "Avanzar consulta",
  "restart": "Volver al inicio",
  "device": "Vista de la página",
  "desktop": "Escritorio",
  "mobile": "Celular",
  "inquiry": "Consulta",
  "appointment": "Cita",
  "send": "Enviar evento",
  "received": "Evento recibido en Meta",
  "origin": "Origen · Meta Ads",
  "contact": "Consulta de ejemplo",
  "message": "Hola, recibimos tu consulta. El equipo te ayudará a elegir una cita.",
  "confirmed": "Cita organizada",
  "reserve": "Probar reserva",
  "reserved": "Solicitud recibida",
  "reservedNote": "Así se confirma el siguiente paso. Esta demostración no envía datos.",
  "back": "Ver página",
  "proposal": "Tu próxima cita empieza aquí",
  "proposalNote": "Conoce el servicio y encuentra un momento para hablar.",
  "promise": "Una propuesta clara",
  "question": "Un pequeño detalle.",
  "answer": "Así se incorpora a tu rutina.",
  "closing": "Conoce el producto.",
  "evidence": "Qué encontramos",
  "action": "Qué hacemos",
  "roadmap": "Plan de 90 días",
  "days": [
    "Días 1–30",
    "Días 31–60",
    "Días 61–90"
  ],
  "titles": [
    "Meta Ads: del anuncio a la consulta",
    "CRM: cada consulta, con seguimiento",
    "Medición: conecta la web, el CRM y Meta",
    "Landing pages: una página, una acción clara",
    "Creativos: del guion a la pieza",
    "Auditoría: qué corregir y por dónde empezar"
  ],
  "descriptions": [
    "Campañas que conectan tu propuesta con personas que pueden escribir, llamar o reservar.",
    "Organizo tus contactos y automatizo los mensajes para que cada consulta tenga un siguiente paso.",
    "Conecto las acciones de tu página con el seguimiento del equipo y las señales que recibe Meta.",
    "Diseño páginas que explican tu servicio y facilitan el contacto desde cualquier pantalla.",
    "Desarrollo guiones y piezas con IA y edición de video para probar distintos mensajes.",
    "Reviso la cuenta, la medición y el recorrido de contacto para ordenar las próximas decisiones."
  ],
  "deliverables": [
    [
      "Estrategia de campaña",
      "Anuncios por etapa",
      "Optimización por citas"
    ],
    [
      "Etapas del CRM",
      "SMS y correo",
      "Seguimiento de contactos"
    ],
    [
      "Píxel y eventos",
      "Conexión con el CRM",
      "API de Conversiones"
    ],
    [
      "Diseño adaptable",
      "Acción principal clara",
      "Conexión al CRM"
    ],
    [
      "Guion y gancho",
      "Piezas para probar",
      "Edición y cierre"
    ],
    [
      "Diagnóstico de cuenta",
      "Prioridades explicadas",
      "Plan de 90 días"
    ]
  ],
  "hints": [
    "Elige una etapa y sigue el recorrido.",
    "Avanza la consulta para ver qué sucede.",
    "Elige una acción y envía su evento.",
    "Cambia de pantalla y prueba la reserva.",
    "Reproduce la pieza o explora sus tres escenas.",
    "Abre un hallazgo para ver cómo se resuelve."
  ],
  "stages": [
    [
      "Anuncio",
      "Página",
      "Consulta"
    ],
    [
      "Ingreso",
      "Seguimiento",
      "Cita"
    ],
    [
      "Web",
      "CRM",
      "Meta"
    ],
    [
      "Propuesta",
      "Acción",
      "Confirmación"
    ],
    [
      "Gancho",
      "Mensaje",
      "Cierre"
    ],
    [
      "Medición",
      "Propuesta",
      "Seguimiento"
    ]
  ],
  "evidenceItems": [
    "La acción principal no tiene un evento comprobado.",
    "El anuncio y la página presentan propuestas distintas.",
    "Una consulta entra sin responsable ni próximo paso."
  ],
  "auditActions": [
    "Comprobar eventos y establecer una base de medición.",
    "Alinear anuncio, página y llamada a la acción.",
    "Conectar responsables, mensajes y etapas del CRM."
  ]
},

  processTour: {
  "play": "Reanudar recorrido",
  "pause": "Pausar recorrido",
  "previous": "Etapa anterior",
  "next": "Etapa siguiente",
  "auto": "Recorrido automático",
  "paused": "Exploración manual",
  "hover": "En pausa mientras exploras",
  "reduced": "Explora cada etapa",
  "hint": "Seis etapas conectadas. Elige una para ver qué hacemos.",
  "nextLabel": "Después",
  "cycle": "Un ciclo de mejora",
  "pieces": [
    [
      "Cuenta",
      "Recorrido",
      "Prioridades"
    ],
    [
      "Objetivo",
      "Audiencias",
      "Inversión"
    ],
    [
      "Gancho",
      "Mensaje",
      "Pieza"
    ],
    [
      "Eventos",
      "Campaña",
      "Activación"
    ],
    [
      "Lectura",
      "Prueba",
      "Decisión"
    ],
    [
      "Capacidad",
      "Presupuesto",
      "Expansión"
    ]
  ]
},
  polish: {
  "campaignTitles": [
    "Tu propuesta, visible",
    "Un mensaje conectado",
    "La conversación empieza"
  ],
  "campaignDescriptions": [
    "Un anuncio con una acción clara.",
    "La página continúa lo que prometiste.",
    "La consulta llega con su origen."
  ],
  "campaignFoot": [
    "Descubrir",
    "Conocer el servicio",
    "Iniciar contacto"
  ],
  "crmSlots": [
    "Identificar el origen",
    "Enviar seguimiento",
    "Confirmar el siguiente paso"
  ],
  "crmReady": "Por aquí continúa",
  "crmDone": "Etapa recorrida",
  "crmCurrent": "Ahora",
  "pageAddress": "tu-negocio / reserva",
  "pageBenefits": [
    "Servicio claro",
    "Atención personal",
    "Reserva sencilla"
  ],
  "signalNotes": [
    "Acción registrada",
    "Contacto identificado",
    "Señal de conversión"
  ],
  "eventRoute": "Recorrido del evento",
  "auditStage": "Prioridad de trabajo"
},

  serviceVisuals: {
    label: 'Ejemplo ilustrativo',
    intro: 'Del primer anuncio a la cita. Así conecto cada parte para que tu inversión tenga un siguiente paso claro.',
    items: [
      { alt: 'Aretes dorados sobre papel: producto presentado en el anuncio de ejemplo.', heading: 'Cada anuncio tiene un siguiente paso', stages: ['Anuncio', 'Página de destino', 'Consulta'], note: 'La campaña lleva a una acción concreta: escribir, llamar o reservar.' },
      { alt: 'Teléfono y libreta para registrar una nueva consulta.', heading: 'Una consulta que sigue avanzando', stages: ['Nueva consulta', 'Seguimiento', 'Cita agendada'], note: 'El CRM organiza cada contacto; los mensajes mantienen la conversación.' },
      { alt: 'Una persona envía una consulta desde un formulario en una tableta.', heading: 'Conectar lo que pasa en cada lugar', stages: ['Web', 'CRM', 'Meta'], note: 'La información vuelve a la campaña para saber qué consultas llegan a ser citas.' },
      { alt: 'Espacio de consulta que presenta el servicio de la página de ejemplo.', heading: 'Una página, una acción principal', stages: ['Propuesta clara', 'Formulario breve', 'Reservar una cita'], note: 'El anuncio y la página hablan de lo mismo, también desde el teléfono.' },
      { alt: 'Frasco ámbar sobre piedra: primera escena para presentar el producto.', heading: 'De una idea a una pieza que se puede probar', stages: ['Guion y gancho', 'Grabación', 'Edición'], note: 'Cada pieza prueba un mensaje concreto y termina con una llamada a la acción.' },
      { alt: 'Pantalla de comprobación con un evento pendiente: evidencia ilustrativa de una medición incompleta.', heading: 'Saber qué arreglar primero', stages: ['Detectar el problema', 'Ordenar prioridades', 'Definir la acción'], note: 'Un diagnóstico con pasos concretos para los próximos 90 días.' },
    ],
  },

  process: {
    title: 'Método de trabajo',
    steps: [
      { title: 'Auditoría', desc: 'Salimos con la lista de por dónde se está yendo el presupuesto hoy y con qué se puede recuperar en las dos primeras semanas.' },
      { title: 'Estrategia', desc: 'Sales sabiendo cuánto va a cada etapa del embudo y qué hipótesis estamos comprando con ese dinero.' },
      { title: 'Creativos', desc: 'Cada anuncio nace de un ángulo concreto, no de una idea suelta: gancho, prueba y llamada, listos para medirse por separado.' },
      { title: 'Lanzamiento', desc: 'Se publica con la medición limpia: eventos que cuadran, el CRM conectado y un test que se puede leer sin dudas.' },
      { title: 'Optimización', desc: 'Cada semana se retira lo que no rinde y se refuerza lo que sí, mirando el costo por cita y no solo el costo por lead — y te llega dicho por qué, no solo qué.' },
      { title: 'Escala', desc: 'Subir el presupuesto sin que se dispare el costo por cliente: más audiencias, más canales y más mercados, en ese orden.' },
    ],
  },

  about: {
    title: 'Hola, soy Paola',
    imgAlt: 'Paola Parra, Paid Media Manager, con la mano apoyada en la mejilla y mirando a la cámara',
    // p1 es el texto de la auditoría, tal cual. p2 sustituye a «trabajo con un
    // número reducido de clientes», que no casa con +40 marcas y un equipo de 4.
    p1: 'Llevo más de 9 años en marketing digital. Hoy dirijo el Departamento de Publicidad de AD Media Solution, con un equipo de 4 personas y más de 40 marcas hispanas en EE. UU.',
    p2: 'Mi trabajo no termina en el anuncio: conecto la campaña con la landing, el CRM y el seguimiento, para que lo que se mida sean citas y clientes, no clics.',
    cv: [
      '2017 — Community Manager',
      '2020 — Trafficker Digital · Printex',
      '2024 — Estratega Digital · Search Media',
      '2025 — Directora de Publicidad · AD Media Solution',
    ],
  },

  // Los testimonios NO viven aquí: son citas literales de clientes y no se
  // traducen. Ver src/data/testimonios.js (hoy vacío, a propósito).

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
          'Diagnóstico de medición: píxel, eventos y API de Conversiones',
          'Revisión del embudo: anuncio → landing → CRM → cita',
          'Roadmap priorizado a 90 días',
        ],
        take: ' un documento con lo que hay que arreglar, en orden y con cuánto pesa cada cosa. Es tuyo, lo apliques conmigo o sin mí.',
      },
      {
        tag: 'Continuo · mínimo 3 meses',
        title: 'Gestión mensual',
        who: 'Ya inviertes cada mes y quieres a alguien dentro de la cuenta, no un informe cuando el mes ya pasó.',
        list: [
          'Estrategia y campañas por etapa del embudo',
          'Creativos nuevos con una hipótesis detrás: IA, guiones y video',
          'Optimización por costo por cita y por cliente, no por lead barato',
          'Revisión quincenal en llamada, no en PDF',
        ],
        take: ' una cuenta que crece con decisiones explicadas: qué se cambió, por qué y qué pasó después.',
      },
      {
        // Antes «Sprint de escala», que prometía subir presupuesto «sin que el
        // ROAS se caiga»: un plan de e-commerce. Este vende el diferencial que
        // pide la auditoría — el sistema que va del anuncio a la cita.
        tag: 'Puntual · por proyecto',
        title: 'Sistema de captación',
        who: 'Tienes anuncios funcionando, pero los leads se enfrían antes de que alguien los llame.',
        list: [
          'Landing page o embudo (GoHighLevel, WordPress o Shopify)',
          'CRM y automatizaciones en GoHighLevel: seguimiento por SMS y correo',
          'Eventos y API de Conversiones conectados al CRM',
          'Traspaso documentado a tu equipo',
        ],
        take: ' un sistema que convierte el lead en cita sin depender de que alguien se acuerde de llamar.',
      },
    ],
  },

  calc: {
    title: 'Haz la cuenta <span class="accent-text">antes</span> de invertir',
    intro: 'Mueve los controles con tus propios números; los de partida son solo un ejemplo. Esto no predice nada: es la misma aritmética que vas a ver en cada reporte, y sirve para saber si lo que te propones se sostiene.',
    fields: {
      spend: 'Inversión publicitaria al mes',
      cpl: 'Costo por lead',
      agenda: 'Leads que agendan cita',
      cierre: 'Citas que se vuelven clientes',
    },
    rows: {
      clientes: 'Clientes al mes',
      leads: 'Leads al mes',
      citas: 'Citas al mes',
      costoCita: 'Costo por cita',
      costoCliente: 'Costo por cliente',
    },
    // Rótulos del embudo a escala. El bloque va aria-hidden: son etiquetas que
    // se LEEN, no que se anuncien.
    viz: { leads: 'Leads', citas: 'Citas', clientes: 'Clientes' },
    // La palanca: misma aritmética, con el agendamiento diez puntos más arriba.
    leverOne: 'Con los mismos {leads} leads, si agendan 10 puntos más ({agenda}), llega 1 cliente más al mes sin invertir un dólar más.',
    leverMany: 'Con los mismos {leads} leads, si agendan 10 puntos más ({agenda}), llegan {extra} clientes más al mes sin invertir un dólar más.',
    noteStrong: 'Dividir es la parte fácil.',
    note: ' Que esos leads contesten, agenden y lleguen a la cita es todo lo demás de esta página: el embudo, el CRM y el seguimiento. Y el cálculo se hace en tu navegador — no se envía a ninguna parte.',
    // Solo para lector de pantalla, al soltar el control.
    announce: 'Con {spend} al mes y {cpl} por lead: {leads} leads, {citas} citas y {clientes} clientes al mes. Costo por cita {costoCita}, costo por cliente {costoCliente}.',
  },

  faq: {
    title: 'Antes de escribirme',
    items: [
      {
        q: '¿Cuánto hay que invertir para que esto tenga sentido?',
        a: 'No hay un mínimo fijo. Con poco presupuesto, el trabajo se concentra en una sola campaña y en que el seguimiento no deje escapar ningún lead; cuando el costo por cita se sostiene, se sube. En la primera llamada vemos qué tiene sentido con lo que quieres invertir.',
      },
      {
        q: '¿Cuánto tarda en verse algo?',
        a: 'Las primeras señales, entre dos y tres semanas: es lo que tarda una ronda de creativos en dar datos concluyentes. Un cambio de tendencia sostenido, entre 60 y 90 días. Cualquiera que te prometa resultados la primera semana está hablando de suerte, no de método.',
      },
      {
        q: '¿Hay un plazo mínimo?',
        a: 'La gestión mensual pide tres meses de compromiso inicial, y no es para atarte: en menos tiempo no da tiempo a auditar, corregir y medir el efecto de lo corregido. A partir del cuarto mes es mes a mes, sin preaviso.',
      },
      {
        q: '¿Trabajas con mi sector?',
        a: 'Sobre todo seguros, reparación de crédito, salud y estética, bienes raíces, finanzas y e-commerce para la comunidad hispana en EE. UU.',
      },
      {
        q: '¿Quién produce los creativos?',
        a: 'Los ángulos, los guiones y el sistema de pruebas, yo. Las piezas con IA y la edición de video (Premiere, Canva) salen del equipo o de tu propio material. Lo que no cambia es el criterio: cada pieza sale con una hipótesis detrás y se mide por separado.',
      },
      {
        q: '¿Qué necesito tener listo antes de empezar?',
        a: 'Solo acceso de administrador a tu cuenta publicitaria. Si no tienes píxel, eventos, API de Conversiones o CRM, se configuran como parte del trabajo: la auditoría empieza justo ahí.',
      },
    ],
  },

  // «Lo que no hago» (PROPUESTAS-NIVEL.md §B3). Quedan tres renglones: el de SEO
  // y orgánico es el complemento de `services.items`; los otros dos, la
  // contracara de la llamada de 30 minutos. Salieron el mínimo de $3.000 (varias
  // cuentas reales invierten menos) y «no llevo venta offline ni ciclos de
  // meses», que negaba el trabajo de verdad: seguros, crédito y salud venden por
  // cita y por llamada. Si se toca uno, mirar la FAQ.
  limits: {
    title: 'Lo que no hago',
    intro: 'Decirlo por delante filtra los malos encajes y hace creíble todo lo demás. Si algo de esta lista es tu caso, te lo digo en la primera llamada — no en el segundo mes.',
    items: [
      'No hago SEO ni manejo de redes orgánicas. Lo que hago está en la lista de más arriba, y prefiero decirlo a venderte un paquete de todo.',
      'No prometo una cifra antes de haber visto tu cuenta. Un costo por lead prometido de entrada es una cifra inventada; el primer número serio sale de la auditoría.',
      'No acepto el proyecto si no encaja. La llamada de 30 minutos también sirve para eso, y no cuesta nada.',
    ],
  },

  contact: {
    pre: '¿Tienes un proyecto entre manos?',
    cta: '¿Escalamos?',
    // {ciudad} sale de src/data/perfil.js. Sin zona horaria no hay reloj.
    time: 'Hora en {ciudad} —',
    // Disponibilidad (§C4). El nombre del mes lo pone Intl, no el diccionario.
    availabilityOne: 'Acepto 1 proyecto para {mes}',
    availabilityMany: 'Acepto {plazas} proyectos para {mes}',
    // Rótulo de la barra fija de celular (PROPUESTAS-NIVEL.md §C3).
    mobileCta: 'Escríbeme',
    // El formulario. Los `value` del <select> NO se traducen — viajan en el
    // correo que recibe Paola, que trabaja en español; lo que cambia de idioma
    // es el rótulo visible. Ver sections/plans.js, que precualifica por ese value.
    form: {
      name: 'Nombre',
      email: 'Email',
      plan: 'Qué te interesa',
      planOptions: ['Todavía no lo sé', 'Auditoría', 'Gestión mensual', 'Sistema de captación'],
      message: 'Cuéntame el proyecto',
      // {link} se sustituye por el enlace a la política, que conserva su href.
      consent: 'He leído y acepto la {link}.',
      consentLink: 'política de privacidad',
      submit: 'Enviar mensaje',
      honeypot: 'No completar:',
    },
    // El aviso de error ofrece una salida SOLO si existe (src/data/perfil.js).
    status: {
      sending: 'Enviando…',
      ok: 'Mensaje enviado. Te respondo en menos de 24 h.',
      errorEmail: 'No pude enviar el formulario. Escríbeme directamente a {email}.',
      errorLinkedin: 'No pude enviar el formulario. Escríbeme por LinkedIn: {url}',
      errorRetry: 'No pude enviar el formulario. Inténtalo de nuevo en unos minutos.',
    },
  },

  footer: {
    rights: '© 2026 Paola Parra — Todos los derechos reservados',
    top: 'Volver arriba ↑',
    marquee: ['Trabajemos juntos', "Let's work together"],
  },

  langSwitch: { label: 'Cambiar idioma', to: 'EN' },
  // Igual que el de idioma, el botón anuncia a DÓNDE se va, no dónde estás.
  theme: { label: 'Cambiar tema', toLight: 'Claro', toDark: 'Oscuro' },
}
