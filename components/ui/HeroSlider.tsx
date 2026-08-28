'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Slide {
  id: number
  url: string
  link?: string | null
  tomTat?: string | null
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (!slides.length) return null

  return (
    <div className="slider-section" style={{ position: 'relative', background: '#000' }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div key={slide.id} style={{
          display: i === current ? 'block' : 'none',
          position: 'relative',
        }}>
          <Link href={slide.link || '/'}>
            <Image
              src={slide.url.replace('/uploadwb/', '/uploads/')}
              alt={slide.tomTat || `Slide ${i + 1}`}
              width={1400}
              height={500}
              style={{ width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover', display: 'block' }}
              priority={i === 0}
            />
          </Link>
        </div>
      ))}

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous" style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 44, height: 44, fontSize: 20, cursor: 'pointer', zIndex: 10,
          }}>‹</button>
          <button onClick={next} aria-label="Next" style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 44, height: 44, fontSize: 20, cursor: 'pointer', zIndex: 10,
          }}>›</button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} style={{
                width: i === current ? 24 : 8, height: 8,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0,
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
