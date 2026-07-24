import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Modal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => (document.body.style.overflow = "auto")
  }, [])

  if (!item) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{item.title || item.role}</h2>
              <p className="text-blue-400 mt-1">
                {item.company} {item.team ? `· ${item.team}` : ""}
              </p>
              {item.period && <p className="text-gray-500 text-sm mt-1">{item.period}</p>}
              {item.status && (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2.5 py-0.5 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {item.status}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-2xl leading-none ml-4 hover:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          {/* Impact Stats */}
          {item.stats && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {item.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-gradient-to-br from-blue-950/60 to-gray-800/60 border border-blue-800/30 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary */}
        {(item.summary || item.description) && (
          <p className="text-gray-300 mb-6 leading-relaxed">
            {item.summary || item.description}
          </p>
        )}

        {/* Detailed breakdown (bullet points) */}
        {item.details && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">What I Built</h3>
            <ul className="space-y-2">
              {item.details.map((d, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex gap-3 text-gray-300 text-sm"
                >
                  <span className="text-blue-400 mt-0.5 shrink-0">▹</span>
                  <span>{d}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

          {/* Highlights */}
          {item.highlights && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Key Contributions</h3>
              <ul className="space-y-2">
                {item.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex gap-3 text-gray-300 text-sm"
                  >
                    <span className="text-blue-400 mt-0.5 shrink-0">▹</span>
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Impact */}
          {item.impact && (
            <div className="mb-6 bg-blue-950/40 border border-blue-800/40 rounded-xl p-4">
              <h3 className="text-blue-400 font-semibold mb-2">Impact</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.impact}</p>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Modal