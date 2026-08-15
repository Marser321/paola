// Consentimiento de analítica externa (tarea 24).
//
// ⚠ Esto NO pide permiso para el panel de sesión, y es deliberado: el panel no
// almacena nada que lo requiera y no envía nada (ver tarea 24 §3.1). Pedirlo daría
// a entender lo contrario y destruiría la distinción que sostiene el concepto.
//
// Rechazar la analítica **no apaga el panel**. El panel se apaga desde el panel.

const KEY = 'paola-consent' // 'accepted' | 'rejected'

const safeGet = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}
const safeSet = (value) => {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* sin storage: la decisión vale para esta sesión */
  }
}

export function getConsent() {
  return safeGet()
}

export function initConsent() {
  const banner = document.getElementById('consent-banner')
  if (!banner) return

  const stored = safeGet()
  if (!stored) banner.hidden = false
  else if (stored === 'accepted') window.dispatchEvent(new CustomEvent('consent:accepted'))

  const decide = (value) => {
    safeSet(value)
    banner.hidden = true
    window.dispatchEvent(new CustomEvent(`consent:${value}`))
  }

  document.getElementById('consent-accept')?.addEventListener('click', () => decide('accepted'))
  document.getElementById('consent-reject')?.addEventListener('click', () => decide('rejected'))
}

// La usa cookies.html para retirar el consentimiento.
export function revokeConsent() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
