"use client"

import { useEffect, useState } from "react"
import ConnectingDots from "./ConnectingDots"

export default function DotsBackgroundSwitcher({
  targetId,
  divisions = 20,
}: {
  targetId: string
  divisions?: number
}) {
  const [targetInView, setTargetInView] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTargetInView(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px 50% 0px',
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      {!targetInView ? (
        <ConnectingDots mode="uniform" divisions={divisions} />
      ) : null}
    </div>
  )
}


