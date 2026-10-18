import * as THREE from 'three'
import gsap from 'gsap'
import { metricsLayout } from './metrics-layout.js'

// The renderer accepts data and emits selection. Labels and accessibility belong to HTML.
export function createMetricsSculpture(
  host,
  { data, onSelect, onFailure, reduced },
) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.setClearColor(0x000000, 0)
  host.prepend(renderer.domElement)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  const scene = new THREE.Scene()
  const root = new THREE.Group()
  scene.add(root)
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 70)
  camera.position.set(1.5, 6.5, 15)
  camera.lookAt(0, 1.9, 0)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3d3020, 2.4))
  const light = new THREE.DirectionalLight(0xffe8ba, 3)
  light.position.set(-3, 8, 5)
  scene.add(light)
  const geometry = new THREE.BoxGeometry(0.62, 1, 0.62)
  const edgeGeometry = new THREE.EdgesGeometry(geometry)
  const layout = metricsLayout(data)
  const { ceiling } = layout
  const bars = data.map((d, i) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x8d713b,
      roughness: 0.34,
      metalness: 0.48,
    })
    const mesh = new THREE.Mesh(geometry, material)
    const edges = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({
        color: 0xe4c786,
        transparent: true,
        opacity: 0.48,
      }),
    )
    mesh.add(edges)
    mesh.position.x = layout.bars[i].x
    mesh.userData.index = i
    const height = layout.bars[i].height
    mesh.scale.y = height
    mesh.position.y = height / 2
    root.add(mesh)
    return { mesh, height, edges }
  })
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 0.08, 1.7),
    new THREE.MeshStandardMaterial({
      color: 0x242321,
      metalness: 0.3,
      roughness: 0.7,
    }),
  )
  base.position.y = -0.07
  root.add(base)
  const lines = []
  for (let i = 0; i <= 5; i++) {
    const y = (i / 5) * 4.4
    const points = [
      new THREE.Vector3(-4.6, y, -0.65),
      new THREE.Vector3(4.6, y, -0.65),
    ]
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: 0xb59b65,
        transparent: true,
        opacity: i ? 0.15 : 0.4,
      }),
    )
    root.add(line)
    lines.push(line)
  }
  let visible = false,
    disposed = false,
    raf = 0,
    timeline,
    selected = 0
  const tweens = new Set()
  const render = () => {
    raf = 0
    if (!disposed && visible && !document.hidden) {
      camera.lookAt(0, 1.9, 0)
      renderer.render(scene, camera)
    }
  }
  const invalidate = () => {
    if (!raf && visible && !document.hidden && !disposed)
      raf = requestAnimationFrame(render)
  }
  const animate = (target, vars) => {
    tweens.forEach((t) => {
      if (t.targets().includes(target)) {
        t.kill()
        tweens.delete(t)
      }
    })
    gsap.killTweensOf(target)
    if (reduced() || !visible || document.hidden) {
      Object.assign(target, vars)
      invalidate()
      return
    }
    let tween
    tween = gsap.to(target, {
      ...vars,
      duration: 0.55,
      ease: 'power3.out',
      onUpdate: invalidate,
      onComplete: () => tweens.delete(tween),
    })
    tweens.add(tween)
  }
  function select(index) {
    selected = index
    const isLight = document.documentElement.dataset.theme === 'light'
    bars.forEach(({ mesh, edges }, i) => {
      const color = new THREE.Color(
        i === index
          ? isLight
            ? 0x9a671b
            : 0xe7bd68
          : isLight
            ? 0xa59a7d
            : 0x665537,
      )
      animate(mesh.material.color, { r: color.r, g: color.g, b: color.b })
      edges.material.opacity = i === index ? 0.95 : 0.32
    })
    base.material.color.set(isLight ? 0xe6dece : 0x242321)
    invalidate()
  }
  function replay() {
    timeline?.kill()
    if (reduced()) {
      bars.forEach(({ mesh, height }) => {
        mesh.scale.y = height
        mesh.position.y = height / 2
      })
      root.position.y = 0
      camera.position.y = 6.5
      invalidate()
      return
    }
    timeline = gsap.timeline({
      paused: !visible || document.hidden,
      onUpdate: invalidate,
    })
    timeline.fromTo(
      camera.position,
      { y: 7.2 },
      { y: 6.5, duration: 1.9, ease: 'power3.out' },
      0,
    )
    timeline.fromTo(
      root.position,
      { y: -0.15 },
      { y: 0, duration: 1.8, ease: 'power3.out' },
      0,
    )
    bars.forEach(({ mesh, height }, i) => {
      timeline.fromTo(
        mesh.scale,
        { y: 0.001 },
        { y: height, duration: 1.1, ease: 'power3.out' },
        0.12 + i * 0.08,
      )
      timeline.fromTo(
        mesh.position,
        { y: 0.0005 },
        { y: height / 2, duration: 1.1, ease: 'power3.out' },
        0.12 + i * 0.08,
      )
    })
    invalidate()
  }
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const hit = (e) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    return raycaster.intersectObjects(
      bars.map((b) => b.mesh),
      false,
    )[0]?.object.userData.index
  }
  const click = (e) => {
    const i = hit(e)
    if (i !== undefined) onSelect(i)
  }
  const move = (e) => {
    renderer.domElement.style.cursor =
      hit(e) === undefined ? 'default' : 'pointer'
    if (e.pointerType === 'touch' || reduced()) return
    animate(root.rotation, {
      y: (THREE.MathUtils.clamp(pointer.x, -1, 1) * Math.PI) / 60,
    })
  }
  const leave = () => animate(root.rotation, { y: 0 })
  renderer.domElement.addEventListener('click', click)
  renderer.domElement.addEventListener('pointermove', move)
  renderer.domElement.addEventListener('pointerleave', leave)
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    const aspect = width / height
    const halfWidth = Math.max(5.2, 3.8 * aspect)
    camera.left = -halfWidth
    camera.right = halfWidth
    camera.top = halfWidth / aspect
    camera.bottom = -halfWidth / aspect
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    invalidate()
  })
  resize.observe(host)
  const theme = () => select(selected)
  window.addEventListener('theme:change', theme)
  const contextLost = (e) => {
    e.preventDefault()
    onFailure()
    dispose()
  }
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  function setVisible(value) {
    visible = value
    if (!value || document.hidden) {
      timeline?.pause()
      tweens.forEach((t) => t.pause())
      cancelAnimationFrame(raf)
      raf = 0
    } else {
      timeline?.resume()
      tweens.forEach((t) => t.resume())
      invalidate()
    }
  }
  const visibility = () => setVisible(visible)
  document.addEventListener('visibilitychange', visibility)
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  const motionChange = () => {
    if (media.matches) {
      tweens.forEach((t) => {
        t.progress(1)
        t.kill()
      })
      tweens.clear()
      replay()
      gsap.killTweensOf(root.rotation)
      root.rotation.y = 0
      invalidate()
    }
  }
  media.addEventListener('change', motionChange)
  function dispose() {
    if (disposed) return
    disposed = true
    timeline?.kill()
    tweens.forEach((t) => t.kill())
    gsap.killTweensOf(root.rotation)
    cancelAnimationFrame(raf)
    resize.disconnect()
    window.removeEventListener('theme:change', theme)
    document.removeEventListener('visibilitychange', visibility)
    media.removeEventListener('change', motionChange)
    renderer.domElement.removeEventListener('click', click)
    renderer.domElement.removeEventListener('pointermove', move)
    renderer.domElement.removeEventListener('pointerleave', leave)
    renderer.domElement.removeEventListener('webglcontextlost', contextLost)
    geometry.dispose()
    edgeGeometry.dispose()
    bars.forEach((b) => {
      b.mesh.material.dispose()
      b.edges.material.dispose()
    })
    lines.forEach((l) => {
      l.geometry.dispose()
      l.material.dispose()
    })
    base.geometry.dispose()
    base.material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
  select(0)
  return { select, replay, setVisible, dispose, ceiling }
}
