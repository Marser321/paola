#!/usr/bin/env node
// Candado de honestidad sobre lo que SE PUBLICA: dist/, después de `vite build`.
//
//   npm run build            (lo corre al final, también en Vercel)
//   npm run check:contenido  (suelto, sobre un dist/ ya construido)
//
// POR QUÉ EXISTE. La auditoría del 17 oct 2026 encontró una web que vendía a otra
// persona: clientes, testimonios, años y cifras de plantilla, un dominio y un
// correo que no existían, redes enlazadas a «#» y español de España para un
// público de EE. UU. Nada de eso se veía como un error —todo «funcionaba»—, y por
// eso había sobrevivido a varias revisiones. Este script no deja publicar si algo
// de eso vuelve. Es la misma idea que los tests de honestidad del portfolio de
// Mario Morera: lo que no se puede afirmar no llega a producción.
//
// Mira dist/ y no src/, a propósito: es lo que lee Google, lo que ve quien abre
// el código fuente y lo que resulta de TODO junto (HTML, diccionarios, datos y lo
// que escribe el plugin de vite.config.js). Sin dependencias.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(root, 'dist')
const importar = (rel) => import(pathToFileURL(join(root, rel)).href)

if (!existsSync(DIST)) {
  console.error('\n  ⛔ No hay dist/. Construye antes: `npx vite build`.\n')
  process.exit(1)
}

const { perfil } = await importar('src/data/perfil.js')
const { sectores, totalInvertido } = await importar('src/data/sectores.js')

// Todos los archivos de texto publicados. Los «._*» son basura de macOS en el
// disco exFAT: no van a Vercel (no están en git) y no se miran.
function* archivos(dir) {
  for (const nombre of readdirSync(dir)) {
    if (nombre.startsWith('._')) continue
    const ruta = join(dir, nombre)
    if (statSync(ruta).isDirectory()) yield* archivos(ruta)
    else if (/\.(html|js|css|txt|xml|webmanifest|json)$/.test(nombre)) yield ruta
  }
}

// Los comentarios no se miran: son notas de desarrollo, y en este proyecto
// cuentan la historia de lo que se retiró. Lo que importa es lo que se LEE.
const sinComentarios = (texto) =>
  texto.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ')

// [patrón, por qué no puede estar]
const PROHIBIDO = [
  // Prioridad 1 de la auditoría: lo inventado.
  [/Atelier Nord|Flowstack|Masterclass Pro|Casa Verde|Zenfit|Glow Skin/i, 'cliente de plantilla'],
  [/Marta G\.|Daniel R\.|Lucía P\./, 'testimonio de plantilla'],
  [/Barcelona|\bBCN\b/, 'trayectoria de plantilla'],
  [/4[.,]2x|\+\$2M|\$2M\+|2M€|ROAS medio|Retención de clientes|Client retention/i, 'cifra que no es de Paola'],
  [/más de 6 años|more than 6 years/i, 'años de plantilla'],
  [/unos \$3[.,]000|roughly \$3,000/i, 'mínimo de inversión retirado'],
  // Prioridad 5: lo técnico que apuntaba a nada.
  [/paola-ads\.com|DOMINIO|data-netlify|netlify-honeypot/, 'dominio o servicio que no existe'],
  [/href="#"/, 'enlace a «#»'],
  [/®|&reg;/, 'símbolo de marca registrada sin registro'],
  [/\bes-ES\b|\bes_ES\b|\ben-GB\b/, 'locale de España o del Reino Unido'],
  [/%[A-Z_]+%/, 'hueco del plugin sin rellenar'],
]

// Léxico de España: el sitio le habla en español neutro a negocios de EE. UU.
// Solo en archivos de la portada y del caso —las páginas legales citan normas
// con su nombre— y siempre sin comentarios.
const LEXICO = [
  /\bcostes?\b/i, /\bvídeos?\b/i, /\bmóvil(es)?\b/i, /\bordenador(es)?\b/i,
  /\bvosotros\b/i, /\btanda\b/i, /\bpermanencia\b/i, /\brellenar\b/i,
  /\bcreatividades\b/i, /\becha la cuenta\b/i, /\bya ha pasado\b/i,
]

const problemas = []
const decir = (archivo, msg) => problemas.push(`${relative(root, archivo)}: ${msg}`)

for (const archivo of archivos(DIST)) {
  const texto = sinComentarios(readFileSync(archivo, 'utf8'))
  for (const [patron, motivo] of PROHIBIDO) {
    const m = texto.match(patron)
    if (m) decir(archivo, `${motivo} → «${m[0]}»`)
  }
  if (!/[\\/]legal[\\/]/.test(archivo)) {
    for (const patron of LEXICO) {
      const m = texto.match(patron)
      if (m) decir(archivo, `léxico de España → «${m[0]}» (español neutro: costo, video, celular…)`)
    }
  }
}

// --- Lo que TIENE que estar ---
const index = join(DIST, 'index.html')
const html = readFileSync(index, 'utf8')
const exige = (cond, msg) => cond || decir(index, msg)

exige(/<html lang="es-US"/.test(html), 'falta <html lang="es-US">')
exige(/<meta property="og:image" content="https:\/\/[^"]+\/og\.jpg"/.test(html), 'og:image no es una URL absoluta a /og.jpg')
exige(/<link rel="canonical" href="https:\/\/[^"]+\/"/.test(html), 'falta el canonical absoluto')

const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
try {
  const datos = JSON.parse(ld?.[1] ?? '')
  exige(Array.isArray(datos['@graph']), 'el JSON-LD no trae @graph')
} catch {
  decir(index, 'el JSON-LD falta o no es JSON válido')
}

const og = join(DIST, 'og.jpg')
if (!existsSync(og)) decir(og, 'no existe: `npm run og`')
else if (statSync(og).size > 100 * 1024) decir(og, `pesa ${Math.round(statSync(og).size / 1024)} KB (máximo 100: WhatsApp no previsualiza imágenes pesadas)`)
if (existsSync(join(DIST, 'og.html'))) decir(join(DIST, 'og.html'), 'la plantilla de la OG no se publica (vive en scripts/og/)')

// --- Las cifras dicen lo mismo en todas partes ---
// La suma de los sectores es el total del perfil, y el hero publica ese total
// redondeado hacia abajo, más las marcas y los años del perfil.
exige(totalInvertido === perfil.cifras.invertido,
  `los sectores suman ${totalInvertido} y perfil.cifras.invertido dice ${perfil.cifras.invertido}`)
const millones = (Math.floor(perfil.cifras.invertido / 100000) / 10).toFixed(1)
const meta = html.match(/<div class="hero__meta mono">([\s\S]*?)<\/div>/)?.[1] ?? ''
for (const cifra of [`+US$${millones}M`, `+${perfil.cifras.marcas} `, `+${perfil.cifras.anios} `]) {
  exige(meta.includes(cifra), `el hero no dice «${cifra.trim()}», que es lo que dice src/data/perfil.js`)
}
exige(sectores.every((s) => html.includes(`data-sector="${s.id}"`)), 'faltan filas de sectores en #metricas')

// --- Informe ---
console.log('\n  Candado de contenido — dist/\n')
if (!problemas.length) {
  console.log('  ✔ nada inventado, nada apuntando a «#», cifras coherentes y español neutro\n')
} else {
  for (const p of problemas) console.log(`  ⛔ ${p}`)
  console.log(`\n  ${problemas.length} problema(s). No se publica hasta corregirlos.\n`)
}
process.exit(problemas.length ? 1 : 0)
