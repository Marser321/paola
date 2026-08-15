// Motor de i18n propio. Sin librerías (PLAN.md §3): son ~90 líneas.
//
// Decisión deliberada: **no se detecta el idioma del navegador.** `navigator.language`
// es justo el tipo de dato que PLAN.md §11.2 prohíbe leer, y un sitio cuyo argumento
// es "no te perfilo" no puede empezar perfilando el idioma. Por defecto ES; la
// elección explícita del visitante se recuerda en localStorage, igual que el opt-out
// del panel.

import { es } from './es.js'
import { en } from './en.js'

const DICTS = { es, en }
const STORAGE_KEY = 'paola-lang'
const DEFAULT = 'es'

let current = DEFAULT

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'es' || v === 'en' ? v : null
  } catch {
    return null
  }
}

function store(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* sin storage: el idioma vive en memoria */
  }
}

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), dict)
}

/**
 * Devuelve la cadena traducida. Si falta en el idioma actual cae al español,
 * que es el diccionario canónico; si tampoco está, devuelve la propia clave
 * (visible en pantalla a propósito: un hueco silencioso no se detecta).
 */
export function t(path, vars) {
  let value = resolve(DICTS[current], path)
  if (value === undefined) value = resolve(DICTS[DEFAULT], path)
  if (value === undefined) return path
  if (typeof value === 'string' && vars) {
    return value.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))
  }
  return value
}

export function getLang() {
  return current
}

export function initI18n() {
  current = readStored() || DEFAULT
  return current
}

/**
 * Cambia de idioma y avisa. Los consumidores (secciones y UI del tracker) se
 * suscriben a 'i18n:change' y se repintan solos; el orquestador se encarga de
 * lo que hay que reconstruir (cards) y de refrescar el tracker.
 */
export function setLang(lang) {
  if (!DICTS[lang] || lang === current) return current
  current = lang
  store(lang)
  document.documentElement.lang = t('htmlLang')
  document.title = t('title')
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', t('description'))
  window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }))
  return current
}

export function toggleLang() {
  return setLang(current === 'es' ? 'en' : 'es')
}
