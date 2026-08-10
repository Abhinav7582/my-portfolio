import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import ErrorBoundary from "./Components/ErrorBoundary.jsx"

// ErrorBoundary sits outside App so it catches everything, including a failure
// in App's own render. If anything throws, the visitor gets the complete text
// version of the site instead of a blank page. See ErrorBoundary.jsx.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
