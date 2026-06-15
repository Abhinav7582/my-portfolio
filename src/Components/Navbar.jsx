import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sections = ["about", "experience", "projects", "publications", "contact"]

function Navbar() {
  const [active, setActive] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const shellClass = `transition-all duration-300 ${
    scrolled
      ? "bg-white/5 backdrop-blur-xl border-white/10 shadow-lg shadow-blue-500/5"
      : "bg-white/[0.02] backdrop-blur-md border-white/5"
  }`

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      {/* ===== DESKTOP PILL (unchanged) ===== */}
      <div
        className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full border ${shellClass}`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 pl-2 pr-3 shrink-0 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-white font-semibold text-sm tracking-tight">
            Abhinav Singh
          </span>
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-1 md:gap-2">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className={`relative capitalize text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full transition-colors ${
                active === s ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {active === s && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-0 bg-blue-600/30 border border-blue-500/40 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* ===== MOBILE BAR ===== */}
      <div className="md:hidden w-full max-w-sm">
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-full border ${shellClass}`}>
          {/* Logo */}
          <a href="#" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white font-semibold text-sm tracking-tight">
              Abhinav Singh
            </span>
          </a>

          {/* Hamburger / close button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="relative w-6 h-6 flex flex-col justify-center items-center gap-1.5"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-white rounded-full"
            />
          </button>
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`mt-2 rounded-2xl border overflow-hidden ${shellClass}`}
            >
              <div className="flex flex-col p-2">
                {sections.map((s) => (
                  <a
                    key={s}
                    href={`#${s}`}
                    onClick={() => setMenuOpen(false)}
                    className={`capitalize text-sm px-4 py-3 rounded-xl transition-colors ${
                      active === s
                        ? "text-white bg-blue-600/30 border border-blue-500/40"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar