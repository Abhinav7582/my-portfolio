# Portfolio — Working Notes

Baseline reference for future sessions. Covers how the site is put together,
why things are the way they are, and what is still outstanding.

Last updated: 7 August 2026

---

## 1. What this is

Single-page portfolio for Abhinav Singh (Data Analyst — AdTech, product
analytics, data engineering). Vite + React 19, Tailwind 3, framer-motion.
Deployed on **Vercel**. Repo: `github.com/Abhinav7582/my-portfolio`.

No backend, no forms, no external scripts, no third-party embeds. Everything
is static. That is a deliberate property worth preserving — it is the reason
the security surface is as small as it is.

### Structure

```
index.html              meta, Open Graph, JSON-LD Person schema
src/
  App.jsx               composition, MotionConfig, plain-view switch
  index.css             base styles, liquid-glass system, reduced motion
  lib/
    scroll.js           eased anchor scrolling (replaces CSS smooth-scroll)
    motion.js           shared variants — the single source of animation timing
    sections.js         measures real section positions → background phase
    cosmos.js           background maths: SCENES, star positions, constellations
  Components/
    CosmicField         Canvas 2D background — the whole journey
    ScrollProgress      spring-damped progress bar
    Navbar              glass pill, active state, plain-view + CV
    Hero                photo, positioning, four headline metrics
    Growth              About + Experience merged, scope chart, toolkit cloud
    Work                12 projects, filterable numbered rows
    Contact             publication + contact
    PlainView           no-animation text version (lazy-loaded)
    Modal               shared dialog, morphs from the clicked row
  Data/
    projects.js         12 projects, each with a `category` used for filtering
    experience.js       roles + growth trajectory metadata
```

**V2 collapsed six sections into four** — hero, growth, work, contact — after
feedback from a real reader: "good portfolio, but I had to scroll a lot."
Detail moved *sideways* into modals rather than downward into scroll.

---

## 2. The background engine

`CosmicField.jsx` — "Deep Nebula", Canvas 2D. Vast soft nebula clouds, a
depth-biased starfield (340 desktop / 150 mobile), and a scene that
transforms per section.

| Section | Scene | Reads as |
|---------|-------|----------|
| hero | deep field, frequent shooting stars | vastness |
| growth | galactic plane, constellation links | structure, connection |
| work | warp — stars stretch into travel streaks | momentum |
| contact | slow rotation, bright core | closing the loop |

Scene parameters live in `lib/cosmos.js` as `SCENES` — one row per section,
linearly interpolated, so scrolling is a continuous transformation rather
than a set of cuts. Tuning the look means editing that table, nothing else.
`SCENES` must have exactly one row per entry in `SECTION_IDS`.

### The signature moment: shooting star → constellation

A shooting star streaks across the field and quietly **collects the stars it
passes near** (`CONSTELLATION.captureRadius`, up to `maxStars`). When it burns
out, those exact stars trace themselves into a constellation — lines drawing
in over ~1.15s, holding ~1.6s, dissolving over ~1.25s.

The point is that it's one continuous gesture rather than two effects played
back to back: the shooting star *becomes* the constellation, using the same
stars it just flew past. Timings and the lifecycle curve are in
`CONSTELLATION` / `constellationProgress()` in `lib/cosmos.js`, and the
lifecycle is covered by the headless test.

Edges longer than 45% of the viewport are skipped — stars wrap around the
field, and without that guard a wrapped member draws a line straight across
the screen.

### The design lesson (three attempts to learn)

What made an earlier version feel "jumbled and too contrasty" was **not
drama — it was high frequency**. Thousands of small bright dots behind a
headline reads as clutter. A few very large, slow, coherent forms reads as
cinema and barely touches legibility.

The overcorrection was just as wrong: a very quiet, sparse field was reliable
but "not eye-catching". The resolution is not a point on the loud↔quiet axis
at all — it's **fewer, larger, slower elements plus structural protection for
the text**.

### The readability well

`CosmicField` draws a dark radial gradient over the *middle* of the screen,
where the content column sits, after everything else. Drama at the edges,
calm behind the words. This is what allows `INTENSITY_BY_SECTION` to sit near
1.0 everywhere.

**If the background ever competes with text, deepen the well rather than
dropping the intensities** — turning intensity down flattens the effect at
the edges too, where it costs nothing.

### Performance
Star glow is a pre-rendered 64px sprite drawn with `drawImage`, not a radial
gradient per star per frame — that difference is roughly 340 gradient
allocations per frame versus zero. Only stars with `z > 0.55` get a glow at
all. Nebula clouds are 5 gradients per frame, which is fine.

### Why Canvas 2D and not WebGL — read this before "upgrading" it

There was a WebGL version: a GPU particle system, 30k points, hand-written
GLSL, real perspective projection. It looked better on paper and it did not
work. It failed to link on some drivers, then failed to compile, and **GLSL
cannot be verified anywhere except a real browser** — so each fix was a guess
and the debugging loop was miserable.

Canvas 2D has no compile step and no driver variance. If it runs once, it runs
everywhere. For a background this restrained the visual difference is
negligible, and the reliability difference is total. If you are ever tempted
to port this back to WebGL, the cost is not the code — it is that you cannot
test it outside a browser.

Two shader bugs from that attempt, worth knowing generally:
- `smoothstep(edge0, edge1, x)` is **undefined when `edge0 > edge1`** and
  returns 0 on many drivers. Reversed edges made every particle invisible
  while compiling perfectly.
- A varying's precision must match between vertex and fragment shaders. The
  two have different default float precision, so relying on defaults fails to
  link on ANGLE (Chrome/Edge on macOS).

### Intensity — the hero is the quietest point

`INTENSITY_BY_SECTION` in `lib/sections.js` is `[0.5, 0.85, 1.0, 1.0, 0.9,
0.85]`. Note the hero is the *lowest*. An earlier version did the opposite —
full spectacle behind the photo and headline — and it read as jumbled and
over-contrasted, because that is precisely where the content needs to win.
**This array is the one dial to turn if the background ever competes with
text.** Don't reach for the node count.

Line alpha caps at 0.13 and node alpha at ~0.5. These are low on purpose.

### Two decisions worth remembering

**Scenes are anchored to real section positions, not scroll percentages.**
`lib/sections.js` measures each section's viewport-centre offset and returns a
continuous phase where `phase === N` means section N is centred. The previous
version hardcoded percentages ("detonate at 0.47") and drifted badly the
moment a section changed length — the Projects section is tall, so every scene
fired in the wrong place. A `ResizeObserver` on `body` re-measures after font
load or content changes. **Add or rewrite a section and the scenes follow it
automatically** — but the section must have an `id` listed in `SECTION_IDS`.

**Phase is smoothed, not read raw.** `phase += (target - phase) * 0.085` each
frame. This is what decouples the visual from trackpad jitter. Lower = smoother
and laggier.

### Intensity

`INTENSITY_BY_SECTION` in `lib/sections.js`: full strength on the hero where
there's room for spectacle, ~0.33 behind the reading sections, with a partial
lift for the Projects flyover so the terrain still lands. If body text ever
feels hard to read, this array is the dial — not the particle count.

### Testing it without a browser

All the maths lives in `lib/cosmos.js` and `lib/sections.js` rather than in
the component, specifically so it can be checked headlessly — this is the part
that silently produces `NaN` and blanks the whole field, and it cannot be
eyeballed reliably.

```bash
npx esbuild src/lib/cosmos.js --bundle --outfile=/tmp/c.mjs \
  --format=esm --platform=node
# then assert: sceneAt() finite and within its keyframe envelope across
# phase 0→5, exact at integer phases, clamped outside the range; and
# starPosition() on-screen across viewports, scroll positions and times.
```

For `lib/sections.js`, stub `window`/`document` with a mock layout, then
assert the phase is monotonic and each section centred yields its own integer
phase. Both suites currently pass — 403,200 star-position samples with zero
off-screen, and correct anchoring with a deliberately tall Projects section,
which is the exact case the old percentage-based timing got wrong.

### Previous engines
Three before this one: a canvas-2D cosmos with a big-bang event, a WebGL
particle field (abandoned — see above), and a deliberately minimal node field
(rejected as not eye-catching). All in git history. The big-bang flash was
capped at 0.55 alpha for photosensitivity reasons — worth remembering if a
full-screen flash is ever reintroduced.

---

## 3. Liquid glass

Modelled on the iOS treatment. Four ingredients, and it needs all four —
three of them alone just looks like a translucent grey box:

1. `blur()` **plus `saturate(180%)`** — the saturation is what makes it look
   lit rather than dead
2. a gradient fill, brighter toward the top-left light source
3. a **specular rim**, drawn as a masked 1px ring (`mask-composite: exclude`)
   so the highlight varies around the edge the way real glass does
4. inner top highlight + outer depth shadow

### Two variants, and the reason for two

- **`.glass`** — real `backdrop-filter`. Expensive: the browser re-composites
  the blur every frame the canvas behind it repaints. Reserved for a small
  number of large surfaces: navbar, modal, publication card, CTA buttons.
- **`.glass-lite`** — gradients only, no `backdrop-filter`. Used for the 12
  project cards and the experience cards.

This split is the important part. Putting true glass on a dozen cards sitting
above a full-screen animated canvas is exactly the combination that tanks
frame rate on mid-range laptops and phones. It looks nearly identical at card
size. **If you're tempted to swap the cards to `.glass`, test on a real
mid-range phone first.**

`.glass-tint` adds a cool blue/violet cast so the glass picks up the scene.
`.glass-hover` responds with light — glow and rim, not scale (see below).

---

## 4. Section flow

- **There are deliberately no dividers between sections.** An earlier version
  put a glowing "seam" between each one to blend them and it did the opposite:
  a glow with a hairline through it, sitting on a moving background, reads as
  a pasted-on patch. On a dark animated backdrop, sections blend by having
  *nothing* between them — the background carries the continuity.
- `ScrollProgress` — bound to `scrollYProgress` through a **spring**. Bound
  directly it tracks trackpad jitter and looks nervous.
- Anchor clicks use `lib/scroll.js` instead of CSS `scroll-behavior: smooth`.
  Duration scales with distance (420–1100ms, ease-in-out), so a short hop and
  a full-page jump feel like the same gesture. CSS smooth-scroll is now
  explicitly `auto` — leaving it on would fight the rAF loop.
- `scroll-margin-top: 7rem` on sections. Headings used to land underneath the
  fixed navbar.
- Stagger is now parent-driven (`staggerChildren`) rather than
  `delay: i * 0.1`. With 12 project cards the old approach finished 1.2s after
  entering view, which reads as lag. Now ~0.7s total.
- `MotionConfig reducedMotion="user"` in App.jsx. The canvas already honoured
  the OS setting; none of the DOM animations did.

---

## 5. Bugs fixed this round

**Modal exit animations never ran.** `AnimatePresence` was inside `Modal`,
but the parents unmounted it with `{selected && <Modal/>}` — so the component
was gone before it could animate out. Closing a card just popped. The
`AnimatePresence` now lives in the parent, wrapping the conditional. This is
the classic version of this mistake; if you add another dialog, keep the
presence wrapper next to the condition.

**Rules of Hooks violation in Experience.jsx.** `useRef` and `useInView` were
being called inside a `.map()` callback. It only worked because the experience
array never changes length — any future filter or sort would have desynced
React's hook order and produced genuinely baffling bugs. Extracted into a
`TimelineCard` component.

**Modal scroll lock** set `overflow: auto` on cleanup rather than restoring
the previous value, and didn't compensate for the scrollbar, so the page
jolted sideways on open and close.

**Modal accessibility** — was missing everything. Now has `role="dialog"`,
`aria-modal`, Escape to close, a Tab focus trap, and focus restoration to the
element that opened it. Cards are keyboard-operable (`role="button"`,
`tabIndex`, Enter/Space).

---

## 6. Card → modal morph

Clicking a card morphs it into the dialog via framer `layoutId`
(`project-{id}` / `exp-{id}`).

Two constraints that are easy to break:

- **The tilt motion values and `layoutId` must be on the same element.** Put
  the tilt on a wrapper and the morph gets measured through a transformed
  ancestor, which skews it. Tilt resets to zero on click so the morph starts
  square-on.
- **No hover `scale`.** Framer drives layout animations with scale internally,
  so animating scale too makes the morph wobble. Hover feedback is light-based
  instead — which suits glass better anyway.

---

## 6c. V2 sections — Growth, Work, Plain view

### Growth (About + Experience merged)

The old version made a reader scroll through four paragraphs of prose, four
stat tiles, forty skill pills across six labelled groups, and five expanded
job cards — roughly three screens to learn what the chart now says at a
glance. Three compressions did the work:

1. **About prose → two sentences.** The arc tells that story structurally now.
2. **Six labelled skill groups → one cloud that highlights per stage.** Nothing
   is hidden, so keyword scanning still works, but it stops being a wall *and*
   becomes part of the growth story — you can watch the toolkit accumulate
   from five tools to thirty.
3. **Full role detail → the modal**, not further down the page.

**The detail panel beside the chart is deliberately always visible.** Research
puts the first-impression portfolio scan at about 7 seconds and a full review
under a minute, so someone who never clicks must still learn where he works
and what he did there. Interaction adds depth; it is never the price of entry.

### Work

Twelve projects as numbered rows rather than a card grid — cards create visual
noise at that count, rows create rhythm. Filtered by `category` (already
present in `projects.js`) with a live count. Hovering a row dims the others.

**No `<AnimatePresence layout>` wrapper around the rows.** Layout animation on
a parent fights the `layoutId` morph on the row itself, and the morph into the
modal is the interaction worth protecting. The list is re-keyed on filter
change so it simply re-enters with its stagger.

### Plain view

`?plain=1`, or the navbar button. A lazy-loaded, no-animation, no-modal text
document containing every fact on the site. Some readers don't want an
interface — they want the text, and making them hunt for it is how you lose
them. It's 1.5KB gzipped in its own chunk, so it costs nothing to anyone who
never opens it.

## 6b. Experience as a growth story

The section is structured around trajectory rather than as five job entries.
Each role in `Data/experience.js` carries a `growth` object:

```js
growth: {
  stage, year, stageLabel, scope,
  ownership,  // 0-100, drives the scope meter width
  leap,       // what actually changed at this step
}
```

Three devices carry the arc:

1. **Trajectory rail** — chronological left to right, 2022 → 2026. Desktop
   only; at mobile widths five columns become unreadable and the per-card
   stage badges carry the same information.
2. **Scope meter** on each card — the widening remit made visible, 15% → 100%.
3. **"The step up"** block — one sentence naming what changed versus the
   previous role. This is the actual storytelling device; the stats prove
   impact, but this is what makes it read as progression.

Note the ordering split: the rail runs oldest → newest because progression
only reads that way, while the cards stay newest-first because that's what a
recruiter wants first. `chronological` is derived by sorting on
`growth.stage`, so the two never drift apart.

## 7. Security

### Now in place
- **`vercel.json`** — CSP, HSTS (2yr, preload), `frame-ancestors 'none'` +
  `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, a locked-down
  Permissions-Policy, COOP/CORP, plus immutable caching for `/assets/*`.
  Clickjacking was the concrete live exposure before this: anyone could have
  iframed the site into their own page.
- **`npm audit` is clean** — was 3 high (Vite `server.fs.deny` bypass, PostCSS
  path traversal, brace-expansion DoS). All dev-time only, so the live site
  was never affected, but the Vite one mattered when running `npm run dev` on
  shared wifi.
- **`.github/dependabot.yml`** — weekly grouped npm PRs, monthly Actions.
  Nothing was previously telling you when a dependency went bad.
- `.jsx.backup` files untracked and gitignored.

### CSP note
`script-src 'self'` is strict. **If you enable Vercel Analytics or Speed
Insights, the script will be blocked** until you add
`https://va.vercel-scripts.com` to `script-src`. Same for any embed, font CDN
or analytics tag you add later — the CSP is the first place to look when
something silently fails to load.

`style-src` allows `'unsafe-inline'`, which is required for React/framer
inline styles. Style injection is a minor vector on a static site with no user
input, so this is an acceptable trade.

### Deliberately left alone
Email is plaintext in `Hero.jsx` and `Contact.jsx` and will be harvested by
scrapers. Reachability was judged more important. The CV at
`/Abhinav_Singh_CV.pdf` contains a phone number and is publicly downloadable
and indexable — reviewed and kept as is, on purpose.

### Not code — worth doing on GitHub
Enable 2FA, secret scanning and branch protection on `main`.

---

## 8. Outstanding

| | Item | Why |
|---|---|---|
| High | Replace `abhinavsingh.vercel.app` placeholder in `index.html`, `robots.txt`, `sitemap.xml` | Open Graph images need absolute URLs — link previews stay broken until this points at the real host |
| High | `public/profile.jpg` is 605KB for a 256px avatar | Biggest single payload on the page. Re-encode to WebP at ~2× display size, likely under 40KB |
| Med | JS bundle is 408KB raw / 129KB gzipped | Mostly framer-motion. Fine for now; if it grows, code-split the modal |
| Med | Tune background presence to taste | `INTENSITY_BY_SECTION` in `lib/sections.js`, and the alpha caps in `AmbientField.jsx` |
| Low | `dist/` is stale in the working tree | Untracked and gitignored, just noise |
| Low | Consider a real 404 page | Currently Vercel's default |

---

## 9. Local environment gotcha

**Never run `npm install` / `npm ci` / `npm audit fix` against this folder from
a Linux environment.** This repo lives on macOS (arm64). Vite 8 uses rolldown,
and Tailwind/Vite pull in platform-specific native binaries
(`@rolldown/binding-darwin-arm64`, `lightningcss-darwin-arm64`). A Linux npm
run rewrites the shared `node_modules` and leaves those packages as empty
directories, after which `npm run dev` dies with:

```
Error: Cannot find native binding.
Cannot find module '@rolldown/binding-darwin-arm64'
```

Recovery — run on the Mac:

```bash
cd ~/my-portfolio
rm -f .git/index.lock          # a crashed cross-platform npm run can leave this
rm -rf node_modules package-lock.json
npm install
```

Deleting both is the documented workaround for npm's optional-dependency bug
(npm/cli#4828). All version ranges in `package.json` are `^`, so a fresh
resolve lands on the patched versions anyway — `npm audit` should report zero
afterwards, and no major versions move (Tailwind stays on 3.x, framer-motion
on 12.x).

**This cuts both ways.** Once `node_modules` holds the macOS binaries, a Linux
environment can no longer run `vite build` against it — same error, opposite
direction. That's correct and expected; the fix is *not* to reinstall. Verify
builds locally on the Mac. For a syntax and import check without touching
`node_modules`, `npx esbuild src/main.jsx --bundle --loader:.css=empty
--jsx=automatic` works from anywhere.

## 9e. Two small fixes (V2.7)

**Hero metrics were under the photo, not the headline.** They sat outside the
photo/text grid, so the row spanned the whole container and the first number
started at the container's left edge — directly beneath the portrait. They are
now inside the text column, so they share its left edge and its width. The
whole hero block is also capped and centred, since a portrait plus an intro
does not benefit from 1472px of width even when the grids below do.

**Navbar highlighted the wrong section on the hero.** The
`IntersectionObserver` only ever *set* `active` when a section entered the
band, and never cleared it when one left. Scrolling back to the top therefore
left the last section — usually Growth — still lit.

It now keeps a `Set` of sections currently in the band and derives `active`
from it each time, picking the first in document order and falling back to `""`
(no pill lit) when none are. **If you add a section, put it in `sections` in
document order** — that ordering is what resolves overlaps.

## 9d. Width, hero balance, About dialog (V2.6)

**Container 72rem → 92rem** (`lib/layout.js`). At 1152px the content was a
narrow column with ~700px of dead space either side on a large display.
Paragraph measure is unaffected — `PROSE` caps that independently, so only
grids and layout use the extra width. Work gains a `2xl:grid-cols-4`
breakpoint, putting twelve projects in three rows on a wide screen.

**Hero rebalanced.** The photo-and-text row was a flex row with the paragraph
capped at `max-w-md`, so on a wide viewport the right half was simply empty.
It is now a `grid md:grid-cols-[auto_minmax(0,1fr)]` — fixed photo column,
flexible text column — with the paragraph at `max-w-2xl`.

**About is a dialog, not a section.** V2 cut the four-paragraph story down to
two sentences because it cost a screen of scroll; the full version now lives
in `Data/about.js` and opens from the navbar, costing nobody any scroll.

`Modal` was generalised rather than duplicated: pass `item` for the standard
project/role layout, or `title` + `children` for arbitrary content. **There is
exactly one `role="dialog"` in the codebase** — the scroll lock, focus trap,
Escape handling and morph-from-origin all live in one place. Keep it that way.

## 9c. Cross-section filtering (V2.5)

The link that turns four sections into one system. `lib/crossFilter.js` holds
it as plain data plus pure functions, so it is unit-testable like the
background maths.

Two kinds:

- **period** — "5 projects from this period →" in Growth's detail panel jumps
  to Work showing only that stage's projects.
- **tag** — every toolkit chip is a button; clicking one shows every project
  using that tool. Chips carry a count, and chips with no matching project are
  disabled. **The count badge is the affordance** — a number means it's
  clickable.

### Rules

- **Project links are explicit `growth.projectIds`, not derived from company
  name.** Three separate roles all sit at Affine Analytics, so the company
  string cannot disambiguate them.
- **A cross-filter overrides the category chips**, and choosing a category
  clears it. Intersecting the two silently produces empty results with no
  explanation.
- **The banner is always visible and always removable.** An applied filter you
  can neither see nor undo is the fastest way to make someone think the site is
  broken.

### The test that matters

`test/run.mjs` asserts every project is claimed by **exactly one** stage — no
duplicates, no unknown ids, no orphans. That mapping is hand-maintained, so
adding a 13th project without assigning it to a stage now fails CI instead of
quietly becoming unreachable from Growth. It also checks each period filter
returns exactly its declared projects and that every toolkit chip's count
matches what it actually filters to.

Current spread: 2022 none (predates the write-ups), 2023 two, 2024 three,
2025 two, 2026 five.

## 9b. Alignment, compositing and tests (V2.4)

### One container for every section

`lib/layout.js` exports `CONTAINER`, `SECTION`, `PROSE`, `EYEBROW`, `HEADING`.
**Use `SECTION` on every top-level `<section>`.**

Sections previously each chose their own width — Hero and Growth at
`max-w-6xl`, Work at `max-w-screen-xl`, Contact at `max-w-4xl` — so the left
edge of the content jumped three times on the way down the page. That is the
kind of misalignment a reader feels without being able to name it.

### No `backdrop-filter` anywhere

Removed from `.glass` entirely. Every glass element floats above a canvas
repainting at 60fps, so each one forced the compositor to re-sample a moving
backdrop every frame — and the navbar is `fixed`, so it paid that cost
permanently. The same property, nested on a scrolling panel, was the root
cause of the dialog tearing.

On a near-black starfield the visual loss is negligible: the gradient, the
specular rim and the inset highlight are what actually read as glass. A solid
base colour gets the same look for free.

**Do not add it back.** If a surface genuinely needs it, give it its own class
— and never on something that scrolls or sits inside another
backdrop-filtered element.

### Tests are real now

```bash
npm test     # headless maths suites
npm run check  # lint + test + build, same as CI
```

`test/run.mjs` bundles the real `lib/cosmos.js` and `lib/sections.js` with
esbuild and exercises them under node, so the suites cannot drift from the
source. They cover the two failure modes that are invisible to lint and build
and have both shipped broken before: a `NaN` blanking the entire star field,
and scenes anchoring to the wrong section. Including a guard that `SCENES` has
exactly one row per entry in `SECTION_IDS`.

`.github/workflows/ci.yml` runs lint, test, build and `npm audit
--audit-level=high` on every push and PR.

## 10. V2 — shipped 9 Aug 2026

Delivered against the plan below. What changed:

| Area | Before | After |
|---|---|---|
| Sections | 6 (~8 screens) | 4 (~4 screens) |
| Hero | kept | kept + four headline metrics |
| About + Experience | two sections, ~3 screens | one `Growth` section |
| Projects | 12 tilting cards in a grid | 12 filterable numbered rows |
| Publications | its own section | one row inside Contact |
| Escape hatch | none | `PlainView`, lazy-loaded |
| profile.jpg | 605 KB | 18 KB WebP / 33 KB JPEG fallback |
| Background | scroll-driven scenes | + shooting star → constellation |
| Phase chase | `k = 0.075` | `k = 0.11` (snappier; fewer, wider sections) |

Verified: eslint clean; esbuild bundle 122 KB gz main + 12 KB chunk + 1.5 KB
lazy PlainView; 140,400 star-position samples with zero off-screen; scene
interpolation inside its keyframe envelope across the full range; constellation
lifecycle correct; all four sections anchor to their own integer phase.

**Still to confirm in a browser** (can't be verified headlessly): the
constellation timing feels right, the modal morph from a row, and mobile
layout of the Growth chart.

### V2.1 fixes (same day)

**Page tearing while scrolling inside a dialog.** One root cause behind three
symptoms. The element carrying `layoutId` was also the element that scrolled,
so framer re-projected the shared-layout node against a moving scroll offset
every frame. The same mistake made the glass rim — an `inset: 0`
pseudo-element — paint a stray line across the content, and pushed the
scrollbar outside the rounded corner.

Fix: `layoutId` now sits on a fixed-size, non-scrolling shell; a separate
**plain** inner element scrolls. **If you add another dialog, keep those two
responsibilities on different nodes.**

**V2.3 — the actual cause was CSS compositing, not framer.**

Three rounds were spent blaming framer. Wrong. V1's dialog was a plain
`bg-gray-900 border border-gray-700` panel. Applying `.glass` to it stacked
four compositing hazards on a single element:

- `backdrop-filter: blur(24px) saturate(180%)` — re-samples the entire backdrop
  every frame
- nested inside *another* `backdrop-filter` (the overlay's blur), so it blurred
  an already-blurred surface
- a `::before` ring using `mask-composite`, needing its own render pass
- `will-change: transform`, which changed layer promotion

…all above a canvas repainting at 60fps, wrapped around a scroll container.
Browsers re-evaluate layer promotion at scroll boundaries, which is exactly
where the tearing appeared.

**Rules for the dialog, learned expensively:**
- **Never put `.glass` on the dialog panel.** It is a solid `bg-[#0d1220]`
  with a real border on purpose. Glass is for the navbar, buttons and the
  publication card — elements that don't scroll and don't sit over other
  backdrop-filtered surfaces.
- The overlay is a **solid scrim**, not `backdrop-blur`. Blurring a
  full-screen 60fps canvas is the most expensive thing this page could ask a
  compositor to do.
- `CosmicField` **pauses its draw loop entirely while a dialog is open** — the
  field is invisible behind the scrim anyway, so it was pure waste.

**V2.2 — the morph no longer uses framer's shared layout at all.** The two
fixes above each moved the glitch rather than removing it (first "while
scrolling", then "at the end of the scroll"), which is the signature of
guarding a mechanism instead of deleting it. A shared `layoutId` maintains a
live projection between two mounted elements and re-measures whenever anything
nudges layout — so there was always another trigger.

The card-to-dialog morph is now computed by hand: the opener captures the
clicked element's `getBoundingClientRect()`, and `Modal` measures its own final
rect in `useLayoutEffect` (before paint) and springs x/y/scale from one to the
other. Plain motion values, one measurement, no projection, nothing listening
to scroll. The visual is the same; the failure mode cannot recur.

`layoutId` now survives in exactly one place — the navbar pill, where nothing
scrolls and nothing else shares the id.

Historical note, still true, **do not put `layoutScroll` on that inner
element**: It was tried, and it
brought the tearing back — this time only when you pushed *past the end* of the
scroll. The prop makes framer re-project layout children on every scroll event,
including the macOS rubber-band bounce at the boundary, and it is pointless
here because nothing inside that container animates its layout. The scroll area
now uses `overscroll-behavior: none` (not `contain`, which only stops chaining
and leaves the bounce), and `CosmicField` ignores scroll and resize entirely
while a dialog holds the page lock.

Contributing factor: opening a dialog locks body scroll and adds scrollbar
padding, which resizes the body and fired `CosmicField`'s `ResizeObserver`,
re-anchoring every scene mid-interaction. `remeasure()` now bails out while
`document.body.style.overflow === "hidden"`.

**Work rows → card grid.** Full-width rows read well individually, but twelve
of them is a tall list by another name, which defeats the point of V2. Three
columns puts twelve projects in four rows. Filters sit directly under the
heading with per-category counts, so the interaction is visible without
scrolling to find it.

**Background: warp is now velocity-driven.** `SCENES.warp` was 0.85 for the
whole Work section, so the starfield sat permanently streaked and read as
"sliding sideways". Base warp is now near zero and most of it comes from
actual scroll velocity (peak-hold, decay 0.92) — it streaks because you are
moving and settles when you stop. Lateral drift was also halved; it was
competing with the vertical parallax rather than supporting it.

**Wrap seams fade.** Stars wrap around the field and used to blink out at one
edge and reappear at the other — very visible on the bright ones with a glow.
`starPosition` now returns a `fade` multiplier that dissolves them across the
seam. Covered by the headless test, including a star sitting exactly on the
seam.

**Constellations mark section changes.** Crossing into a new section now fires
a shooting star, which draws its constellation. The signature moment became
the transition itself rather than something random. Random spawns dropped from
0.0075 to 0.0032 per frame so the deliberate ones carry weight.

### Outstanding from V2
- Headline metrics in `Hero.jsx` are a judgement call — Abhinav to confirm
  those four are the ones that land in interviews.
- Clicking a stat or "projects from this period" doesn't yet cross-filter
  `Work`. That's the natural next interaction.

## 10b. Original plan (agreed 8 Aug 2026)

Two critical parts, and they are **one design problem, not two** — see the
coupling note below.

### Decisions locked in

| | Decision |
|---|---|
| Interface | **Hybrid.** Screen one shows the whole story at a glance and is fully interactive. Scrolling remains available for long-form depth, but is optional. |
| Devices | **Desktop and mobile equally.** |
| Escape hatch | **Yes** — a visible "plain view" giving the boring, scannable version instantly, alongside the CV download. |
| Content | **Full creative control** — restructure, restyle and rewrite. Abhinav validates wording afterwards. |
| Background | **Keep the Deep Nebula cosmos.** Change the transitions, not the look. |

### The coupling problem

`CosmicField` is driven entirely by scroll position — `phase` comes from which
section is centred in the viewport (`lib/sections.js`). **A one-screen
interface has almost no scroll to read.** So the background must be driven by
interface state instead: what's selected, what's hovered, which panel is open.

This is an improvement, not a compromise: selection is discrete, so scenes can
*snap* with a proper easing curve rather than easing through an exponential
chase. That is the "snappier, timing just right" feeling being asked for. But
it means `lib/sections.js` gets replaced or supplemented by a state-driven
phase source, and that decision has to be made before either part is built.

### Mobile-equal implies one rule

Design the **data model once, render it two ways.** Desktop gets hover plus
click on a timeline rail and chart; mobile gets the same information as a
swipeable stack. If a piece of information can only exist as a hover, it
cannot be in the design.

### Research to do first
- Single-screen / hub portfolio interfaces, and specifically how they degrade
  to mobile
- Interaction cost versus hiring-manager patience — is there real evidence on
  when exploration becomes friction?
- Faceted filtering patterns for a small dataset (12 projects)
- Command palette (⌘K) as a "play" affordance — plausibly very on-brand for a
  data person, needs a mobile answer
- View Transitions API and momentum scrolling, for the snap-and-glide feel

### Build order
1. Research and agree the interface shape concretely (wireframe first)
2. Rework the content model — merge the three Affine roles into one entry with
   a title progression (see §6b; this is the highest-value single change),
   projects into a filterable numbered list, growth as a real chart rather
   than progress bars
3. Build the hybrid screen, mobile alongside desktop, not after
4. Re-drive `CosmicField` from interface state and retune the transitions
5. Plain view + verification pass

## 11. Conventions

- British spelling throughout the copy (per earlier commits).
- Animation timing lives in `lib/motion.js`. Add variants there rather than
  inlining transitions, so sections stay in sync.
- Prefer `.glass-lite` by default; reach for `.glass` only for large, few,
  mostly-static surfaces.
- Every new interactive element needs a keyboard path and a visible focus
  ring (the global `:focus-visible` rule handles the ring).
