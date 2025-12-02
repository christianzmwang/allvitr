'use client'

import { useEffect, useRef } from 'react'

type Letter = {
  char: string
  color: string
  startColor: string
  targetColor: string
  colorProgress: number
}

type LetterGlitchProps = {
  className?: string
  glitchColors?: string[]
  glitchSpeed?: number
  centerVignette?: boolean
  outerVignette?: boolean
  smooth?: boolean
  characters?: string
}

const DEFAULT_COLORS = ['#2b4539', '#61dca3', '#61b3dc']
const DEFAULT_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'

const interpolateColor = (
  start: { r: number; g: number; b: number },
  end: { r: number; g: number; b: number },
  factor: number
) => {
  const clampFactor = Math.min(Math.max(factor, 0), 1)
  const r = Math.round(start.r + (end.r - start.r) * clampFactor)
  const g = Math.round(start.g + (end.g - start.g) * clampFactor)
  const b = Math.round(start.b + (end.b - start.b) * clampFactor)
  return `rgb(${r}, ${g}, ${b})`
}

const parseColor = (value: string) => {
  const hexMatch = /^#?([a-f\d]{6})$/i.exec(value.replace('#', ''))
  if (hexMatch) {
    const [r, g, b] = hexMatch[1].match(/.{2}/g)!.map(component => parseInt(component, 16))
    return { r, g, b }
  }

  const rgbMatch = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.exec(value)
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    }
  }

  return null
}

export default function LetterGlitchBackground({
  className,
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = DEFAULT_CHARACTERS,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const lettersRef = useRef<Letter[]>([])
  const gridRef = useRef({ columns: 0, rows: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const lastGlitchTimeRef = useRef(Date.now())

  const lettersAndSymbols = Array.from(characters)

  const fontSize = 16
  const charWidth = 10
  const charHeight = 20

  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)]
  }

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)]
  }

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.max(1, Math.ceil(width / charWidth))
    const rows = Math.max(1, Math.ceil(height / charHeight))
    return { columns, rows }
  }

  const initializeLetters = (columns: number, rows: number) => {
    const totalLetters = columns * rows
    lettersRef.current = Array.from({ length: totalLetters }, () => {
      const color = getRandomColor()
      return {
        char: getRandomChar(),
        color,
        startColor: color,
        targetColor: getRandomColor(),
        colorProgress: 1,
      }
    })
    gridRef.current = { columns, rows }
  }

  const drawLetters = () => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx || gridRef.current.columns === 0) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = 'top'

    lettersRef.current.forEach((letter, index) => {
      const column = index % gridRef.current.columns
      const row = Math.floor(index / gridRef.current.columns)
      const x = column * charWidth
      const y = row * charHeight
      ctx.fillStyle = letter.color
      ctx.fillText(letter.char, x, y)
    })
  }

  const updateLetters = () => {
    const total = lettersRef.current.length
    if (total === 0) return

    const updates = Math.max(1, Math.floor(total * 0.05))
    for (let i = 0; i < updates; i += 1) {
      const index = Math.floor(Math.random() * total)
      const letter = lettersRef.current[index]
      if (!letter) continue

      letter.char = getRandomChar()
      letter.startColor = letter.color
      letter.targetColor = getRandomColor()

      if (!smooth) {
        letter.color = letter.targetColor
        letter.startColor = letter.targetColor
        letter.colorProgress = 1
      } else {
        letter.colorProgress = 0
      }
    }
  }

  const handleSmoothTransitions = () => {
    if (!smooth) return

    let needsRedraw = false

    lettersRef.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        const startRgb = parseColor(letter.startColor)
        const endRgb = parseColor(letter.targetColor)

        if (!startRgb || !endRgb) {
          letter.color = letter.targetColor
          letter.startColor = letter.targetColor
          letter.colorProgress = 1
          needsRedraw = true
          return
        }

        letter.colorProgress = Math.min(1, letter.colorProgress + 0.05)
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress)

        if (letter.colorProgress === 1) {
          letter.color = letter.targetColor
          letter.startColor = letter.targetColor
        }

        needsRedraw = true
      }
    })

    if (needsRedraw) {
      drawLetters()
    }
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = contextRef.current
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height)
    initializeLetters(columns, rows)
    drawLetters()
  }

  const animate = () => {
    const now = Date.now()
    if (now - lastGlitchTimeRef.current >= glitchSpeed) {
      updateLetters()
      drawLetters()
      lastGlitchTimeRef.current = now
    }

    handleSmoothTransitions()
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    contextRef.current = canvas.getContext('2d')
    if (!contextRef.current) return

    resizeCanvas()
    animate()

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        resizeCanvas()
        animate()
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [glitchSpeed, smooth, glitchColors, characters, animate, resizeCanvas])

  const containerClassName = ['relative w-full h-full overflow-hidden bg-black', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      <canvas ref={canvasRef} className="block h-full w-full" />

      {outerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]" />
      )}

      {centerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  )
}
