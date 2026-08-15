import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { portraits } from '../../data/media.js'

/**
 * Sustituye el gradiente placeholder del retrato por la foto real, si está
 * declarada en el manifiesto (tarea 38). Sin foto declarada no hace nada y se
 * queda el gradiente: el layout es idéntico en los dos casos (mismo 4:5), así
 * que la llegada de la foto no mueve nada.
 */
function mountPortrait() {
  const holder = document.querySelector('.about__img')
  const portrait = portraits?.about
  if (!holder || !portrait?.src) return

  holder.insertAdjacentHTML(
    'afterbegin',
    `<picture class="about__picture">
       <source srcset="/img/${portrait.src}.avif" type="image/avif" />
       <source srcset="/img/${portrait.src}.webp" type="image/webp" />
       <img src="/img/${portrait.src}.webp" alt="${portrait.alt || ''}"
            width="1000" height="1250" loading="lazy" decoding="async" />
     </picture>`
  )
  holder.classList.add('has-photo')
  // El nombre accesible pasa a darlo el alt del <img>. Dejar además el
  // role="img" + aria-label del contenedor lo anunciaría dos veces.
  holder.removeAttribute('role')
  holder.removeAttribute('aria-label')
}

export function initAbout() {
  mountPortrait()

  const about = document.querySelector('.about')
  if (!about || shouldReduceMotion()) return

  gsap.from('.about__content > *', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: about, start: 'top 70%', once: true },
  })

  gsap.from('.about__media', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: about, start: 'top 75%', once: true },
  })

  // Parallax de hover sobre el retrato (DESIGN.md: "imagen con hover parallax").
  const media = document.querySelector('.about__media')
  const img = document.querySelector('.about__img')
  if (!media || !img || window.matchMedia('(hover: none)').matches) return

  const moveX = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power2.out' })
  const moveY = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power2.out' })

  media.addEventListener('mousemove', (e) => {
    const r = media.getBoundingClientRect()
    moveX(((e.clientX - r.left) / r.width - 0.5) * 24)
    moveY(((e.clientY - r.top) / r.height - 0.5) * 24)
  })
  media.addEventListener('mouseleave', () => {
    moveX(0)
    moveY(0)
  })
}
