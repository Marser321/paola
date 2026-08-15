### READ lines 60-129 of 177
  loaded = true
  loadGA4()
  loadMetaPixel()
  registerEvents()
}

// --- Eventos de negocio ---
function registerEvents() {
  // 1) Lead: formulario enviado (evento de la tarea 24)
  window.addEventListener('form:success', () => {
    window.gtag?.('event', 'generate_lead', { method: 'form' })
    window.fbq?.('track', 'Lead')
  })

  // 2) Clicks en mailto / social
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'contact_click', { method: 'email' })
      window.fbq?.('track', 'Contact')
    })
  )
  document.querySelectorAll('.footer__social a').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'social_click', { network: a.textContent.trim() })
    })
  )

  // 3) view_content por sección (una vez por sesión y sección)
  const seen = new Set()
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = entry.target.id
        if (!id || seen.has(id)) return
        seen.add(id)
        sectionObserver.unobserve(entry.target)
        window.gtag?.('event', 'view_content', { section: id })
        window.fbq?.('trackCustom', 'SectionView', { section: id })
      })
    },
    { threshold: 0.4 }
  )
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s))

  // 4) Scroll depth 75%
  let depthSent = false
  const onScroll = () => {
    if (depthSent) return
    const depth =
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
    if (depth >= 0.75) {
      depthSent = true
      window.gtag?.('event', 'scroll_depth', { percent: 75 })
      window.removeEventListener('scroll', onScroll)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

export function initAnalytics() {
  // Si ya hay consentimiento guardado (visitas anteriores), cargar directo
  if (localStorage.getItem('paola-consent') === 'accepted') {
    loadAll()
    return
  }
  window.addEventListener('consent:accepted', loadAll, { once: true })
}
```


### EDIT
--- old ---
// --- Eventos de negocio ---
function registerEvents() {
  // 1) Lead: formulario enviado (evento de la tarea 24)
  window.addEventListener('form:success', () => {
    window.gtag?.('event', 'generate_lead', { method: 'form' })
    window.fbq?.('track', 'Lead')
  })

  // 2) Clicks en mailto / social
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'contact_click', { method: 'email' })
      window.fbq?.('track', 'Contact')
    })
  )
  document.querySelectorAll('.footer__social a').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'social_click', { network: a.textContent.trim() })
    })
  )

  // 3) view_content por sección (una vez por sesión y sección)
  const seen = new Set()
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = entry.target.id
        if (!id || seen.has(id)) return
        seen.add(id)
        sectionObserver.unobserve(entry.target)
        window.gtag?.('event', 'view_content', { section: id })
        window.fbq?.('trackCustom', 'SectionView', { section: id })
      })
    },
    { threshold: 0.4 }
  )
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s))

  // 4) Scroll depth 75%
  let depthSent = false
  const onScroll = () => {
    if (depthSent) return
    const depth =
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
    if (depth >= 0.75) {
      depthSent = true
      window.gtag?.('event', 'scroll_depth', { percent: 75 })
      window.removeEventListener('scroll', onScroll)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}
--- new ---
// --- Eventos de negocio ---
//
// ARQUITECTURA: analytics.js es un SUSCRIPTOR del bus del tracker. La dirección de
// la dependencia es siempre `analytics → tracker`, jamás al revés (PLAN.md §11.7).
// El tracker no conoce gtag ni fbq y sigue midiendo, en local, haya consentimiento
// o no. Aquí solo se REENVÍA lo que ya se midió, y solo si el visitante aceptó.
//
// Efecto colateral valioso: al centralizar, DESAPARECEN el único
// window.addEventListener('scroll') del proyecto y un IntersectionObserver
// duplicado. El concepto reduce listeners netos.
function registerEvents() {
  // 1) Lead: formulario enviado (evento de la tarea 24)
  window.addEventListener('form:success', () => {
    window.gtag?.('event', 'generate_lead', { method: 'form' })
    window.fbq?.('track', 'Lead')
  })

  // 2) Clicks en mailto / social
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'contact_click', { method: 'email' })
      window.fbq?.('track', 'Contact')
    })
  )
  document.querySelectorAll('.footer__social a').forEach((a) =>
    a.addEventListener('click', () => {
      window.gtag?.('event', 'social_click', { network: a.textContent.trim() })
    })
  )

  // 3) Todo lo demás llega del bus del tracker. Ni observers ni listeners propios.
  on('signal', (signal) => {
    switch (signal.name) {
      case 'ViewContent':
        window.gtag?.('event', 'view_content')
        window.fbq?.('track', 'ViewContent')
        break
      case 'Scroll75':
        window.gtag?.('event', 'scroll_depth', { percent: 75 })
        break
      case 'ContentEngagement':
        window.gtag?.('event', 'select_content', { content_id: signal.slug })
        window.fbq?.('trackCustom', 'CaseView', { case: signal.slug })
        break
      case 'Dwell60':
        window.gtag?.('event', 'engaged_session')
        break
      case 'Conversion':
        window.gtag?.('event', 'contact_click', { method: signal.source || 'cta' })
        window.fbq?.('track', 'Contact')
        break
      default:
        break
    }
  })

  // 4) La variante servida se envía como dimensión, no como evento: así los
  //    informes de GA4 pueden segmentar por test A/B.
  on('variant', ({ variant }) => {
    window.gtag?.('set', 'user_properties', { hero_variant: variant })
  })
}

### EDIT
--- old ---
### 1. `src/js/core/analytics.js` (literal)
```js
// IDs placeholder — sustituir por los reales antes del deploy (tarea 26)
const GA4_ID = 'G-XXXXXXXXXX'
--- new ---
### 1. `src/js/core/analytics.js` (literal)
```js
import { on } from './tracker.js'

// IDs placeholder — sustituir por los reales antes del deploy (tarea 26)
const GA4_ID = 'G-XXXXXXXXXX'

### EDIT
--- old ---
| Evento | Disparo | GA4 | Meta Pixel |
|---|---|---|---|
| Lead | Formulario enviado OK | `generate_lead` | `Lead` |
| Contacto email | Click en mailto | `contact_click` | `Contact` |
| Social | Click en LinkedIn/IG/X | `social_click {network}` | — |
| Vista de sección | 40% visible, 1×/sesión | `view_content {section}` | `SectionView` (custom) |
| Scroll profundo | 75% de la página | `scroll_depth {percent:75}` | — |
| PageView | Carga (tras consent) | automático | `PageView` |
--- new ---
Todos los eventos marcados con ▸ llegan del **bus del tracker**, no de listeners propios.

| Evento | Disparo | GA4 | Meta Pixel |
|---|---|---|---|
| Lead | Formulario enviado OK | `generate_lead` | `Lead` |
| Contacto email | Click en mailto | `contact_click` | `Contact` |
| Social | Click en LinkedIn/IG/X | `social_click {network}` | — |
| ▸ Vista de contenido | Señal `ViewContent` | `view_content` | `ViewContent` |
| ▸ Scroll profundo | Señal `Scroll75` | `scroll_depth {percent:75}` | — |
| ▸ Interés en caso | Señal `ContentEngagement` | `select_content {content_id}` | `CaseView` (custom) |
| ▸ Sesión comprometida | Señal `Dwell60` | `engaged_session` | — |
| ▸ Conversión | Señal `Conversion` | `contact_click {method}` | `Contact` |
| ▸ Variante A/B | Asignación del test | `user_properties.hero_variant` | — |
| PageView | Carga (tras consent) | automático | `PageView` |

### EDIT
--- old ---
## Criterios de aceptación
- [ ] Sin consentimiento: cero peticiones a google/facebook (Network filtrado).
- [ ] Tras aceptar: `gtag/js` y `fbevents.js` cargan; PageView registrado.
- [ ] Los 4 eventos de negocio se disparan según la tabla (DebugView / Pixel Helper).
- [ ] Rechazar cookies → nada se carga ni en esa visita ni en las siguientes.
- [ ] Con consentimiento previo guardado: carga directa al entrar (sin banner).
--- new ---
## Criterios de aceptación
- [ ] Sin consentimiento: cero peticiones a google/facebook (Network filtrado).
- [ ] Tras aceptar: `gtag/js` y `fbevents.js` cargan; PageView registrado.
- [ ] Los eventos de la tabla se disparan según lo previsto (DebugView / Pixel Helper).
- [ ] Rechazar cookies → nada se carga ni en esa visita ni en las siguientes.
- [ ] Con consentimiento previo guardado: carga directa al entrar (sin banner).
- [ ] **`analytics.js` no contiene ni un `window.addEventListener('scroll')` ni un
  `IntersectionObserver`.** Ambos se eliminaron al suscribirse al bus.
- [ ] **Sin consentimiento, el tracker sigue funcionando con normalidad**: HUD, toasts e
  informe siguen midiendo en local. Rechazar la analítica no apaga el panel.
- [ ] `grep -rn "addEventListener('scroll'" src/` **no devuelve nada** en todo el
  proyecto (`PLAN.md` §9.8).
- [ ] `grep -rn "gtag\|fbq" src/js/core/tracker.js` **no devuelve nada** (§11.7).

### EDIT
--- old ---
## ⚠ No hacer
- No cargar los scripts directamente en `index.html`: siempre vía `analytics.js`
  tras consentimiento (cumplimiento RGPD).
--- new ---
## ⚠ No hacer
- **No importar `analytics.js` desde `tracker.js`.** La dependencia va siempre
  `analytics → tracker` (`PLAN.md` §11.7). Si `tracker.js` llegara a conocer `gtag`, el
  concepto entero dejaría de ser cierto.
- **No condicionar el tracker al consentimiento.** Medir en local sin transmitir nada no
  lo requiere (tarea 24 §3.1), y apagarlo destruiría la distinción que sostiene el sitio.
- No volver a añadir listeners de scroll ni observers propios aquí: ya existen en el
  tracker y duplicarlos es trabajo repetido en cada frame.
- No cargar los scripts directamente en `index.html`: siempre vía `analytics.js`
  tras consentimiento (cumplimiento RGPD).