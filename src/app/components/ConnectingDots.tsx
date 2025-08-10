"use client"

import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"

// Connected points + floating circles hero background
// Ported from the imperative IIFE to a React/Next.js component with GSAP tweens
// Works in Next.js App Router. Add anywhere in your page tree.

// Notes:
// - Uses devicePixelRatio scaling for crisp lines on retina
// - Cleans up RAF + tweens on unmount and on resize
// - Tailwind handles layout; no extra CSS required

export default function ConnectingDots({
  className = "",
  heading = "",
  mode = "mouse",
  divisions = 20,
  bleed = 48,
}: {
  className?: string
  heading?: string
  mode?: "mouse" | "uniform"
  divisions?: number
  bleed?: number
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef<number | null>(null)

  type Point = {
    x: number
    y: number
    originX: number
    originY: number
    active: number
    closest: Point[]
    circle: {
      radius: number
      active: number
      draw: (ctx: CanvasRenderingContext2D, p: Point) => void
    }
  }

  const pointsRef = useRef<Point[]>([])
  const targetRef = useRef({ x: 0, y: 0 })
  const mouseViewportRef = useRef({ x: 0, y: 0, active: false })
  // Always animate; do not pause on scroll

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return dx * dx + dy * dy
  }

  const setupCanvasAndGeometry = () => {
    const container = containerRef.current!
    const canvas = canvasRef.current!

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const bleedPx = Math.max(0, Math.floor(bleed))
    const expandedWidth = containerWidth + bleedPx * 2
    const expandedHeight = containerHeight + bleedPx * 2

    // Hi-DPI scaling
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    canvas.width = Math.floor(expandedWidth * dpr)
    canvas.height = Math.floor(expandedHeight * dpr)
    canvas.style.width = `${expandedWidth}px`
    canvas.style.height = `${expandedHeight}px`
    canvas.style.left = `-${bleedPx}px`
    canvas.style.top = `-${bleedPx}px`
    canvas.style.right = "auto"
    canvas.style.bottom = "auto"

    const ctx = canvas.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx

    targetRef.current = { x: expandedWidth / 2, y: expandedHeight / 2 }

    // Create grid of jittered points
    const points: Point[] = []
    const baseDivs = Math.max(5, Math.floor(divisions))
    // On mobile, reduce divisions to approximately halve point count
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const divs = isMobile
      ? Math.max(5, Math.floor(baseDivs * 0.707)) // ~half the points (since points scale with divs^2)
      : baseDivs
    const stepX = expandedWidth / divs
    const stepY = expandedHeight / divs

    for (let x = 0; x < expandedWidth; x += stepX) {
      for (let y = 0; y < expandedHeight; y += stepY) {
        const px = x + Math.random() * stepX
        const py = y + Math.random() * stepY

        const p: Point = {
          x: px,
          y: py,
          originX: px,
          originY: py,
          active: 0,
          closest: [],
          circle: {
            radius: 2 + Math.random() * 2,
            active: 0,
            draw: (ctx, p) => {
              if (!p.circle.active) return
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.circle.radius, 0, Math.PI * 2, false)
              ctx.fillStyle = `rgba(156,217,249,${p.circle.active})`
              ctx.fill()
            },
          },
        }
        points.push(p)
      }
    }

    // For each point, find the 5 closest
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      const closest: Point[] = new Array(5)

      for (let j = 0; j < points.length; j++) {
        const p2 = points[j]
        if (p1 === p2) continue

        for (let k = 0; k < 5; k++) {
          if (!closest[k]) {
            closest[k] = p2
            break
          }
          if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
            closest[k] = p2
            break
          }
        }
      }

      p1.closest = closest
    }

    pointsRef.current = points

    // Start GSAP shifting tweens for each point
    const startShift = (p: Point) => {
      gsap.to(p, {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        duration: 1 + Math.random(),
        ease: "circ.inOut",
        onComplete: () => startShift(p),
      })
    }

    points.forEach(startShift)
  }

  const drawLines = (p: Point, ctx: CanvasRenderingContext2D) => {
    if (!p.active) return
    for (let i = 0; i < p.closest.length; i++) {
      const c = p.closest[i]
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(c.x, c.y)
      ctx.strokeStyle = `rgba(156,217,249,${p.active})`
      ctx.stroke()
    }
  }

  const animate = () => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Solid black background for the animation
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)
    const points = pointsRef.current
    if (mode === "uniform") {
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        p.active = 0.12
        p.circle.active = 0.45
        drawLines(p, ctx)
        p.circle.draw(ctx, p)
      }
    } else {
      const target = targetRef.current
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const d = getDistance(target, p)
        if (d < 4000) {
          p.active = 0.3
          p.circle.active = 0.6
        } else if (d < 20000) {
          p.active = 0.1
          p.circle.active = 0.3
        } else if (d < 40000) {
          p.active = 0.02
          p.circle.active = 0.1
        } else {
          p.active = 0
          p.circle.active = 0
        }
        drawLines(p, ctx)
        p.circle.draw(ctx, p)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    setupCanvasAndGeometry()
    animate()

    const onMouseMove = (e: MouseEvent) => {
      if (mode !== "mouse") return
      // Track viewport mouse position and map to canvas coordinates
      mouseViewportRef.current = { x: e.clientX, y: e.clientY, active: true }
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onScroll = () => {
      if (mode !== "mouse") return
      // Recalculate canvas-relative target when page scrolls without mouse movement
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const { x, y, active } = mouseViewportRef.current
      if (active) {
        targetRef.current = { x: x - rect.left, y: y - rect.top }
      }
    }

    const onResize = () => {
      // Kill existing tweens to avoid leaks before regenerating
      gsap.killTweensOf(pointsRef.current)
      setupCanvasAndGeometry()
    }

    if (mode === "mouse" && !("ontouchstart" in window)) {
      window.addEventListener("mousemove", onMouseMove)
    }
    window.addEventListener("resize", onResize)
    if (mode === "mouse") {
      window.addEventListener("scroll", onScroll, { passive: true })
    }

    return () => {
      if (mode === "mouse" && !("ontouchstart" in window)) {
        window.removeEventListener("mousemove", onMouseMove)
      }
      window.removeEventListener("resize", onResize)
      if (mode === "mouse") {
        window.removeEventListener("scroll", onScroll)
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // Nuke all tweens for our points
      gsap.killTweensOf(pointsRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Optional content overlay */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {heading ? (
          <h1 className="text-4xl md:text-6xl font-semibold text-white/90 drop-shadow">{heading}</h1>
        ) : null}
      </div>

      {/* No gradient overlay; keep a solid black background for the canvas */}
    </section>
  )
}