import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { t } from '../../i18n/index.js'

// --- Render (se ejecuta ANTES de cualquier ScrollTrigger de sección) ---
export function renderProjects() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  track.innerHTML = projects
    .map((p) => {
      const winner = p.abTest.winner

      // Visual del caso (tarea 23). Con `image` en projects.js se sirve la
      // creatividad real; sin ella, el gradiente del sistema. Así la migración a
      // contenido real es un cambio de DATOS, sin tocar este template.
      // `width`/`height` van explícitos para que no haya salto de layout: el pin
      // horizontal mide la galería antes de que carguen las imágenes.
      const visual = p.image
        ? `<picture class="project-card__picture">
             <source srcset="/img/${p.image}.avif" type="image/avif" />
             <source srcset="/img/${p.image}.webp" type="image/webp" />
             <img src="/img/${p.image}.webp" alt="${p.imageAlt || ''}"
                  width="1200" height="750" loading="lazy" decoding="async" />
           </picture>`
        : `<div class="project-card__gradient"
               style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})"></div>`
      const variant = (key) => `
        <div class="backstage__variant${winner === key ? ' is-winner' : ''}">
          <span class="backstage__variant-key mono">${key.toUpperCase()}</span>
          <p class="backstage__variant-text">${p.abTest[key]}</p>
          ${winner === key ? `<span class="backstage__badge mono">${t('backstage.winner')}</span>` : ''}
        </div>`

      return `
      <article class="project-card" data-hover="audience" data-cursor-label="${p.audienceShort}" data-id="${p.id}">
        <!-- Chrome de anuncio: atrezo. aria-hidden para no ensuciar la lectura del caso. -->
        <header class="ad-chrome" aria-hidden="true">
          <span class="ad-chrome__avatar" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})"></span>
          <span class="ad-chrome__brand">PAOLA<sup>®</sup></span>
          <span class="ad-chrome__meta mono">${t('backstage.sponsored')}</span>
        </header>

        <div class="project-card__visual">
          ${visual}
          <span class="project-card__sector mono">${p.sector} — ${p.year}</span>
          <span class="ad-chrome__format mono" aria-hidden="true">${p.adFormat}</span>

          <!-- Backstage: overlay sobre el visual. NO altera la altura de la card. -->
          <div class="backstage" id="bs-${p.id}" hidden>
            <p class="backstage__title mono">${t('backstage.title')}</p>
            <dl class="backstage__rows mono">
              <div><dt>${t('backstage.audience')}</dt><dd>${p.audience}</dd></div>
              <div><dt>${t('backstage.budget')}</dt><dd>${p.budget}</dd></div>
              <div><dt>${t('backstage.objective')}</dt><dd>${p.objective}</dd></div>
            </dl>
            <p class="backstage__test-title mono">${t('backstage.test')}</p>
            <div class="backstage__variants">
              ${variant('a')}
              ${variant('b')}
            </div>
            <p class="backstage__result mono">
              ${p.abTest.result} · ${p.beforeAfter.before} → ${p.beforeAfter.after}
            </p>
          </div>
        </div>

        <!-- CTA decorativo: es un <span>, no un <button>. No lleva a ninguna parte. -->
        <div class="ad-chrome__cta mono" aria-hidden="true"><span>${p.cta}</span></div>

        <div class="project-card__body">
          <span class="project-card__index mono">${p.index}/06</span>
          <h3 class="project-card__title">
            <a class="project-card__link" href="caso.html?id=${p.id}">${p.title}</a>
          </h3>
          <p class="project-card__tags mono">${p.tags}</p>
          <div class="project-card__kpis">
            <div>
              <p class="project-card__kpi-value">${p.kpi1.value}</p>
              <p class="project-card__kpi-label mono">${p.kpi1.label}</p>
            </div>
            <div>
              <p class="project-card__kpi-value">${p.kpi2.value}</p>
              <p class="project-card__kpi-label mono">${p.kpi2.label}</p>
            </div>
          </div>
          <p class="project-card__desc">${p.desc}</p>
          <button type="button" class="project-card__more mono"
                  aria-expanded="false" aria-controls="bs-${p.id}">${t('projects.backstage')}</button>
        </div>
      </article>`
    })
    .join('')
}

// Un solo listener delegado para las 6 cards.
function initBackstage() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  track.addEventListener('click', (event) => {
    const button = event.target.closest('.project-card__more')
    if (!button) return

    const panel = document.getElementById(button.getAttribute('aria-controls'))
    if (!panel) return

    const open = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!open))
    button.textContent = open ? t('projects.backstage') : t('projects.backstageHide')
    panel.hidden = open
    // El overlay no cambia la altura de la card: no hace falta ScrollTrigger.refresh()
  })
}

// --- Tilt 3D por card ---
function initTilt() {
  if (window.matchMedia('(hover: none)').matches || shouldReduceMotion()) return

  document.querySelectorAll('.project-card').forEach((card) => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' })
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' })

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rotX(-py * 8)
      rotY(px * 8)
    })
    card.addEventListener('mouseleave', () => {
      rotX(0)
      rotY(0)
    })
  })
}

/**
 * Re-render tras cambiar de idioma (tarea 28). Recrear el track destruye los
 * listeners de tilt (son por card), así que hay que volver a montarlos. El del
 * backstage sobrevive: está delegado en `.projects__track`, que no se sustituye.
 * Quien llama es responsable de invocar después `tracker.refresh()`.
 */
export function refreshProjects() {
  renderProjects()
  initTilt()
}

// --- Scroll horizontal pinneado (desktop) / reveals (resto) ---
export function initProjects() {
  initTilt()
  initBackstage()
  if (shouldReduceMotion()) return

  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    const track = document.querySelector('.projects__track')
    const viewport = document.querySelector('.projects__viewport')
    const progress = document.querySelector('.projects__progress-fill')

    const distance = () => track.scrollWidth - viewport.clientWidth

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        // Se pinea .projects__cases, NO .projects. La sección incluye ahora la
        // galería 3D por encima (index.html §proyectos) y pinear la sección
        // entera la arrastraría al pin: se quedaría congelada y recortada bajo
        // la cabecera en vez de tener su propio recorrido de scroll.
        trigger: '.projects__cases',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.style.transform = `scaleX(${self.progress})`
        },
      },
    })

    return () => tween.scrollTrigger?.kill() // cleanup de matchMedia
  })

  mm.add('(max-width: 1023px)', () => {
    document.querySelectorAll('.project-card').forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      })
    })
  })
}
