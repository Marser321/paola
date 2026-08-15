// Entrada de las páginas legales (tarea 24).
// Solo estilos y el botón de retirar consentimiento. Sin tracker: igual que en
// caso.html, el concepto vive en la one-page.

import '../../styles/tokens.css'
import '../../styles/base.css'
import '../../styles/sections.css'
import '../../styles/legal.css'

import { revokeConsent, getConsent } from '../core/consent.js'
import { initTheme } from '../ui/theme.js'

// El tema ya lo aplica el <script> del <head>; esto solo pone el botón, para
// que no haya que volver a la portada para cambiarlo.
initTheme()

const button = document.getElementById('revoke-consent')
const status = document.getElementById('revoke-status')

function paintStatus() {
  if (!status) return
  const value = getConsent()
  status.textContent =
    value === 'accepted'
      ? 'Estado actual: has aceptado la analítica externa.'
      : value === 'rejected'
        ? 'Estado actual: has rechazado la analítica externa.'
        : 'Estado actual: todavía no has decidido; se te preguntará al volver al inicio.'
}

button?.addEventListener('click', () => {
  revokeConsent()
  paintStatus()
  if (status) {
    status.textContent =
      'Decisión borrada. La próxima vez que abras la página principal se te volverá a preguntar.'
  }
})

paintStatus()
