// Galería 3D de creatividades — cabecera inmersiva de #proyectos.
//
// Es el puerto a vanilla de un componente React (@react-three/fiber + drei) que
// dibuja N planos viajando en profundidad con fundido y desenfoque por distancia.
// Aquí no hay React: la escena se monta a mano sobre el `three` que ya carga el
// hero, y el avance lo manda el scroll de la página, no la rueda del visitante.
//
// POR QUÉ ESTA SECCIÓN EXISTE. La tarea 20 (card-distortion.js) quiso dar
// profundidad a la galería con un canvas WebGL POR CARD y quedó bloqueada:
// 7 contextos simultáneos dejaban la página en negro (BLOCKERS.md §B-02). El
// propio bloqueo escribe la salida — «un único renderer que dibuje las seis
// creatividades» — y esto es exactamente eso: UNA escena, UN renderer, un canvas.
// Contextos WebGL en toda la página tras este módulo: 2 (hero + galería).
//
// Reglas heredadas que NO son negociables aquí:
// · Guards ANTES del import() de three, o el chunk se descarga en móvil (t.17).
// · Un único RAF en todo el sitio: gsap.ticker (PLAN.md §9.8).
// · Render BAJO DEMANDA: en reposo, una comparación por frame.
// · dispose() de verdad. Quitar el <canvas> del DOM NO libera el contexto: esa
//   fue la medición inválida que retrasó el diagnóstico de B-02.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects.js'
import { shouldReduceMotion } from '../core/lenis.js'

// Profundidad del ciclo. Los planos viven en z ∈ [0, DEPTH_RANGE) y se pintan en
// worldZ = z - DEPTH_RANGE/2, así que la mitad negativa es la que ve la cámara.
const DEPTH_RANGE = 50
const VISIBLE_COUNT = 12
// Cuántos casos avanza cada plano al dar una vuelta completa. 5 es coprimo con
// los 6 casos: con un divisor (2, 3, 6) cada plano repetiría siempre la misma
// creatividad vuelta tras vuelta y el ciclo se leería como un bucle corto.
const IMAGE_ADVANCE = 5
const MAX_H_OFFSET = 8
const MAX_V_OFFSET = 8

// Cuántas vueltas al ciclo da la galería en su recorrido de scroll. Más vueltas
// = más creatividades vistas en la misma altura de página, pero más velocidad.
const CYCLES = 2.2

// Fundido y desenfoque por posición normalizada (0 = fondo, 1 = fin del ciclo).
// Los planos solo son visibles hasta 0.43: pasado eso ya están detrás de la
// cámara. Valores del componente original, que están tuneados para fov 55.
const FADE = {
  in: { start: 0.05, end: 0.25 },
  out: { start: 0.4, end: 0.43 },
}
const BLUR = {
  in: { start: 0.0, end: 0.1 },
  out: { start: 0.4, end: 0.43 },
  max: 8.0,
}

const vertexShader = /* glsl */ `
  uniform float uScrollForce;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Curvatura de tela: el plano se comba según la fuerza del scroll, más
    // cuanto más lejos del centro. Es lo que hace que la creatividad "ceda"
    // al avanzar en vez de viajar como un cartón rígido.
    float curveIntensity = uScrollForce * 0.3;
    float distanceFromCenter = length(pos.xy);
    float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

    // Ondas suaves encima, para que la tela no se lea como una parábola limpia.
    float ripple1 = sin(pos.x * 2.0 + uScrollForce * 3.0 + uTime * 0.6) * 0.02;
    float ripple2 = sin(pos.y * 2.5 + uScrollForce * 2.0 + uTime * 0.4) * 0.015;
    float cloth = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

    pos.z -= (curve + cloth);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Sin `precision mediump float;` a propósito: three ya inyecta la precisión en
// los DOS shaders, y declararla solo aquí dejaba uScrollForce en mediump en el
// fragment y en highp en el vertex. El enlazado falla con «Precisions of uniform
// 'uScrollForce' differ between VERTEX and FRAGMENT shaders» y la galería no
// pinta nada — solo un reguero de INVALID_OPERATION en la consola.
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uBlur;
  uniform float uScrollForce;
  uniform vec2 uTexel;   // 1/resolución de la textura

  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uMap, vUv);

    // Desenfoque por distancia. El componente original calculaba el tamaño del
    // téxel con textureSize(), que NO existe en GLSL1 — y GLSL1 es lo que
    // compila ShaderMaterial por defecto en three. De ahí el uniform uTexel:
    // tal cual venía, el shader no compilaba y la galería salía en negro.
    if (uBlur > 0.0) {
      vec4 blurred = vec4(0.0);
      float total = 0.0;

      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          vec2 offset = vec2(x, y) * uTexel * uBlur;
          float weight = 1.0 / (1.0 + length(vec2(x, y)));
          blurred += texture2D(uMap, vUv + offset) * weight;
          total += weight;
        }
      }
      color = blurred / total;
    }

    // Realce sutil mientras la galería está en movimiento.
    color.rgb += vec3(abs(uScrollForce) * 0.005);

    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`

// Rampa lineal recortada: 0 antes de `start`, 1 a partir de `end`.
function ramp(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0
  return Math.max(0, Math.min(1, (value - start) / (end - start)))
}

/**
 * Textura de la creatividad. Sin `image` en el caso se PINTA una: el gradiente
 * del sistema con los datos del caso encima, en la tipografía de la marca.
 * Cero peticiones de red y cero stock genérico — cambiar la galería es editar
 * src/data/projects.js, igual que la card (projects.js §visual).
 */
function paintCreative(project) {
  const W = 1024
  const H = 640
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Gradiente a 135°, el mismo que el linear-gradient de la card.
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, project.gradient[0])
  grad.addColorStop(1, project.gradient[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Viñeteado: sin él los bordes del plano se recortan a cuchillo contra el
  // fondo de la sección y se ve el rectángulo, no la creatividad.
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.8)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.34)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, W, H)

  ctx.textBaseline = 'alphabetic'

  // Índice + formato arriba, como el chrome de la card.
  ctx.font = '500 22px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(243, 242, 242, 0.72)'
  ctx.fillText(`${project.index}/06`, 56, 84)
  const format = project.adFormat.toUpperCase()
  ctx.textAlign = 'right'
  ctx.fillText(format, W - 56, 84)
  ctx.textAlign = 'left'

  // Título.
  ctx.font = '600 76px "Clash Display", sans-serif'
  ctx.fillStyle = '#F3F2F2'
  ctx.fillText(project.title, 56, H - 168)

  // KPI: el dato es el argumento de venta, va grande y al lado del título.
  ctx.font = '600 58px "Clash Display", sans-serif'
  ctx.fillText(project.kpi1.value, 56, H - 88)

  ctx.font = '500 22px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(243, 242, 242, 0.72)'
  const kpiWidth = ctx.measureText(project.kpi1.value).width
  ctx.fillText(project.kpi1.label.toUpperCase(), 56 + kpiWidth + 220, H - 88)
  ctx.fillText(project.sector.toUpperCase(), 56, H - 46)

  return canvas
}

async function buildTextures(THREE, renderer) {
  // Sin esperar a las fuentes, los rótulos salen en la fuente de sistema: el
  // canvas 2D no re-dibuja solo cuando la woff2 termina de cargar.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      /* si falla, se pinta igual con el fallback */
    }
  }

  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const loader = new THREE.TextureLoader()

  return Promise.all(
    projects.map(async (project) => {
      let texture

      // Misma bifurcación que la card (projects.js §visual): en cuanto un caso
      // declare `image`, aquí entra la creatividad real sin tocar código.
      //
      // AVIF PRIMERO, y no por capricho: la card ya sirve el .avif con su
      // <picture>, así que pedirlo aquí también da un acierto de caché y coste
      // CERO. Forzando .webp —como estaba— cada creatividad se descargaba DOS
      // veces, una por formato: 12 peticiones para 6 imágenes.
      // El webp queda de red de seguridad para navegadores sin AVIF, y el
      // gradiente pintado por si tampoco hubiera webp.
      for (const url of project.image
        ? [`/img/${project.image}.avif`, `/img/${project.image}.webp`]
        : []) {
        try {
          texture = await loader.loadAsync(url)
          break
        } catch {
          /* siguiente formato */
        }
      }
      if (!texture) texture = new THREE.CanvasTexture(paintCreative(project))

      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = anisotropy
      // El desenfoque muestrea fuera del [0,1]: sin CLAMP, el borde izquierdo
      // se llena con píxeles del derecho y aparece una costura.
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.needsUpdate = true
      return texture
    })
  )
}

// Reparto en X/Y por ángulo áureo: da una dispersión que no se lee como rejilla
// ni como aleatoriedad sucia. Es determinista, así que no parpadea entre cargas.
function spatialPositions(count) {
  return Array.from({ length: count }, (_, i) => {
    const hAngle = (i * 2.618) % (Math.PI * 2)
    const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2)
    const hRadius = (i % 3) * 1.2
    const vRadius = ((i + 1) % 4) * 0.8
    return {
      x: (Math.sin(hAngle) * hRadius * MAX_H_OFFSET) / 3,
      y: (Math.cos(vAngle) * vRadius * MAX_V_OFFSET) / 4,
    }
  })
}

export async function initProjectsGallery() {
  const container = document.querySelector('.projects__gallery')
  const canvas = document.getElementById('projects-gallery-canvas')
  if (!container || !canvas) return null

  // Guards de PLAN.md §9.7 + el de desktop de card-distortion.js. Van ANTES del
  // import(): en móvil y con reduced-motion el chunk no se descarga jamás.
  // El CSS oculta .projects__gallery en esos mismos casos, así que la sección
  // no se queda con un hueco vacío (sections.css §PROYECTOS — GALERÍA 3D).
  if (shouldReduceMotion()) return null
  if (window.innerWidth < 1024) return null
  if (!document.createElement('canvas').getContext('webgl2')) return null
  if (!projects.length) return null

  // Nada se monta hasta que la galería se acerca: el hero manda en el arranque.
  await new Promise((resolve) => {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        resolve()
      },
      { rootMargin: '100% 0px' }
    )
    io.observe(container)
  })

  const THREE = await import('three') // chunk ya en caché: lo trajo el hero

  const width = container.clientWidth || 1
  const height = container.clientHeight || 1

  // alpha: true y NADA de color de fondo. Así el fundido de los planos ocurre
  // contra la sección real y la galería sirve en tema oscuro y en claro sin
  // pasarle --bg al shader ni repintar al cambiar de tema.
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
  camera.position.set(0, 0, 0)

  const textures = await buildTextures(THREE, renderer)

  // Una geometría para los 12 planos. Segmentada 32×32 porque la curvatura de
  // tela se hace en el vértice: con un quad de 4 vértices no se comba nada.
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

  const positions = spatialPositions(VISIBLE_COUNT)

  const planes = Array.from({ length: VISIBLE_COUNT }, (_, i) => {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false, // planos translúcidos: el z-buffer los recortaría entre sí
      vertexShader,
      fragmentShader,
      uniforms: {
        uMap: { value: textures[i % textures.length] },
        uOpacity: { value: 0 },
        uBlur: { value: 0 },
        uScrollForce: { value: 0 },
        uTime: { value: 0 },
        uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 640) },
      },
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false // el vertex shader desplaza z: three mediría mal
    mesh.position.set(positions[i].x, positions[i].y, 0)
    scene.add(mesh)

    return {
      mesh,
      material,
      baseZ: (DEPTH_RANGE / VISIBLE_COUNT) * i,
      x: positions[i].x,
      y: positions[i].y,
      textureIndex: -1,
    }
  })

  // Escala del plano según el aspecto de su textura, para no deformar nada.
  // BASE es la altura en unidades de escena: con 2 (el valor del componente
  // original) las creatividades se leían como sellos diminutos a esta fov.
  function applyScale(plane, texture) {
    const BASE = 3.4
    const image = texture.image
    const aspect = image && image.height ? image.width / image.height : 1.6
    if (aspect > 1) plane.mesh.scale.set(BASE * aspect, BASE, 1)
    else plane.mesh.scale.set(BASE, BASE / aspect, 1)
  }

  let progress = 0
  let scrollForce = 0
  let dirty = true
  let disposed = false

  function layout() {
    const offset = progress * DEPTH_RANGE * CYCLES

    planes.forEach((plane, i) => {
      const raw = plane.baseZ + offset
      // Vueltas completas dadas. Determinista a partir del progreso, así que el
      // scrub hacia atrás recompone exactamente el mismo estado — nada de
      // contadores acumulados que se desincronizan al invertir el scroll.
      const wraps = Math.floor(raw / DEPTH_RANGE)
      const z = raw - wraps * DEPTH_RANGE
      const normalized = z / DEPTH_RANGE

      const index =
        (((i + wraps * IMAGE_ADVANCE) % textures.length) + textures.length) % textures.length

      if (index !== plane.textureIndex) {
        plane.textureIndex = index
        plane.material.uniforms.uMap.value = textures[index]
        applyScale(plane, textures[index])
      }

      plane.mesh.position.set(plane.x, plane.y, z - DEPTH_RANGE / 2)

      // Fundido: transparente antes de fadeIn.start, opaco en la meseta, y de
      // vuelta a transparente al pasar por delante de la cámara.
      let opacity = 0
      if (normalized < FADE.in.start) opacity = 0
      else if (normalized <= FADE.in.end) opacity = ramp(normalized, FADE.in.start, FADE.in.end)
      else if (normalized < FADE.out.start) opacity = 1
      else if (normalized <= FADE.out.end) opacity = 1 - ramp(normalized, FADE.out.start, FADE.out.end)

      // Desenfoque: máximo al fondo, nítido en la meseta, máximo al salir.
      let blur = BLUR.max
      if (normalized >= BLUR.in.start && normalized <= BLUR.in.end) {
        blur = BLUR.max * (1 - ramp(normalized, BLUR.in.start, BLUR.in.end))
      } else if (normalized > BLUR.in.end && normalized < BLUR.out.start) {
        blur = 0
      } else if (normalized >= BLUR.out.start && normalized <= BLUR.out.end) {
        blur = BLUR.max * ramp(normalized, BLUR.out.start, BLUR.out.end)
      }

      plane.material.uniforms.uOpacity.value = opacity
      plane.material.uniforms.uBlur.value = blur
      plane.material.uniforms.uScrollForce.value = scrollForce
    })
  }

  // El avance lo manda el scroll de la página. El componente original capturaba
  // la rueda con preventDefault sobre document.querySelector('canvas') — que en
  // este sitio devuelve el canvas DEL HERO — y además habría matado a Lenis y
  // chocado con el pin horizontal del track. Aquí: scrub, y nada de secuestro.
  const trigger = ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      progress = self.progress
      // La velocidad alimenta la curvatura de tela. Recortada, o un scroll
      // brusco pliega los planos sobre sí mismos.
      scrollForce = gsap.utils.clamp(-1.6, 1.6, self.getVelocity() / 900)
      dirty = true
    },
  })

  // Un solo consumidor del gsap.ticker, y solo trabaja si hay algo que pintar.
  // `trigger.isActive` se lee en cada frame en vez de cachearlo desde onToggle:
  // ese callback NO dispara si el trigger ya nace activo, y como la galería se
  // monta justo cuando entra en pantalla, ese es el caso NORMAL. Con la bandera
  // cacheada la escena se pintaba una vez y no volvía a repintarse nunca.
  const tick = () => {
    if (disposed || !trigger.isActive) return

    // La tela sigue relajándose unos frames después de parar el scroll.
    if (Math.abs(scrollForce) > 0.001) {
      scrollForce *= 0.92
      dirty = true
    } else if (scrollForce !== 0) {
      scrollForce = 0
      dirty = true
    }

    if (!dirty) return
    dirty = false

    const time = gsap.ticker.time
    for (const plane of planes) plane.material.uniforms.uTime.value = time

    layout()
    renderer.render(scene, camera)
  }
  gsap.ticker.add(tick)

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    dirty = true
  })
  resizeObserver.observe(container)

  // Primer pintado inmediato: la sección no aparece vacía esperando al scroll.
  progress = trigger.progress
  layout()
  renderer.render(scene, camera)

  function dispose() {
    if (disposed) return
    disposed = true
    gsap.ticker.remove(tick)
    trigger.kill()
    resizeObserver.disconnect()
    for (const plane of planes) {
      scene.remove(plane.mesh)
      plane.material.dispose()
    }
    geometry.dispose()
    for (const texture of textures) texture.dispose()
    // Lo que de verdad libera el contexto. Quitar el <canvas> del DOM no lo
    // hace, y creer lo contrario fue lo que despistó el diagnóstico de B-02.
    renderer.dispose()
  }

  window.addEventListener('pagehide', dispose, { once: true })

  return { dispose }
}
