// Custom eased anchor scrolling.
//
// The browser's native `scroll-behavior: smooth` uses a fixed curve and a
// fixed-ish duration, which makes a short hop and a full-page jump feel
// completely different. This scales duration with distance and uses an
// ease-in-out curve, so every nav click lands with the same weight.

const NAV_OFFSET = 96 // clearance for the fixed navbar

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

let activeScroll = null

export function scrollToId(id) {
  if (typeof window === "undefined") return

  const target =
    id && id !== "#" && id !== "top" ? document.getElementById(id) : null

  const destination = target
    ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
    : 0

  const start = window.scrollY
  const distance = destination - start

  if (Math.abs(distance) < 2) return

  if (prefersReducedMotion()) {
    window.scrollTo({ top: destination, behavior: "auto" })
    return
  }

  // Cancel any scroll already in flight so rapid nav clicks don't fight.
  if (activeScroll) cancelAnimationFrame(activeScroll)

  // Longer trips take longer, but within sane bounds.
  const duration = Math.min(1100, Math.max(420, Math.abs(distance) * 0.45))
  const startTime = performance.now()

  const step = (now) => {
    const elapsed = now - startTime
    const t = Math.min(1, elapsed / duration)
    window.scrollTo({ top: start + distance * easeInOutCubic(t), behavior: "auto" })
    if (t < 1) {
      activeScroll = requestAnimationFrame(step)
    } else {
      activeScroll = null
      // Move keyboard focus so the jump is real for screen reader and
      // keyboard users, not just a visual scroll.
      if (target) {
        target.setAttribute("tabindex", "-1")
        target.focus({ preventScroll: true })
      }
    }
  }

  activeScroll = requestAnimationFrame(step)
}

/** Click handler for in-page anchors. Attach to <a href="#section">. */
export function handleAnchorClick(e, id) {
  e.preventDefault()
  scrollToId(id)
  if (id && id !== "top") {
    window.history.replaceState(null, "", `#${id}`)
  } else {
    window.history.replaceState(null, "", window.location.pathname)
  }
}
