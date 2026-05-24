import { useState } from "react"
import { motion } from "framer-motion"
import { experiences } from "../Data/experience"
import Modal from "./Modal"

function Experience() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto">
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
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800 hidden md:block" />

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="md:pl-16 relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-blue-600 border-2 border-gray-950 hidden md:block" />

              <div
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-600/50 hover:bg-gray-800/80 transition-all group"
                onClick={() => setSelected(exp)}
              >
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

                {/* Impact stats */}
                <div className="flex gap-3 flex-wrap mb-4">
                  {exp.stats.map((stat, j) => (
                    <div key={j} className="bg-gray-800 rounded-lg px-3 py-1.5 text-center">
                      <span className="text-blue-400 font-bold text-sm">{stat.value}</span>
                      <span className="text-gray-500 text-xs ml-2">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag, j) => (
                    <span key={j} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-xs mt-4 group-hover:text-gray-400 transition-colors">
                  Click to see full details →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default Experience