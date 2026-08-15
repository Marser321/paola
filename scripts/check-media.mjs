#!/usr/bin/env node
// Comprobador del manifiesto de medios (tarea 38).
// Sin dependencias: el stack está bloqueado (PLAN.md §3).
//
//   npm run check:media
//
// Responde a tres preguntas:
//   1. ¿Existe en disco todo lo que se declara en src/data/media.js?
//   2. ¿Alguien se ha pasado de su presupuesto de peso?
//   3. ¿Qué sigue marcado como generado por IA y por tanto NO se puede publicar?

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const IMG = join(root, 'public', 'img')

const { portraits, backdrops, sequences, galleries, budgets } = await import(
  pathToFileURL(join(root, 'src', 'data', 'media.js')).href
)

const problems = []
const warnings = []
const pending = []
const KB = (bytes) => Math.round(bytes / 1024)

// Comprueba que existe CADA formato declarado, no solo alguno: un image-set con
// un .avif inexistente deja la capa en blanco sin caer al .webp.
function assetSize(base, formats = ['avif', 'webp']) {
  let biggest = 0
  const missing = []
  for (const ext of formats) {
    const file = join(IMG, `${base}.${ext}`)
    if (existsSync(file)) biggest = Math.max(biggest, statSync(file).size)
    else missing.push(ext)
  }
  return { size: missing.length === formats.length ? null : biggest, missing }
}

function dirSize(relative) {
  const dir = join(IMG, relative)
  if (!existsSync(dir)) return null
  return readdirSync(dir).reduce((sum, f) => sum + statSync(join(dir, f)).size, 0)
}

function checkBudget(key, bytes) {
  const budget = budgets?.[key]
  if (!budget || bytes == null) return
  if (KB(bytes) > budget) {
    problems.push(`«${key}» pesa ${KB(bytes)} KB y su presupuesto son ${budget} KB`)
  }
}

// --- Retratos ---
for (const [slot, portrait] of Object.entries(portraits || {})) {
  if (!portrait?.src) continue
  // Los retratos usan <picture> con <source>, que SÍ cae de avif a webp solo.
  const { size } = assetSize(portrait.src)
  if (size == null) problems.push(`Retrato «${slot}»: falta /img/${portrait.src}.(avif|webp)`)
  else checkBudget('portraits', size)
  if (!portrait.alt) problems.push(`Retrato «${slot}»: falta el texto alternativo (alt)`)
  if (portrait.placeholder) pending.push(`retrato «${slot}» (${portrait.src})`)
}

// --- Fondos ---
for (const [section, config] of Object.entries(backdrops || {})) {
  let total = 0
  for (const layer of config?.layers || []) {
    const { size, missing } = assetSize(layer.src, layer.formats)
    if (size == null) problems.push(`Fondo de «${section}»: falta /img/${layer.src} en todos sus formatos`)
    else {
      total += size
      if (missing.length) {
        problems.push(
          `Fondo de «${section}»: falta /img/${layer.src}.${missing.join(', .')} — ` +
          `image-set lo pedirá igualmente y la capa saldrá vacía. Genera ese formato o ` +
          `declara \`formats: ['webp']\` en la capa`
        )
      }
    }
    if ((layer.depth ?? 0) > 0.35) {
      warnings.push(`Fondo de «${section}»: depth ${layer.depth} > 0.35, competirá con el texto`)
    }
  }
  checkBudget(section, total)
  if (config?.placeholder) pending.push(`fondo de «${section}»`)
}

// --- Secuencias ---
for (const [section, entry] of Object.entries(sequences || {})) {
  if (!entry?.dir) continue
  const size = dirSize(entry.dir)
  if (size == null) {
    problems.push(`Secuencia de «${section}»: no existe /img/${entry.dir}/`)
  } else {
    const files = readdirSync(join(IMG, entry.dir)).filter((f) => f.endsWith(`.${entry.ext}`))
    if (files.length !== entry.frames) {
      problems.push(
        `Secuencia de «${section}»: declara ${entry.frames} frames y hay ${files.length} .${entry.ext}`
      )
    }
    checkBudget(entry.dir, size)
  }
  if (entry.still) {
    const { size: stillSize } = assetSize(entry.still, entry.stillFormats)
    if (stillSize == null) problems.push(`Secuencia de «${section}»: falta el frame fijo /img/${entry.still}`)
    else checkBudget(entry.still, stillSize)
  } else {
    warnings.push(`Secuencia de «${section}»: sin \`still\`. En móvil y reduced-motion no se verá nada`)
  }
  if (entry.placeholder) pending.push(`secuencia de «${section}»`)
}

// --- Galerías de servicio ---
// Los pies de las muestras NO se comprueban aquí: viven en i18n (son texto
// visible y bilingüe), no en el manifiesto. Aquí solo se comprueba el medio.
let galleryTotal = 0
for (const [service, gallery] of Object.entries(galleries || {})) {
  const items = gallery?.items || []
  if (!items.length) {
    warnings.push(`Galería de «${service}»: declarada y vacía, no se renderizará`)
    continue
  }
  items.forEach((item, i) => {
    // `src: null` es legítimo y frecuente: significa «todavía gradiente».
    if (!item.src) {
      if (!Array.isArray(item.gradient) || item.gradient.length !== 2) {
        problems.push(
          `Galería de «${service}» #${i + 1}: sin \`src\` y sin \`gradient\` de 2 colores — ` +
          `no hay nada que pintar`
        )
      }
      return
    }
    const { size, missing } = assetSize(item.src, item.formats)
    if (size == null) {
      problems.push(`Galería de «${service}» #${i + 1}: falta /img/${item.src} en todos sus formatos`)
    } else {
      galleryTotal += size
      // <picture> SÍ cae de avif a webp solo, al contrario que image-set: que
      // falte un formato es aviso, no problema.
      if (missing.length) {
        warnings.push(`Galería de «${service}» #${i + 1}: sin .${missing.join(', .')} — se servirá el otro`)
      }
    }
  })
  if (gallery.placeholder) pending.push(`galería de «${service}»`)
}
checkBudget('galleries', galleryTotal)

// --- Informe ---
const declared =
  Object.values(portraits || {}).filter(Boolean).length +
  Object.keys(backdrops || {}).length +
  Object.keys(sequences || {}).length +
  Object.keys(galleries || {}).length

console.log(`\n  Manifiesto de medios — ${declared} entrada(s) declarada(s)\n`)

if (backdrops?.informe) {
  warnings.push('«#informe» tiene fondo declarado. Va sin imagen a propósito: es el clímax y el único sitio donde aparece el gradiente Meta (MEDIA-BRIEF §criterios)')
}

for (const w of warnings) console.log(`  ⚠  ${w}`)
for (const p of problems) console.log(`  ✕  ${p}`)

if (pending.length) {
  console.log(`\n  ⛔ ${pending.length} elemento(s) generados por IA, PENDIENTES de material real:`)
  for (const item of pending) console.log(`     · ${item}`)
  console.log('\n     El sitio NO debe publicarse mientras quede algo en esta lista.')
  console.log('     Ver tasks/26 (checklist de lanzamiento) y MEDIA-BRIEF.md §guardas.')
}

if (!problems.length && !warnings.length && !pending.length) {
  console.log('  ✓  Todo en orden.\n')
} else {
  console.log('')
}

// Solo los errores de verdad rompen el comando; lo pendiente de IA se avisa
// pero no bloquea el trabajo diario.
process.exit(problems.length ? 1 : 0)
