import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { handleAnchorClick } from "../lib/scroll"
import Modal from "./Modal"
import AboutPanel from "./AboutPanel"

const sections = ["growth", "work", "contact"]

function Navbar({ onPlainView }) {
  const [active, setActive] = useState("")
  // About is a dialog, not a section — the long-form story lives one click
  // away rather than costing a screen of scroll. See Data/about.js.
  const [aboutOpen, setAboutOpen] = useState(null) // null | DOMRect (morph origin)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const mobileRef = useRef(null)

  useEffect(() => {
    // Track which sections are currently in the band, rather than only
    // reacting to ones entering it. The previous version set `active` on
    // intersect and never cleared it, so scrolling back up to the hero left
    // the last section — usually Growth — still highlighted, even though the
    // reader was nowhere near it.
    const visible = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // First in document order wins when two overlap the band. Empty
        // string means the hero — no pill lit, which is correct.
        setActive(sections.find((id) => visible.has(id)) ?? "")
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Escape closes the mobile menu; clicking outside does too.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false)
    const onClick = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [menuOpen])

  const onNavClick = (e, id) => {
    handleAnchorClick(e, id)
    setMenuOpen(false)
  }

  // `.glass` now carries its own solid base colour (see index.css — no
  // backdrop-filter, because this bar is fixed above a 60fps canvas). So the
  // scrolled state changes depth via shadow rather than by layering another
  // translucent background on top of it.
  const shellClass = `glass glass-tint transition-shadow duration-500 ${
    scrolled ? "shadow-xl shadow-black/50" : "shadow-lg shadow-black/25"
  }`

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      aria-label="Main navigation"
    >
      {/* ===== DESKTOP PILL ===== */}
      <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full ${shellClass}`}>
        <a
          href="#top"
          onClick={(e) => onNavClick(e, "top")}
          className="flex items-center gap-2 pl-2 pr-3 shrink-0 border-r border-white/10 relative z-[2]"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-white font-semibold text-sm tracking-tight">Abhinav Singh</span>
        </a>

        <div className="flex items-center gap-1 relative z-[2]">
          <button
            type="button"
            onClick={(e) => setAboutOpen(e.currentTarget.getBoundingClientRect())}
            className="text-sm text-gray-400 hover:text-white px-4 py-1.5 rounded-full hover:bg-white/[0.07] transition-colors"
          >
            About
          </button>
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={(e) => onNavClick(e, s)}
              aria-current={active === s ? "true" : undefined}
              className={`relative capitalize text-sm px-4 py-1.5 rounded-full transition-colors ${
                active === s ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {active === s && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-0 bg-blue-500/25 border border-blue-400/40 rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {s}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-white/10 relative z-[2]">
          {/* The escape hatch for anyone who just wants the text. */}
          <button
            type="button"
            onClick={onPlainView}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.07] transition-colors"
          >
            Plain view
          </button>
          <a
            href="/Abhinav_Singh_CV.pdf"
            download
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full transition-colors"
          >
            CV
          </a>
        </div>
      </div>

      {/* ===== MOBILE BAR ===== */}
      <div className="md:hidden w-full max-w-sm" ref={mobileRef}>
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-full ${shellClass}`}>
          <a
            href="#top"
            onClick={(e) => onNavClick(e, "top")}
            className="flex items-center gap-2 relative z-[2]"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white font-semibold text-sm tracking-tight">Abhinav Singh</span>
          </a>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="relative z-[2] -mr-2 w-11 h-11 flex flex-col justify-center items-center gap-1.5"
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

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-2 rounded-2xl overflow-hidden ${shellClass}`}
            >
              <div className="flex flex-col p-2 relative z-[2]">
                <button
                  type="button"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setMenuOpen(false)
                    setAboutOpen(rect)
                  }}
                  className="text-left text-sm px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  About
                </button>
                {sections.map((s) => (
                  <a
                    key={s}
                    href={`#${s}`}
                    onClick={(e) => onNavClick(e, s)}
                    className={`capitalize text-sm px-4 py-3 rounded-xl transition-colors ${
                      active === s
                        ? "text-white bg-blue-500/25 border border-blue-400/40"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s}
                  </a>
                ))}
                <div className="flex gap-2 p-2 pt-3 mt-1 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onPlainView()
                    }}
                    className="flex-1 text-sm text-gray-300 border border-white/15 rounded-xl py-2.5"
                  >
                    Plain view
                  </button>
                  <a
                    href="/Abhinav_Singh_CV.pdf"
                    download
                    className="flex-1 text-center text-sm bg-blue-600 text-white rounded-xl py-2.5"
                  >
                    CV
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {aboutOpen && (
          <Modal
            title="About me"
            originRect={aboutOpen}
            onClose={() => setAboutOpen(null)}
          >
            <AboutPanel />
          </Modal>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
