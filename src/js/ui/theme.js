// Conmutador de tema. Se crea por JS, igual que el de idioma, el cursor y el HUD:
// el markup de la tarea 02 no se toca.
//
// Reparto de responsabilidades:
//   · el <script> en línea del <head> aplica el tema guardado ANTES de la primera
//     pintura. Es lo único que evita el fotograma en negro de quien tiene el tema
//     claro guardado, y por eso está duplicado ahí en lugar de vivir solo aquí;
//   · este módulo pone el botón, persiste el cambio y avisa a quien pinta con
//     algo que no es CSS — hoy el WebGL del hero.
//
// El sitio arranca SIEMPRE en oscuro salvo elección previa. No se consulta
// `prefers-color-scheme`: ver el razonamiento en tokens.css §TEMA.

// ⚠ Este módulo NO importa i18n, y es deliberado. Lo usan también caso.html y las
// tres páginas legales, y con el import dentro Rollup sacaba un chunk compartido
// de 16 KB con los dos diccionarios enteros — descargados en un aviso legal para
// rotular un botón de tres letras. Los textos entran por parámetro: la one-page
// le pasa los traducidos, las páginas sueltas se quedan con los de abajo, que es
// el idioma en el que están escritas.
const FALLBACK_LABELS = { label: 'Cambiar tema', toLight: 'Claro', toDark: 'Oscuro' }

export const STORAGE_KEY = 'paola:theme'
const THEMES = ['dark', 'light']

export function getTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme) {
  const next = THEMES.includes(theme) ? theme : 'dark'
  const root = document.documentElement

  if (next === 'dark') root.removeAttribute('data-theme')
  else root.dataset.theme = next

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Safari en navegación privada tira al escribir. El tema se aplica igual,
    // solo que no sobrevive a la recarga: no es motivo para romper el botón.
  }

  // La barra del navegador en móvil se pinta con este meta. Sin actualizarlo, el
  // tema claro deja una franja negra arriba.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', next === 'light' ? '#F2EEE6' : '#0E0E0E')

  // Los shaders no leen custom properties: el hero se entera por aquí.
  window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: next } }))
  return next
}

export function toggleTheme() {
  return setTheme(getTheme() === 'light' ? 'dark' : 'light')
}

/**
 * @param {() => {label: string, toLight: string, toDark: string}} [getLabels]
 *   Devuelve los rótulos. Es una FUNCIÓN, no un objeto, porque en la one-page el
 *   idioma puede cambiar en caliente y hay que volver a preguntarlos.
 */
export function initTheme(getLabels) {
  const header = document.querySelector('.site-header')
  if (!header || document.querySelector('.theme-switch')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'theme-switch mono'
  button.setAttribute('data-hover', '')

  const paint = () => {
    const current = getTheme()
    const labels = { ...FALLBACK_LABELS, ...(getLabels?.() || {}) }
    // Igual que el conmutador de idioma: el botón anuncia a DÓNDE se va, no
    // dónde estás. Es lo que espera quien lo pulsa.
    button.textContent = current === 'light' ? labels.toDark : labels.toLight
    button.setAttribute('aria-label', labels.label)
    button.setAttribute('aria-pressed', String(current === 'light'))
  }

  button.addEventListener('click', () => {
    toggleTheme()
    paint()
  })

  // El rótulo puede estar traducido, así que también se repinta al cambiar de
  // idioma. Sin esto se queda en el idioma con el que se montó.
  window.addEventListener('i18n:change', paint)

  paint()
  header.querySelector('.site-nav')?.appendChild(button)
}
