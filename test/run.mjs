/**
 * Headless maths tests.
 *
 * The background and the section anchoring are the two places on this site
 * that can fail silently and catastrophically — a NaN anywhere in the star
 * maths blanks the entire field, and a bad anchor sends every scene to the
 * wrong section. Neither is visible in a lint or a build, and neither can be
 * eyeballed reliably. Both have shipped broken before.
 *
 * These suites deliberately test only pure functions, which is why they run
 * anywhere with no browser and no test framework:
 *
 *   node --experimental-strip-types test/run.mjs   (or just: npm test)
 *
 * They exercise the real source via esbuild, so they cannot drift from it.
 */

import { execFileSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const work = mkdtempSync(join(tmpdir(), "portfolio-test-"))
let failures = 0
const results = []

function fail(suite, msg) {
  failures++
  results.push(`  ✗ ${suite}: ${msg}`)
}
function pass(msg) {
  results.push(`  ✓ ${msg}`)
}

/** Bundle a source module to plain ESM so node can import it. */
function build(entry, out) {
  execFileSync(
    "npx",
    [
      "--yes",
      "esbuild",
      entry,
      "--bundle",
      `--outfile=${join(work, out)}`,
      "--format=esm",
      "--platform=node",
      "--log-level=error",
    ],
    { stdio: "inherit" }
  )
  return join(work, out)
}

// ---------------------------------------------------------------------------
// 1. Background maths — lib/cosmos.js
// ---------------------------------------------------------------------------
async function testCosmos() {
  const mod = await import(build("src/lib/cosmos.js", "cosmos.mjs"))
  const { SCENES, sceneAt, starPosition, constellationProgress, CONSTELLATION_LIFE } = mod
  const S = "cosmos"
  const LAST = SCENES.length - 1
  const keys = ["drift", "warp", "band", "links", "core", "spin", "shoot"]

  // Interpolated values must stay inside the envelope of their keyframes.
  const min = {}
  const max = {}
  for (const k of keys) {
    min[k] = Math.min(...SCENES.map((s) => s[k]))
    max[k] = Math.max(...SCENES.map((s) => s[k]))
  }
  for (let p = -1; p <= LAST + 1; p += 0.005) {
    const s = sceneAt(p)
    for (const k of keys) {
      if (!Number.isFinite(s[k])) return fail(S, `${k} non-finite at phase ${p.toFixed(3)}`)
      if (s[k] < min[k] - 1e-9 || s[k] > max[k] + 1e-9)
        return fail(S, `${k}=${s[k]} outside keyframe envelope at phase ${p.toFixed(3)}`)
    }
    for (const h of s.hues) {
      if (!Number.isFinite(h) || h < 150 || h > 320)
        return fail(S, `hue ${h} implausible at phase ${p.toFixed(3)}`)
    }
  }
  pass(`scene interpolation finite and in-envelope across [-1, ${LAST + 1}]`)

  // Integer phases must land exactly on their keyframe.
  for (let i = 0; i < SCENES.length; i++) {
    const s = sceneAt(i)
    for (const k of keys) {
      if (Math.abs(s[k] - SCENES[i][k]) > 1e-9)
        return fail(S, `phase ${i} did not land on keyframe for ${k}`)
    }
  }
  pass(`${SCENES.length} scenes land exactly on their keyframes`)

  // Star positions must stay on screen across viewports, scroll and time.
  const stars = []
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      z: Math.pow(Math.random(), 2.1),
      tw: 0,
      twSpeed: 1,
    })
  }
  let n = 0
  let off = 0
  let minFade = 1
  let maxFade = 0
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
    [2560, 1329],
  ]) {
    for (let p = 0; p <= LAST; p += 0.25) {
      const s = sceneAt(p)
      for (const sf of [0, 0.33, 0.66, 1]) {
        for (const t of [0, 17, 600, 7200]) {
          for (const st of stars) {
            const { px, py, fade } = starPosition(st, s, t, sf, w, h)
            n++
            if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(fade))
              return fail(S, "star position produced a non-finite value")
            if (fade < 0 || fade > 1) return fail(S, `fade ${fade} outside 0..1`)
            minFade = Math.min(minFade, fade)
            maxFade = Math.max(maxFade, fade)
            if (px < -w || px > w * 2 || py < -h || py > h * 2) off++
          }
        }
      }
    }
  }
  if (off / n > 0.01) return fail(S, `${((off / n) * 100).toFixed(2)}% of stars far off screen`)
  pass(`${n.toLocaleString()} star samples on screen, fade spans ${minFade.toFixed(2)}–${maxFade.toFixed(2)}`)

  // A star sitting exactly on the wrap seam must be invisible, otherwise it
  // pops as it wraps.
  const seam = starPosition({ x: 0.5, y: 0, z: 1, tw: 0, twSpeed: 1 }, sceneAt(0), 0, 0, 1440, 900)
  if (seam.fade > 0.001) return fail(S, `star on the wrap seam has fade ${seam.fade}, should be ~0`)
  pass("wrap seam fades to zero (no pop as stars wrap)")

  // Constellation lifecycle.
  let sawFull = false
  for (let a = 0; a <= CONSTELLATION_LIFE + 0.5; a += 0.01) {
    const { drawn, alpha } = constellationProgress(a)
    if (!Number.isFinite(drawn) || !Number.isFinite(alpha))
      return fail(S, `constellation non-finite at age ${a.toFixed(2)}`)
    if (drawn < 0 || drawn > 1 || alpha < 0 || alpha > 1)
      return fail(S, `constellation out of range at age ${a.toFixed(2)}`)
    if (alpha > 0.99) sawFull = true
  }
  if (!sawFull) return fail(S, "constellation never reaches full brightness")
  if (!constellationProgress(CONSTELLATION_LIFE + 0.01).done)
    return fail(S, "constellation never reports done — they would leak")
  if (constellationProgress(0).drawn !== 0) return fail(S, "constellation starts already drawn")
  pass(`constellation lifecycle correct over ${CONSTELLATION_LIFE.toFixed(2)}s`)
}

// ---------------------------------------------------------------------------
// 2. Section anchoring — lib/sections.js
// ---------------------------------------------------------------------------
async function testSections() {
  const S = "sections"
  const H = 900
  // A deliberately uneven layout: `work` is far taller than the rest, which is
  // the exact case that broke the old percentage-based scene timing.
  const layout = {
    hero: [0, 1000],
    growth: [1000, 2600],
    work: [2600, 5400],
    contact: [5400, 6400],
  }
  globalThis.window = { scrollY: 0, innerHeight: H }
  globalThis.document = {
    getElementById: (id) =>
      layout[id]
        ? {
            getBoundingClientRect: () => ({
              top: layout[id][0] - globalThis.window.scrollY,
              height: layout[id][1] - layout[id][0],
            }),
          }
        : null,
  }

  const mod = await import(build("src/lib/sections.js", "sections.mjs"))
  const { SECTION_IDS, measureAnchors, phaseFromScroll, intensityFromPhase } = mod

  for (const id of SECTION_IDS) {
    if (!layout[id]) return fail(S, `SECTION_IDS lists "${id}" but the test layout has no such section`)
  }

  const anchors = measureAnchors()
  let prev = -1
  for (let y = 0; y <= 6400 - H; y += 10) {
    globalThis.window.scrollY = y
    const p = phaseFromScroll(anchors)
    const i = intensityFromPhase(p)
    if (!Number.isFinite(p) || p < 0 || p > SECTION_IDS.length - 1)
      return fail(S, `phase ${p} out of range at scrollY ${y}`)
    if (!Number.isFinite(i) || i < 0 || i > 1.001)
      return fail(S, `intensity ${i} out of range at scrollY ${y}`)
    if (p < prev - 1e-9) return fail(S, `phase went backwards at scrollY ${y}`)
    prev = p
  }
  pass("phase is monotonic and in range across the whole page")

  for (const [i, id] of SECTION_IDS.entries()) {
    const [t0, t1] = layout[id]
    globalThis.window.scrollY = (t0 + t1) / 2 - H / 2
    const p = phaseFromScroll(anchors)
    if (Math.abs(p - i) > 0.02)
      return fail(S, `${id} centred gives phase ${p.toFixed(3)}, expected ${i}`)
  }
  pass(`all ${SECTION_IDS.length} sections anchor to their own integer phase`)
}

// ---------------------------------------------------------------------------
// 3. Scene table must match the section list
// ---------------------------------------------------------------------------
async function testWiring() {
  const S = "wiring"
  const cosmos = await import(join(work, "cosmos.mjs"))
  const sections = await import(join(work, "sections.mjs"))
  if (cosmos.SCENES.length !== sections.SECTION_IDS.length) {
    return fail(
      S,
      `SCENES has ${cosmos.SCENES.length} rows but SECTION_IDS has ${sections.SECTION_IDS.length} — the background would mis-time`
    )
  }
  pass("SCENES has exactly one row per section")
}

// ---------------------------------------------------------------------------
// 4. Cross-filter data integrity — lib/crossFilter.js
// ---------------------------------------------------------------------------
async function testCrossFilter() {
  const S = "cross-filter"
  const cf = await import(build("src/lib/crossFilter.js", "crossfilter.mjs"))
  const { periodFilter, tagFilter, applyFilter, countForTag } = cf
  const { projects } = await import(build("src/Data/projects.js", "projects.mjs"))
  const { experience } = await import(build("src/Data/experience.js", "experience.mjs"))

  const allIds = projects.map((p) => p.id)

  // Every project must be claimed by exactly one career stage. This mapping is
  // hand-maintained (company name can't disambiguate three roles at the same
  // employer), so it is precisely the sort of thing that rots silently when a
  // project is added.
  const claimed = experience.flatMap((e) => e.growth?.projectIds ?? [])
  const dupes = claimed.filter((id, i) => claimed.indexOf(id) !== i)
  if (dupes.length) return fail(S, `project(s) claimed by more than one stage: ${dupes.join(", ")}`)

  const unknown = claimed.filter((id) => !allIds.includes(id))
  if (unknown.length) return fail(S, `stage references non-existent project(s): ${unknown.join(", ")}`)

  const orphans = allIds.filter((id) => !claimed.includes(id))
  if (orphans.length)
    return fail(
      S,
      `project(s) not reachable from any career stage: ${orphans.join(", ")} — add them to a growth.projectIds`
    )
  pass(`all ${allIds.length} projects claimed by exactly one of ${experience.length} stages`)

  // Period filters must return exactly what they claim.
  for (const e of experience) {
    const f = periodFilter(e)
    const got = applyFilter(f).map((p) => p.id).sort((a, b) => a - b)
    const want = [...(e.growth?.projectIds ?? [])].sort((a, b) => a - b)
    if (JSON.stringify(got) !== JSON.stringify(want))
      return fail(S, `period filter for ${e.company} returned [${got}], expected [${want}]`)
  }
  pass("every period filter returns exactly its declared projects")

  // Tag filters must agree with their advertised counts — the number shown on
  // each toolkit chip.
  const tags = [...new Set(experience.flatMap((e) => e.tags))]
  let matched = 0
  for (const tag of tags) {
    const n = countForTag(tag)
    const got = applyFilter(tagFilter(tag)).length
    if (got !== n) return fail(S, `tag "${tag}" counts ${n} but filters to ${got}`)
    if (n > 0) matched++
  }
  pass(`${matched}/${tags.length} toolkit tags map to at least one project, all counts consistent`)

  if (applyFilter(null).length !== projects.length)
    return fail(S, "no filter should return every project")
  pass("clearing the filter restores all projects")
}

// ---------------------------------------------------------------------------

try {
  await testCosmos()
  await testSections()
  await testWiring()
  await testCrossFilter()
} catch (err) {
  failures++
  results.push(`  ✗ threw: ${err.message}`)
} finally {
  rmSync(work, { recursive: true, force: true })
}

console.log("\n" + results.join("\n"))
console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} failure(s).\n`)
process.exit(failures === 0 ? 0 : 1)
