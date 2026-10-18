const paths = [
  '<path d="M4 10 18 5v13L4 14zM4 10H2v4h2m4 1 2 6h4l-2-5"/><path class="icon-motion" d="m21 8 2-1m-2 6h3m-3 4 2 1"/>',
  '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M8 4v16m8-16v16"/><rect class="icon-motion" x="4" y="8" width="2" height="5" rx="1"/>',
  '<circle cx="4" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="20" cy="12" r="2"/><path d="m6 11 4-4m4 0 4 4M6 13h12"/><circle class="icon-motion" cx="12" cy="13" r="1"/>',
  '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20M6 5h1m2 0h1M6 12h12"/><path class="icon-motion" d="M6 16h8m-3-2 3 2-3 2"/>',
  '<rect x="2" y="3" width="20" height="18" rx="2"/><path class="icon-motion" d="m10 7 6 4-6 4z"/><path d="M5 18h14"/>',
  '<path d="M8 4H4v18h16V4h-4M8 2h8v4H8zM7 11h10M7 16h10"/><path class="icon-motion" d="m7 11 2 2 4-4"/>',
]
export const serviceIcon = (i) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i]}</svg>`
