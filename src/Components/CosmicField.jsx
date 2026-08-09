import { useEffect, useRef } from "react"
import { measureAnchors, phaseFromScroll, intensityFromPhase } from "../lib/sections"
import {
  sceneAt,
  starPosition,
  constellationProgress,
  CONSTELLATION,
  CONSTELLATION_LIFE,
} from "../lib/cosmos"

/**
 * Deep Nebula — the background.
 *
 * Canvas 2D, deliberately. A WebGL version was attempted and abandoned: GLSL
 * cannot be compiled or verified outside a real browser, so every fix was a
 * guess. Canvas 2D has no compile step and no driver variance.
 *
 * The design lesson that took a few rounds to learn: what made an earlier
 * version feel "jumbled" was not drama, it was HIGH FREQUENCY. Thousands of
 * small bright dots behind a headline reads as clutter. A few very large,
 * slow, coherent forms reads as cinema and barely touches legibility.
 *
 * The signature moment: a shooting star streaks across the field, quietly
 * collecting the stars it passes near. When it burns out, those stars trace
 * themselves into a constellation, hold, and dissolve. One gesture, no cut —
 * the shooting star *becomes* the constellation.
 */

const TAU = Math.PI * 2

/** Pre-rendered soft glow sprite — far cheaper than a gradient per star per frame. */
function makeGlowSprite(size) {
  const c = document.createElement("canvas")
  c.width = size
  c.height = size
  const g = c.getContext("2d")
  if (!g) return c
  const r = size / 2
  const grad = g.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.18, "rgba(215,235,255,0.55)")
  grad.addColorStop(0.5, "rgba(160,200,255,0.14)")
  grad.addColorStop(1, "rgba(140,190,255,0)")
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

function CosmicField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let reduced = motionQuery.matches
    const onMotionChange = (e) => {
      reduced = e.matches
    }

    let cssW = window.innerWidth
    let cssH = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const glow = makeGlowSprite(64)

    const resize = () => {
      cssW = window.innerWidth
      cssH = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // ---- stars -------------------------------------------------------------
    const isMobile = window.innerWidth < 768
    const STAR_COUNT = reduced ? 90 : isMobile ? 150 : 320
    const stars = []
    for (let i = 0; i < STAR_COUNT; i++) {
      // Bias z so most stars sit far away and only a handful are close and
      // bright — that contrast is what produces depth.
      stars.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.pow(Math.random(), 2.1),
        tw: Math.random() * TAU,
        twSpeed: 0.6 + Math.random() * 1.6,
      })
    }
    const bright = [...stars].sort((a, b) => b.z - a.z).slice(0, 20)
    // Screen positions, recomputed once per frame and reused by the shooting
    // stars and constellations rather than recalculated per consumer.
    const pos = new Float32Array(STAR_COUNT * 2)

    // ---- nebula clouds -----------------------------------------------------
    const clouds = [
      { x: 0.26, y: 0.34, r: 0.58, hue: 0, a: 0.20, sp: 0.031, ph: 0.0 },
      { x: 0.74, y: 0.56, r: 0.50, hue: 1, a: 0.17, sp: 0.024, ph: 1.7 },
      { x: 0.54, y: 0.18, r: 0.42, hue: 2, a: 0.13, sp: 0.019, ph: 3.1 },
      { x: 0.14, y: 0.74, r: 0.46, hue: 1, a: 0.12, sp: 0.027, ph: 4.4 },
      { x: 0.86, y: 0.16, r: 0.38, hue: 0, a: 0.11, sp: 0.022, ph: 5.6 },
    ]

    // ---- shooting stars & constellations -----------------------------------
    let shooting = []
    let constellations = []

    const spawnShootingStar = () => {
      const angle = Math.PI * (0.13 + Math.random() * 0.14) // gentle downward diagonal
      const speed = (Math.min(cssW, cssH) * (0.55 + Math.random() * 0.35)) / 60
      const fromLeft = Math.random() > 0.35
      return {
        x: fromLeft ? -cssW * 0.05 : cssW * (0.3 + Math.random() * 0.6),
        y: cssH * (0.04 + Math.random() * 0.42),
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : 1),
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.006 + Math.random() * 0.004,
        len: 70 + Math.random() * 90,
        collected: [],
      }
    }

    // ---- scroll ------------------------------------------------------------
    let anchors = measureAnchors()
    let targetPhase = phaseFromScroll(anchors)
    let phase = targetPhase
    let targetIntensity = intensityFromPhase(targetPhase)
    let intensity = targetIntensity
    let scrollFrac = 0

    /** True while a dialog has the page scroll locked. */
    const dialogOpen = () => document.body.style.overflow === "hidden"

    const readScroll = () => {
      // Fully decouple the background from anything happening while a dialog
      // is open. Rubber-banding past the end of a locked page can still emit
      // scroll events with transient values, and reacting to those made the
      // field lurch behind the card.
      if (dialogOpen()) return
      targetPhase = phaseFromScroll(anchors)
      targetIntensity = intensityFromPhase(targetPhase)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      scrollFrac = scrollable > 0 ? window.scrollY / scrollable : 0
    }
    const remeasure = () => {
      // Opening a dialog locks body scroll and adds scrollbar padding, which
      // resizes the body and would otherwise re-anchor every scene mid-
      // interaction — the page appeared to tear while scrolling a modal.
      if (dialogOpen()) return
      anchors = measureAnchors()
      readScroll()
    }

    // ---- loop --------------------------------------------------------------
    let raf = null
    let running = true
    const start = performance.now()

    // Warp is driven by how fast you are actually moving, not by which section
    // you happen to be in. Peak-hold with decay so a flick streaks and then
    // settles, instead of the field sitting permanently smeared.
    let prevScrollFrac = 0
    let scrollVel = 0
    // Crossing into a new section fires a shooting star, which then draws its
    // constellation. That turns the signature moment into the transition
    // itself rather than something that happens at random.
    let lastSection = -1

    const draw = () => {
      // While a dialog is open the field is completely hidden behind a solid
      // scrim, so drawing it is pure waste — and a canvas repainting at 60fps
      // underneath a dialog is a compositing cost that showed up as tearing.
      // Keep the loop alive (cheap) so it resumes the instant the dialog closes.
      if (dialogOpen()) {
        if (running) raf = requestAnimationFrame(draw)
        return
      }

      const t = reduced ? 0 : (performance.now() - start) / 1000

      // Snappier than the original 0.075 — sections are fewer and further
      // apart now, so a faster chase reads as responsive rather than twitchy.
      const k = reduced ? 1 : 0.11
      phase += (targetPhase - phase) * k
      intensity += (targetIntensity - intensity) * k

      const dsf = Math.abs(scrollFrac - prevScrollFrac)
      prevScrollFrac = scrollFrac
      scrollVel = Math.max(dsf, scrollVel * 0.92)

      const scene = sceneAt(phase)
      const cx = cssW / 2
      const cy = cssH / 2

      const settled = Math.round(phase)
      if (settled !== lastSection) {
        if (lastSection !== -1 && !reduced && shooting.length < 3) {
          shooting.push(spawnShootingStar())
        }
        lastSection = settled
      }

      // --- deep space base ---
      const bg = ctx.createRadialGradient(cx, cy * 0.85, 0, cx, cy, Math.max(cssW, cssH) * 0.9)
      bg.addColorStop(0, "#0a1024")
      bg.addColorStop(0.45, "#050813")
      bg.addColorStop(1, "#01020a")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, cssW, cssH)

      ctx.globalCompositeOperation = "lighter"

      // --- nebula clouds ---
      for (const c of clouds) {
        const hue = scene.hues[c.hue]
        const bx = (c.x + Math.sin(t * c.sp + c.ph) * 0.045) * cssW
        const by = (c.y + Math.cos(t * c.sp * 1.2 + c.ph) * 0.035) * cssH
        const rad = c.r * Math.max(cssW, cssH) * 0.85
        const a = c.a * intensity
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, rad)
        g.addColorStop(0, `hsla(${hue}, 82%, 58%, ${a})`)
        g.addColorStop(0.4, `hsla(${hue}, 82%, 50%, ${a * 0.4})`)
        g.addColorStop(0.72, `hsla(${hue}, 82%, 45%, ${a * 0.12})`)
        g.addColorStop(1, `hsla(${hue}, 82%, 45%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(bx - rad, by - rad, rad * 2, rad * 2)
      }

      // --- galactic plane ---
      if (scene.band > 0.01) {
        const bandY = cssH * 0.52
        const bh = cssH * 0.34
        const g = ctx.createLinearGradient(0, bandY - bh, 0, bandY + bh)
        const a = scene.band * 0.16 * intensity
        g.addColorStop(0, `hsla(${scene.hues[0]}, 80%, 60%, 0)`)
        g.addColorStop(0.5, `hsla(${scene.hues[0]}, 80%, 66%, ${a})`)
        g.addColorStop(1, `hsla(${scene.hues[1]}, 80%, 60%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, bandY - bh, cssW, bh * 2)
      }

      // --- stars ---
      const velWarp = Math.min(0.75, scrollVel * 45)
      const warpAmount = Math.min(1, scene.warp + velWarp)
      const warpLen = warpAmount * Math.min(cssW, cssH) * 0.1
      for (let i = 0; i < STAR_COUNT; i++) {
        const st = stars[i]
        const { px, py, par, fade } = starPosition(st, scene, t, scrollFrac, cssW, cssH)
        pos[i * 2] = px
        pos[i * 2 + 1] = py

        const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * st.twSpeed + st.tw)
        const alpha = (0.18 + st.z * 0.75) * twinkle * intensity * fade
        if (alpha < 0.01) continue
        const size = 0.5 + st.z * 2.0

        if (warpLen > 1.2) {
          const dx = px - cx
          const dy = py - cy
          const d = Math.hypot(dx, dy) || 1
          const len = warpLen * par
          ctx.strokeStyle = `rgba(214,234,255,${alpha})`
          ctx.lineWidth = size
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px - (dx / d) * len, py - (dy / d) * len)
          ctx.stroke()
        } else {
          if (st.z > 0.55) {
            const gs = (6 + st.z * 26) * (0.7 + twinkle * 0.3)
            ctx.globalAlpha = alpha * 0.85
            ctx.drawImage(glow, px - gs / 2, py - gs / 2, gs, gs)
            ctx.globalAlpha = 1
          }
          ctx.fillStyle = `rgba(226,240,255,${alpha})`
          ctx.beginPath()
          ctx.arc(px, py, size, 0, TAU)
          ctx.fill()
        }
      }

      // --- shooting stars, collecting as they go ---
      if (!reduced) {
        const rate = 0.0032 * scene.shoot
        if (Math.random() < rate && shooting.length < 2) shooting.push(spawnShootingStar())

        const capture = Math.min(cssW, cssH) * CONSTELLATION.captureRadius
        const capture2 = capture * capture

        shooting = shooting.filter((s) => {
          s.x += s.vx
          s.y += s.vy
          s.life -= s.decay

          // Collect nearby stars along the path — these become the constellation.
          if (s.collected.length < CONSTELLATION.maxStars) {
            for (let i = 0; i < STAR_COUNT; i++) {
              if (s.collected.includes(i)) continue
              const dx = pos[i * 2] - s.x
              const dy = pos[i * 2 + 1] - s.y
              if (dx * dx + dy * dy < capture2) {
                s.collected.push(i)
                if (s.collected.length >= CONSTELLATION.maxStars) break
              }
            }
          }

          const dead = s.life <= 0 || s.x > cssW * 1.1 || s.y > cssH * 1.1
          if (dead) {
            // The burnout seeds the constellation — one gesture, no cut.
            if (s.collected.length >= CONSTELLATION.minStars) {
              constellations.push({ ids: s.collected.slice(), born: t })
            }
            return false
          }

          const tailX = s.x - (s.vx / (Math.hypot(s.vx, s.vy) || 1)) * s.len
          const tailY = s.y - (s.vy / (Math.hypot(s.vx, s.vy) || 1)) * s.len
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
          const a = Math.max(0, s.life) * intensity
          grad.addColorStop(0, `rgba(235,246,255,${a})`)
          grad.addColorStop(0.35, `rgba(150,205,255,${a * 0.5})`)
          grad.addColorStop(1, "rgba(150,205,255,0)")
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()

          // bright head
          ctx.globalAlpha = a
          ctx.drawImage(glow, s.x - 9, s.y - 9, 18, 18)
          ctx.globalAlpha = 1
          return true
        })

        // --- constellations tracing themselves in ---
        const maxEdge = Math.min(cssW, cssH) * 0.45 // guards against wrapped stars
        constellations = constellations.filter((c) => {
          const { drawn, alpha, done } = constellationProgress(t - c.born)
          if (done || t - c.born > CONSTELLATION_LIFE + 0.5) return false

          const n = c.ids.length
          const edges = n - 1
          const progress = drawn * edges
          const a = alpha * intensity

          ctx.lineWidth = 1.15
          for (let e = 0; e < edges; e++) {
            const f = Math.max(0, Math.min(1, progress - e))
            if (f <= 0) break
            const i0 = c.ids[e] * 2
            const i1 = c.ids[e + 1] * 2
            const x0 = pos[i0]
            const y0 = pos[i0 + 1]
            const x1 = pos[i1]
            const y1 = pos[i1 + 1]
            if (Math.hypot(x1 - x0, y1 - y0) > maxEdge) continue
            ctx.strokeStyle = `rgba(150,205,255,${a * 0.55})`
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f)
            ctx.stroke()
          }

          // Nodes brighten as the line reaches them.
          for (let i = 0; i < n; i++) {
            const lit = Math.max(0, Math.min(1, progress - (i - 1)))
            if (lit <= 0) continue
            const px = pos[c.ids[i] * 2]
            const py = pos[c.ids[i] * 2 + 1]
            ctx.globalAlpha = a * lit * 0.9
            ctx.drawImage(glow, px - 11, py - 11, 22, 22)
            ctx.globalAlpha = 1
            ctx.fillStyle = `rgba(226,244,255,${a * lit})`
            ctx.beginPath()
            ctx.arc(px, py, 1.6, 0, TAU)
            ctx.fill()
          }
          return true
        })
      }

      // --- persistent links between the brightest stars ---
      if (scene.links > 0.02) {
        const maxD = Math.min(cssW, cssH) * 0.3
        ctx.lineWidth = 1
        for (let i = 0; i < bright.length; i++) {
          const A = starPosition(bright[i], scene, t, scrollFrac, cssW, cssH)
          for (let j = i + 1; j < bright.length; j++) {
            const B = starPosition(bright[j], scene, t, scrollFrac, cssW, cssH)
            const d = Math.hypot(A.px - B.px, A.py - B.py)
            if (d >= maxD) continue
            const a = (1 - d / maxD) * 0.26 * scene.links * intensity
            if (a < 0.005) continue
            ctx.strokeStyle = `rgba(150,200,255,${a})`
            ctx.beginPath()
            ctx.moveTo(A.px, A.py)
            ctx.lineTo(B.px, B.py)
            ctx.stroke()
          }
        }
      }

      // --- central core ---
      if (scene.core > 0.02) {
        const pulse = reduced ? 1 : 0.9 + 0.1 * Math.sin(t * 0.7)
        const rad = Math.min(cssW, cssH) * (0.16 + scene.core * 0.3) * pulse
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const a = scene.core * 0.34 * intensity
        g.addColorStop(0, `hsla(${scene.hues[2]}, 95%, 82%, ${a})`)
        g.addColorStop(0.3, `hsla(${scene.hues[1]}, 90%, 68%, ${a * 0.35})`)
        g.addColorStop(1, `hsla(${scene.hues[1]}, 90%, 65%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }

      ctx.globalCompositeOperation = "source-over"

      // --- readability well ---
      // Dim only the middle, where the content column lives. Drama at the
      // edges, calm behind the words — this is what lets intensity sit near 1.
      const wellW = Math.min(cssW * 0.62, 980)
      const wellH = cssH * 0.92
      const wg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(wellW, wellH))
      wg.addColorStop(0, "rgba(2,3,10,0.62)")
      wg.addColorStop(0.42, "rgba(2,3,10,0.42)")
      wg.addColorStop(0.75, "rgba(2,3,10,0.12)")
      wg.addColorStop(1, "rgba(2,3,10,0)")
      ctx.fillStyle = wg
      ctx.fillRect(0, 0, cssW, cssH)

      // --- cinematic vignette ---
      const vg = ctx.createLinearGradient(0, 0, 0, cssH)
      vg.addColorStop(0, "rgba(1,2,8,0.55)")
      vg.addColorStop(0.22, "rgba(1,2,8,0)")
      vg.addColorStop(0.78, "rgba(1,2,8,0)")
      vg.addColorStop(1, "rgba(1,2,8,0.6)")
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, cssW, cssH)

      if (running) raf = requestAnimationFrame(draw)
    }

    // ---- listeners ---------------------------------------------------------
    let resizeTimer = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        remeasure()
      }, 150)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        if (raf) cancelAnimationFrame(raf)
        raf = null
      } else if (!running) {
        running = true
        draw()
      }
    }

    const observer = new ResizeObserver(() => remeasure())
    observer.observe(document.body)

    resize()
    remeasure()
    draw()

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", readScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    motionQuery.addEventListener("change", onMotionChange)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      observer.disconnect()
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", readScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      motionQuery.removeEventListener("change", onMotionChange)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[#01020a]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

export default CosmicField
