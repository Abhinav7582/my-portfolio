import { about } from "../Data/about"

/**
 * Contents of the About dialog.
 *
 * Deliberately just content — the shell, focus trap, scroll lock and
 * morph-from-origin all come from Modal, so there is exactly one dialog
 * implementation on the site.
 */
function AboutPanel() {
  return (
    <div>
      <p className="text-blue-400 text-sm -mt-4 mb-6">{about.role}</p>

      <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-7">
        {about.facts.map((f) => (
          <div key={f.label} className="rounded-xl p-4 bg-white/[0.05] border border-white/[0.09]">
            <p className="text-xl font-bold text-blue-400">{f.value}</p>
            <p className="text-gray-400 text-xs mt-1">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-7">
        <a
          href="/Abhinav_Singh_CV.pdf"
          download
          className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-colors"
        >
          ↓ Download CV
        </a>
        <a
          href="mailto:abhisingh170801@gmail.com"
          className="text-sm text-gray-300 hover:text-white border border-white/15 hover:border-white/35 px-4 py-2 rounded-full transition-colors"
        >
          Get in touch
        </a>
        <a
          href="https://www.linkedin.com/in/abhinav-singh-534012213/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-300 hover:text-white border border-white/15 hover:border-white/35 px-4 py-2 rounded-full transition-colors"
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  )
}

export default AboutPanel
