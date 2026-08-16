import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

// `three` se carga con import() dinámico (tarea 17): es el 85% del JS del sitio y
// solo hace falta si los guards pasan. Así no entra en el bundle inicial ni bloquea
// la entrada del hero. Los colores se instancian dentro, cuando THREE ya existe.
//
// Colores del sistema. Excepción documentada de PLAN.md §9.2: GLSL no lee
// custom properties, así que los hex de tokens.css se replican aquí.
//
// Una paleta por tema, y no por capricho de color:
//   · en oscuro las partículas se mezclan en ADITIVO, que es lo que las hace
//     brillar sobre el negro. Ese mismo aditivo sobre el papel crema del tema
//     claro satura a blanco y la nube DESAPARECE, porque sumar luz a algo que ya
//     está casi en blanco no da nada;
//   · en claro se pasa a mezcla normal con los bronces del tema (tokens.css
//     §TEMA CLARO), y la nube se lee como polvo oscuro en suspensión.
//
// Oscuro: --gold-deep #8A6A1F · --gold #D4AF37 · --gold-soft #F2DFA6
// Claro:  --gold-deep #5C4512 · --gold #8A6A1F · --gold-soft #B08D2E
const PALETTE = {
  dark: { a: '#8A6A1F', b: '#D4AF37', c: '#F2DFA6', push: 1, alpha: 0.55 },
  // Alfa más baja que en oscuro: sobre negro un punto claro se lee como estrella,
  // pero sobre crema un punto oscuro se lee como mota de suciedad. A 0.28 la
  // nube da profundidad sin ensuciar el papel.
  light: { a: '#5C4512', b: '#8A6A1F', c: '#B08D2E', push: 0, alpha: 0.28 },
}

const currentTheme = () =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

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
  uniform float uPushTarget;   // 1 = las empujadas van a blanco, 0 = a negro
  uniform float uBaseAlpha;

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

    // Las partículas empujadas responden con CONTRASTE contra el fondo, no con
    // un color nuevo. Sobre negro eso es irse a blanco; sobre crema, irse a
    // negro. Con el blanco fijo, en tema claro el empuje del ratón borraba la
    // partícula en vez de marcarla.
    color = mix(color, vec3(uPushTarget), vPush * 0.5);

    gl_FragColor = vec4(color, alpha * (uBaseAlpha + vPush * 0.45));
  }
`

/**
 * Monta la escena. Da por hecho que los guards ya han pasado: quien decide es
 * initHeroScene(), que además vuelve a decidirlo cada vez que se cruza el
 * breakpoint.
 */
async function mountHeroScene(hero, canvas) {
  const THREE = await import('three')

  const COLOR_A = new THREE.Color()
  const COLOR_B = new THREE.Color()
  const COLOR_C = new THREE.Color()

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
      uPushTarget: { value: 1 },
      uBaseAlpha: { value: 0.55 },
    },
  })

  // --- Tema ---
  // Además de los tres colores hay que cambiar el MODO DE MEZCLA, y eso no es un
  // uniform: es una propiedad del material, así que se marca `needsUpdate` para
  // que three recompile el estado de blending.
  const applyTheme = (theme) => {
    const p = PALETTE[theme] || PALETTE.dark
    COLOR_A.set(p.a)
    COLOR_B.set(p.b)
    COLOR_C.set(p.c)
    material.uniforms.uPushTarget.value = p.push
    material.uniforms.uBaseAlpha.value = p.alpha
    material.blending = theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending
    material.needsUpdate = true
  }
  applyTheme(currentTheme())

  const onThemeChange = (e) => applyTheme(e.detail?.theme || currentTheme())
  window.addEventListener('theme:change', onThemeChange)

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  // Ratón → coordenadas del plano z=0 de la escena.
  const mouse = new THREE.Vector2(999, 999)
  const targetMouse = new THREE.Vector2(999, 999)
  const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
  const visibleWidth = visibleHeight * camera.aspect

  // Los listeners van con nombre y no en línea: la escena se desmonta y se vuelve
  // a montar al cruzar el breakpoint (ver initHeroScene), y unos listeners que no
  // se pueden quitar se acumularían en cada vuelta.
  const onMouseMove = (e) => {
    const rect = hero.getBoundingClientRect()
    targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * visibleWidth
    targetMouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * visibleHeight
  }
  const onMouseLeave = () => targetMouse.set(999, 999)
  window.addEventListener('mousemove', onMouseMove)
  hero.addEventListener('mouseleave', onMouseLeave)

  // --- Click burst (tarea 22) ---
  // El hero no tiene nada clicable propio; se ignoran los clicks sobre el
  // header y sobre cualquier enlace o botón que pase por encima.
  const onClick = (e) => {
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
  }
  hero.addEventListener('click', onClick)

  // --- Cámara ligada al scroll (tarea 22) ---
  // La cámara se aleja y sube según se abandona el hero: da profundidad a la
  // salida sin mover ni un píxel del texto. ease 'none' porque es scrub.
  const camTween = gsap.to(camera.position, {
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

  const onResize = () => {
    sizes.width = hero.clientWidth
    sizes.height = hero.clientHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  }
  window.addEventListener('resize', onResize)

  return {
    destroy() {
      gsap.ticker.remove(render)
      window.removeEventListener('theme:change', onThemeChange)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      hero.removeEventListener('mouseleave', onMouseLeave)
      hero.removeEventListener('click', onClick)
      camTween.scrollTrigger?.kill()
      camTween.kill()
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}

/**
 * Guards de PLAN.md §9.7: sin WebGL por debajo de 768px, sin él con
 * reduced-motion y sin él si no hay contexto webgl2.
 *
 * ⚠ Se REEVALÚAN. Antes se leían una sola vez con `window.innerWidth` en la carga
 * y el canvas se eliminaba del DOM con `canvas.remove()`, que además es
 * irreversible: un teléfono girado a horizontal, o una ventana de escritorio
 * estrechada y vuelta a ensanchar, se quedaba sin hero para siempre — o al revés,
 * mantenía 6000 partículas corriendo en una ventana de móvil. Ahora manda un
 * `matchMedia` con listener, y el canvas se oculta en vez de borrarse.
 *
 * El import() dinámico de `three` sigue viviendo dentro de mountHeroScene, así que
 * en una pantalla que nunca cruza el breakpoint el chunk no se descarga jamás.
 */
export async function initHeroScene() {
  const hero = document.querySelector('.hero')
  const canvas = document.getElementById('hero-canvas')
  if (!hero || !canvas) return null

  const mm = window.matchMedia('(min-width: 768px)')
  const noContext = !document.createElement('canvas').getContext('webgl2')
  const puedeMontar = () => mm.matches && !shouldReduceMotion() && !noContext

  let scene = null
  let turno = 0 // el import() es asíncrono: sin este testigo, dos cambios seguidos de breakpoint pueden montar una escena que ya sobra

  const sync = async () => {
    const mio = ++turno
    if (puedeMontar()) {
      if (scene) return
      hero.classList.remove('no-webgl')
      canvas.hidden = false
      const montada = await mountHeroScene(hero, canvas)
      if (mio !== turno) { montada?.destroy(); return }
      scene = montada
    } else {
      scene?.destroy()
      scene = null
      hero.classList.add('no-webgl')
      canvas.hidden = true
    }
  }

  mm.addEventListener('change', sync)
  await sync()

  return {
    destroy() {
      mm.removeEventListener('change', sync)
      turno += 1
      scene?.destroy()
      scene = null
    },
  }
}
