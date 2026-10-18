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
    hint: 'Arrastra el scroll →',
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
      { title: 'Estrategia y campañas en Meta Ads', desc: 'Campañas por etapa del embudo que se optimizan por citas y clientes, no por leads baratos.', tags: 'Facebook · Instagram · TOFU-MOFU-BOFU' },
      { title: 'CRM y automatizaciones en GoHighLevel', desc: 'Cada lead entra al CRM en su etapa y recibe seguimiento automático por SMS y correo, para que ninguno se quede sin respuesta.', tags: 'GoHighLevel · Pipelines · SMS y correo' },
      { title: 'Medición: píxel, eventos y API de Conversiones', desc: 'Eventos que cuadran entre la web, el CRM y Meta; la API de Conversiones le devuelve a Meta qué leads se volvieron citas.', tags: 'Píxel · Eventos · CAPI' },
      { title: 'Landing pages y embudos', desc: 'Páginas hechas para una sola acción —agendar, llamar o cotizar— y conectadas al CRM desde el primer día.', tags: 'GHL · WordPress · Shopify' },
      { title: 'Piezas con IA, guiones y edición de video', desc: 'Creativos con una hipótesis detrás: guion, gancho y edición, para probar ángulos sin esperar a una gran producción.', tags: 'IA · Guiones · Premiere · Canva' },
      { title: 'Auditoría de cuenta', desc: 'Qué está fallando en tu cuenta y en qué orden arreglarlo, con un plan de 90 días que puedes ejecutar conmigo o sin mí.', tags: 'Cuenta · Medición · Roadmap' },
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
