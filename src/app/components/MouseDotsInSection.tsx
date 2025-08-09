"use client"

import { useEffect, useState } from "react"
import ConnectingDots from "./ConnectingDots"

export default function MouseDotsInSection({
  sectionId,
  divisions = 20,
}: {
  sectionId: string
  divisions?: number
}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px 50% 0px',
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionId])

  if (!active) return null

  return (
    <div className="absolute inset-0 z-0">
      <ConnectingDots mode="mouse" divisions={divisions} />
    </div>
  )
}


