import { motion } from "framer-motion"

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">

      {/* Content */}
      <motion.p
        className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to my portfolio
      </motion.p>

      <motion.h1
        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Hi, I'm{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Abhinav Singh
        </span>
      </motion.h1>

      <motion.p
        className="text-xl text-gray-400 max-w-2xl mb-4 leading-relaxed relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Data Analyst with ~3 years of experience across AdTech, product analytics,
        marketing analytics, and business intelligence.
      </motion.p>

      <motion.p
        className="text-gray-500 max-w-xl mb-10 leading-relaxed relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        I turn ambiguous business problems into scalable analytics solutions —
        from ML-powered recommendation engines to automated DSP monitoring pipelines.
      </motion.p>

      <motion.div
        className="flex gap-4 flex-wrap justify-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <a
          href="#projects"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          View Projects
        </a>
        <a
          href="#experience"
          className="border border-gray-600 hover:border-blue-400/50 text-gray-300 hover:text-white px-6 py-3 rounded-full transition-all hover:bg-white/5"
        >
          My Experience
        </a>
        <a
          href="mailto:abhisingh170801@gmail.com"
          className="border border-gray-600 hover:border-blue-400/50 text-gray-300 hover:text-white px-6 py-3 rounded-full transition-all hover:bg-white/5"
        >
          Get in Touch
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 text-gray-600 text-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
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