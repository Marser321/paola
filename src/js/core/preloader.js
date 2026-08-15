import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from './lenis.js'

export function initPreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const counter = preloader.querySelector('.preloader__counter')
  const barFill = preloader.querySelector('.preloader__bar-fill')
  const status = preloader.querySelector('.preloader__status')

  const finish = () => {
    preloader.remove()
    window.dispatchEvent(new CustomEvent('app:ready'))
    ScrollTrigger.refresh()
  }

  if (shouldReduceMotion()) {
    finish()
    return
  }

  const progress = { value: 0 }

  const tl = gsap.timeline()
  tl.to(progress, {
    value: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.textContent = `${Math.round(progress.value)}%`
      barFill.style.transform = `scaleX(${progress.value / 100})`
    },
  })
    // Al 100%, la campaña pasa a entregar (CONTENT.md §1)
    .call(() => {
      if (status) status.textContent = 'Entregando impresión'
    })
    // Cortina: el preloader sube y revela la página
    .to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    })
    .add(finish)
}
