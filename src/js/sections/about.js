import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { portraits } from '../../data/media.js'
import { t } from '../../i18n/index.js'
import { escape as esc } from '../motion/settings.js'

/**
 * Respaldo: monta el retrato solo si el HTML no lo trae ya.
 *
 * Desde el 2026-10-17 el retrato va ESCRITO en index.html (con respaldo JPG): la
 * auditoría lo vio sin foto porque solo existía si este módulo corría y el
 * visitante hacía scroll. Esto queda para el caso de que alguien lo quite del
 * HTML: entonces vuelve a montarse desde el manifiesto (tarea 38), igual que
 * antes.
 */
function mountPortrait() {
  const holder = document.querySelector('.about__img')
  const portrait = portraits?.about
  if (!holder || !portrait?.src || holder.querySelector('picture')) return

  holder.insertAdjacentHTML(
    'afterbegin',
    `<picture class="about__picture">
       <source srcset="/img/${portrait.src}.avif" type="image/avif" />
       <source srcset="/img/${portrait.src}.webp" type="image/webp" />
       <img src="/img/${portrait.src}.webp" alt="${portrait.alt || ''}"
            width="1000" height="1250" loading="lazy" decoding="async" />
     </picture>`,
  )
  holder.classList.add('has-photo')
  // El nombre accesible pasa a darlo el alt del <img>. Dejar además el
  // role="img" + aria-label del contenedor lo anunciaría dos veces.
  holder.removeAttribute('role')
  holder.removeAttribute('aria-label')
}

let current = 0
export function refreshAbout() {
  const list = document.querySelector('.about__cv')
  if (!list) return
  list.querySelectorAll('li').forEach((li, i) => {
    const [year, ...rest] = t('about.cv')[i].split(' — ')
    li.innerHTML = `<span class="about__chapter-year">${year}</span><h3>${esc(rest.join(' — '))}</h3><p>${esc(t('experience.chapters')[i])}</p>`
    li.classList.toggle('is-active', i === current)
  })
  const label = document.querySelector('.about__folio-label')
  if (label) label.textContent = t('experience.chapterLabel')
}
export function initAbout() {
  mountPortrait()
  const about = document.querySelector('.about')
  if (!about) return
  const folio = document.createElement('div')
  folio.className = 'about__folio'
  folio.setAttribute('aria-hidden', 'true')
  folio.innerHTML =
    '<span class="about__folio-label mono"></span><span class="about__folio-year">2017</span><span class="about__folio-progress"><i></i></span>'
  about.querySelector('.about__media').append(folio)
  refreshAbout()
  const chapters = [...about.querySelectorAll('.about__cv li')]
  chapters.forEach((chapter, i) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 65%',
      end: 'bottom 65%',
      onEnter: () => activate(i),
      onEnterBack: () => activate(i),
    })
  })
  function activate(i) {
    current = i
    chapters.forEach((chapter, j) => chapter.classList.toggle('is-active', i === j))
    folio.querySelector('.about__folio-year').textContent = t('about.cv')[i].split(' — ')[0]
    folio.querySelector('i').style.transform = `scaleX(${(i + 1) / chapters.length})`
  }
  activate(0)
  if (shouldReduceMotion()) return
  gsap.from('.about__content > .about__text', {
    y: 24,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: about, start: 'top 75%', once: true },
  })
  gsap.matchMedia().add('(min-width:1024px)', () => {
    const image = about.querySelector('.about__picture img')
    gsap.fromTo(
      image,
      { y: -20, scale: 1.045 },
      {
        y: 20,
        scale: 1.045,
        ease: 'none',
        scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    )
  })
}
