'use client'

import React, { useRef, useState } from 'react'
import MousePosition from '../utils/mouse-position'
import ConnectingDots from './ConnectingDots'

export default function Spotlight({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = MousePosition(containerRef)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gray-900 z-0" />
      <div
        className="absolute inset-0 transition-all duration-300 z-0"
        style={{
          opacity: isHovering ? 1 : 0,
          maskImage: `radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 60%)`,
        }}
      >
        <ConnectingDots color="255,255,255" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
