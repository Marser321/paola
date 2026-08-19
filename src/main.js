import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/media.css'
import './styles/neon.css'
import './styles/pill-nav.css'
import './styles/process.css'
import './styles/sale.css'
import './styles/parallax.css'
import './styles/seams.css'

import { initI18n, getLang, t } from './i18n/index.js'
import { applyStaticTranslations } from './i18n/apply-dom.js'
import { initPillNav } from './js/ui/pill-nav.js'
import { initLangSwitch } from './js/ui/lang-switch.js'
import { initTheme } from './js/ui/theme.js'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis } from './js/core/lenis.js'
import { initAbTest, repaintVariant } from './js/core/ab-test.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { initHeroScene } from './js/webgl/hero-scene.js'
import { initCardDistortion } from './js/webgl/card-distortion.js'
import { initProjectsGallery } from './js/webgl/projects-gallery.js'
import { initMarquee } from './js/sections/marquee.js'
import { initMetrics } from './js/sections/metrics.js'
import { renderProjects, initProjects, refreshProjects } from './js/sections/projects.js'
import { initServices, refreshServices } from './js/sections/services.js'
import { initProcess } from './js/sections/process.js'
import { initAbout } from './js/sections/about.js'
import { initBackdrops } from './js/sections/backdrops.js'
import { initSequences } from './js/sections/sequence.js'
import { initTestimonials } from './js/sections/testimonials.js'
import { initPlans } from './js/sections/plans.js'
import { initCalculator } from './js/sections/calculator.js'
import { initFaq } from './js/sections/faq.js'
import { initContact } from './js/sections/contact.js'
import { initContactForm } from './js/core/contact-form.js'
import { initScramble } from './js/fx/scramble.js'
import { initSplitTitles } from './js/fx/split-titles.js'
import { initNeon, refreshNeon } from './js/fx/neon.js'
import { initParallax } from './js/fx/parallax.js'
import { initSeams } from './js/fx/seams.js'
import { projects } from './data/projects.js'

// i18n va PRIMERO: fija el idioma antes de que nadie pinte nada. Si fuera
// después, el hero y las cards se montarían en español y parpadearían al inglés.
initI18n()
document.documentElement.lang = getLang() === 'en' ? 'en' : 'es-ES'
applyStaticTranslations()

initLenis()        // 1º — ScrollTrigger depende de esto
renderProjects()   // 2º — el DOM de las cards debe existir antes de medir
initAbTest()       // 3º — (a) ANTES de initHero(), o se ve cambiar el texto
initCursor()
initPreloader()
initHero()
initHeroScene()
initMarquee()
initMetrics()
initProjects()
// initCardDistortion()  // t.20 — DESACTIVADO, ver tasks/BLOCKERS.md §B-02
// La galería 3D es la salida que el propio B-02 proponía: UN renderer para las
// seis creatividades en vez de seis. Va después de initProjects() porque su
// ScrollTrigger mide una sección cuyo track ya debe estar montado. Es async y
// no se espera, igual que initHeroScene().
initProjectsGallery()
// Capas de imagen (t.38). Van ANTES de los reveals de sección: insertan un
// hijo en cada sección y conviene que el DOM esté estable cuando ScrollTrigger
// mida. Sin nada declarado en media.js, ambas salen en su primera línea.
initParallax()   // capas de profundidad: mismo criterio que los backdrops,
                 // DOM estable antes de que ScrollTrigger mida
initBackdrops()
initSequences()
initServices()
initProcess()
initAbout()
initTestimonials()
// Bloque de venta. Va ANTES de initContact(): el CTA de cada plan escribe en el
// desplegable del formulario, que tiene que existir ya — y lo hace, porque es
// HTML estático, pero el orden deja dicho quién depende de quién.
initPlans()
initCalculator()
initFaq()
initContact()
// El menú se rehace ANTES que los dos conmutadores: los tres se cuelgan de
// .site-nav, y si el de idioma llegara primero acabaría metido dentro de la lista
// de píldoras en vez de al lado.
initPillNav()
initLangSwitch()
// Los rótulos entran por parámetro para que theme.js no importe i18n: lo comparte
// con las páginas legales, que no deben cargar los diccionarios (ver theme.js).
initTheme(() => t('theme'))  // después del de idioma: los dos se cuelgan de
                             // .site-nav y este va el último de la fila
initContactForm()  // t.24

// Cambio de idioma en caliente. El orden importa: primero el DOM estático y
// luego las cards, que se recrean enteras.
window.addEventListener('i18n:change', () => {
  applyStaticTranslations()
  // El subtítulo del hero NO lo alcanza el aplicador estático: lo posee el test
  // A/B, que decide qué variante se sirve. Se repinta sin animación, igual que
  // en el arranque, para que no se vea el texto cambiar dos veces.
  repaintVariant()
  refreshProjects()
  refreshServices()  // los pies de las muestras se leen al renderizar, no se traducen solos
  // refreshProjects() reescribe el track entero, así que las seis cards vuelven
  // SIN clase .neon y sin halo. Sin esto se quedan sin borde al cambiar de
  // idioma, y en silencio.
  refreshNeon()
  ScrollTrigger.refresh()
})

// Fase B — efectos de texto (t.21). Van al final: operan sobre el DOM ya montado.
// Las costuras van con ellos y por el mismo motivo: miden el borde de cada
// sección y necesitan el DOM ya en su sitio, con las cards renderizadas y los
// fondos puestos.
initSeams()
initSplitTitles()
initScramble()
// El neón va DESPUÉS de todo: recorre el DOM buscando sus superficies y necesita
// que las cards ya estén renderizadas y las secciones ya tengan su fondo.
initNeon()

// Solo en desarrollo: Vite lo elimina del bundle de producción por eliminación de
// código muerto, así que la consola del sitio publicado queda limpia.
if (import.meta.env.DEV) {
  console.log(`[paola] ${projects.length} proyectos cargados · todas las secciones ok`)
}
