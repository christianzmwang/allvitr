'use client'

import { useEffect, useState } from 'react'
import ConnectingDots from './ConnectingDots'

export default function DotsLayer({
  targetId,
  showWhenInView = true,
  mode = 'mouse',
  divisions = 20,
  variant = 'section',
  alwaysVisible = false,
}: {
  targetId: string
  showWhenInView?: boolean
  mode?: 'mouse' | 'uniform'
  divisions?: number
  variant?: 'fixed' | 'section'
  alwaysVisible?: boolean
}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  const visible = alwaysVisible || (showWhenInView ? inView : !inView)

  if (variant === 'fixed') {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        {visible ? <ConnectingDots mode={mode} divisions={divisions} /> : null}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0">
      {visible ? <ConnectingDots mode={mode} divisions={divisions} /> : null}
    </div>
  )
}
