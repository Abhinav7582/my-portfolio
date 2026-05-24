import { useEffect, useRef } from "react"

function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationId
    let nodes = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createNodes = () => {
      nodes = []
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Pulsing glow
        const pulseSize = node.radius + Math.sin(node.pulse) * 0.8

        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseSize * 4
        )
        gradient.addColorStop(0, "rgba(96, 165, 250, 0.8)")
        gradient.addColorStop(1, "rgba(96, 165, 250, 0)")
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Node core
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(147, 197, 253, 0.9)"
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 160

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.25

            // Data flow effect
            const flowProgress = (Date.now() / 1000) % 1
            const flowX = nodes[i].x + (nodes[j].x - nodes[i].x) * flowProgress
            const flowY = nodes[i].y + (nodes[j].y - nodes[i].y) * flowProgress

            // Line
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.stroke()

            // Flowing data particle
            if (dist < 100) {
              ctx.beginPath()
              ctx.arc(flowX, flowY, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(196, 225, 255, ${opacity * 2})`
              ctx.fill()
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createNodes()
    draw()

    window.addEventListener("resize", () => {
      resize()
      createNodes()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}

export default NeuralBackground