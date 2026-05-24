import { useState } from "react"
import { motion } from "framer-motion"
import { projects } from "../Data/projects"
import Modal from "./Modal"

function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => setSelected(project)}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-600/50 hover:bg-gray-800/80 transition-all group flex flex-col"
          >
            {/* Company badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-blue-400 bg-blue-950/50 border border-blue-800/40 px-3 py-1 rounded-full">
                {project.company}
              </span>
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-lg">↗</span>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>

            {/* One-liner */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
              {project.oneliner}
            </p>

            {/* Stats */}
            <div className="flex gap-2 flex-wrap mb-4">
              {project.stats.map((stat, j) => (
                <div key={j} className="bg-gray-800 rounded-lg px-3 py-1.5">
                  <span className="text-blue-400 font-bold text-sm">{stat.value}</span>
                  <span className="text-gray-500 text-xs ml-1.5">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
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
          </motion.div>
        ))}
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default Projects