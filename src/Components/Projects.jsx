import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { projects } from "../Data/projects"
import Modal from "./Modal"

function TiltCard({ children, onClick, featured }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [5, -5])
  const rotateY = useTransform(x, [-50, 50], [-5, 5])

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
      whileHover={{ scale: 1.03 }}
      className={`bg-white/[0.03] backdrop-blur-md border rounded-2xl p-6 cursor-pointer hover:bg-white/[0.06] transition-all group flex flex-col h-full shadow-xl shadow-black/20 ${
        featured
          ? "border-blue-500/30 hover:border-blue-500/50"
          : "border-white/10 hover:border-blue-500/40"
      }`}
    >
      {children}
    </motion.div>
  )
}

function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="projects" className="py-24 px-6 max-w-screen-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-3">What I've Built</p>
        <h2 className="text-4xl font-bold text-white">Projects</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="h-full"
          >
            <TiltCard onClick={() => setSelected(project)} featured={project.featured}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-blue-400 bg-blue-950/50 border border-blue-800/40 px-3 py-1 rounded-full">
                  {project.company}
                </span>
                <motion.span
                  className="text-gray-600 group-hover:text-blue-400 transition-colors text-lg"
                  whileHover={{ rotate: 45, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ↗
                </motion.span>
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
              </div>

              {project.status && (
                <span className="inline-flex items-center gap-1.5 self-start text-[11px] text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2.5 py-0.5 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {project.status}
                </span>
              )}

              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                {project.oneliner}
              </p>

              <div className="flex gap-2 flex-wrap mb-4">
                {project.stats.map((stat, j) => (
                  <div key={j} className="bg-gray-800/80 rounded-lg px-3 py-1.5">
                    <span className="text-blue-400 font-bold text-sm">{stat.value}</span>
                    <span className="text-gray-500 text-xs ml-1.5">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag, j) => (
                  <span key={j} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-gray-600 text-xs px-2.5 py-1">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default Projects