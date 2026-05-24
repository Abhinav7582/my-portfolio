import { useState, useEffect } from "react"

const sections = ["about", "experience", "projects", "publications", "contact"]

function Navbar() {
  const [active, setActive] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <span className="text-white font-bold text-lg tracking-tight">
          Abhinav Singh
        </span>
        <div className="flex gap-6 text-sm">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className={`capitalize transition-colors ${
                active === s
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar