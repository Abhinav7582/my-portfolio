import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { projects } from "../Data/projects"
import Modal from "./Modal"
import { fadeUp, cardIn, staggerContainer, viewport } from "../lib/motion"
import { SECTION, PROSE, EYEBROW, HEADING } from "../lib/layout"
import { applyFilter } from "../lib/crossFilter"

/**
 * Work — twelve projects as a filterable card grid.
 *
 * Briefly tried full-width rows. They read well individually but twelve of
 * them is just a tall list by another name — the whole point of V2 was to stop
 * making people scroll. A three-column grid puts the same twelve projects in
 * four rows instead of twelve, and the filters sit above the fold with a live
 * count so the interaction is visible immediately rather than discovered after
 * a scroll.
 *
 * Filtering is the interactive element, and it's on brand: letting someone
 * query the work is a better demonstration of the craft than an animation.
 */

const CATEGORIES = ["All", ...new Set(projects.map((p) => p.category))]

function ProjectCard({ project, index, onOpen, dimmed, onHover }) {
  const ref = useRef(null)
  // The dialog morphs from this rect. Captured on click rather than tracked
  // continuously — see the note at the top of Modal.jsx on why shared-layout
  // projection was removed.
  const open = () => onOpen(project, ref.current?.getBoundingClientRect())
  // Pointer offset from the card centre, driving the tilt. Named mx/my so
  // they aren't confused with the transform `y` that whileHover animates.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-120, 120], [4, -4])
  const rotateY = useTransform(mx, [-160, 160], [-4, 4])

  const handleMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left - r.width / 2)
    my.set(e.clientY - r.top - r.height / 2)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      variants={cardIn}
      whileHover={{ y: -4 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => {
        reset()
        onHover(null)
      }}
      onClick={() => {
        reset()
        open()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          open()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${project.title} — open details`}
      className={`glass-lite glass-hover glass-tint rounded-2xl p-5 cursor-pointer flex flex-col h-full transition-opacity duration-300 ${
        dimmed ? "opacity-40" : "opacity-100"
      } ${project.featured ? "ring-1 ring-blue-400/25" : ""}`}
    >
      <div className="relative z-[2] flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] text-gray-600 font-mono tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-blue-300 bg-blue-500/10 border border-blue-400/25 px-2 py-0.5 rounded-full truncate">
            {project.category}
          </span>
        </div>

        <h3 className="text-white font-semibold leading-snug">{project.title}</h3>
        <p className="text-[11px] text-blue-400/80 mt-1">{project.company}</p>

        {project.status && (
          <span className="inline-flex items-center gap-1.5 self-start text-[10px] text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2 py-0.5 rounded-full mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {project.status}
          </span>
        )}

        <p className="text-gray-400 text-sm leading-relaxed mt-3 flex-1">{project.oneliner}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.05] border border-white/[0.07] rounded-lg px-2.5 py-1.5"
            >
              <span className="text-blue-400 font-semibold text-xs">{s.value}</span>
              <span className="text-gray-500 text-[10px] ml-1.5">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[10px] text-gray-600 px-1 py-0.5">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Work({ crossFilter, onClearCrossFilter }) {
  const [filter, setFilter] = useState("All")
  // { project, rect } — rect is the morph origin for the dialog.
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const openProject = (project, rect) => setSelected({ project, rect })

  // A cross-filter arriving from Growth takes precedence over the local
  // category chips — it was an explicit act, and silently intersecting the two
  // would usually produce zero results with no explanation.
  const shown = useMemo(() => {
    const list = crossFilter
      ? applyFilter(crossFilter)
      : filter === "All"
        ? projects
        : projects.filter((p) => p.category === filter)
    // Featured first, so the strongest work leads regardless of filter.
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [filter, crossFilter])

  // Choosing a category clears the cross-filter, so the two never disagree.
  const chooseCategory = (c) => {
    onClearCrossFilter?.()
    setFilter(c)
  }

  return (
    <section id="work" className={SECTION}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
        <p className={EYEBROW}>What I&apos;ve built</p>
        <h2 className={HEADING}>Work</h2>
        <p className={`text-gray-400 mt-4 ${PROSE}`}>
          Twelve projects across pipelines, experimentation, machine learning and BI governance.
          Filter by discipline, or open any card for the full breakdown.
        </p>
      </motion.div>

      {/* Cross-filter banner — shown only when Growth sent you here, and
          always removable. An applied filter you can't see or undo is the
          fastest way to make someone think the site is broken. */}
      <AnimatePresence>
        {crossFilter && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-7 flex flex-wrap items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3"
          >
            <span className="text-xs text-blue-200">
              {crossFilter.kind === "period" ? "Projects from" : "Projects using"}{" "}
              <strong className="font-semibold text-white">{crossFilter.label}</strong>
            </span>
            <span className="text-xs text-gray-400 tabular-nums">
              {shown.length} of {projects.length}
            </span>
            <button
              type="button"
              onClick={onClearCrossFilter}
              className="ml-auto text-xs text-gray-300 hover:text-white border border-white/15 hover:border-white/35 rounded-full px-3 py-1 transition-colors"
            >
              Clear ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters — deliberately directly under the heading, so the interaction
          is visible without scrolling to find it. */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="flex flex-wrap items-center gap-2 mt-7 mb-8"
      >
        {CATEGORIES.map((c) => {
          const active = !crossFilter && c === filter
          const n = c === "All" ? projects.length : projects.filter((p) => p.category === c).length
          return (
            <button
              key={c}
              type="button"
              onClick={() => chooseCategory(c)}
              aria-pressed={active}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? "bg-blue-500/25 border-blue-400/50 text-white"
                  : "bg-white/[0.03] border-white/[0.09] text-gray-400 hover:text-white hover:border-blue-400/40"
              }`}
            >
              {c}
              <span className={`ml-1.5 tabular-nums ${active ? "text-blue-200" : "text-gray-600"}`}>
                {n}
              </span>
            </button>
          )
        })}
        <span className="text-xs text-gray-500 tabular-nums ml-auto">
          Showing {shown.length} of {projects.length}
        </span>
      </motion.div>

      {/* Re-keyed on filter so the grid simply re-enters with its stagger. */}
      <motion.div
        key={crossFilter ? crossFilter.key : filter}
        variants={staggerContainer(0.04)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
      >
        {shown.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full py-8">
            No projects match this filter.
          </p>
        )}
        {shown.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            onOpen={openProject}
            onHover={setHovered}
            dimmed={hovered !== null && hovered !== p.id}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <Modal
            key={selected.project.id}
            item={selected.project}
            originRect={selected.rect}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Work
