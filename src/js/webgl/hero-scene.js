import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

// `three` se carga con import() dinámico (tarea 17): es el 85% del JS del sitio y
// solo hace falta si los guards pasan. Así no entra en el bundle inicial ni bloquea
// la entrada del hero. Los colores se instancian dentro, cuando THREE ya existe.
//
// Colores del sistema. Excepción documentada de PLAN.md §9.2: GLSL no lee
// custom properties, así que los hex de tokens.css se replican aquí.
//   --gold-deep #8A6A1F · --gold #D4AF37 · --gold-soft #F2DFA6
const HEX_A = '#8A6A1F'
const HEX_B = '#D4AF37'
const HEX_C = '#F2DFA6'

const COUNT = 6000
const REPEL_RADIUS = 9

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRepelRadius;
  uniform float uPixelRatio;
  uniform float uBurst;        // 0→1 tras un click (tarea 22)
  uniform vec2 uBurstOrigin;

  attribute float aScale;
  attribute float aSeed;

  varying float vMix;
  varying float vPush;

  void main() {
    vec3 pos = position;

    // Deriva orgánica: cada partícula respira con su propia fase.
    pos.x += sin(uTime * 0.25 + aSeed * 6.283) * 0.6;
    pos.y += cos(uTime * 0.19 + aSeed * 6.283) * 0.6;
    pos.z += sin(uTime * 0.31 + aSeed * 3.141) * 0.9;

    // Repulsión del ratón: empuje radial que decae con la distancia.
    vec2 toMouse = pos.xy - uMouse;
    float dist = length(toMouse);
    float force = 1.0 - smoothstep(0.0, uRepelRadius, dist);
    pos.xy += normalize(toMouse + 0.0001) * force * 3.2;

    // Onda de choque del click (tarea 22): un anillo que se expande desde el
    // punto pulsado y se disuelve. uBurst va de 0 a 1 en un tween de GSAP, así
    // que no hace falta ningún reloj nuevo.
    vec2 toBurst = pos.xy - uBurstOrigin;
    float dBurst = length(toBurst);
    float ring = exp(-pow(dBurst - uBurst * 34.0, 2.0) * 0.02);
    float blast = ring * (1.0 - uBurst);
    pos.xy += normalize(toBurst + 0.0001) * blast * 7.0;

    vPush = max(force, blast);

    vMix = aSeed;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * uPixelRatio * (70.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vMix;
  varying float vPush;

  void main() {
    // Punto circular con borde suave (sin texturas: cero peticiones de red).
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.15, d);
    if (alpha < 0.01) discard;

    vec3 color = vMix < 0.5
      ? mix(uColorA, uColorB, vMix * 2.0)
      : mix(uColorB, uColorC, (vMix - 0.5) * 2.0);

    // Las partículas empujadas brillan: el feedback del ratón es luz, no color nuevo.
    color = mix(color, vec3(1.0), vPush * 0.5);

    gl_FragColor = vec4(color, alpha * (0.55 + vPush * 0.45));
  }
`

export async function initHeroScene() {
  const hero = document.querySelector('.hero')
  const canvas = document.getElementById('hero-canvas')
  if (!hero || !canvas) return null

  // Guards de PLAN.md §9.7: sin WebGL en móvil ni con reduced-motion.
  // Van ANTES del import(): en móvil el chunk de three no se descarga nunca.
  const tooNarrow = window.innerWidth < 768
  const noContext = !document.createElement('canvas').getContext('webgl2')
  if (tooNarrow || shouldReduceMotion() || noContext) {
    hero.classList.add('no-webgl')
    canvas.remove()
    return null
  }

  const THREE = await import('three')

  const COLOR_A = new THREE.Color(HEX_A)
  const COLOR_B = new THREE.Color(HEX_B)
  const COLOR_C = new THREE.Color(HEX_C)

  const sizes = { width: hero.clientWidth, height: hero.clientHeight }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200)
  camera.position.z = 42

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setSize(sizes.width, sizes.height)
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(pixelRatio)

  // Nube de partículas
  const positions = new Float32Array(COUNT * 3)
  const scales = new Float32Array(COUNT)
  const seeds = new Float32Array(COUNT)

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 60
    positions[i * 3 + 1] = (Math.random() - 0.5) * 38
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    scales[i] = 0.6 + Math.random() * 1.6
    seeds[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uRepelRadius: { value: REPEL_RADIUS },
      uPixelRatio: { value: pixelRatio },
      uBurst: { value: 1 }, // 1 = en reposo (la onda ya se disolvió)
      uBurstOrigin: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: COLOR_A },
      uColorB: { value: COLOR_B },
      uColorC: { value: COLOR_C },
    },
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  // Ratón → coordenadas del plano z=0 de la escena.
  const mouse = new THREE.Vector2(999, 999)
  const targetMouse = new THREE.Vector2(999, 999)
  const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
  const visibleWidth = visibleHeight * camera.aspect

  window.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * visibleWidth
    targetMouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * visibleHeight
  })
  hero.addEventListener('mouseleave', () => targetMouse.set(999, 999))

  // --- Click burst (tarea 22) ---
  // El hero no tiene nada clicable propio; se ignoran los clicks sobre el
  // header y sobre cualquier enlace o botón que pase por encima.
  hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .site-header')) return
    const rect = hero.getBoundingClientRect()
    material.uniforms.uBurstOrigin.value.set(
      ((e.clientX - rect.left) / rect.width - 0.5) * visibleWidth,
      -((e.clientY - rect.top) / rect.height - 0.5) * visibleHeight
    )
    gsap.fromTo(
      material.uniforms.uBurst,
      { value: 0 },
      { value: 1, duration: 1.1, ease: 'power2.out', overwrite: true }
    )
  })

  // --- Cámara ligada al scroll (tarea 22) ---
  // La cámara se aleja y sube según se abandona el hero: da profundidad a la
  // salida sin mover ni un píxel del texto. ease 'none' porque es scrub.
  gsap.to(camera.position, {
    z: 58,
    y: 6,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  })

  // Pausa fuera del viewport (PLAN.md §9.7)
  let isVisible = true
  const observer = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting },
    { threshold: 0 }
  )
  observer.observe(hero)

  // Único RAF del sitio: gsap.ticker (PLAN.md §9.8)
  const render = (time) => {
    if (!isVisible) return
    mouse.lerp(targetMouse, 0.08)
    material.uniforms.uTime.value = time
    material.uniforms.uMouse.value.copy(mouse)
    renderer.render(scene, camera)
  }
  gsap.ticker.add(render)

  window.addEventListener('resize', () => {
    sizes.width = hero.clientWidth
    sizes.height = hero.clientHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  })

  return {
    destroy() {
      gsap.ticker.remove(render)
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
