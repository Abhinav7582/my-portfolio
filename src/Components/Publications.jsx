import { motion } from "framer-motion"

const publications = [
  {
    title: "Modelling Autonomous Driving and Obstacle Avoidance using Multi-Modal Fusion Transformer Framework",
    journal: "IJISRT — International Journal of Innovative Science and Research Technology",
    volume: "Volume 8 | Issue 2 | February 2023",
    articleId: "IJISRT23FEB493",
    description: "Defined a Multi-Modal Fusion Transformer for autonomous driving, integrating camera and LiDAR data to enhance trajectory prediction. Demonstrated via lane detection simulation and recognized by IJISRT and Karnataka State Council for its innovative traffic applications.",
    tags: ["Multi-Modal Fusion Transformer", "Autonomous Driving", "Computer Vision", "LiDAR", "Deep Learning"],
    link: "https://www.ijisrt.com/modelling-autonomous-driving-and-obstacle-avoidance-using-multimodal-fusion-transformer-framework",
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
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all group shadow-xl shadow-black/20"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-white font-semibold text-xl leading-snug group-hover:text-blue-400 transition-colors">
                {pub.title}
              </h3>
              <span className="text-blue-400 bg-blue-950/50 border border-blue-800/40 px-3 py-1 rounded-full text-sm shrink-0">
                2023
              </span>
            </div>

            <p className="text-blue-400/70 text-sm mb-1">{pub.journal}</p>
            <p className="text-gray-600 text-xs mb-4">{pub.volume} · Article ID: {pub.articleId}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{pub.description}</p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag, j) => (
                  <span key={j} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-full transition-colors"
              >
                Read Paper ↗
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Publications