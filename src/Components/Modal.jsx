import { useEffect, useLayoutEffect, useRef } from "react"
import { animate, motion, useMotionValue } from "framer-motion"

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }

/**
 * Detail dialog.
 *
 * ---------------------------------------------------------------------------
 * Why there is no `layoutId` here any more
 * ---------------------------------------------------------------------------
 * The card-to-dialog morph used to be framer's shared-layout animation. It
 * looked great and was a persistent source of visual tearing, because a shared
 * `layoutId` keeps a live projection between two mounted elements and
 * re-measures whenever anything nudges layout — scrolling the dialog, the page
 * scroll lock resizing the body, and finally the rubber-band bounce at the end
 * of the dialog's own scroll. Each fix moved the glitch rather than removing
 * it, which is the signature of guarding a mechanism instead of deleting it.
 *
 * So the morph is now computed by hand, once:
 *
 *   1. The opener captures the clicked element's bounding rect.
 *   2. On mount, this measures its own final rect (already laid out, because
 *      useLayoutEffect runs before paint).
 *   3. It sets x/y/scale so the dialog *starts* exactly on top of the card,
 *      then springs to identity.
 *
 * Those are plain motion values. Nothing re-measures, nothing listens to
 * scroll, and no projection exists to go stale. The visual is the same and the
 * failure mode is gone.
 *
 * Also note: this component deliberately does NOT render its own
 * <AnimatePresence>. It used to, which meant the parent's `{selected &&
 * <Modal/>}` unmounted it before any exit animation could run.
 *
 * Two modes:
 *   - pass `item` for the standard project/role layout
 *   - pass `title` + `children` for arbitrary content (the About panel)
 *
 * Both share this shell, so the scroll lock, focus trap, Escape handling and
 * morph-from-origin only exist once.
 */
function Modal({ item, onClose, originRect, title, children }) {
  const shellRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)

  // Morph in from wherever the reader clicked.
  useLayoutEffect(() => {
    const el = shellRef.current
    if (!el) return

    if (!originRect) {
      // No origin (keyboard activation, or opened from something unmeasured):
      // a plain rise is a perfectly good fallback.
      scale.set(0.96)
      opacity.set(0)
      animate(scale, 1, SPRING)
      animate(opacity, 1, { duration: 0.2 })
      return
    }

    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return

    const dx = originRect.left + originRect.width / 2 - (r.left + r.width / 2)
    const dy = originRect.top + originRect.height / 2 - (r.top + r.height / 2)
    const s = Math.max(0.25, Math.min(1, originRect.width / r.width))

    x.set(dx)
    y.set(dy)
    scale.set(s)
    opacity.set(0.35)

    const controls = [
      animate(x, 0, SPRING),
      animate(y, 0, SPRING),
      animate(scale, 1, SPRING),
      animate(opacity, 1, { duration: 0.22 }),
    ]
    return () => controls.forEach((c) => c.stop())
  }, [originRect, x, y, scale, opacity])

  // Lock the page behind the dialog, compensating for the scrollbar so the
  // layout doesn't jolt sideways. Restores the *previous* values rather than
  // assuming they were the defaults.
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight

    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [])

  // Escape to close, Tab cycles within the dialog, focus returns on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    shellRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab" || !shellRef.current) return

      const focusables = Array.from(shellRef.current.querySelectorAll(FOCUSABLE))
      if (focusables.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose])

  if (!item && !children) return null

  const heading = title || item?.title || item?.role

  return (
    <motion.div
      // Solid scrim, not a backdrop blur. Blurring a full-screen canvas that
      // repaints at 60fps is the single most expensive thing this page could
      // ask a compositor to do, and it was a direct cause of the tearing.
      className="fixed inset-0 bg-[#02030a]/90 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ overscrollBehavior: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Shell — transform-only motion values, no layout projection. */}
      <motion.div
        ref={shellRef}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        tabIndex={-1}
        style={{ x, y, scale, opacity }}
        // Deliberately NOT the .glass class. Glass brings backdrop-filter, a
        // mask-composite ::before ring and isolation — and nested inside
        // another backdrop-filter, above a 60fps canvas, wrapped around a
        // scroll container, that combination tears at scroll boundaries where
        // the browser re-evaluates layer promotion. This is the plain solid
        // panel the dialog originally had, plus a real border.
        //
        // No `will-change` either: on an element that already has its own
        // layer from the transform, it only changes layering in ways that
        // reintroduced flashing.
        className="bg-[#0d1220] border border-white/12 shadow-2xl shadow-black/60 rounded-2xl max-w-2xl w-full max-h-[85vh] max-h-[85dvh] overflow-hidden outline-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll area: a plain div on purpose. Nothing framer-managed lives
            here, so scrolling it — including past either end — cannot disturb
            anything above it. `overscroll-behavior: none` also stops the
            elastic bounce rather than only the chaining. */}
        <div className="modal-scroll overflow-y-auto p-6 sm:p-8" style={{ overscrollBehavior: "none" }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{heading}</h2>
              {item?.company && (
              <p className="text-blue-400 mt-1">
                {item.company} {item.team ? `· ${item.team}` : ""}
              </p>
              )}
              {item?.period && <p className="text-gray-400 text-sm mt-1">{item.period}</p>}
              {item?.status && (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2.5 py-0.5 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {item.status}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-gray-400 hover:text-white text-2xl leading-none hover:bg-white/10 w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0"
            >
              ✕
            </button>
          </div>

          {children}

          {/* Impact stats */}
          {item?.stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {item.stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center bg-white/[0.05] border border-white/[0.09]"
                >
                  <p className="text-xl font-bold text-blue-400">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {(item?.summary || item?.description) && (
            <p className="text-gray-300 mb-6 leading-relaxed">{item.summary || item.description}</p>
          )}

          {item?.details && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">What I built</h3>
              <ul className="space-y-2">
                {item.details.map((d, i) => (
                  <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                    <span className="text-blue-400 mt-0.5 shrink-0">▹</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item?.highlights && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Key contributions</h3>
              <ul className="space-y-2">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                    <span className="text-blue-400 mt-0.5 shrink-0">▹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item?.impact && (
            <div className="mb-6 rounded-xl p-4 bg-blue-950/35 border border-blue-800/35">
              <h3 className="text-blue-400 font-semibold mb-2">Impact</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.impact}</p>
            </div>
          )}

          {item?.tags && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Modal
