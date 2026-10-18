import assert from 'node:assert/strict'
import { test } from 'node:test'
import { metricsLayout } from '../src/js/webgl/metrics-layout.js'
import { sectores, totalInvertido } from '../src/data/sectores.js'
import { perfil } from '../src/data/perfil.js'

test('every recorded industry is represented, including unclassified spending', () => {
  const layout = metricsLayout(sectores)
  assert.equal(totalInvertido, perfil.cifras.invertido)
  assert.deepEqual(
    layout.bars.map((bar) => bar.id),
    sectores.map((sector) => sector.id),
  )
  assert.equal(layout.bars.at(-1).id, 'otras')
})

test('bar heights preserve spending ratios with identical footprints and a zero baseline', () => {
  const { bars, ticks, ceiling } = metricsLayout(sectores)
  assert.equal(ticks[0], 0)
  assert.ok(ceiling >= Math.max(...sectores.map((s) => s.invertido)))
  for (let i = 0; i < bars.length; i++) {
    assert.equal(bars[i].width, bars[0].width)
    assert.equal(bars[i].depth, bars[0].depth)
    assert.ok(
      Math.abs(
        bars[i].height / bars[0].height -
          sectores[i].invertido / sectores[0].invertido,
      ) < 1e-12,
    )
  }
})

test('zero spending stays zero and changed data expands the shared scale', () => {
  const { bars, ceiling } = metricsLayout([
    { id: 'zero', invertido: 0 },
    { id: 'large', invertido: 400001 },
  ])
  assert.equal(bars[0].height, 0)
  assert.ok(ceiling >= 400001)
  assert.ok(Number.isFinite(bars[1].height))
})
