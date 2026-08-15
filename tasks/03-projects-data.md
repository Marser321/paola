# Tarea 03 — Datos de proyectos (`src/data/projects.js`)

## Objetivo
Crear la fuente de datos de los 6 casos placeholder. La galería (tarea 11) los renderiza
desde aquí, el chrome de anuncio y el backstage (tarea 34) consumen los campos de anuncio,
y el cursor (tarea 05) lee `audienceShort`. Valores tomados de `CONTENT.md` §7, §7.1 y §7.2.

## Archivos a crear/editar
- **Crear** `src/data/projects.js`

## Spec

Cada objeto tiene tres bloques: **identidad** (`id`…`gradient`), **datos de anuncio**
(`adFormat`…`cta`) y **backstage** (`abTest`, `beforeAfter`).

> ⚠ `audienceShort` es lo que muestra el cursor en hover: **máximo ~24 caracteres**, o no
> cabe en la píldora. `audience` completa vive en el backstage textual.

### `src/data/projects.js` (literal)
```js
// Casos de éxito — placeholders (CONTENT.md §7, §7.1, §7.2).
// Para contenido real: editar SOLO este archivo + las imágenes.
// NDA: presupuestos y audiencias van siempre en RANGO y con permiso del cliente.

export const projects = [
  {
    id: 'atelier-nord',
    index: '01',
    title: 'Atelier Nord',
    sector: 'E-commerce moda',
    year: '2025',
    tags: 'Meta Ads · Escala',
    kpi1: { value: '5.8x', label: 'ROAS' },
    kpi2: { value: '+212%', label: 'Revenue' },
    desc: 'Estrategia full-funnel, creatividades UGC y escala de campañas Advantage+.',
    gradient: ['#7B19C8', '#C559C4'],
    adFormat: 'Reels 9:16',
    audience: 'Mujeres 25-44 · ES · Intereses moda',
    audienceShort: 'Mujeres 25-44 · ES',
    budget: '12-18K€/mes',
    objective: 'Ventas catálogo',
    cta: 'Comprar ahora',
    abTest: {
      a: 'Producto en primer plano',
      b: 'Testimonio a cámara',
      winner: 'b',
      result: '+64% CTR',
    },
    beforeAfter: { before: 'ROAS 2.1x', after: 'ROAS 5.8x' },
  },
  {
    id: 'flowstack',
    index: '02',
    title: 'Flowstack',
    sector: 'SaaS B2B',
    year: '2025',
    tags: 'Lead Gen · B2B',
    kpi1: { value: '−47%', label: 'CPL' },
    kpi2: { value: '3.2x', label: 'Pipeline' },
    desc: 'Generación de leads cualificados con secuencias de retargeting y lead forms.',
    gradient: ['#C559C4', '#F57327'],
    adFormat: 'Estático 4:5',
    audience: 'Decisores IT · ES/LATAM · Lookalike 1%',
    audienceShort: 'Decisores IT · ES',
    budget: '6-9K€/mes',
    objective: 'Generación de leads',
    cta: 'Más información',
    abTest: {
      a: 'Formulario nativo',
      b: 'Landing con demo en vídeo',
      winner: 'b',
      result: '−47% CPL',
    },
    beforeAfter: { before: 'CPL 84€', after: 'CPL 45€' },
  },
  {
    id: 'masterclass-pro',
    index: '03',
    title: 'Masterclass Pro',
    sector: 'Infoproducto',
    year: '2024',
    tags: 'Launch · Webinar',
    kpi1: { value: '12.400', label: 'Leads' },
    kpi2: { value: '1.80€', label: 'CPA' },
    desc: 'Lanzamiento evergreen con funnel de webinar y captación multicanal.',
    gradient: ['#2B0A4A', '#7B19C8'],
    adFormat: 'Vídeo 1:1',
    audience: '25-55 · ES · Audiencia cálida 180d',
    audienceShort: 'Audiencia cálida',
    budget: '20-30K€/lanzamiento',
    objective: 'Registros webinar',
    cta: 'Registrarse',
    abTest: {
      a: 'Webinar en directo',
      b: 'Webinar automatizado',
      winner: 'a',
      result: '+31% asistencia',
    },
    beforeAfter: { before: 'CPA 4.20€', after: 'CPA 1.80€' },
  },
  {
    id: 'casa-verde',
    index: '04',
    title: 'Casa Verde',
    sector: 'Retail local',
    year: '2024',
    tags: 'Tráfico · Local',
    kpi1: { value: '+180%', label: 'Tráfico' },
    kpi2: { value: '3.4x', label: 'ROAS' },
    desc: 'Campañas de tráfico a tienda y catálogo local con segmentación geográfica.',
    gradient: ['#F57327', '#C559C4'],
    adFormat: 'Carrusel 1:1',
    audience: 'Radio 15km · 30-60 · Hogar y jardín',
    audienceShort: 'Radio 15km · 30-60',
    budget: '2-3K€/mes',
    objective: 'Tráfico a tienda',
    cta: 'Cómo llegar',
    abTest: {
      a: 'Oferta de temporada',
      b: 'Producto + horario de tienda',
      winner: 'a',
      result: '+180% visitas',
    },
    beforeAfter: { before: '1.100 visitas/mes', after: '3.080 visitas/mes' },
  },
  {
    id: 'zenfit',
    index: '05',
    title: 'Zenfit',
    sector: 'App móvil',
    year: '2025',
    tags: 'App Installs',
    kpi1: { value: '0.90€', label: 'CPI' },
    kpi2: { value: '45K', label: 'Instalaciones' },
    desc: 'Campañas de instalaciones con eventos de app y optimización por valor.',
    gradient: ['#161616', '#7B19C8'],
    adFormat: 'Reels 9:16',
    audience: '18-34 · ES/PT/IT · Fitness',
    audienceShort: '18-34 · Fitness',
    budget: '10-14K€/mes',
    objective: 'Instalaciones de app',
    cta: 'Instalar ahora',
    abTest: {
      a: 'Demo de la app en pantalla',
      b: 'UGC de usuaria entrenando',
      winner: 'b',
      result: '−38% CPI',
    },
    beforeAfter: { before: 'CPI 1.45€', after: 'CPI 0.90€' },
  },
  {
    id: 'glow-skin',
    index: '06',
    title: 'Glow Skin',
    sector: 'DTC belleza',
    year: '2026',
    tags: 'DTC · UGC',
    kpi1: { value: '7.1x', label: 'ROAS' },
    kpi2: { value: '0→80K€', label: '/mes' },
    desc: 'De cero a 80K€/mes con sistema de testing creativo UGC semanal.',
    gradient: ['#7B19C8', '#F57327'],
    adFormat: 'Reels 9:16',
    audience: 'Mujeres 20-40 · ES · Skincare',
    audienceShort: 'Mujeres 20-40 · ES',
    budget: '15-25K€/mes',
    objective: 'Ventas catálogo',
    cta: 'Comprar ahora',
    abTest: {
      a: 'Antes/después de piel',
      b: 'Rutina de 15 segundos',
      winner: 'b',
      result: 'ROAS 7.1x',
    },
    beforeAfter: { before: '0€/mes', after: '80K€/mes' },
  },
]
```

### Añadir a `src/main.js` (al final del archivo, sin tocar lo anterior)
```js
import { projects } from './data/projects.js'
console.log(`[paola] ${projects.length} proyectos cargados`)
```

## Criterios de aceptación
- [ ] `npm run dev` sin errores; consola muestra `[paola] 6 proyectos cargados`.
- [ ] `projects` exporta un array de 6 objetos con exactamente estas claves:
  `id, index, title, sector, year, tags, kpi1, kpi2, desc, gradient, adFormat,
  audience, audienceShort, budget, objective, cta, abTest, beforeAfter`.
- [ ] `abTest.winner` es siempre `'a'` o `'b'` en los 6 casos.
- [ ] Ningún `audienceShort` supera los 24 caracteres (si no, no cabe en el cursor).
- [ ] Ningún `budget` es una cifra exacta: los 6 son rangos (regla NDA, `CONTENT.md` §7.1).

## Verificación
```bash
npm run dev   # consola del navegador debe mostrar el log con "6 proyectos"
```

En la consola del navegador:
```js
projects.every(p => p.audienceShort.length <= 24 && ['a','b'].includes(p.abTest.winner))
// → true
```

## ⚠ No hacer
- No renderizar nada en el DOM todavía (eso es la tarea 11; el backstage, la 34).
- No añadir URLs de imágenes externas: el visual es el par de colores `gradient`.
- No poner cifras exactas de presupuesto ni audiencias identificables de clientes reales.
