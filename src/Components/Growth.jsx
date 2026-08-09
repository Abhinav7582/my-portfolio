import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { experience } from "../Data/experience"
import Modal from "./Modal"
import { fadeUp, staggerContainer, viewport, EASE_OUT } from "../lib/motion"
import { SECTION, PROSE, EYEBROW, HEADING } from "../lib/layout"
import { periodFilter, tagFilter, countForTag } from "../lib/crossFilter"

/**
 * Growth — About and Experience merged into one section.
 *
 * This exists because the previous version made a reader scroll through four
 * paragraphs of prose, four stat tiles, forty skill pills across six labelled
 * groups, and five expanded job cards. Roughly three screens to learn what the
 * chart below communicates at a glance.
 *
 * Three compressions do the work:
 *   1. The About prose became two sentences — the arc tells that story now.
 *   2. Six labelled skill groups became one cloud that highlights per stage.
 *      Nothing is hidden, so keyword scanning still works, but it stops being
 *      a wall and starts showing the toolkit accumulate over time.
 *   3. Full role detail moved sideways into the modal instead of down the page.
 *
 * The panel beside the chart is deliberately always visible. Research on
 * portfolio review puts the first-impression scan at about seven seconds, so
 * someone who never clicks anything still has to learn where he works and
 * what he did there.
 */

// Oldest first — progression only reads left to right in time.
const stages = [...experience].sort((a, b) => (a.growth?.stage ?? 0) - (b.growth?.stage ?? 0))
const allSkills = [...new Set(stages.flatMap((s) => s.tags))]

function ScopeChart({ selected, onSelect }) {
  const W = 320
  const H = 104
  const pad = 14
  const pts = stages.map((s, i) => [
    pad + i * ((W - pad * 2) / (stages.length - 1)),
    H - 18 - (s.growth.ownership / 100) * (H - 40),
  ])
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  const area = `${line} L${pts[pts.length - 1][0]},${H - 18} L${pts[0][0]},${H - 18} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Scope of ownership rising from 2022 to 2026"
    >
      <defs>
        <linearGradient id="gl" x1="0" x2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.26" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={area}
        fill="url(#ga)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="url(#gl)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: EASE_OUT }}
      />

      {pts.map((p, i) => {
        const active = i === selected
        return (
          <g
            key={stages[i].id}
            onClick={() => onSelect(i)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`${stages[i].growth.year} — ${stages[i].growth.short}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect(i)
              }
            }}
          >
            {/* generous invisible hit area */}
            <rect x={p[0] - 16} y={0} width="32" height={H} fill="transparent" />
            {active && <circle cx={p[0]} cy={p[1]} r="9" fill="none" stroke="#67e8f9" strokeOpacity="0.35" />}
            <circle
              cx={p[0]}
              cy={p[1]}
              r={active ? 4.6 : 2.8}
              fill={active ? "#67e8f9" : "#3b6ea8"}
              className="transition-all duration-200"
            />
            <text
              x={p[0]}
              y={H - 3}
              textAnchor="middle"
              fontSize="9"
              fill={active ? "#9fd8f5" : "#5d6b83"}
            >
              {stages[i].growth.year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Growth({ onShowProjects }) {
  const [selected, setSelected] = useState(stages.length - 1)
  // { item, rect } — rect is the morph origin for the dialog.
  const [modalItem, setModalItem] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const exp = stages[selected]
  const g = exp.growth

  return (
    <section id="growth" ref={ref} className={SECTION}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mb-12"
      >
        <p className={EYEBROW}>Who I am &amp; how I got here</p>
        <h2 className={HEADING}>Growth</h2>
        <p className={`text-gray-400 mt-4 ${PROSE}`}>
          Data Analyst with three years across AdTech, product analytics and data engineering —
          from validating OCR output to owning the pipelines revenue decisions run on. The
          through-line is turning ambiguous, manual processes into systems teams can trust.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-16 items-start">
        {/* Left: chart + role list */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          {inView && <ScopeChart selected={selected} onSelect={setSelected} />}

          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mt-4 space-y-1"
          >
            {stages.map((s, i) => {
              const active = i === selected
              return (
                <motion.button
                  key={s.id}
                  variants={fadeUp}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={active}
                  className={`w-full text-left grid grid-cols-[42px_1fr_auto] gap-3 items-center px-3 py-2.5 rounded-xl border transition-colors ${
                    active
                      ? "bg-blue-500/15 border-blue-400/35"
                      : "border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-[11px] text-gray-500">{s.growth.year}</span>
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-100 truncate">{s.growth.short}</span>
                    <span className="block text-[11px] text-gray-500 truncate">{s.company}</span>
                  </span>
                  <span
                    className={`text-[10px] transition-opacity ${
                      active ? "text-blue-300 opacity-100" : "text-gray-600 opacity-0"
                    }`}
                  >
                    selected
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Right: detail panel — always visible, no click required */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          <AnimatePresence mode="wait">
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              data-detail-card
              className="glass-lite glass-tint rounded-2xl p-6"
            >
              <div className="relative z-[2]">
                <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
                <p className="text-blue-400 text-sm mt-0.5">{exp.company}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {exp.team} · {exp.period}
                </p>

                <div className="my-5 pl-3.5 border-l-2 border-blue-500/40">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-blue-400/70 mb-1.5">
                    The step up
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{g.leap}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {exp.stats.slice(0, 4).map((s, i) => (
                    <span
                      key={i}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs"
                    >
                      <span className="text-blue-400 font-semibold">{s.value}</span>
                      <span className="text-gray-500 ml-1.5">{s.label}</span>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) =>
                      setModalItem({
                        item: exp,
                        rect: e.currentTarget
                          .closest("[data-detail-card]")
                          ?.getBoundingClientRect(),
                      })
                    }
                    className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Full detail ↗
                  </button>

                  {/* The cross-section link: narrows Work to this stage and
                      jumps there. Hidden when a stage has no written-up
                      projects, rather than offering a dead end. */}
                  {g.projectIds?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onShowProjects(periodFilter(exp))}
                      className="text-sm text-blue-300 hover:text-white border border-blue-400/30 hover:border-blue-400/60 px-4 py-2 rounded-full transition-colors"
                    >
                      {g.projectIds.length} project{g.projectIds.length > 1 ? "s" : ""} from this
                      period →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Toolkit — one cloud, highlighted by stage */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-12 pt-8 border-t border-white/[0.08]"
      >
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Toolkit</p>
          <p className="text-xs text-blue-400/80">
            {exp.tags.length} of {allSkills.length} in use — {g.year}
          </p>
        </div>
        {/* Chips are buttons: clicking a tool filters Work to every project
            that used it. Highlight still tracks the selected stage, so the
            cloud keeps showing the toolkit accumulating over time. */}
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => {
            const on = exp.tags.includes(skill)
            const n = countForTag(skill)
            return (
              <button
                key={skill}
                type="button"
                disabled={n === 0}
                onClick={() => n > 0 && onShowProjects(tagFilter(skill))}
                title={n > 0 ? `Show ${n} project${n > 1 ? "s" : ""} using ${skill}` : undefined}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  on
                    ? "bg-blue-500/25 border-blue-400/50 text-white"
                    : "bg-white/[0.02] border-white/[0.07] text-gray-600"
                } ${n > 0 ? "hover:border-blue-400/70 hover:text-white cursor-pointer" : "cursor-default"}`}
              >
                {skill}
                {n > 0 && <span className="ml-1.5 tabular-nums opacity-60">{n}</span>}
              </button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {modalItem && (
          <Modal
            key={modalItem.item.id}
            item={modalItem.item}
            originRect={modalItem.rect}
            onClose={() => setModalItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Growth
