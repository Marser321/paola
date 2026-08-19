// Diccionario EN. Misma forma que es.js; lo que falte aquí cae al español.
//
// NO se traducen: "PAOLA", los nombres de cliente y los tags que ya están en
// inglés (Meta Ads, Paid Social, UGC…).

export const en = {
  htmlLang: 'en',
  title: 'PAOLA — Meta Ads Specialist · Performance Marketing',
  description:
    'Meta Ads specialist (Facebook and Instagram). Scale your e-commerce or digital business with measurable performance campaigns: 4.2x average ROAS, $2M+ managed.',

  preloader: { label: 'Launching campaign', status: 'Campaign 2026 · Objective: conversion', delivering: 'Delivering impression' },

  nav: { projects: 'Work', services: 'Services', process: 'Process', plans: 'Plans', about: 'About', contact: 'Contact' },

  hero: {
    label: 'Meta Ads Specialist — Performance Marketing',
    meta: ['4.2x average ROAS', '$2M+ managed', 'FB · IG'],
    scroll: 'Scroll',
  },

  variants: {
    A: 'I turn ad budget into <span class="accent-text">measurable growth</span>.',
    B: 'Every dollar you invest has to <span class="accent-text">come back with company</span>.',
  },

  labels: {
    results: 'Results', cases: 'Creatives',
    services: 'Services', process: 'Process',
    about: 'Who runs it', testimonials: 'Social proof',
    plans: 'Working together', calculator: 'Calculator', faq: 'Questions',
    contact: 'Contact',
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
      { title: 'Meta Ads', desc: 'Campaigns that do not hang on one lucky creative: structure by stage, bids that get reviewed, and scaling that holds when the budget goes up.', tags: 'FB · IG · Advantage+',
        samples: ['Campaign structure by funnel stage', 'Catalogue ad running as a Reel', 'Scaling dashboard with ROAS per ad set'] },
      { title: 'Paid Social', desc: 'Leaving Meta only when the numbers ask for it, and doing it with pieces built natively for each platform instead of recycling the same ones.', tags: 'TikTok · Pinterest · LinkedIn',
        samples: ['One campaign adapted to three platforms', 'Natively built TikTok creative', 'Cost per channel, side by side'] },
      { title: 'Funnels &amp; CRO', desc: 'So what you pay to bring in does not fall over on arrival: measurement without holes, pages that get tested, and the exact point where the sale is lost.', tags: 'Landings · A/B · Tracking',
        samples: ['Landing page before and after the redesign', 'Funnel with drop-off by step', 'A/B test with the winning variant'] },
      { title: 'UGC &amp; Creative', desc: 'New creative every week with a hypothesis behind it, so winning stops depending on having got it right once.', tags: 'Scripts · Hooks · Testing',
        samples: ['UGC script with its three hooks', 'One week of creative output', 'Angles ranked by retention'] },
      { title: 'Audits &amp; Consulting', desc: 'Knowing what is broken in your account and in what order to fix it, with a 90-day plan you can run without me.', tags: 'Audit · Roadmap · Mentoring',
        samples: ['Account diagnosis with the leaks flagged', 'Ninety-day roadmap by priority', 'Event and CAPI review'] },
    ],
  },

  process: {
    title: 'How I work',
    steps: [
      { title: 'Audit', desc: 'We come out with the list of where the budget is leaking today and what can be recovered in the first two weeks.' },
      { title: 'Strategy', desc: 'You leave knowing how much goes to each funnel stage and which hypothesis that money is buying.' },
      { title: 'Creative', desc: 'Every ad comes from a specific angle, not a loose idea: hook, proof and call to action, ready to be measured on its own.' },
      { title: 'Launch', desc: 'It goes live with clean measurement: events that add up, a catalogue in order, and a test that can be read without doubts.' },
      { title: 'Optimisation', desc: 'Every week what does not perform is pulled and what does is reinforced — and you are told why, not just what.' },
      { title: 'Scale', desc: 'Raising the budget without the return falling: more audiences, more channels and more markets, in that order.' },
    ],
  },

  about: {
    title: "Hi, I'm Paola",
    imgAlt: 'Portrait of Paola',
    imgLabel: 'Photo — 4:5',
    p1: "I've spent more than 6 years running paid social for brands that want to grow on data, not intuition. My obsession: that every dollar invested has a measurable return.",
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

  // ⚠ The UI of the "THE CAMPAIGN IS YOU" concept lived here (session panel,
  // Ads Manager signal glosses, retargeting title and the whole report). It was
  // retired on 2026-08-16 and replaced by the sales block that starts here.

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
          'Measurement diagnosis: pixel, CAPI and duplicated events',
          'Analysis of creative, audiences and structure',
          'Prioritised 90-day roadmap',
        ],
        take: ' a document with everything that needs fixing, in order and with the weight of each item. It is yours, whether you apply it with me or without me.',
      },
      {
        tag: 'Ongoing · 3 months minimum',
        title: 'Monthly management',
        who: 'You already spend every month and you want someone inside the account, not a report once the month is over.',
        list: [
          'Strategy and campaign structure by funnel stage',
          'Creative testing system with a new batch every week',
          'Optimisation and scaling that protects ROAS',
          'Fortnightly review on a call, not in a PDF',
        ],
        take: ' an account that grows on explained decisions: what changed, why, and what happened next.',
      },
      {
        tag: 'One-off · 6 weeks',
        title: 'Scaling sprint',
        who: 'The account already works and you want to raise the budget without ROAS falling apart on the way.',
        list: [
          'Phased scaling plan, with its ceiling calculated',
          'Opening up audiences, markets and channels',
          'A creative refresh system that keeps the pace',
          'Documented handover to your in-house team',
        ],
        take: ' a scaling method your team keeps using once I am no longer around.',
      },
    ],
  },

  calc: {
    title: 'Do the maths <span class="accent-text">before</span> you spend',
    intro: 'Move the controls using your own numbers. This predicts nothing: it is the same arithmetic you will see in every report, and it tells you whether what you are aiming for holds up.',
    fields: {
      spend: 'Monthly ad spend',
      roas: 'Target ROAS',
      ticket: 'Average order value',
    },
    rows: {
      revenue: 'Estimated return',
      profit: 'Over what you spent',
      sales: 'Sales per month',
      cpa: 'Maximum cost per sale',
    },
    viz: {
      spend: 'You put in',
    },
    noteStrong: 'Multiplying is the easy part.',
    note: ' Reaching that ROAS at that order value is everything else on this page: the structure, the creative and the weeks of testing. And the maths runs in your browser — nothing is sent anywhere.',
    announce: 'With {spend} a month at a ROAS of {roas}: estimated return {revenue}, {sales} sales per month, maximum cost per sale {cpa}.',
  },

  faq: {
    title: 'Before you write',
    items: [
      {
        q: 'How much do I need to spend for this to make sense?',
        a: 'Below roughly $3,000 a month in ad spend, the algorithm does not gather enough data to optimise and any test takes weeks to conclude. If you are below that, I will say so on the first call and suggest what to do first.',
      },
      {
        q: 'How long before anything shows?',
        a: 'First signals, two to three weeks: that is how long a batch of creative takes to produce conclusive data. A sustained change of trend, 60 to 90 days. Anyone promising results in week one is talking about luck, not method.',
      },
      {
        q: 'Is there a lock-in?',
        a: 'Monthly management asks for a three-month initial commitment, and not to tie you down: in less time there is no room to audit, fix and measure the effect of the fix. From the fourth month on it is month to month, no notice period.',
      },
      {
        q: 'Do you work with my sector?',
        a: 'Mostly e-commerce, education and info-products, and services sold online. If you sell offline or with decision cycles of months, the work changes a lot and there are better fits than me: I will tell you before taking the project, not after.',
      },
      {
        q: 'Who produces the creative?',
        a: 'The system, the angles and the scripts, me. Production depends on the case: your team, UGC creators or an external producer. What does not change is the criterion — every piece ships with a hypothesis behind it and is measured on its own.',
      },
      {
        q: 'What do I need in place before we start?',
        a: 'A working pixel and Conversions API, a catalogue if you sell products, and admin access to your ad account. If something is missing, that is not a problem: the audit starts exactly there.',
      },
    ],
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
