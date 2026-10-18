#!/usr/bin/env node
// La imagen para compartir: public/og.jpg (1200×630), desde scripts/og/og.html.
//
//   npm run og
//
// POR QUÉ UN SCRIPT y no una captura a mano. La OG que había era de otra época
// del sitio («La campaña eres tú», el degradado violeta, «+2M€»): la plantilla se
// actualizó, la imagen no, y nadie lo vio porque og:image además estaba
// comentado. Aquí la plantilla se rellena con el MISMO texto del hero
// (i18n/es.js) en cada ejecución, así que no se pueden separar.
//
// Necesita Google Chrome (headless) y `sips`, que viene con macOS. Es una
// herramienta de autoría, no corre en el build de Vercel: el og.jpg resultante
// se versiona en public/.
//
// ⚠ ≤100 KB, a propósito: WhatsApp no enseña la vista previa de imágenes pesadas,
// y por WhatsApp es por donde más se comparte este enlace. Si una captura pasa
// del límite, se baja la calidad del JPG hasta que entre.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const { es } = await import(pathToFileURL(join(root, 'src', 'i18n', 'es.js')).href)

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SALIDA = join(root, 'public', 'og.jpg')
const LIMITE_KB = 100

if (!existsSync(CHROME)) {
  console.error(`✗ No encuentro Chrome en ${CHROME}. Indica otro con CHROME_PATH=…`)
  process.exit(1)
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const dataUri = (rel, tipo) => `data:${tipo};base64,${readFileSync(join(root, rel)).toString('base64')}`

const huecos = {
  '{{label}}': esc(es.hero.label),
  // La frase lleva su <span class="accent-text"> dentro: va tal cual, es HTML propio.
  '{{frase}}': es.hero.subtitle,
  '{{cifras}}': esc(es.hero.meta.join(' · ')),
  '{{font-clash}}': dataUri('public/fonts/ClashDisplay-Bold.woff2', 'font/woff2'),
  '{{font-satoshi}}': dataUri('public/fonts/Satoshi-Medium.woff2', 'font/woff2'),
  '{{font-mono}}': dataUri('public/fonts/JetBrainsMono-latin.woff2', 'font/woff2'),
  '{{figura}}': dataUri('public/img/paola-figura.webp', 'image/webp'),
}

let html = readFileSync(join(root, 'scripts', 'og', 'og.html'), 'utf8')
for (const [hueco, valor] of Object.entries(huecos)) html = html.replaceAll(hueco, valor)
if (/\{\{[\w-]+\}\}/.test(html)) {
  console.error('✗ Quedan huecos sin rellenar en og.html:', html.match(/\{\{[\w-]+\}\}/g).join(', '))
  process.exit(1)
}

const tmp = mkdtempSync(join(tmpdir(), 'paola-og-'))
try {
  const pagina = join(tmp, 'og.html')
  const png = join(tmp, 'og.png')
  writeFileSync(pagina, html)

  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    // Tiempo virtual para que fuentes e imagen (data: URI) estén pintadas.
    '--virtual-time-budget=4000',
    `--screenshot=${png}`,
    pathToFileURL(pagina).href,
  ], { stdio: 'ignore' })

  let kb = Infinity
  for (const calidad of [86, 80, 74, 68, 62]) {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(calidad), png, '--out', SALIDA], { stdio: 'ignore' })
    kb = Math.round(statSync(SALIDA).size / 1024)
    if (kb <= LIMITE_KB) {
      console.log(`✓ public/og.jpg — 1200×630, calidad ${calidad}, ${kb} KB`)
      break
    }
  }
  if (kb > LIMITE_KB) {
    console.error(`✗ public/og.jpg pesa ${kb} KB incluso a calidad 62 (límite ${LIMITE_KB} KB)`)
    process.exitCode = 1
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
