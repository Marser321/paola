// Diccionario EN. Misma forma que es.js; lo que falte aquí cae al español.
//
// Inglés de EE. UU. —optimize, catalog, every two weeks—, que es el mercado. Hasta
// el 2026-10-17 estaba en británico (optimise, catalogue, maths, fortnightly).
//
// NO se traducen: "PAOLA", los nombres de herramientas (Meta Ads, GoHighLevel,
// Premiere, Canva) ni las siglas del oficio (CPL, CAPI, TOFU-MOFU-BOFU).

export const en = {
  htmlLang: 'en-US',
  title: 'Paola Parra — Paid Media Manager · Meta Ads, funnels & CRM',
  description:
    'Paid Media Manager for Hispanic brands in the US: Meta Ads, funnels and GoHighLevel CRM that turn ad spend into appointments and clients. US$1.1M+ invested.',

  preloader: { label: 'Launching campaign', status: 'Campaign 2026 · Objective: leads', delivering: 'Delivering impression' },

  nav: { projects: 'Industries', services: 'Services', process: 'Process', plans: 'Plans', about: 'About', contact: 'Contact' },

  hero: {
    label: 'Paid Media Manager · Meta Ads, funnels & CRM',
    subtitle: 'I turn ad spend into <span class="accent-text">appointments and clients</span> for Hispanic brands in the US.',
    meta: ['US$1.1M+ invested', '40+ brands', '9+ years'],
    scroll: 'Scroll',
  },

  labels: {
    results: 'By the numbers', cases: 'Industries',
    services: 'Services', process: 'Process',
    about: 'Who runs it', testimonials: 'Social proof',
    plans: 'Working together', calculator: 'Calculator', faq: 'Questions',
    contact: 'Contact',
  },

  metrics: {
    labels: [
      'Invested in Meta Ads',
      'Ad accounts with spend',
      'Accounts above US$10,000',
      'Hispanic brands in the US',
    ],
    sectoresTitulo: 'Where the money went, by industry',
    fuente:
      'Source: Meta Ads, spend per account from Jan 1, 2025 to Oct 17, 2026 (USD accounts). Accounts in other currencies and disabled accounts are not included, so the real figure is higher.',
  },

  sectores: {
    joyeria: { nombre: 'Jewelry & e-commerce', conversion: 'Online sales and store visits' },
    salud: { nombre: 'Health, aesthetics & dental', conversion: 'Consultation bookings' },
    credito: { nombre: 'Credit, finance & tax', conversion: 'Phone consultations' },
    seguros: { nombre: 'Insurance', conversion: 'Quotes by phone' },
    tramites: { nombre: 'Paperwork services' },
    viajes: { nombre: 'Travel & boating' },
    'bienes-raices': { nombre: 'Real estate' },
    educacion: { nombre: 'Education' },
    otras: { nombre: 'Other, unclassified' },
  },

  projects: {
    title: 'Four industries, <span class="accent-text">{pct}%</span> of the spend',
    hint: 'Drag the scroll →',
    invested: 'invested in Meta Ads',
    share: '{pct}% of the total',
    delta: 'From {antes} to {despues}',
    caseLink: 'Read the case',
  },

  backstage: { sponsored: 'Sponsored' },

  caso: {
    title: '{titulo} — Case · Paola Parra',
    reto: 'The challenge',
    queHicimos: 'What we did',
    resultado: 'Result',
    ficha: 'Fact sheet',
    periodo: 'Period',
    inversion: 'Spend',
    stack: 'Tools',
    cta: 'Ad CTA',
    antesDespues: 'Before / after',
    otros: 'Other cases',
  },

  services: {
    title: 'What I do',
    toggle: 'See samples of this work',
    items: [
      { title: 'Meta Ads strategy and campaigns', desc: 'Campaigns by funnel stage, optimized for booked appointments and clients, not for cheap leads.', tags: 'Facebook · Instagram · TOFU-MOFU-BOFU' },
      { title: 'GoHighLevel CRM and automations', desc: 'Every lead lands in the CRM at its stage and gets automatic follow-up by text and email, so none of them is left waiting.', tags: 'GoHighLevel · Pipelines · SMS and email' },
      { title: 'Measurement: pixel, events and Conversions API', desc: 'Events that match across the site, the CRM and Meta; the Conversions API tells Meta which leads became appointments.', tags: 'Pixel · Events · CAPI' },
      { title: 'Landing pages and funnels', desc: 'Pages built for a single action —book, call or get a quote— and connected to the CRM from day one.', tags: 'GHL · WordPress · Shopify' },
      { title: 'AI pieces, scripts and video editing', desc: 'Creative with a hypothesis behind it: script, hook and edit, so new angles get tested without waiting for a big production.', tags: 'AI · Scripts · Premiere · Canva' },
      { title: 'Account audit', desc: 'What is broken in your account and in what order to fix it, with a 90-day plan you can run with me or without me.', tags: 'Account · Measurement · Roadmap' },
    ],
  },

  process: {
    title: 'How I work',
    steps: [
      { title: 'Audit', desc: 'We come out with the list of where the budget is leaking today and what can be recovered in the first two weeks.' },
      { title: 'Strategy', desc: 'You leave knowing how much goes to each funnel stage and which hypothesis that money is buying.' },
      { title: 'Creative', desc: 'Every ad comes from a specific angle, not a loose idea: hook, proof and call to action, ready to be measured on its own.' },
      { title: 'Launch', desc: 'It goes live with clean measurement: events that add up, the CRM connected, and a test that can be read without doubts.' },
      { title: 'Optimization', desc: 'Every week what does not perform is pulled and what does is reinforced, looking at cost per appointment and not just cost per lead — and you are told why, not just what.' },
      { title: 'Scale', desc: 'Raising the budget without cost per client shooting up: more audiences, more channels and more markets, in that order.' },
    ],
  },

  about: {
    title: "Hi, I'm Paola",
    imgAlt: 'Paola Parra, Paid Media Manager, resting her hand on her cheek and looking at the camera',
    p1: 'I have more than 9 years in digital marketing. Today I run the Advertising Department at AD Media Solution, with a team of 4 and more than 40 Hispanic brands in the US.',
    p2: 'My work does not stop at the ad: I connect the campaign to the landing page, the CRM and the follow-up, so what gets measured is appointments and clients, not clicks.',
    cv: [
      '2017 — Community Manager',
      '2020 — Digital Trafficker · Printex',
      '2024 — Digital Strategist · Search Media',
      '2025 — Head of Advertising · AD Media Solution',
    ],
  },

  // --- SALES BLOCK: plans, calculator and questions ---
  plans: {
    title: 'Three ways to <span class="accent-text">start</span>',
    intro: 'None of them starts with a contract. All three start with the same 30-minute call, where we look at your account and I tell you which one you need — or that you need none of them.',
    cta: 'Request a proposal',
    takeWord: 'You get',
    items: [
      {
        tag: 'One-off · 2 weeks',
        title: 'Audit',
        who: 'You have campaigns running and you suspect budget is leaking, but you cannot tell where.',
        list: [
          'Full review of the ad account',
          'Measurement diagnosis: pixel, events and Conversions API',
          'Funnel review: ad → landing page → CRM → appointment',
          'Prioritized 90-day roadmap',
        ],
        take: ' a document with everything that needs fixing, in order and with the weight of each item. It is yours, whether you apply it with me or without me.',
      },
      {
        tag: 'Ongoing · 3 months minimum',
        title: 'Monthly management',
        who: 'You already spend every month and you want someone inside the account, not a report once the month is over.',
        list: [
          'Strategy and campaigns by funnel stage',
          'New creative with a hypothesis behind it: AI, scripts and video',
          'Optimization for cost per appointment and per client, not cheap leads',
          'A review call every two weeks, not a PDF',
        ],
        take: ' an account that grows on explained decisions: what changed, why, and what happened next.',
      },
      {
        tag: 'One-off · per project',
        title: 'Lead capture system',
        who: 'Your ads are running, but leads go cold before anyone calls them.',
        list: [
          'Landing page or funnel (GoHighLevel, WordPress or Shopify)',
          'GoHighLevel CRM and automations: follow-up by text and email',
          'Events and Conversions API connected to the CRM',
          'Documented handover to your team',
        ],
        take: ' a system that turns a lead into an appointment without depending on someone remembering to call.',
      },
    ],
  },

  calc: {
    title: 'Do the math <span class="accent-text">before</span> you spend',
    intro: 'Move the controls using your own numbers; the starting ones are just an example. This predicts nothing: it is the same arithmetic you will see in every report, and it tells you whether what you are aiming for holds up.',
    fields: {
      spend: 'Monthly ad spend',
      cpl: 'Cost per lead',
      agenda: 'Leads who book an appointment',
      cierre: 'Appointments that become clients',
    },
    rows: {
      clientes: 'Clients per month',
      leads: 'Leads per month',
      citas: 'Appointments per month',
      costoCita: 'Cost per appointment',
      costoCliente: 'Cost per client',
    },
    viz: { leads: 'Leads', citas: 'Appointments', clientes: 'Clients' },
    leverOne: 'With the same {leads} leads, if 10 more points book ({agenda}), you get 1 more client a month without spending another dollar.',
    leverMany: 'With the same {leads} leads, if 10 more points book ({agenda}), you get {extra} more clients a month without spending another dollar.',
    noteStrong: 'Dividing is the easy part.',
    note: ' Getting those leads to answer, book and show up is everything else on this page: the funnel, the CRM and the follow-up. And the math runs in your browser — nothing is sent anywhere.',
    announce: 'With {spend} a month at {cpl} per lead: {leads} leads, {citas} appointments and {clientes} clients a month. Cost per appointment {costoCita}, cost per client {costoCliente}.',
  },

  faq: {
    title: 'Before you write',
    items: [
      {
        q: 'How much do I need to spend for this to make sense?',
        a: 'There is no fixed minimum. With a small budget, the work focuses on a single campaign and on follow-up that does not let a single lead slip; once cost per appointment holds, the budget goes up. On the first call we look at what makes sense for what you want to invest.',
      },
      {
        q: 'How long before anything shows?',
        a: 'First signals, two to three weeks: that is how long a round of creative takes to produce conclusive data. A sustained change of trend, 60 to 90 days. Anyone promising results in week one is talking about luck, not method.',
      },
      {
        q: 'Is there a minimum term?',
        a: 'Monthly management asks for a three-month initial commitment, and not to tie you down: in less time there is no room to audit, fix and measure the effect of the fix. From the fourth month on it is month to month, no notice period.',
      },
      {
        q: 'Do you work with my industry?',
        a: 'Mostly insurance, credit repair, health and aesthetics, real estate, finance and e-commerce for the Hispanic community in the US.',
      },
      {
        q: 'Who produces the creative?',
        a: 'The angles, the scripts and the testing system, me. The AI pieces and the video editing (Premiere, Canva) come from the team or from your own material. What does not change is the criterion: every piece ships with a hypothesis behind it and is measured on its own.',
      },
      {
        q: 'What do I need in place before we start?',
        a: 'Just admin access to your ad account. If you have no pixel, events, Conversions API or CRM, they get set up as part of the work: the audit starts exactly there.',
      },
    ],
  },

  limits: {
    title: 'What I do not do',
    intro: 'Saying it up front filters out the bad fits and makes everything else credible. If any of this is your case, I tell you on the first call — not in month two.',
    items: [
      'I do not do SEO or manage organic social. What I do is the list further up, and I would rather say so than sell you a bundle of everything.',
      'I do not promise a number before seeing your account. A cost per lead promised up front is a made-up number; the first serious one comes out of the audit.',
      'I do not take the project on if it does not fit. The 30-minute call is for that too, and it costs nothing.',
    ],
  },

  contact: {
    pre: 'Got a project in mind?',
    cta: 'Shall we scale?',
    time: 'Time in {ciudad} —',
    availabilityOne: 'Taking 1 project for {mes}',
    availabilityMany: 'Taking {plazas} projects for {mes}',
    mobileCta: 'Write to me',
    form: {
      name: 'Name',
      email: 'Email',
      plan: 'What you are after',
      planOptions: ['Not sure yet', 'Audit', 'Monthly management', 'Lead capture system'],
      message: 'Tell me about the project',
      consent: 'I have read and accept the {link}.',
      consentLink: 'privacy policy',
      submit: 'Send message',
      honeypot: 'Do not fill in:',
    },
    status: {
      sending: 'Sending…',
      ok: 'Message sent. I reply within 24 h.',
      errorEmail: 'I could not send the form. Email me directly at {email}.',
      errorLinkedin: 'I could not send the form. Message me on LinkedIn: {url}',
      errorRetry: 'I could not send the form. Please try again in a few minutes.',
    },
  },

  footer: {
    rights: '© 2026 Paola Parra — All rights reserved',
    top: 'Back to top ↑',
    marquee: ["Let's work together", 'Trabajemos juntos'],
  },

  langSwitch: { label: 'Change language', to: 'ES' },
  theme: { label: 'Change theme', toLight: 'Light', toDark: 'Dark' },
}
