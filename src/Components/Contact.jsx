import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewport } from "../lib/motion"
import { SECTION, EYEBROW } from "../lib/layout"

/**
 * Contact — with the publication folded in.
 *
 * One paper did not justify its own full screen. It now sits as a single row
 * above the contact block, which keeps it discoverable without costing a
 * scroll.
 */

const publication = {
  title:
    "Modelling Autonomous Driving and Obstacle Avoidance using Multi-Modal Fusion Transformer Framework",
  journal: "IJISRT — International Journal of Innovative Science and Research Technology",
  meta: "Volume 8 · Issue 2 · February 2023 · Article ID IJISRT23FEB493",
  blurb:
    "A Multi-Modal Fusion Transformer integrating camera and LiDAR data to improve trajectory prediction, demonstrated through lane-detection simulation. Recognised by IJISRT and the Karnataka State Council for its traffic applications.",
  link: "https://www.ijisrt.com/modelling-autonomous-driving-and-obstacle-avoidance-using-multimodal-fusion-transformer-framework",
}

function Contact() {
  return (
    <section id="contact" className={SECTION}>
      {/* Publication */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
        <p className={EYEBROW}>Research</p>
        <a
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="glass glass-tint glass-hover rounded-2xl p-6 block group"
        >
          <div className="relative z-[2]">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-white font-semibold leading-snug group-hover:text-blue-300 transition-colors">
                {publication.title}
              </h3>
              <span className="text-xs text-blue-300 border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                2023
              </span>
            </div>
            <p className="text-blue-400/70 text-xs">{publication.journal}</p>
            <p className="text-muted text-[11px] mt-0.5">{publication.meta}</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">{publication.blurb}</p>
            <p className="text-blue-400 text-sm mt-4">Read the paper ↗</p>
          </div>
        </a>
      </motion.div>

      {/* Contact */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-20 text-center"
      >
        <motion.p variants={fadeUp} className={EYEBROW}>
          Get in touch
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-4xl font-bold text-white mb-4">
          Let&apos;s talk
        </motion.h2>
        <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed max-w-xl mx-auto mb-10">
          Always open to discussing data, analytics, new opportunities — or just a good
          conversation about a hard problem.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:abhisingh170801@gmail.com"
            className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-full font-medium transition-colors"
          >
            Send an email
          </a>
          <a
            href="https://www.linkedin.com/in/abhinav-singh-534012213/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover text-gray-300 hover:text-blue-300 px-7 py-3 rounded-full transition-colors"
          >
            <span className="relative z-[2]">LinkedIn ↗</span>
          </a>
          <a
            href="https://github.com/Abhinav7582"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover text-gray-300 hover:text-blue-300 px-7 py-3 rounded-full transition-colors"
          >
            <span className="relative z-[2]">GitHub ↗</span>
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="border-t border-white/[0.08] mt-16 pt-8 text-muted text-sm"
        >
          <p>Designed &amp; built by Abhinav Singh · {new Date().getFullYear()}</p>
          <p className="text-muted text-xs mt-2">
            React &amp; Vite, Tailwind, framer-motion. Background is hand-written Canvas 2D.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Contact
