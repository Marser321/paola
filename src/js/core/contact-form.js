// Formulario de contacto (tarea 24) — Netlify Forms.
//
// El envío correcto emite `form:success`, que el orquestador traduce a la señal
// `Conversion` del tracker. El dedupe del tracker garantiza que cuente UNA sola vez
// aunque además se pulse el CTA magnético (tarea 14).

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
      say('Mensaje enviado. Te respondo en menos de 24 h.', 'ok')
      return
    }

    submit.disabled = true
    say('Enviando…', 'pending')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      form.reset()
      say('Mensaje enviado. Te respondo en menos de 24 h.', 'ok')
      window.dispatchEvent(new CustomEvent('form:success'))
    } catch {
      // Hasta el deploy en Netlify (t.26) esto SIEMPRE falla en local, y es normal.
      // Nunca se deja al visitante sin salida: se le da el email.
      say(
        'No he podido enviar el formulario. Escríbeme directamente a hola@paola-ads.com.',
        'error'
      )
    } finally {
      submit.disabled = false
    }
  })
}
