// Section-anchored scroll mapping.
//
// The background times its scenes off where the sections actually are, not off
// hardcoded scroll percentages. Percentages drift the moment any section
// changes length — which is exactly what went wrong once, when a tall section
// pushed every scene out of place.
//
// V2 collapsed six sections into four:
//   hero · growth (about + experience) · work (projects) · contact (+ publication)
// Add or rename a section and the background follows automatically, provided
// the id is listed here and SCENES in lib/cosmos.js has a matching row.

export const SECTION_IDS = ["hero", "growth", "work", "contact"]

/** Viewport-centre offset of each section, in document coordinates. */
export function measureAnchors() {
  const anchors = []
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) {
      anchors.push(null)
      continue
    }
    const rect = el.getBoundingClientRect()
    anchors.push(rect.top + window.scrollY + rect.height / 2)
  }

  // Fill gaps (a section that isn't rendered) so the phase never jumps.
  const valid = anchors.filter((a) => a !== null)
  if (valid.length === 0) return SECTION_IDS.map((_, i) => i)
  for (let i = 0; i < anchors.length; i++) {
    if (anchors[i] === null) anchors[i] = i === 0 ? valid[0] : anchors[i - 1] + 1
  }
  return anchors
}

/**
 * Continuous phase in [0, SECTION_IDS.length - 1] for the current scroll.
 * Uses the viewport centre, so a section "arrives" when it's actually in
 * front of the reader rather than when it first touches the fold.
 */
export function phaseFromScroll(anchors) {
  const centre = window.scrollY + window.innerHeight / 2
  const last = anchors.length - 1

  if (centre <= anchors[0]) return 0
  if (centre >= anchors[last]) return last

  for (let i = 0; i < last; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (centre >= a && centre <= b) {
      const span = b - a || 1
      return i + (centre - a) / span
    }
  }
  return last
}

/**
 * How present the background should be at a given phase.
 *
 * Near full strength throughout, because legibility is handled structurally —
 * CosmicField draws a "readability well" that dims only the middle of the
 * screen where the content column sits.
 *
 * If the background ever competes with text, deepen the well in CosmicField
 * rather than pulling these down; lowering these flattens the edges too,
 * where the brightness costs nothing.
 */
const INTENSITY_BY_SECTION = [0.95, 1.0, 1.0, 0.92]

export function intensityFromPhase(phase) {
  const last = INTENSITY_BY_SECTION.length - 1
  const i = Math.max(0, Math.min(last, Math.floor(phase)))
  const j = Math.min(last, i + 1)
  const t = Math.max(0, Math.min(1, phase - i))
  const smooth = t * t * (3 - 2 * t)
  return INTENSITY_BY_SECTION[i] + (INTENSITY_BY_SECTION[j] - INTENSITY_BY_SECTION[i]) * smooth
}
