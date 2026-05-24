import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"

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

      {/* Typing animation */}
      <motion.div
        className="text-xl text-gray-300 max-w-2xl mb-4 leading-relaxed relative z-10 h-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <TypeAnimation
          sequence={[
            "Data Analyst · AdTech & Product Analytics",
            2000,
            "Building Automated Monitoring Pipelines",
            2000,
            "Turning Ambiguous Problems into Scalable Solutions",
            2000,
            "SQL · Python · Pyspark · Git · NLP · Dashboarding ",
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="text-blue-300"
        />
      </motion.div>

      <motion.p
        className="text-gray-500 max-w-xl mb-10 leading-relaxed relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        ~3 years of experience across AdTech, product analytics,
        marketing analytics, and business intelligence.
      </motion.p>

      <motion.div
        className="flex gap-4 flex-wrap justify-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
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
            href="/Abhinav_Singh_-_CV.pdf"
            download
            className="border border-blue-600/50 hover:border-blue-400 text-blue-400 hover:text-blue-300 px-6 py-3 rounded-full transition-all hover:bg-blue-950/30 flex items-center gap-2"
        >
            ⬇ Download CV
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