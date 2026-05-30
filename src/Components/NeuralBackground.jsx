import { useEffect, useRef } from "react"

function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationId
    let stars = []
    let shootingStars = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStars = () => {
      stars = []
      const count = Math.floor((canvas.width * canvas.height) / 4000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          drift: Math.random() * 0.15 + 0.02,
        })
      }
    }

    const spawnShootingStar = () => {
      if (Math.random() < 0.012 && shootingStars.length < 2) {
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height * 0.5
        shootingStars.push({
          x: startX,
          y: startY,
          len: Math.random() * 80 + 60,
          speed: Math.random() * 6 + 6,
          angle: Math.PI / 4,
          opacity: 1,
        })
      }
    }

    const draw = () => {
      // Deep space gradient backdrop
      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.8
      )
      bg.addColorStop(0, "#0a0e1a")
      bg.addColorStop(0.5, "#060914")
      bg.addColorStop(1, "#02030a")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Nebula glow blobs
      const drawNebula = (x, y, size, color) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
        grad.addColorStop(0, color)
        grad.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = grad
        ctx.fillRect(x - size, y - size, size * 2, size * 2)
      }
      const t = Date.now() / 8000
      drawNebula(
        canvas.width * 0.3 + Math.sin(t) * 50,
        canvas.height * 0.4 + Math.cos(t) * 30,
        400, "rgba(37, 99, 235, 0.08)"
      )
      drawNebula(
        canvas.width * 0.7 + Math.cos(t * 0.8) * 50,
        canvas.height * 0.6 + Math.sin(t * 0.8) * 40,
        350, "rgba(99, 102, 241, 0.06)"
      )
      drawNebula(
        canvas.width * 0.5 + Math.sin(t * 1.2) * 40,
        canvas.height * 0.7,
        300, "rgba(6, 182, 212, 0.05)"
      )

      // Stars
      stars.forEach((star) => {
        star.twinkle += star.twinkleSpeed
        star.y += star.drift
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        const opacity = star.baseOpacity + Math.sin(star.twinkle) * 0.3
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`
        ctx.fill()

        // Occasional glow on bigger stars
        if (star.radius > 1) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0, star.x, star.y, star.radius * 4
          )
          glow.addColorStop(0, `rgba(147, 197, 253, ${opacity * 0.4})`)
          glow.addColorStop(1, "rgba(147, 197, 253, 0)")
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }
      })

      // Shooting stars
      spawnShootingStar()
      shootingStars.forEach((s, i) => {
        const dx = Math.cos(s.angle) * s.len
        const dy = Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy)
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`)
        grad.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - dx, s.y - dy)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.stroke()

        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity -= 0.012
        if (s.opacity <= 0) shootingStars.splice(i, 1)
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createStars()
    draw()

    window.addEventListener("resize", () => {
      resize()
      createStars()
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
    />
  )
}

export default NeuralBackground