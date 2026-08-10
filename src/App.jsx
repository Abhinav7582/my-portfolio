import { useCallback, useEffect, useState } from "react"
import { MotionConfig } from "framer-motion"
import Navbar from "./Components/Navbar"
import ScrollProgress from "./Components/ScrollProgress"
import Hero from "./Components/Hero"
import Growth from "./Components/Growth"
import Work from "./Components/Work"
import Contact from "./Components/Contact"
import CosmicField from "./Components/CosmicField"
import { scrollToId } from "./lib/scroll"
import "./App.css"

// Imported statically rather than lazily. ErrorBoundary uses PlainView as its
// crash fallback, and a fallback that must fetch a chunk before it can render
// is the wrong shape for a crash handler. Costs a few KB gzipped.
import PlainView from "./Components/PlainView"

// V2 structure: six sections became four.
//   hero · growth (about + experience) · work (projects) · contact (+ publication)
// Detail moved sideways into modals rather than downward into scroll, after
// feedback that the previous version was good but required too much scrolling.
//
// There are deliberately no divider elements between sections. An earlier
// version put a glowing "seam" between each one and it read as a pasted-on
// patch — on a dark animated backdrop, sections blend by having nothing
// between them.

function App() {
  const [plain, setPlain] = useState(
    () => typeof window !== "undefined" && window.location.search.includes("plain")
  )

  // The one piece of state shared between sections: selecting a career stage
  // or a tool in Growth narrows Work and jumps you there. Lifted to App rather
  // than routed through context — only two components need it, and App renders
  // both directly.
  const [crossFilter, setCrossFilter] = useState(null)

  const applyCrossFilter = useCallback((filter) => {
    setCrossFilter(filter)
    // Let Work re-render with the new filter before scrolling to it, so the
    // count is already correct when it arrives.
    requestAnimationFrame(() => scrollToId("work"))
  }, [])

  // Keep the URL honest so plain view is shareable and the back button works.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (plain) url.searchParams.set("plain", "1")
    else url.searchParams.delete("plain")
    window.history.replaceState(null, "", url.pathname + url.search)
  }, [plain])

  const togglePlain = useCallback(() => setPlain((p) => !p), [])

  if (plain) {
    return <PlainView onExit={togglePlain} />
  }

  return (
    // reducedMotion="user" makes every framer animation honour the OS setting.
    <MotionConfig reducedMotion="user">
      <div className="bg-[#02030a] text-white min-h-screen relative overflow-x-hidden">
        <CosmicField />
        <ScrollProgress />
        <div className="relative z-10">
          <Navbar onPlainView={togglePlain} />
          <main>
            <Hero />
            <Growth onShowProjects={applyCrossFilter} />
            <Work crossFilter={crossFilter} onClearCrossFilter={() => setCrossFilter(null)} />
            <Contact />
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}

export default App
