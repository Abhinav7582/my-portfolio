import { Component } from "react"
import PlainView from "./PlainView"

/**
 * Last line of defence.
 *
 * A React SPA's characteristic production failure is not a wrong colour — it
 * is a component throwing during render, which unmounts the whole tree and
 * leaves the visitor a completely blank page. Lint passes, the build passes,
 * the maths tests pass, and the site is white.
 *
 * Rather than show an apologetic error screen, this falls back to Plain view:
 * the same complete document — every role, every project, the publication,
 * contact details — with no animation and nothing to click. A crash degrades
 * to a readable CV instead of nothing, which for a portfolio is close to no
 * loss at all.
 *
 * Note PlainView is imported statically, not lazily. It used to be a lazy
 * chunk, but a fallback that must fetch a separate file before it can render
 * is exactly the wrong shape for a crash handler — whatever broke may well
 * have broken chunk loading too. The bundle grew a few KB gzipped; a crash
 * fallback that reliably works is worth more than that.
 */
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Deliberately loud. This is the one failure the tests cannot catch, so
    // if it ever happens the console should say so unambiguously.
    console.error(
      "[portfolio] render failed — falling back to plain view.\n" +
        "This is a real bug; the fallback is a courtesy, not a fix.",
      error,
      info?.componentStack
    )

    // A dialog may have been open when it threw, in which case the body still
    // has `overflow: hidden` and scrollbar padding applied. Without this the
    // fallback renders but cannot be scrolled.
    try {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    } catch {
      // Nothing sensible to do if even this fails.
    }
  }

  render() {
    if (this.state.error) {
      return <PlainView crashed onExit={() => window.location.reload()} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
