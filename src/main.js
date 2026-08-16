import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/tracker.css'
import './styles/media.css'
import './styles/neon.css'

import { initI18n, getLang, t } from './i18n/index.js'
import { applyStaticTranslations } from './i18n/apply-dom.js'
import { initLangSwitch } from './js/ui/lang-switch.js'
import { initTheme } from './js/ui/theme.js'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis } from './js/core/lenis.js'
import { initTracker, refresh as refreshTracker, emit } from './js/core/tracker.js'
import { initAbTest, repaintVariant } from './js/core/ab-test.js'
import { initHud } from './js/ui/hud.js'
import { initSignals } from './js/ui/signals.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { initHeroScene } from './js/webgl/hero-scene.js'
import { initCardDistortion } from './js/webgl/card-distortion.js'
import { initMarquee } from './js/sections/marquee.js'
import { initMetrics } from './js/sections/metrics.js'
import { renderProjects, initProjects, refreshProjects } from './js/sections/projects.js'
import { initServices, refreshServices } from './js/sections/services.js'
import { initProcess } from './js/sections/process.js'
import { initAbout } from './js/sections/about.js'
import { initBackdrops } from './js/sections/backdrops.js'
import { initSequences } from './js/sections/sequence.js'
import { initTestimonials } from './js/sections/testimonials.js'
import { initReport } from './js/sections/report.js'
import { initContact } from './js/sections/contact.js'
import { initContactForm } from './js/core/contact-form.js'
import { initScramble } from './js/fx/scramble.js'
import { initSplitTitles } from './js/fx/split-titles.js'
import { initNeon } from './js/fx/neon.js'
import { projects } from './data/projects.js'

// i18n va PRIMERO: fija el idioma antes de que nadie pinte nada. Si fuera
// después, el hero y las cards se montarían en español y parpadearían al inglés.
initI18n()
document.documentElement.lang = getLang() === 'en' ? 'en' : 'es-ES'
applyStaticTranslations()

initLenis()        // 1º — ScrollTrigger depende de esto
renderProjects()   // 2º — el DOM de las cards debe existir antes de medir
initTracker()      // 3º — (a) necesita las .project-card ya renderizadas
initAbTest()       // 4º — (b) ANTES de initHero(), o se ve cambiar el texto
initHud()
initSignals()
initCursor()
initPreloader()
initHero()
initHeroScene()
initMarquee()
initMetrics()
initProjects()
// initCardDistortion()  // t.20 — DESACTIVADO, ver tasks/BLOCKERS.md §B-02
// Capas de imagen (t.38). Van ANTES de los reveals de sección: insertan un
// hijo en cada sección y conviene que el DOM esté estable cuando ScrollTrigger
// mida. Sin nada declarado en media.js, ambas salen en su primera línea.
initBackdrops()
initSequences()
initServices()
initProcess()
initAbout()
initTestimonials()
initReport()       // (c) ANTES de initContact(): reserva su altura antes de medir
initContact()
initLangSwitch()
// Los rótulos entran por parámetro para que theme.js no importe i18n: lo comparte
// con las páginas legales, que no deben cargar los diccionarios (ver theme.js).
initTheme(() => t('theme'))  // después del de idioma: los dos se cuelgan de
                             // .site-nav y este va el último de la fila
initContactForm()  // t.24

// El envío correcto del formulario es una conversión igual que el CTA (t.14).
// El dedupe del tracker garantiza que cuente UNA sola vez aunque pasen las dos.
window.addEventListener('form:success', () => emit('Conversion', { source: 'form' }))

// Cambio de idioma en caliente. El orden importa: primero el DOM estático,
// luego las cards (que se recrean), y solo entonces el refresh del tracker —
// si no, su IntersectionObserver se queda observando nodos que ya no existen y
// el dwell por creatividad deja de contar EN SILENCIO (t.28, ajuste 3).
window.addEventListener('i18n:change', () => {
  applyStaticTranslations()
  // El subtítulo del hero NO lo alcanza el aplicador estático: lo posee el test
  // A/B, que decide qué variante se sirve. Se repinta sin animación, igual que
  // en el arranque, para que no se vea el texto cambiar dos veces.
  repaintVariant()
  refreshProjects()
  refreshServices()  // los pies de las muestras se leen al renderizar, no se traducen solos
  refreshTracker()
  ScrollTrigger.refresh()
})

// Fase B — efectos de texto (t.21). Van al final: operan sobre el DOM ya montado.
initSplitTitles()
initScramble()
// El neón va DESPUÉS de todo: recorre el DOM buscando sus superficies y necesita
// que las cards ya estén renderizadas y las secciones ya tengan su fondo.
initNeon()

console.log(`[paola] ${projects.length} proyectos cargados · todas las secciones ok`)
