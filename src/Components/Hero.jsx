import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16 pt-28 md:pt-20 gap-10 md:gap-16 max-w-6xl mx-auto overflow-hidden">

      {/* Left — Photo with orbit ring */}
      <motion.div
        className="relative shrink-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Rotating orbit rings */}
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

        {/* Glow behind photo */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-110" />

        {/* Photo */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-blue-500/20">
          <img
            src="/Abhi Photo.jpeg"
            alt="Abhinav Singh"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Right — Text content */}
      <div className="flex flex-col items-center md:items-start">
        <motion.p
          className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to my portfolio
        </motion.p>

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Hi, I'm{" "}
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
              "Data Analyst · AdTech & Product Analytics",
              2000,
              "Building automated DSP monitoring pipelines",
              2000,
              "Turning ambiguous problems into scalable solutions",
              2000,
              "SQL · Python · PySpark · Power BI · Tableau",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.p
          className="text-gray-400 max-w-md mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          ~3 years of experience across AdTech, product analytics,
          marketing analytics, and business intelligence.
        </motion.p>

        <motion.div
          className="flex gap-3 flex-wrap justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href="#projects"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            View Projects
          </a>
          <a
            href="/Abhinav_Singh_-_CV.pdf"
            download
            className="border border-blue-600/50 hover:border-blue-400 text-blue-400 hover:text-blue-300 px-5 py-2.5 rounded-full transition-all hover:bg-blue-950/30 flex items-center gap-2"
          >
            ⬇ Download CV
          </a>
          <a
            href="mailto:abhisingh170801@gmail.com"
            className="border border-gray-600 hover:border-blue-400/50 text-gray-300 hover:text-white px-5 py-2.5 rounded-full transition-all hover:bg-white/5"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓ scroll
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero