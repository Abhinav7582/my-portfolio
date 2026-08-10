import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { handleAnchorClick, scrollToId } from "../lib/scroll"
import { CONTAINER } from "../lib/layout"

/**
 * Hero — kept largely as it was, on purpose.
 *
 * This is the one screen that already tested well with a real reader, so V2
 * preserved it rather than replacing it with something cleverer. The only
 * substantive addition is the metrics strip: portfolio-review research puts
 * the first-impression scan at roughly seven seconds, and those four numbers
 * are the fastest way to spend them well.
 */

const metrics = [
  { value: "3+", label: "years in AdTech & analytics" },
  { value: "15+", label: "production pipelines" },
  { value: "~$82K", label: "media spend identified" },
  { value: "60%", label: "pipeline runtime cut" },
]

function Hero() {
  return (
    <section
      id="hero"
      className={`relative min-h-screen min-h-[100svh] flex flex-col justify-center px-6 md:px-10 pt-28 pb-16 ${CONTAINER} mx-auto`}
    >
      <div className="grid md:grid-cols-[auto_minmax(0,1fr)] items-center gap-10 md:gap-16 text-center md:text-left max-w-6xl mx-auto w-full">
        {/* Photo with orbit rings */}
        <motion.div
          className="relative shrink-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 -m-6 rounded-full border border-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
          </motion.div>

          <motion.div
            className="absolute inset-0 -m-3 rounded-full border border-cyan-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </motion.div>

          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-110" />

          <div className="relative w-44 h-44 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-blue-500/20">
            {/* WebP first — the original JPEG was 605KB for a 240px avatar.
                Explicit dimensions prevent layout shift while it loads. */}
            <picture>
              <source srcSet="/profile.webp" type="image/webp" />
              <img
                src="/profile.jpg"
                alt="Abhinav Singh"
                width="512"
                height="512"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col items-center md:items-start w-full">
          <motion.p
            className="text-blue-400 text-sm font-medium tracking-[0.18em] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to my portfolio
          </motion.p>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Hi, I&apos;m{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Abhinav Singh
            </span>
          </motion.h1>

          <motion.div
            className="text-lg md:text-xl text-blue-300 mb-4 h-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TypeAnimation
              sequence={[
                "Data Analyst · AdTech · Product Analytics",
                2000,
                "Building product monitoring systems and automation pipelines",
                2000,
                "Turning ambiguous data problems into scalable systems",
                2000,
                "SQL · Python · PySpark · Power BI · Databricks",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          <motion.p
            className="text-gray-400 max-w-2xl mb-8 leading-relaxed text-base md:text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            Data Analyst working across AdTech analytics and data engineering. I solve ambiguous
            problems end to end — from building reliable pipelines to delivering insights that
            drive better decisions.
          </motion.p>

          <motion.div
            className="flex gap-3 flex-wrap justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <a
              href="#work"
              onClick={(e) => handleAnchorClick(e, "work")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              View work
            </a>
            <a
              href="/Abhinav_Singh_CV.pdf"
              download
              className="glass glass-hover text-blue-300 hover:text-blue-200 px-5 py-2.5 rounded-full transition-all"
            >
              <span className="relative z-[2]">↓ Download CV</span>
            </a>
            <a
              href="mailto:abhisingh170801@gmail.com"
              className="glass glass-hover text-gray-300 hover:text-white px-5 py-2.5 rounded-full transition-all"
            >
              <span className="relative z-[2]">Get in touch</span>
            </a>
          </motion.div>

          {/* Metrics — the seven-second layer.
              Deliberately inside the text column, not a full-width row below
              the grid. Spanning the whole container made the first number sit
              under the photo instead of under the headline, which read as
              misaligned. */}
          <motion.div
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/[0.08] text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
          >
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-2xl md:text-3xl font-bold text-blue-400 tracking-tight">
                  {m.value}
                </p>
                <p className="text-gray-400 text-xs mt-1 leading-snug">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToId("growth")}
        aria-label="Scroll to Growth section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted hover:text-blue-400 text-sm transition-colors hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.span
          className="block"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓ scroll
        </motion.span>
      </motion.button>
    </section>
  )
}

export default Hero
