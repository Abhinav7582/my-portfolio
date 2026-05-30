import Navbar from "./Components/Navbar"
import Hero from "./Components/Hero"
import About from "./Components/About"
import Experience from "./Components/Experience"
import Projects from "./Components/Projects"
import Publications from "./Components/Publications"
import Contact from "./Components/Contact"
import NeuralBackground from "./Components/NeuralBackground"
import './App.css'

function App() {
  return (
    <div className="bg-[#02030a] text-white min-h-screen relative overflow-x-hidden">
      <NeuralBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Publications />
        <Contact />
      </div>
    </div>
  )
}

export default App