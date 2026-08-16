// Diccionario EN. Misma forma que es.js; lo que falte aquí cae al español.
//
// NO se traducen: "PAOLA", los nombres de cliente, los tags que ya están en
// inglés (Meta Ads, Paid Social, UGC…) y, sobre todo, los NOMBRES DE SEÑAL
// (las claves de `signals`), que son vocabulario literal de Ads Manager.

export const en = {
  htmlLang: 'en',
  title: 'PAOLA — Meta Ads Specialist · Performance Marketing',
  description:
    'Meta Ads specialist (Facebook and Instagram). Scale your e-commerce or digital business with measurable performance campaigns: 4.2x average ROAS, $2M+ managed.',

  preloader: { label: 'Launching campaign', status: 'PAOLA_2026 · Objective: conversion', delivering: 'Delivering impression' },

  nav: { projects: 'Work', services: 'Services', process: 'Process', about: 'About', contact: 'Contact' },

  hero: {
    label: 'Meta Ads Specialist — Performance Marketing',
    meta: ['4.2x average ROAS', '$2M+ managed', 'FB · IG'],
    scroll: 'Scroll',
  },

  variants: {
    A: 'I turn ad budget into <span class="accent-text">measurable growth</span>.',
    B: 'Every euro you invest has to <span class="accent-text">come back with company</span>.',
  },

  stageWord: 'Stage',
  stages: {
    alcance: 'Reach', interes: 'Interest', consideracion: 'Consideration',
    intencion: 'Intent', conversion: 'Conversion',
  },
  labels: {
    results: 'Results', cases: 'Creatives',
    services: 'Services', process: 'Process',
    about: 'Who runs it', testimonials: 'Social proof',
    report: 'Your report', contact: 'Contact',
  },

  metrics: ['Average ROAS', 'Ad spend managed', 'Client retention', 'Campaigns launched'],

  projects: {
    title: 'Work that <span class="accent-text">scales</span>',
    hint: 'Drag the scroll →',
    backstage: 'View backstage',
    backstageHide: 'Hide backstage',
  },

  backstage: {
    title: 'Backstage', audience: 'Audience', budget: 'Budget',
    objective: 'Objective', test: 'A/B test', winner: 'Winner',
    sponsored: 'Sponsored',
  },

  services: {
    title: 'What I do',
    // `samples` = caption for each gallery item. It doubles as the image `alt`,
    // so it describes WHAT IS SHOWN, not the service in the abstract.
    toggle: 'See samples of this work',
    items: [
      { title: 'Meta Ads', desc: 'Conversion campaigns on Facebook and Instagram: structure, targeting, bidding, and horizontal and vertical scaling.', tags: 'FB · IG · Advantage+',
        samples: ['Campaign structure by funnel stage', 'Catalogue ad running as a Reel', 'Scaling dashboard with ROAS per ad set'] },
      { title: 'Paid Social', desc: 'Multichannel expansion when the funnel justifies it, with creative built natively for each platform.', tags: 'TikTok · Pinterest · LinkedIn',
        samples: ['One campaign adapted to three platforms', 'Natively built TikTok creative', 'Cost per channel, side by side'] },
      { title: 'Funnels &amp; CRO', desc: 'Pages and flows that convert: CAPI, pixel, events, A/B tests and drop-off analysis.', tags: 'Landings · A/B · Tracking',
        samples: ['Landing page before and after the redesign', 'Funnel with drop-off by step', 'A/B test with the winning variant'] },
      { title: 'UGC &amp; Creative', desc: 'A production and creative testing system: hooks, angles and weekly data-driven iteration.', tags: 'Scripts · Hooks · Testing',
        samples: ['UGC script with its three hooks', 'One week of creative output', 'Angles ranked by retention'] },
      { title: 'Audits &amp; Consulting', desc: 'Full ad account audit with an actionable 90-day roadmap.', tags: 'Audit · Roadmap · Mentoring',
        samples: ['Account diagnosis with the leaks flagged', 'Ninety-day roadmap by priority', 'Event and CAPI review'] },
    ],
  },

  process: {
    title: 'How I work',
    steps: [
      { title: 'Audit', desc: 'Account, tracking and competitor analysis. We find budget leaks and quick wins.' },
      { title: 'Strategy', desc: 'Hypotheses, angles, campaign structure and budget by funnel stage.' },
      { title: 'Creative', desc: 'Ad production (UGC, static, video) built around hook + social proof + CTA.' },
      { title: 'Launch', desc: 'Flawless technical setup: CAPI, events, catalogues and testing structure.' },
      { title: 'Optimisation', desc: 'Weekly iteration: kill the losers, scale the winners, refresh the creative.' },
      { title: 'Scale', desc: 'Sustainable growth that protects ROAS: more budget, more channels, more markets.' },
    ],
  },

  about: {
    title: "Hi, I'm Paola",
    imgAlt: 'Portrait of Paola',
    imgLabel: 'Photo — 4:5',
    p1: "I've spent more than 6 years running paid social for brands that want to grow on data, not intuition. My obsession: that every euro invested has a measurable return.",
    p2: 'I work with a small number of clients so I can be inside every account, every week. No smoke: clear reporting, constant testing and decisions based on numbers.',
    cv: [
      '2019 — Media Buyer · Performance agency (Barcelona)',
      '2021 — Senior Media Buyer · E-commerce Group',
      '2023 — Freelance · Meta Ads Specialist',
      '2026 — 40+ brands supported',
    ],
  },

  testimonials: [
    { quote: '“Paola doubled our ROAS in 90 days and we finally understood which campaigns worked, and why.”', author: 'Marta G. — CEO · Atelier Nord' },
    { quote: '“Impeccable reporting and a testing speed we had never seen from any agency.”', author: 'Daniel R. — CMO · Flowstack' },
    { quote: '“We went from burning budget to scaling with full control. Best investment of the year.”', author: 'Lucía P. — Founder · Glow Skin' },
  ],

  hud: {
    title: 'Session in progress',
    elapsed: 'Time', depth: 'Depth', stage: 'Stage',
    signals: 'Signals', variant: 'Variant', last: 'Last signal',
    switch: 'Switch', off: 'Turn panel off',
    reactivate: 'Turn session panel back on', disabled: 'Panel turned off',
    aria: 'Session panel',
  },

  // ⚠ Las CLAVES son nombres de Ads Manager: idénticas en todos los idiomas.
  // Esa es justamente la gracia: quien trabaja con la herramienta los ve igual.
  signals: {
    PageView: 'impression served',
    ViewContent: 'content viewed',
    Scroll75: '75% scroll depth',
    ContentEngagement: 'interest in {case}',
    Dwell60: '60 s on page',
    Retargeting: "you're back",
    Conversion: 'objective met',
  },
  retargetTitle: '← This is retargeting · PAOLA',

  report: {
    title: 'The campaign <span class="accent-text">is you</span>',
    intro: 'While you were reading, this page was doing what I do every day with the accounts I manage: measuring. This is the report of your visit.',
    panelTitle: 'Session report',
    status: { idle: 'Idle', compiling: 'Compiling…', done: 'Compiled', converted: 'Objective met', off: 'Panel turned off' },
    rows: {
      elapsed: 'Time on session', depth: 'Depth', signals: 'Signals fired',
      stage: 'Stage reached', cases: 'Creatives seen',
      topcase: 'Most attention', variant: 'Variant served',
    },
    forced: ' · switched manually',
    scoreLabel: 'Conversion probability',
    scoreTag: 'Heuristic estimate',
    formulaShow: 'show formula',
    formulaHide: 'hide formula',
    formula: 'Local heuristic: depth ×30 + dwell ×20 + creatives ×20 + signals ×15 + conversion ×15. Capped at 99: no honest estimate says 100%.',
    note1strong: 'None of this has left your browser.',
    note1: ' No cookies, no pixel, no server: it was computed here and disappears when you close the tab.',
    note2: 'Measuring well is not collecting more data. It is collecting the right data and knowing how to read it. That is exactly what I do with the accounts I manage.',
    announce: 'Report of your visit ready',
    offNote: 'You turned measurement off. The report stays as it was.',
  },

  contact: { pre: 'Got a project in mind?', cta: 'Shall we scale?', time: 'Local time —' },

  footer: {
    rights: '© 2026 Paola — All rights reserved',
    top: 'Back to top ↑',
    marquee: ["Let's work together", 'Trabajemos juntos'],
  },

  langSwitch: { label: 'Change language', to: 'ES' },
  theme: { label: 'Change theme', toLight: 'Light', toDark: 'Dark' },
}
