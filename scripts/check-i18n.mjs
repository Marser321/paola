#!/usr/bin/env node
// Comprobador de deriva entre el HTML estático y el diccionario español.
// Sin dependencias: el stack está bloqueado (PLAN.md §3).
//
//   npm run check:i18n
//
// POR QUÉ EXISTE
// El texto visible vive en DOS sitios a la vez y es a propósito:
//   · index.html lo lleva escrito — es lo que se ve antes de que corra el JS, lo
//     que lee un buscador y lo que queda si el JS falla;
//   · src/i18n/es.js lo lleva otra vez, porque el sitio es bilingüe y
//     apply-dom.js sobrescribe el HTML con el idioma elegido.
//
// La consecuencia es que se pueden separar SIN QUE SE NOTE: en pantalla manda el
// diccionario, así que un cambio hecho solo ahí parece correcto y deja el HTML
// mintiendo por debajo. Pasó dos veces:
//   · «cada euro invertido» sobrevivió en el HTML a la conversión a dólares de
//     5ca8619 y al repaso de 3248f1b, que dio el asunto por cerrado sin serlo;
//   · «ángulos y iteración» se corrigió a «e iteración» solo en el diccionario.
// Las dos se veían bien en el navegador. Ninguna se veía bien en el código
// fuente, que es lo que indexa Google.
//
// QUÉ NO COMPRUEBA: el inglés. en.js no tiene HTML espejo — el markup está en
// español y el inglés solo existe en el diccionario.

import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const D = await import(pathToFileURL(join(root, 'src', 'i18n', 'es.js')).href).then(
  (m) => m.default || m.es || m
)

// El HTML lleva etiquetas dentro (los <span class="accent-text">) y el
// diccionario también: se comparan los textos planos, que es lo que se lee.
const limpia = (s) =>
  String(s).replace(/<[^>]+>/g, '').replace(/&reg;/g, '®').replace(/\s+/g, ' ').trim()

const enHtml = (cls) =>
  [...html.matchAll(new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</`, 'g'))]
    .map((m) => limpia(m[1]))

// Cada pareja: la clase del HTML y de dónde sale su texto en el diccionario.
// Si se añade una sección con texto estático traducible, se añade aquí.
const PAREJAS = [
  ['about__text', [D.about?.p1, D.about?.p2]],
  ['hero__label', [D.hero?.label]],
  ['step__title', (D.process?.steps || []).map((s) => s.title)],
  ['step__desc', (D.process?.steps || []).map((s) => s.desc)],
  ['service__title', (D.services?.items || []).map((s) => s.title)],
  ['service__desc', (D.services?.items || []).map((s) => s.desc)],
  ['metric__label', D.metrics || []],
  ['plan-card__tag', (D.plans?.items || []).map((p) => p.tag)],
  ['plan-card__title', (D.plans?.items || []).map((p) => p.title)],
  ['plan-card__who', (D.plans?.items || []).map((p) => p.who)],
  ['plans__intro', [D.plans?.intro]],
  ['calc__intro', [D.calc?.intro]],
  ['calc__label', ['spend', 'roas', 'ticket'].map((k) => D.calc?.fields?.[k])],
  ['calc__viz-label', [D.calc?.viz?.spend, D.calc?.rows?.profit]],
  ['faq__q', (D.faq?.items || []).map((f) => f.q)],
  ['limits__title', [D.limits?.title]],
  ['limits__intro', [D.limits?.intro]],
  ['limits__item', D.limits?.items || []],
  ['contact-form__label', ['name', 'email', 'plan', 'message'].map((k) => D.contact?.form?.[k])],
  ['contact-form__submit', [D.contact?.form?.submit]],
  ['mobile-cta__text', [D.contact?.mobileCta]],
]

// ⚠ NO se comprueban los bloques con etiquetas DENTRO del texto
// (.plan-card__take, .calc__note): el recorte de arriba corta en el primer
// `</`, así que compararía «Te llevas» contra la frase entera y fallaría
// siempre. Su deriva se vigila a ojo, que para dos párrafos es asumible.

const problemas = []
for (const [cls, valores] of PAREJAS) {
  const html_ = enHtml(cls)
  const dicc = valores.filter((v) => v != null).map(limpia)
  if (html_.length && dicc.length && html_.length !== dicc.length) {
    problemas.push(
      `.${cls}: el HTML tiene ${html_.length} y el diccionario ${dicc.length}. ` +
      `Uno de los dos se quedó sin actualizar.`
    )
  }
  for (let i = 0; i < Math.min(html_.length, dicc.length); i++) {
    if (html_[i] !== dicc[i]) {
      problemas.push(
        `.${cls} [${i}] no coincide:\n` +
        `       html: ${html_[i]}\n` +
        `       es.js: ${dicc[i]}`
      )
    }
  }
}

console.log(`\n  Deriva HTML ↔ diccionario — ${PAREJAS.length} bloque(s) comprobado(s)\n`)
if (!problemas.length) {
  console.log('  ✔ el HTML estático y el diccionario español dicen lo mismo\n')
} else {
  for (const p of problemas) console.log(`  ⛔ ${p}\n`)
  console.log(
    `  ${problemas.length} desajuste(s). En pantalla manda el diccionario, así que\n` +
    `  esto NO se ve en el navegador: se ve en el código fuente, que es lo que\n` +
    `  indexa Google y lo que queda si el JS no llega a correr.\n`
  )
}
process.exit(problemas.length ? 1 : 0)
