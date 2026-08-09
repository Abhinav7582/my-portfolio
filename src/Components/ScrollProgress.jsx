import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Hairline progress bar pinned to the top of the viewport.
 *
 * Spring-damped rather than bound directly to scrollYProgress — a raw binding
 * tracks trackpad jitter one-to-one and looks nervous.
 */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]"
    />
  )
}

export default ScrollProgress
