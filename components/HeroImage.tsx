'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'

const HeroImage = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation: scale it down so it's subtle (e.g., max 15 degrees)
    const rotateY = ((x - centerX) / centerX) * 10
    const rotateX = ((centerY - y) / centerY) * 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative transition-all duration-200 ease-out"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="relative overflow-hidden transition-all duration-300 ease-out rounded-2xl"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${rotate.x !== 0 || rotate.y !== 0 ? 1.05 : 1})`,
          boxShadow:
            rotate.x !== 0 || rotate.y !== 0
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.45)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Image
          src="/static/images/homepage_image_2.webp"
          alt="Homepage hero"
          width={600}
          height={600}
          className="h-auto w-full object-cover"
          priority
        />
        {/* Shine effect on hover */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-20"
          style={{
            background: `radial-gradient(circle at ${(rotate.y + 10) * 5}% ${(10 - rotate.x) * 5}%, white, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

export default HeroImage
