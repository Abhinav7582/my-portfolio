import { useState, useRef, useEffect } from "react"
import { motion, useInView, useMotionValue, useTransform } from "framer-motion"
import { experience } from "../Data/experience"
import Modal from "./Modal"

// Animated counter hook
function useCounter(target, inView) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])
  return count
}

// 3D tilt card
function TiltCard({ children, onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [4, -4])
  const rotateY = useTransform(x, [-50, 50], [-4, 4])

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-blue-500/40 hover:bg-white/[0.06] transition-all group shadow-xl shadow-black/20"
    >
      {children}
    </motion.div>
  )
}

// Stat badge with counter
function StatBadge({ value, label, inView }) {
  const isNumber = /[\d.]+/.test(value)
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0
  const prefix = value.match(/^[^0-9]*/)?.[0] || ""
  const suffix = value.match(/[^0-9.]+$/)?.[0] || ""
  const count = useCounter(isNumber ? numericPart : 0, inView)

  return (
    <div className="bg-gray-800/80 rounded-lg px-3 py-1.5 text-center">
      <span className="text-blue-400 font-bold text-sm">
        {isNumber ? `${prefix}${count}${suffix}` : value}
      </span>
      <span className="text-gray-500 text-xs ml-2">{label}</span>
    </div>
  )
}

function Experience() {
  const [selected, setSelected] = useState(null)
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-3">Where I've Worked</p>
        <h2 className="text-4xl font-bold text-white">Experience</h2>
      </motion.div>

      <div className="relative">
        {/* Animated timeline line */}
        <motion.div
          className="absolute left-6 top-0 w-px bg-gradient-to-b from-blue-500 via-blue-400 to-transparent hidden md:block"
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Static background line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800 hidden md:block" />

        <div className="space-y-6">
          {experience.map((exp, i) => {
            const cardRef = useRef(null)
            const cardInView = useInView(cardRef, { once: true })

            return (
              <motion.div
                key={exp.id}
                ref={cardRef}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="md:pl-16 relative"
              >
                {/* Animated timeline dot */}
                <motion.div
                  className="absolute left-3.5 top-6 w-5 h-5 rounded-full bg-gray-950 border-2 border-blue-500 hidden md:flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </motion.div>

                {/* Connector line from dot to card */}
                <motion.div
                  className="absolute left-[26px] top-[26px] h-px bg-gradient-to-r from-blue-500/50 to-transparent hidden md:block"
                  initial={{ width: 0 }}
                  whileInView={{ width: "40px" }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 0.4 }}
                />

                <TiltCard onClick={() => setSelected(exp)}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 text-sm">{exp.company} · {exp.team}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-400 text-sm">{exp.period}</p>
                      <p className="text-gray-600 text-xs">{exp.location}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.summary}</p>

                  <div className="flex gap-3 flex-wrap mb-4">
                    {exp.stats.map((stat, j) => (
                      <StatBadge key={j} value={stat.value} label={stat.label} inView={cardInView} />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, j) => (
                      <span key={j} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-xs mt-4 group-hover:text-blue-400/60 transition-colors">
                    Click to see full details →
                  </p>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default Experience