// Shared motion vocabulary.
//
// Previously every list animated with `delay: i * 0.1`, which meant a 12-item
// grid finished 1.2s after it entered view — that reads as lag, not stagger.
// Parent-driven `staggerChildren` keeps the cascade but caps the total, and
// keeps timing consistent across every section.

export const EASE_OUT = [0.22, 1, 0.36, 1] // gentle overshoot-free deceleration
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

/** Standard section viewport trigger. */
export const viewport = { once: true, amount: 0.15, margin: "0px 0px -80px 0px" }

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/**
 * Parent container that cascades its children.
 * @param {number} stagger  gap between children
 * @param {number} delay    lead-in before the first child
 */
export const staggerContainer = (stagger = 0.07, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})

/** Card entrance — a touch of scale so it feels like it arrives, not slides. */
export const cardIn = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}
