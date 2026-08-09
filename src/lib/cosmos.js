// Pure maths for the Deep Nebula background.
//
// Kept out of the component so it can be unit-checked headlessly (bundle with
// esbuild, run under node) — this is the part that silently produces NaN and
// blanks the whole field, and it cannot be eyeballed reliably.

/**
 * Per-section scene parameters, interpolated between adjacent sections so
 * scrolling is a continuous transformation rather than a set of cuts.
 *
 *   hues    [cloud A, cloud B, cloud C]
 *   drift   ambient motion speed
 *   warp    stars stretch into travel streaks
 *   band    brightness of the galactic plane
 *   links   persistent constellation lines between the brightest stars
 *   core    central glow strength
 *   spin    rotation of the field about the centre
 *   shoot   shooting-star spawn rate (each one seeds a constellation)
 *
 * Index order matches SECTION_IDS in sections.js:
 *   hero · growth · work · contact
 */
// Note on `warp`: these are *base* values only, and deliberately low. An
// earlier version set warp to 0.85 for the whole Work section, which meant the
// starfield sat permanently streaked and read as "sliding sideways". Warp is
// now driven mostly by actual scroll velocity in CosmicField — it streaks
// because you are moving, and settles the moment you stop.
export const SCENES = [
  { hues: [222, 250, 200], drift: 0.010, warp: 0.00, band: 0.00, links: 0.0, core: 0.14, spin: 0.00, shoot: 1.00 },
  { hues: [212, 264, 194], drift: 0.013, warp: 0.00, band: 0.55, links: 0.5, core: 0.22, spin: 0.00, shoot: 0.80 },
  { hues: [203, 280, 186], drift: 0.020, warp: 0.12, band: 0.00, links: 0.0, core: 0.40, spin: 0.00, shoot: 0.55 },
  { hues: [214, 274, 194], drift: 0.012, warp: 0.00, band: 0.00, links: 0.0, core: 0.72, spin: 0.55, shoot: 0.75 },
]

const lerp = (a, b, t) => a + (b - a) * t

/** Interpolated scene at a continuous phase. Clamps outside the valid range. */
export function sceneAt(phase) {
  const last = SCENES.length - 1
  const lo = Math.max(0, Math.min(last, Math.floor(phase)))
  const hi = Math.min(last, lo + 1)
  let f = Math.max(0, Math.min(1, phase - lo))
  f = f * f * (3 - 2 * f) // ease

  const a = SCENES[lo]
  const b = SCENES[hi]
  return {
    hues: [
      lerp(a.hues[0], b.hues[0], f),
      lerp(a.hues[1], b.hues[1], f),
      lerp(a.hues[2], b.hues[2], f),
    ],
    drift: lerp(a.drift, b.drift, f),
    warp: lerp(a.warp, b.warp, f),
    band: lerp(a.band, b.band, f),
    links: lerp(a.links, b.links, f),
    core: lerp(a.core, b.core, f),
    spin: lerp(a.spin, b.spin, f),
    shoot: lerp(a.shoot, b.shoot, f),
  }
}

/**
 * A star's screen position.
 *
 * Depth parallax is the important part: near stars travel further as you
 * scroll, which makes scrolling feel like movement *through* the field rather
 * than past a flat image.
 */
export function starPosition(star, scene, t, scrollFrac, w, h) {
  const par = 0.25 + star.z * 0.75

  // Horizontal drift halved. The field previously read as sliding sideways,
  // because a constant lateral drift was competing with the vertical parallax
  // rather than supporting it.
  let nx = star.x + t * scene.drift * par * 0.03
  let ny = star.y + scrollFrac * par * 0.55

  nx -= Math.floor(nx)
  ny -= Math.floor(ny)

  // Stars wrap around the field. Without this they blink out at one edge and
  // reappear at the other — a visible pop, especially on the bright ones with
  // a glow. Fading across the seam turns the wrap into a dissolve.
  const fx = Math.min(1, Math.min(nx, 1 - nx) / 0.05)
  const fy = Math.min(1, Math.min(ny, 1 - ny) / 0.08)
  const fade = Math.max(0, Math.min(1, fx * fy))

  let px = nx * w
  let py = ny * h

  if (scene.spin > 0.001) {
    const cx = w / 2
    const cy = h / 2
    const ang = t * 0.02 * scene.spin * par
    const dx = px - cx
    const dy = py - cy
    const c = Math.cos(ang)
    const s = Math.sin(ang)
    px = cx + dx * c - dy * s
    py = cy + dx * s + dy * c
  }

  return { px, py, par, fade }
}

// ---------------------------------------------------------------------------
// Constellations
// ---------------------------------------------------------------------------

/** Lifecycle timings, in seconds. */
export const CONSTELLATION = {
  draw: 1.15, // tracing the lines in
  hold: 1.6, // fully lit
  fade: 1.25, // dissolving
  minStars: 3,
  maxStars: 7,
  /** A shooting star collects background stars within this fraction of the viewport. */
  captureRadius: 0.075,
}

export const CONSTELLATION_LIFE =
  CONSTELLATION.draw + CONSTELLATION.hold + CONSTELLATION.fade

/**
 * Progress of a constellation at age `age` (seconds).
 *
 * `drawn` runs 0→1 while the lines trace themselves in; `alpha` handles the
 * hold and the dissolve. Separating them is what makes it read as a drawing
 * gesture rather than a crossfade.
 */
export function constellationProgress(age) {
  const { draw, hold, fade } = CONSTELLATION
  if (age < 0) return { drawn: 0, alpha: 0, done: false }

  if (age < draw) {
    const t = age / draw
    return { drawn: 1 - Math.pow(1 - t, 3), alpha: Math.min(1, t * 2.2), done: false }
  }
  if (age < draw + hold) {
    return { drawn: 1, alpha: 1, done: false }
  }
  const t = (age - draw - hold) / fade
  if (t >= 1) return { drawn: 1, alpha: 0, done: true }
  return { drawn: 1, alpha: 1 - t * t, done: false }
}
