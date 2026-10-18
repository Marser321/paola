// Shared, zero-based geometry. No perspective scaling or per-bar normalization.
export function metricsLayout(data) {
  const ceiling = Math.max(
    50000,
    Math.ceil(Math.max(...data.map((d) => d.invertido)) / 50000) * 50000,
  )
  return {
    ceiling,
    ticks: Array.from({ length: 6 }, (_, i) => (ceiling * i) / 5),
    bars: data.map((d, i) => ({
      id: d.id,
      x: (i - (data.length - 1) / 2) * 0.94,
      height: (d.invertido / ceiling) * 4.4,
      width: 0.62,
      depth: 0.62,
    })),
  }
}
