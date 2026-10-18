import gsap from 'gsap'
import { t } from '../../i18n/index.js'
import { serviceVisuals, serviceStateVisuals } from '../../data/media.js'
import { shouldReduceMotion } from '../core/lenis.js'

import { escape as esc } from '../motion/settings.js'
import { serviceIcon } from '../ui/service-icons.js'

const copy = (key, tag = 'span', cls = '') =>
  `<${tag} class="${cls}" data-copy="${key}"></${tag}>`
const stage = (i, j) => `<span data-stage="${j}"></span>`
const choices = (i) =>
  `<div class="demo-tabs" role="group">${[0, 1, 2].map((j) => `<button type="button" data-choice="${j}" aria-pressed="false"><span class="demo-tabs__number mono" aria-hidden="true">0${j + 1}</span>${stage(i, j)}</button>`).join('')}</div>`
const button = (attr, key, icon = '→') =>
  `<button class="demo-button" type="button" ${attr}>${copy('studio.' + key)}<span aria-hidden="true">${icon}</span></button>`

const photograph = (config, i, cls = 'demo-editorial-photo') =>
  `<picture class="${cls}"><source srcset="/img/${config.src}.avif" type="image/avif"/><img src="/img/${config.src}.webp" alt="${esc(t('serviceVisuals.items')[i].alt)}" width="1200" height="800" loading="lazy" decoding="async" data-service-photo="${i}"/></picture>`

function markup(i, config) {
  if (i === 0)
    return `<div class="demo-campaign-story">${photograph(config, i, 'demo-campaign-photo')}<div class="demo-campaign-story__copy"><span class="mono" data-campaign-stage></span><strong data-campaign-title></strong><p data-campaign-description></p><span class="demo-campaign-story__action" data-campaign-action></span></div></div>${choices(i)}`
  if (i === 1)
    return `${photograph(config, i)}<div class="demo-crm"><div class="demo-crm__columns">${[0, 1, 2].map((j) => `<div data-crm-column="${j}"><span class="demo-crm__heading">${stage(i, j)}<span class="demo-crm__marker" aria-hidden="true"></span></span><span class="demo-crm__slot">${serviceIcon([0, 1, 5][j])}<span data-copy="polish.crmSlots.${j}"></span><small data-crm-status="${j}"></small></span></div>`).join('')}</div><div class="demo-crm__traveler"><div class="demo-contact"><span class="demo-contact__avatar" aria-hidden="true">${serviceIcon(1)}</span>${copy('studio.contact', 'strong')}${copy('studio.origin', 'small')}<span class="demo-contact__status" data-copy="polish.crmCurrent"></span></div></div></div><div class="demo-message">${serviceIcon(1)}<p data-crm-message></p></div>${button('data-next', 'next')}`
  if (i === 2)
    return `${photograph(config, i)}<div class="demo-event-type" role="group">${['inquiry', 'appointment'].map((v) => `<button type="button" data-event="${v}">${copy('studio.' + v)}</button>`).join('')}</div><div class="demo-signal"><svg class="demo-signal__wires" viewBox="0 0 480 180" aria-hidden="true"><path class="signal-wire" d="M65 90C130 10 170 10 240 90S355 170 415 90"/><path class="signal-trace" pathLength="1" d="M65 90C130 10 170 10 240 90S355 170 415 90"/><circle class="signal-packet" cx="65" cy="90" r="6"/></svg><div class="demo-signal__nodes">${[3, 1, 0].map((v, j) => `<div class="demo-signal__node" data-signal-node="${j}"><span>${serviceIcon(v)}</span>${stage(i, j)}<small data-copy="polish.signalNotes.${j}"></small></div>`).join('')}</div></div><div class="demo-event-status mono" role="status"></div>${button('data-send-event', 'send')}`
  if (i === 3)
    return `<div class="demo-device" role="group">${['desktop', 'mobile'].map((v) => `<button type="button" data-device="${v}">${copy('studio.' + v)}</button>`).join('')}</div><div class="demo-browser"><div class="demo-chrome" aria-hidden="true"><span class="demo-browser__dots">● ● ●</span>${copy('polish.pageAddress')}<span>↗</span></div>${photograph(config, i, 'demo-landing-photo')}<div class="demo-landing"><div class="demo-landing__offer">${copy('studio.proposal', 'strong')}${copy('studio.proposalNote', 'p')}<span class="demo-landing__benefits">${[0, 1, 2].map((j) => `<span><span aria-hidden="true">✓</span>${copy('polish.pageBenefits.' + j)}</span>`).join('')}</span>${button('data-reserve', 'reserve')}</div><div class="demo-landing__confirmation" hidden><span class="demo-check" aria-hidden="true">✓</span>${copy('studio.reserved', 'strong')}${copy('studio.reservedNote', 'p')}${button('data-back', 'back', '↶')}</div></div></div>`
  if (i === 4)
    return `<div class="demo-film">${photograph(config, i, 'demo-film-photo')}<div class="demo-film__vignette"></div>${['question', 'answer', 'closing'].map((key, j) => `<div class="demo-film__frame" data-film-frame="${j}" ${j ? 'hidden' : ''}><span class="mono demo-film__kicker">0${j + 1} / 03 · ${stage(i, j)}</span>${copy('studio.' + key, 'strong')}<span class="demo-film__graphic" aria-hidden="true">${j === 0 ? '<i></i><i></i><i></i>' : j === 1 ? serviceIcon(4) : '↗'}</span></div>`).join('')}<div class="demo-film__progress" aria-hidden="true"><i></i></div></div><div class="demo-film__transport">${button('data-play', 'play', '▷')}<span class="mono" data-film-time>00:00 / 00:06</span></div>${choices(i)}`
  return `${photograph(config, i)}<div class="demo-audit"><div class="demo-audit__findings">${[0, 1, 2].map((j) => `<button type="button" data-choice="${j}"><span class="mono">0${j + 1}</span><span data-finding="${j}"></span><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="demo-audit__sheet"><div>${copy('studio.evidence', 'span', 'mono')}<p data-evidence></p></div><div>${copy('studio.action', 'span', 'mono')}<p data-audit-action></p></div></div></div><div class="demo-roadmap"><span class="mono" data-copy="studio.roadmap"></span><div>${[0, 1, 2].map((j) => `<span data-day="${j}"></span>`).join('')}</div></div>`
}

export function createServiceDemo(scene, i, id) {
  const visuals = serviceStateVisuals[id]
  const config = { ...serviceVisuals[id], src: visuals[0] }
  const state = {
    step: 0,
    device: 'desktop',
    reserved: false,
    event: 'inquiry',
    sent: false,
    playhead: 0,
    playing: false,
  }
  let imagesPreloaded = false
  let visible = false,
    run,
    video,
    cardMotion,
    transition,
    hasEntered = false
  scene.classList.add('service-scene--studio')
  scene.innerHTML = `<div class="studio-window"><header class="studio-window__header"><span class="studio-window__icon">${serviceIcon(i)}</span><div>${copy('studio.example', 'span', 'mono')}<strong data-scene-label></strong></div><span class="mono studio-window__index">0${i + 1}<span>/06</span></span></header><div class="studio-window__demo">${markup(i, config)}</div><div class="studio-window__context"><p data-demo-detail aria-live="polite"></p></div><footer class="studio-window__footer">${copy('studio.demo', 'span', 'mono')}<button type="button" data-replay class="demo-replay">↻</button></footer></div>`
  const q = (s) => scene.querySelector(s),
    all = (s) => [...scene.querySelectorAll(s)]
  const duration = () => (shouldReduceMotion() ? 0 : 0.55)
  const details = () =>
    i === 5
      ? t('studio.auditActions')[state.step]
      : i === 3 && state.reserved
        ? t('studio.reservedNote')
        : i === 2
          ? state.sent
            ? t('studio.received')
            : t('studio.hints')[i]
          : t('experience.details')[i][state.step]
  function syncPhotograph() {
    const index =
      i === 2
        ? state.sent
          ? 2
          : state.event === 'appointment'
            ? 1
            : 0
        : i === 3
          ? state.reserved
            ? 2
            : state.device === 'mobile'
              ? 1
              : 0
          : state.step
    const img = q('[data-service-photo]')
    const src = `/img/${visuals[index]}`
    // Synchronous updates leave source selection to the browser: no delayed
    // decode callbacks can restore an older image after a rapid interaction.
    if (img.getAttribute('src') !== `${src}.webp`) {
      img.parentElement
        .querySelector('source')
        .setAttribute('srcset', `${src}.avif`)
      img.setAttribute('src', `${src}.webp`)
    }
    img.alt = t('serviceStateAlts')[i][index]
    img.dataset.visualState = index
  }
  function sync(animate = false) {
    syncPhotograph()
    scene.dataset.step = state.step
    scene.dataset.device = state.device
    all('[data-choice]').forEach((b) =>
      b.setAttribute('aria-pressed', String(+b.dataset.choice === state.step)),
    )
    all('[data-device]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.device === state.device)),
    )
    all('[data-event]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.event === state.event)),
    )
    q('[data-demo-detail]').textContent = details()
    if (i === 0) {
      q('[data-campaign-stage]').textContent =
        `0${state.step + 1} · ${t('studio.stages')[0][state.step]}`
      q('[data-campaign-title]').textContent = t('polish.campaignTitles')[
        state.step
      ]
      q('[data-campaign-description]').textContent = t(
        'polish.campaignDescriptions',
      )[state.step]
      q('[data-campaign-action]').textContent =
        t('polish.campaignFoot')[state.step] + ' ↗'
    }
    if (i === 1) {
      all('[data-crm-column]').forEach((el) => {
        const j = +el.dataset.crmColumn
        el.classList.toggle('is-current', j === state.step)
        el.classList.toggle('is-complete', j < state.step)
      })
      all('[data-crm-status]').forEach(
        (el) =>
          (el.textContent = t(
            +el.dataset.crmStatus < state.step
              ? 'polish.crmDone'
              : 'polish.crmReady',
          )),
      )
      cardMotion?.kill()
      cardMotion = gsap.to(q('.demo-crm__traveler'), {
        xPercent: 0,
        duration: animate ? duration() : 0,
        ease: 'power3.inOut',
        overwrite: true,
      })
      q('[data-crm-message]').textContent = t(
        ['studio.origin', 'studio.message', 'studio.confirmed'][state.step],
      )
      q('[data-next] [data-copy]').textContent = t(
        state.step === 2 ? 'studio.restart' : 'studio.next',
      )
    }
    if (i === 2)
      q('.demo-event-status').textContent = state.sent
        ? `${t('studio.' + state.event)} → ${t('studio.received')}`
        : `${t('studio.' + state.event)} · ${t('studio.stages')[2][0]}`
    if (i === 3) {
      q('.demo-landing__offer').hidden = state.reserved
      q('.demo-landing__confirmation').hidden = !state.reserved
    }
    if (i === 4) {
      all('[data-film-frame]').forEach(
        (el) => (el.hidden = +el.dataset.filmFrame !== state.step),
      )
      q('[data-play] [data-copy]').textContent = t(
        state.playing ? 'studio.pause' : 'studio.play',
      )
      q('[data-play]').setAttribute('aria-pressed', String(state.playing))
      q('[data-play] > span:last-child').textContent = state.playing ? 'Ⅱ' : '▷'
    }
    if (i === 5) {
      q('[data-evidence]').textContent = t('studio.evidenceItems')[state.step]
      q('[data-audit-action]').textContent = t('studio.auditActions')[
        state.step
      ]
      all('[data-day]').forEach((el) =>
        el.classList.toggle('is-current', +el.dataset.day === state.step),
      )
    }
    if (animate && !shouldReduceMotion()) {
      const target =
        i === 0
          ? q('.demo-campaign-story__copy')
          : i === 1
            ? q('.demo-message')
            : i === 5
              ? q('.demo-audit__sheet')
              : i === 3
                ? q(
                    state.reserved
                      ? '.demo-landing__confirmation'
                      : '.demo-landing__offer',
                  )
                : i === 4
                  ? q(`[data-film-frame="${state.step}"]`)
                  : null
      if (transition) {
        gsap.set(transition.targets(), { clearProps: 'transform,opacity' })
        transition.kill()
      }
      if (target)
        transition = gsap.fromTo(
          target,
          { y: 7, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            overwrite: true,
            clearProps: 'transform,opacity',
          },
        )
    }
  }
  function videoProgress() {
    const step = Math.min(2, Math.floor(state.playhead))
    if (step !== state.step) {
      state.step = step
      sync(true)
    }
    q('.demo-film__progress i').style.transform =
      `scaleX(${state.playhead / 3})`
    q('[data-film-time]').textContent =
      `00:0${Math.min(6, Math.floor(state.playhead * 2))} / 00:06`
  }
  function stopVideo() {
    video?.kill()
    state.playing = false
  }
  function playVideo() {
    if (shouldReduceMotion()) {
      state.step = (state.step + 1) % 3
      state.playhead = state.step
      videoProgress()
      sync()
      return
    }
    video?.kill()
    if (state.playhead >= 3) state.playhead = 0
    state.playing = true
    sync()
    video = gsap.to(state, {
      playhead: 3,
      duration: (3 - state.playhead) * 2,
      ease: 'none',
      paused: !visible || document.hidden,
      onUpdate: videoProgress,
      onComplete: () => {
        state.playing = false
        sync()
      },
    })
  }
  function sendEvent() {
    run?.kill()
    state.sent = false
    sync()
    const path = q('.signal-wire'),
      packet = q('.signal-packet'),
      trace = q('.signal-trace'),
      progress = { value: 0 }
    const length = path.getTotalLength()
    function draw() {
      const point = path.getPointAtLength(length * progress.value)
      packet.setAttribute('cx', point.x)
      packet.setAttribute('cy', point.y)
      trace.style.strokeDashoffset = 1 - progress.value
      all('[data-signal-node]').forEach((el) =>
        el.classList.toggle(
          'is-received',
          +el.dataset.signalNode / 2 <= progress.value,
        ),
      )
    }
    if (shouldReduceMotion()) {
      progress.value = 1
      draw()
      state.sent = true
      sync()
      return
    }
    run = gsap.to(progress, {
      value: 1,
      duration: 1.6,
      ease: 'power1.inOut',
      paused: !visible || document.hidden,
      onUpdate: draw,
      onComplete: () => {
        state.sent = true
        sync()
      },
    })
  }
  function replay() {
    if (i === 2) {
      sendEvent()
      return
    }
    if (i === 4) {
      stopVideo()
      state.playhead = 0
      state.step = 0
      videoProgress()
      playVideo()
      return
    }
    state.step = 0
    state.reserved = false
    sync(true)
    run?.kill()
    if (shouldReduceMotion()) return
    if (i === 0 || i === 1) {
      run = gsap.timeline({ paused: !visible || document.hidden })
      ;[1, 2].forEach((step, j) =>
        run.call(
          () => {
            state.step = step
            sync(true)
          },
          null,
          0.8 + j * 0.8,
        ),
      )
    }
  }
  function refresh() {
    all('[data-copy]').forEach((el) => (el.textContent = t(el.dataset.copy)))
    all('[data-stage]').forEach(
      (el) => (el.textContent = t('studio.stages')[i][+el.dataset.stage]),
    )
    all('[data-finding]').forEach(
      (el) => (el.textContent = t('experience.findings')[+el.dataset.finding]),
    )
    all('[data-day]').forEach(
      (el) => (el.textContent = t('studio.days')[+el.dataset.day]),
    )
    all('[role="group"]').forEach((el) =>
      el.setAttribute('aria-label', t('studio.hints')[i]),
    )
    q('[data-scene-label]').textContent = t('experience.sceneLabels')[i]
    q('[data-replay]').setAttribute('aria-label', t('studio.replay'))
    sync()
  }
  scene.addEventListener('click', (event) => {
    const control = event.target.closest('button')
    if (!control) return
    if (control.hasAttribute('data-choice')) {
      run?.kill()
      stopVideo()
      state.step = +control.dataset.choice
      if (i === 4) {
        state.playhead = state.step
        videoProgress()
      }
      sync(true)
    }
    if (control.hasAttribute('data-next')) {
      run?.kill()
      state.step = (state.step + 1) % 3
      sync(true)
    }
    if (control.hasAttribute('data-device')) {
      state.device = control.dataset.device
      sync()
    }
    if (control.hasAttribute('data-reserve')) {
      state.reserved = true
      state.step = 2
      sync(true)
      q('[data-back]').focus({ preventScroll: true })
    }
    if (control.hasAttribute('data-back')) {
      state.reserved = false
      state.step = 0
      sync(true)
      q('[data-reserve]').focus({ preventScroll: true })
    }
    if (control.hasAttribute('data-event')) {
      run?.kill()
      state.event = control.dataset.event
      state.sent = false
      q('.signal-trace').style.strokeDashoffset = 1
      q('.signal-packet').setAttribute('cx', '65')
      q('.signal-packet').setAttribute('cy', '90')
      all('[data-signal-node]').forEach((el) =>
        el.classList.remove('is-received'),
      )
      sync()
    }
    if (control.hasAttribute('data-send-event')) sendEvent()
    if (control.hasAttribute('data-play')) {
      if (state.playing) {
        video?.pause()
        state.playing = false
        sync()
      } else playVideo()
    }
    if (control.hasAttribute('data-replay')) replay()
  })
  scene.addEventListener('keydown', (event) => {
    const button = event.target.closest('button[data-choice]')
    if (
      !button ||
      !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    )
      return
    const group = button.closest(
      '.demo-tabs,.demo-audit__findings,.demo-campaign',
    )
    if (!group) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? 2
          : (state.step + (event.key === 'ArrowRight' ? 1 : 2)) % 3
    const target = group.querySelector(`[data-choice="${next}"]`)
    target?.click()
    target?.focus({ preventScroll: true })
  })
  function setVisible(value) {
    visible = value
    if (visible && !imagesPreloaded) {
      imagesPreloaded = true
      // Prepare only this service's next scenes, never the full image collection.
      visuals.slice(1).forEach((src) => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.type = 'image/avif'
        link.href = `/img/${src}.avif`
        document.head.append(link)
      })
    }
    const running = visible && !document.hidden
    scene.classList.toggle('experience-live', running)
    if (!running) {
      run?.pause()
      video?.pause()
      cardMotion?.pause()
      transition?.pause()
      return
    }
    run?.resume()
    cardMotion?.resume()
    transition?.resume()
    if (state.playing) video?.resume()
    if (!hasEntered) {
      hasEntered = true
      if (i === 0) replay()
    }
  }
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', () => {
    if (media.matches) {
      run?.kill()
      cardMotion?.progress(1)
      transition?.progress(1)
      stopVideo()
      if (i === 4) videoProgress()
      sync()
    }
  })
  refresh()
  return { refresh, setVisible }
}
