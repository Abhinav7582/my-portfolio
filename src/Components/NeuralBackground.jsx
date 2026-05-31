import { useEffect, useRef } from "react"

function NeuralBackground() {
  const canvasRef = useRef(null)
  const scrollProgress = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationId
    let time = 0

    // Respect users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Lower density on smaller screens for performance
    const isMobile = window.innerWidth < 768
    const densityDivisor = isMobile ? 9000 : 5000

    let stars = []
    let shootingStars = []
    let waveParticles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = scrollable > 0 ? window.scrollY / scrollable : 0
    }

    const createStars = () => {
      stars = []
      const count = Math.floor((canvas.width * canvas.height) / densityDivisor)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * Math.max(canvas.width, canvas.height)
        // galaxy arm assignment for the galaxy scene
        const arm = Math.floor(Math.random() * 3)
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          angle,
          radius,
          arm,
          size: Math.random() * 1.4 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.3,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          spinSpeed: (Math.random() * 0.5 + 0.5) * 0.01,
        })
      }
    }

    const createWaveParticles = () => {
      waveParticles = []
      for (let i = 0; i < 60; i++) {
        waveParticles.push({
          x: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.3,
        })
      }
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
    const smooth = (t) => t * t * (3 - 2 * t)

    // Returns how active a scene is (0-1) given scroll p, the scene's center, and width
    const sceneWeight = (p, center, width) => {
      const d = Math.abs(p - center)
      return smooth(clamp(1 - d / width, 0, 1))
    }

    const draw = () => {
      const p = scrollProgress.current
      if (!prefersReducedMotion) time += 1
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // ===== SCENE WEIGHTS ACROSS SCROLL (p = 0 → 1) =====
      // Scene 0: Starfield     centered at p=0.0
      // Scene 1: Vortex        centered at p=0.30
      // Scene 2: Galaxy        centered at p=0.55
      // Scene 3: Energy waves  centered at p=0.78
      // Scene 4: Convergence   centered at p=1.0
      const wStar     = sceneWeight(p, 0.0, 0.28)
      const wVortex   = sceneWeight(p, 0.30, 0.22)
      const wGalaxy   = sceneWeight(p, 0.55, 0.22)
      const wWaves    = sceneWeight(p, 0.78, 0.20)
      const wConverge = sceneWeight(p, 1.0, 0.22)

      // ===== BASE BACKGROUND (hue shifts across journey) =====
      const baseHue = lerp(225, 280, p)
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.85)
      bg.addColorStop(0, `hsl(${baseHue}, ${lerp(30, 55, p)}%, ${lerp(7, 9, p)}%)`)
      bg.addColorStop(0.5, "#060914")
      bg.addColorStop(1, "#01020a")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // ===== CENTRAL GLOW CORE (vortex + galaxy + convergence) =====
      const coreStrength = Math.max(wVortex, wGalaxy * 0.8, wConverge)
      if (coreStrength > 0.05) {
        const coreSize = lerp(150, 320, coreStrength)
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize)
        coreGlow.addColorStop(0, `hsla(${lerp(260, 300, p)}, 90%, 72%, ${coreStrength * 0.45})`)
        coreGlow.addColorStop(0.5, `hsla(${lerp(220, 280, p)}, 90%, 60%, ${coreStrength * 0.15})`)
        coreGlow.addColorStop(1, "hsla(240, 90%, 60%, 0)")
        ctx.fillStyle = coreGlow
        ctx.fillRect(cx - coreSize, cy - coreSize, coreSize * 2, coreSize * 2)
      }

      // ===== STARS — morph across starfield / vortex / galaxy / convergence =====
      stars.forEach((star) => {
        star.twinkle += star.twinkleSpeed
        star.angle += star.spinSpeed * (wVortex + wGalaxy * 1.5 + wConverge * 3)

        // --- Scene 0: scattered starfield ---
        const scatterX = star.x
        const scatterY = star.y

        // --- Scene 1: vortex (rotate + pull inward) ---
        const vortexRadius = star.radius * 0.6
        const vortexX = cx + Math.cos(star.angle) * vortexRadius
        const vortexY = cy + Math.sin(star.angle) * vortexRadius

        // --- Scene 2: galaxy (spiral arms) ---
        const armAngle = star.angle + (star.arm * (Math.PI * 2 / 3))
        const spiralR = (star.radius * 0.5) + star.radius * 0.0008 * armAngle * 40
        const galaxyX = cx + Math.cos(armAngle + spiralR * 0.005) * spiralR
        const galaxyY = cy + Math.sin(armAngle + spiralR * 0.005) * spiralR * 0.6 // flatten for disc look

        // --- Scene 4: convergence (pull to tight center) ---
        const convergeRadius = star.radius * 0.15
        const convergeX = cx + Math.cos(star.angle) * convergeRadius
        const convergeY = cy + Math.sin(star.angle) * convergeRadius

        // Blend all scenes by weight (normalize so they sum sensibly)
        const totalW = wStar + wVortex + wGalaxy + wWaves + wConverge || 1
        const drawX =
          (scatterX * (wStar + wWaves) + vortexX * wVortex + galaxyX * wGalaxy + convergeX * wConverge) / totalW
        const drawY =
          (scatterY * (wStar + wWaves) + vortexY * wVortex + galaxyY * wGalaxy + convergeY * wConverge) / totalW

        const opacity = (star.baseOpacity + Math.sin(star.twinkle) * 0.3) * (1 - wWaves * 0.5)

        // Streak effect during vortex, galaxy, convergence
        const streakAmount = Math.max(wVortex, wGalaxy, wConverge)
        if (streakAmount > 0.3) {
          const streakLen = streakAmount * 14
          const tailX = drawX - Math.cos(star.angle) * streakLen
          const tailY = drawY - Math.sin(star.angle) * streakLen
          const grad = ctx.createLinearGradient(drawX, drawY, tailX, tailY)
          grad.addColorStop(0, `hsla(${lerp(210, 300, p)}, 85%, 78%, ${Math.max(0, opacity)})`)
          grad.addColorStop(1, "hsla(270, 85%, 78%, 0)")
          ctx.beginPath()
          ctx.moveTo(drawX, drawY)
          ctx.lineTo(tailX, tailY)
          ctx.strokeStyle = grad
          ctx.lineWidth = star.size
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0, opacity)})`
          ctx.fill()
        }
      })

      // ===== SCENE 0: SHOOTING STARS (only in calm starfield) =====
      const shootingChance = wStar * 0.015
      if (Math.random() < shootingChance && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          len: Math.random() * 80 + 60,
          speed: Math.random() * 6 + 6,
          angle: Math.PI / 4,
          opacity: 1,
        })
      }
      shootingStars.forEach((s, i) => {
        const dx = Math.cos(s.angle) * s.len
        const dy = Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy)
        grad.addColorStop(0, `rgba(255,255,255,${s.opacity * wStar})`)
        grad.addColorStop(1, "rgba(255,255,255,0)")
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

      // ===== SCENE 3: ENERGY WAVES (flowing horizontal light) =====
      if (wWaves > 0.02) {
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath()
          const yBase = cy + (layer - 1) * 80
          const amp = 60 + layer * 20
          for (let x = 0; x <= canvas.width; x += 10) {
            const y =
              yBase +
              Math.sin(x * 0.004 + time * 0.02 + layer) * amp +
              Math.sin(x * 0.008 + time * 0.03) * (amp * 0.4)
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          const hue = lerp(190, 280, p) + layer * 20
          ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${wWaves * (0.3 - layer * 0.07)})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // flowing particles along the waves
        waveParticles.forEach((wp) => {
          wp.x += wp.speed * (1 + wWaves)
          if (wp.x > canvas.width) wp.x = 0
          const y = cy + Math.sin(wp.x * 0.004 + time * 0.02 + wp.phase) * 60
          const hue = lerp(190, 280, p)
          ctx.beginPath()
          ctx.arc(wp.x, y, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${hue}, 90%, 80%, ${wWaves * 0.8})`
          ctx.fill()
        })
      }

      // ===== SCENE 4: CONVERGENCE FLASH (soft core glow at the very bottom) =====
      if (wConverge > 0.3) {
        const pulse = 0.5 + Math.sin(time * 0.05) * 0.5
        const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220 + pulse * 50)
        flash.addColorStop(0, `hsla(290, 90%, 80%, ${wConverge * 0.28})`)
        flash.addColorStop(0.6, `hsla(270, 90%, 70%, ${wConverge * 0.1})`)
        flash.addColorStop(1, "hsla(270, 90%, 70%, 0)")
        ctx.fillStyle = flash
        ctx.fillRect(cx - 280, cy - 280, 560, 560)
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createStars()
    createWaveParticles()
    onScroll()
    draw()

    window.addEventListener("resize", () => {
      resize()
      createStars()
      createWaveParticles()
    })
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
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