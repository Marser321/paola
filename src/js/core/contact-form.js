// Formulario de contacto → api/contacto.js (función de Vercel → correo con Resend).
//
// ⚠ Hasta el 2026-10-17 esto era Netlify Forms (POST a '/' con `form-name`)
// desplegado en VERCEL, donde Netlify no existe: no llegó ni un mensaje. Y el
// aviso de fallo mandaba escribir a hola@paola-ads.com, que tampoco existía. Para
// la web de una especialista en captación, perder los leads del propio
// formulario era el peor fallo posible del sitio.
//
// El envío correcto emite `form:success`: es el gancho natural para lo que venga
// (una analítica de verdad, una redirección a gracias) y no cuesta nada.
//
// Sin JS el formulario sigue funcionando: el POST nativo va a la misma función,
// que en ese caso responde con una redirección de vuelta a #contacto.

import { t } from '../../i18n/index.js'
import { perfil } from '../../data/perfil.js'

const ENDPOINT = '/api/contacto'

/**
 * El aviso de error ofrece una salida, pero SOLO si existe: el correo de perfil,
 * si lo hay; si no, LinkedIn; si tampoco, volver a intentarlo. Nunca un correo
 * inventado — que es exactamente lo que había.
 */
function avisoDeError() {
  const { email, linkedin } = perfil.contacto
  if (email) return t('contact.status.errorEmail', { email })
  if (linkedin) return t('contact.status.errorLinkedin', { url: linkedin })
  return t('contact.status.errorRetry')
}

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
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      form.reset()
      say(t('contact.status.ok'), 'ok')
      window.dispatchEvent(new CustomEvent('form:success'))
    } catch {
      // En `vite dev` esto falla SIEMPRE, y es normal: Vite no ejecuta /api. Para
      // probar el envío de verdad, un preview de Vercel con las variables puestas.
      // Y en producción, si faltan RESEND_API_KEY / CONTACT_TO / CONTACT_FROM, la
      // función responde 503 y se cae aquí: el visitante nunca se queda sin salida.
      say(avisoDeError(), 'error')
    } finally {
      submit.disabled = false
    }
  })
}
