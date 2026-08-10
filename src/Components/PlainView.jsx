import { about } from "../Data/about"
import { experience } from "../Data/experience"
import { projects } from "../Data/projects"

/**
 * Plain view — the escape hatch.
 *
 * No animation, no canvas, no modals, nothing to click before you can read.
 * Every fact on the site rendered as a single scannable document.
 *
 * This exists because portfolio-review research puts the first-impression scan
 * at roughly seven seconds and a full review at under a minute. Some readers
 * will not want an interface at all — they want the text. Making them hunt for
 * it is how you lose them, and one extra view is a cheap insurance policy.
 *
 * Deliberately plain: system fonts, high contrast, semantic headings, prints
 * cleanly.
 */

const stages = [...experience].sort((a, b) => (b.growth?.stage ?? 0) - (a.growth?.stage ?? 0))

function PlainView({ onExit, crashed = false }) {
  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-200 print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-white/15">
          <div>
            <h1 className="text-2xl font-bold text-white print:text-black">Abhinav Singh</h1>
            <p className="text-sm text-gray-400 mt-1">
              Data Analyst · AdTech &amp; Product Analytics · Bengaluru, India
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <a className="underline" href="mailto:abhisingh170801@gmail.com">
                abhisingh170801@gmail.com
              </a>
              {" · "}
              <a
                className="underline"
                href="https://www.linkedin.com/in/abhinav-singh-534012213/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              {" · "}
              <a
                className="underline"
                href="https://github.com/Abhinav7582"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              {" · "}
              <a className="underline" href="/Abhinav_Singh_CV.pdf" download>
                CV (PDF)
              </a>
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="text-xs border border-white/25 rounded-full px-3 py-1.5 hover:bg-white/10 shrink-0 print:hidden"
          >
            {crashed ? "Reload" : "← Full site"}
          </button>
        </div>

        {crashed && (
          <p className="mb-8 rounded-xl border border-amber-600/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-200 print:hidden">
            The interactive view failed to load, so this is the full text
            version — everything is here.
          </p>
        )}

        {/* The full story, not the two-sentence version. This view exists for
            readers who want everything without clicking anything, so it would
            be self-defeating to make them open a dialog for the About text. */}
        <h2 className="text-lg font-semibold text-white print:text-black mb-3">About</h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-300 mb-6">
          {about.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <p className="text-sm text-gray-400 mb-10">
          {about.facts.map((f) => `${f.value} ${f.label.toLowerCase()}`).join(" · ")}
        </p>

        <h2 className="text-lg font-semibold text-white print:text-black mb-4">Experience</h2>
        <div className="space-y-8 mb-12">
          {stages.map((e) => (
            <article key={e.id}>
              <h3 className="font-semibold text-white print:text-black">
                {e.role} — {e.company}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {e.team} · {e.period} · {e.location}
              </p>
              <p className="text-sm leading-relaxed mt-2 text-gray-300">{e.summary}</p>
              <p className="text-sm mt-2 text-gray-400">
                <strong className="text-gray-300">Key numbers:</strong>{" "}
                {e.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-400">
                {e.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">{e.tags.join(", ")}</p>
            </article>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white print:text-black mb-4">
          Projects ({projects.length})
        </h2>
        <div className="space-y-6 mb-12">
          {projects.map((p) => (
            <article key={p.id}>
              <h3 className="font-semibold text-white print:text-black">
                {p.title} <span className="font-normal text-gray-500">— {p.company}</span>
              </h3>
              <p className="text-sm leading-relaxed mt-1 text-gray-300">{p.oneliner}</p>
              <p className="text-sm mt-1 text-gray-400">
                {p.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
              </p>
              <p className="text-xs text-gray-500 mt-1">{p.tags.join(", ")}</p>
            </article>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white print:text-black mb-3">Publication</h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-12">
          <a
            className="underline"
            href="https://www.ijisrt.com/modelling-autonomous-driving-and-obstacle-avoidance-using-multimodal-fusion-transformer-framework"
            target="_blank"
            rel="noopener noreferrer"
          >
            Modelling Autonomous Driving and Obstacle Avoidance using Multi-Modal Fusion
            Transformer Framework
          </a>{" "}
          — IJISRT, Volume 8, Issue 2, February 2023.
        </p>

        <p className="text-xs text-gray-600 border-t border-white/15 pt-6">
          Plain view · no animation, no interaction required.
        </p>
      </div>
    </div>
  )
}

export default PlainView
