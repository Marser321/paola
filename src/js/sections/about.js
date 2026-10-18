import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { portraits } from '../../data/media.js'

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

  // ⚠ Solo `y`, NUNCA la opacidad. Con `opacity: 0` de salida, el retrato no
  // existía para nadie que no hiciera scroll hasta aquí: ni para una captura de
  // página entera, ni para un visor de enlaces. Que se mueva al entrar, sí; que
  // se esconda hasta entonces, no.
  gsap.from('.about__media', {
    y: 60,
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
