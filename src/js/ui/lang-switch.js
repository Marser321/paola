// Conmutador de idioma. Se crea por JS, como el cursor y el HUD, para no tocar
// el markup de la tarea 02.

import { t, getLang, toggleLang } from '../../i18n/index.js'

export function initLangSwitch() {
  const header = document.querySelector('.site-header')
  if (!header || document.querySelector('.lang-switch')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'lang-switch mono'
  button.setAttribute('data-hover', '')

  const paint = () => {
    // El botón muestra el idioma AL QUE se va, no en el que estás: es lo que
    // espera quien lo pulsa.
    button.textContent = t('langSwitch.to')
    button.setAttribute('aria-label', `${t('langSwitch.label')} (${getLang().toUpperCase()} → ${t('langSwitch.to')})`)
  }

  button.addEventListener('click', () => {
    toggleLang()
    paint()
  })

  paint()
  header.querySelector('.site-nav')?.appendChild(button)
}
