import { motion } from "framer-motion"

const publications = [
  {
    title: "Autonomous Driving Using Machine Learning and Computer Vision",
    journal: "IJISRT — International Journal of Innovative Science and Research Technology",
    year: "2023",
    description: "Research paper exploring how machine learning and computer vision techniques can be applied to autonomous driving systems. Covers perception, decision-making, and intelligent automation in real-world driving scenarios.",
    tags: ["Machine Learning", "Computer Vision", "Autonomous Driving", "AI"],
    link: "#",
  },
]

function Publications() {
  return (
    <section id="publications" className="py-24 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-3">Research</p>
        <h2 className="text-4xl font-bold text-white">Publications</h2>
      </motion.div>

      <div className="space-y-6">
        {publications.map((pub, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-600/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-white font-semibold text-xl leading-snug group-hover:text-blue-400 transition-colors">
                {pub.title}
              </h3>
              <span className="text-blue-400 bg-blue-950/50 border border-blue-800/40 px-3 py-1 rounded-full text-sm shrink-0">
                {pub.year}
              </span>
            </div>

            <p className="text-blue-400/70 text-sm mb-4">{pub.journal}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{pub.description}</p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag, j) => (
                  <span key={j} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {pub.link !== "#" && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                >
                  Read Paper ↗
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Publications