import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { perfil } from './src/data/perfil.js'
import { sectores, destacados, totalInvertido, enMiles, porcentaje } from './src/data/sectores.js'
import { es } from './src/i18n/es.js'

// URL PÚBLICA DEL SITIO — para todo lo que tiene que ser ABSOLUTO: og:image,
// og:url, el canonical, el JSON-LD, robots.txt y el sitemap. Un enlace relativo
// ahí no vale: el que lee la etiqueta es WhatsApp o LinkedIn, no esta página.
//
// Por orden:
//   1. SITE_URL, si alguien la fija a mano (para probar un dominio antes de
//      conectarlo, por ejemplo);
//   2. VERCEL_PROJECT_PRODUCTION_URL, que Vercel inyecta en CADA build con el
//      dominio de producción —también en los previews, que es lo que quiere un
//      canonical—. Cuando se conecte un dominio propio, cambia sola: ni una
//      línea de código que tocar;
//   3. el dominio de Vercel de hoy, para los builds locales.
//
// Hasta el 2026-10-17 todo esto apuntaba a «https://DOMINIO/» o a paola-ads.com
// (que nunca existió), y por eso og:image estaba comentado: al compartir el
// enlace no salía imagen.
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://paola-beta.vercel.app'
).replace(/\/+$/, '')

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const { contacto, cifras } = perfil

// «+US$1.1M»: millones con UN decimal y redondeando HACIA ABAJO. La cifra de la
// auditoría es un mínimo (deja fuera cuentas), así que lo publicado no puede
// pasarse de ella: 1.137.187 es «1.1», nunca «1.2».
const millones = (usd) => (Math.floor(usd / 100000) / 10).toFixed(1)

/**
 * Las cuatro cifras de #metricas, escritas en el HTML con su valor FINAL.
 * Hasta el 2026-10-17 el HTML decía «0» en las cuatro y el número real solo
 * existía si corría el contador: sin JS, o en una captura de página entera, la
 * web presumía de cero. El contador (sections/metrics.js) sigue siendo una
 * mejora: solo escribe cuando la sección entra, y termina en este mismo número.
 */
function htmlCifras() {
  const m = millones(cifras.invertido)
  const items = [
    { attrs: `data-count="${m}" data-decimals="1" data-prefix="+US$" data-suffix="M"`, valor: `+US$${m}M` },
    { attrs: `data-count="${cifras.cuentas}"`, valor: `${cifras.cuentas}` },
    { attrs: `data-count="${cifras.cuentasMas10k}"`, valor: `${cifras.cuentasMas10k}` },
    { attrs: `data-count="${cifras.marcas}" data-prefix="+"`, valor: `+${cifras.marcas}` },
  ]
  return items
    .map(
      ({ attrs, valor }, i) => `<div class="metric">
              <p class="metric__value" ${attrs}>${valor}</p>
              <p class="metric__label mono">${esc(es.metrics.labels[i])}</p>
            </div>`
    )
    .join('\n            ')
}

/**
 * «Dónde se ha invertido, por industria» — la gráfica de la página 2 de la
 * auditoría, con sus mismos datos. Base CERO y la misma escala para las nueve
 * filas (el 100 % es la fila más larga), como pide el resto de gráficas del
 * sitio (sections/metrics.js §coordenadas). La barra va aria-hidden porque no
 * dice nada que no esté ya en el texto de su fila: nombre, importe y porcentaje.
 */
function htmlSectores() {
  const techo = Math.max(...sectores.map((s) => s.invertido))
  return sectores
    .map((s) => {
      const clases = ['sector-bar', s.destacado && 'is-featured', s.id === 'otras' && 'is-rest']
        .filter(Boolean)
        .join(' ')
      const ancho = ((s.invertido / techo) * 100).toFixed(2)
      return `<li class="${clases}" data-sector="${s.id}" style="--valor: ${ancho}%">
                <span class="sector-bar__name">${esc(es.sectores[s.id].nombre)}</span>
                <span class="sector-bar__value mono">${enMiles(s.invertido)}</span>
                <span class="sector-bar__share mono">${porcentaje(s.invertido)}%</span>
                <span class="sector-bar__track" aria-hidden="true"><i></i></span>
              </li>`
    })
    .join('\n              ')
}

// Cada hueco del HTML y lo que lo rellena. Lo que sale de un dato VACÍO es una
// cadena vacía: el elemento no existe, en vez de existir apuntando a nada (es el
// contrato de src/data/perfil.js).
const HUECOS = {
  '<!-- perfil:cifras -->': htmlCifras,
  '<!-- perfil:sectores -->': htmlSectores,
  // El 69 % del titular de #proyectos, calculado y no escrito.
  '%PCT_DESTACADOS%': () =>
    String(Math.round((destacados.reduce((s, x) => s + x.invertido, 0) / totalInvertido) * 100)),

  // El titular de contacto. Con correo, abre el correo; sin él, baja al
  // formulario, que está justo debajo y SÍ entrega (api/contacto.js). Son los
  // ATRIBUTOS enteros porque el `data-scroll` solo tiene sentido en el segundo
  // caso: es el que engancha el scroll suave de core/lenis.js.
  '%CTA_CONTACTO%': () =>
    contacto.email ? `href="mailto:${esc(contacto.email)}"` : 'href="#cf-nombre" data-scroll',

  '<!-- perfil:correo -->': () =>
    contacto.email
      ? `<a class="contact__email" href="mailto:${esc(contacto.email)}" data-hover>${esc(contacto.email)}</a>`
      : '',

  // Solo las redes que existan. La auditoría lo pedía así: «conecta LinkedIn y
  // quita las que no uses».
  '<!-- perfil:redes -->': () => {
    const redes = [['LinkedIn', contacto.linkedin]].filter(([, url]) => url)
    if (!redes.length) return ''
    const enlaces = redes
      .map(([red, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener me" data-hover>${red}</a>`)
      .join('')
    return `<div class="footer__social">${enlaces}</div>`
  },

  '<!-- perfil:jsonld -->': () => `<script type="application/ld+json">\n${jsonLd()}\n    </script>`,
}

/**
 * JSON-LD construido desde los datos, no escrito a mano: así no puede volver a
 * declarar un email o una URL que no existen. Solo afirma lo que el sitio
 * afirma — nada de reseñas ni ratings, que además Google penaliza si no se ven.
 */
function jsonLd() {
  const id = (frag) => `${SITE_URL}/#${frag}`
  const sameAs = [contacto.linkedin].filter(Boolean)

  const persona = {
    '@type': 'Person',
    '@id': id('paola'),
    name: perfil.nombre,
    jobTitle: perfil.rol,
    worksFor: { '@type': 'Organization', name: perfil.empresa },
    url: `${SITE_URL}/`,
    knowsAbout: perfil.especialidades,
    ...(contacto.email && { email: contacto.email }),
    ...(sameAs.length && { sameAs }),
  }

  const servicio = {
    '@type': 'ProfessionalService',
    '@id': id('servicio'),
    name: `${perfil.nombre} — ${perfil.rol}`,
    description: es.description,
    url: `${SITE_URL}/`,
    provider: { '@id': id('paola') },
    areaServed: { '@type': 'Country', name: 'United States' },
    availableLanguage: ['es', 'en'],
    // Los mismos seis servicios de la sección, con sus mismos nombres.
    serviceType: es.services.items.map((s) => s.title),
  }

  const web = {
    '@type': 'WebSite',
    '@id': id('web'),
    url: `${SITE_URL}/`,
    name: perfil.nombre,
    inLanguage: es.htmlLang,
    publisher: { '@id': id('paola') },
  }

  // `<` escapado: dentro de un <script>, un «</script>» en un texto cerraría la
  // etiqueta antes de tiempo.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [persona, servicio, web] }, null, 2)
    .replace(/</g, '\\u003c')
}

/**
 * Plugin del sitio: rellena los huecos de los HTML y emite robots.txt y el
 * sitemap con la URL de verdad. Corre también en `vite dev`, así que lo que se
 * ve en local es lo mismo que se publica.
 */
function sitio() {
  return {
    name: 'paola-sitio',
    // `pre`: antes del reemplazo de variables de entorno de Vite, que también usa
    // la sintaxis %NOMBRE% y avisaría de que %SITE_URL% «no está definida».
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let out = html.replaceAll('%SITE_URL%', SITE_URL)
        for (const [hueco, valor] of Object.entries(HUECOS)) {
          if (out.includes(hueco)) out = out.replaceAll(hueco, valor())
        }
        return out
      },
    },
    generateBundle() {
      const hoy = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
      // Una sola URL: la portada. caso.html va con noindex y hoy no hay ningún
      // caso publicable; cuando los haya, se añaden aquí desde sectores.js.
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${hoy}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  base: './', // build portable (Netlify/Vercel/GitHub Pages)
  plugins: [sitio()],
  build: {
    target: 'es2020',
    // El único chunk que supera los 500 kB es `three`, y es deliberado: se carga
    // con import() dinámico y nunca entra en el arranque. Sin subir el umbral, el
    // build avisaría en cada ejecución de algo que ya está resuelto por diseño.
    // El budget que importa es el del JS INICIAL (<150 kB gzip, tarea 17 §6).
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      // MPA (tarea 29): index.html + caso.html. Una plantilla de caso, no seis.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        caso: resolve(import.meta.dirname, 'caso.html'),
        avisoLegal: resolve(import.meta.dirname, 'legal/aviso-legal.html'),
        privacidad: resolve(import.meta.dirname, 'legal/privacidad.html'),
        cookies: resolve(import.meta.dirname, 'legal/cookies.html'),
      },
      output: {
        // Vendors separados (tarea 17). `three` NO se lista aquí: sale solo en su
        // propio chunk porque hero-scene.js lo carga con import() dinámico.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('lenis')) return 'vendor-lenis'
        },
      },
    },
  },
})
