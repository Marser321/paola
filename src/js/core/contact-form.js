// Formulario de contacto (tarea 24) — Netlify Forms.
//
// El envío correcto emite `form:success`. Hasta el 2026-08-16 el orquestador lo
// traducía a la señal `Conversion` del tracker; retirado aquel, el evento se
// queda porque es el gancho natural para lo que venga (una analítica de verdad,
// una redirección a gracias) y no cuesta nada.

import { t } from '../../i18n/index.js'

const ENDPOINT = '/' // Netlify recoge el POST en la propia ruta

export function initContactForm() {
  const form = document.querySelector('.contact-form')
  if (!form) return

  const status = form.querySelector('.contact-form__status')
  const submit = form.querySelector('.contact-form__submit')

  const say = (message, state) => {
    if (!status) return
    status.textContent = message
    status.dataset.state = state
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // Honeypot: si viene relleno es un bot. Se finge éxito y no se envía nada.
    if (form.querySelector('[name="bot-field"]')?.value) {
      say(t('contact.status.ok'), 'ok')
      return
    }

    submit.disabled = true
    say(t('contact.status.sending'), 'pending')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      form.reset()
      say(t('contact.status.ok'), 'ok')
      window.dispatchEvent(new CustomEvent('form:success'))
    } catch {
      // Hasta el deploy en Netlify (t.26) esto SIEMPRE falla en local, y es normal.
      // Nunca se deja al visitante sin salida: se le da el email.
      say(t('contact.status.error'), 'error')
    } finally {
      submit.disabled = false
    }
  })
}
