// Distorsión WebGL de la creatividad de cada card (tarea 20).
//
// Reglas que vienen de otras tareas y NO son negociables aquí:
// · Render BAJO DEMANDA. Ni un rAF continuo por card (tarea 20 §⚠).
// · El canvas va a z-index 0: por encima están el badge de formato (2) y el
//   backstage (3) que añadió la tarea 34. Solo se distorsiona la creatividad,
//   nunca el chrome ni el backstage: eso es la lectura del caso.
// · Un único RAF en todo el sitio: gsap.ticker (PLAN.md §9.8).

import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uMouse;      // 0..1 dentro del visual
  uniform float uIntensity; // 0 en reposo, 1 con el puntero dentro
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Ondulación radial alrededor del puntero. Sin texturas: la "imagen" es el
    // gradiente del caso, que en v1 es lo que hay (las fotos llegan en la t.23).
    float d = distance(uv, uMouse);
    float ripple = sin(d * 22.0 - uTime * 2.4) * exp(-d * 5.0);
    uv += normalize(uv - uMouse + 0.0001) * ripple * 0.045 * uIntensity;

    // Gradiente a 135° equivalente al linear-gradient de la card.
    float t = clamp((uv.x + uv.y) * 0.5, 0.0, 1.0);
    vec3 color = mix(uColorA, uColorB, t);

    // Un punto de luz suave donde está el puntero, para que el efecto se lea.
    color += vec3(0.06) * uIntensity * exp(-d * 6.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  // sRGB → lineal aproximado, para que el color case con el CSS.
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255)
  return srgb.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
}

export async function initCardDistortion() {
  // Mismos guards que el hero, más el de desktop: en el layout en columna las
  // cards son grandes y seis contextos WebGL no compensan.
  if (shouldReduceMotion()) return
  if (window.matchMedia('(hover: none)').matches) return
  if (window.innerWidth < 1024) return
  if (!document.createElement('canvas').getContext('webgl2')) return

  const cards = [...document.querySelectorAll('.project-card')]
  if (!cards.length) return

  const gallery = document.querySelector('.projects')
  if (!gallery) return

  // No se monta nada hasta que la galería se acerca: seis contextos WebGL no
  // pueden competir con el arranque ni con el hero.
  await new Promise((resolve) => {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        resolve()
      },
      { rootMargin: '100% 0px' }
    )
    io.observe(gallery)
  })

  const THREE = await import('three') // chunk ya en caché: lo trajo el hero

  const instances = cards
    .map((card) => setupCard(THREE, card))
    .filter(Boolean)

  if (!instances.length) return

  // Un solo consumidor del ticker para las seis cards, y solo trabaja si hay
  // alguna activa. En reposo el coste es una comparación por frame.
  gsap.ticker.add(() => {
    for (const inst of instances) {
      if (!inst.active) continue
      // Con el backstage abierto el overlay tapa el visual entero: no se pinta.
      if (inst.backstage && !inst.backstage.hidden) continue

      inst.mouse.lerp(inst.targetMouse, 0.12)
      inst.intensity += (inst.targetIntensity - inst.intensity) * 0.08

      inst.material.uniforms.uMouse.value.copy(inst.mouse)
      inst.material.uniforms.uIntensity.value = inst.intensity
      inst.material.uniforms.uTime.value += 0.016
      inst.renderer.render(inst.scene, inst.camera)

      // Al volver al reposo se apaga: deja de renderizar del todo.
      if (inst.targetIntensity === 0 && inst.intensity < 0.01) {
        inst.intensity = 0
        inst.material.uniforms.uIntensity.value = 0
        inst.renderer.render(inst.scene, inst.camera)
        inst.active = false
      }
    }
  })
}

function setupCard(THREE, card) {
  const visual = card.querySelector('.project-card__visual')
  const gradientEl = card.querySelector('.project-card__gradient')
  if (!visual || !gradientEl) return null

  // Los dos colores del caso salen del propio inline style que puso la t.11.
  const hexes = (gradientEl.getAttribute('style') || '').match(/#[0-9A-Fa-f]{6}/g)
  if (!hexes || hexes.length < 2) return null

  const canvas = document.createElement('canvas')
  canvas.className = 'project-card__canvas'
  canvas.setAttribute('aria-hidden', 'true')

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
  const dpr = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(dpr)
  const rect = visual.getBoundingClientRect()
  renderer.setSize(rect.width || 560, rect.height || 350, false)

  const scene = new THREE.Scene()
  const camera = new THREE.Camera()

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColorA: { value: new THREE.Vector3(...hexToRgb(hexes[0])) },
      uColorB: { value: new THREE.Vector3(...hexToRgb(hexes[1])) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0 },
      uTime: { value: 0 },
    },
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  // Solo se oculta .project-card__gradient. El badge de formato, la pill de
  // sector y el backstage siguen visibles: no son la creatividad (tarea 34).
  visual.prepend(canvas)
  gradientEl.style.display = 'none'

  // Un render estático inmediato: la card se ve igual que antes hasta que
  // alguien la toca. Nada de "pop" al cambiar CSS por canvas.
  renderer.render(scene, camera)

  const inst = {
    renderer, scene, camera, material,
    mouse: new THREE.Vector2(0.5, 0.5),
    targetMouse: new THREE.Vector2(0.5, 0.5),
    intensity: 0,
    targetIntensity: 0,
    active: false,
    backstage: card.querySelector('.backstage'),
  }

  visual.addEventListener('mousemove', (e) => {
    const r = visual.getBoundingClientRect()
    inst.targetMouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    inst.targetIntensity = 1
    inst.active = true
  })
  visual.addEventListener('mouseleave', () => {
    inst.targetIntensity = 0
    inst.active = true // sigue vivo hasta desvanecerse, luego se apaga solo
  })

  return inst
}
