import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const arcRef = useRef(null)
  const numRef = useRef(null)

  useEffect(() => {
    const circumference = 2 * Math.PI * 80 // ≈ 502.65
    const arc = arcRef.current
    const num = numRef.current
    const loader = loaderRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          y: '-100%',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            loader.style.display = 'none'
            if (onComplete) onComplete()
          }
        })
      }
    })

    const counter = { val: 0 }
    tl.to(counter, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const progress = Math.round(counter.val)
        num.textContent = progress
        const offset = circumference - (progress / 100) * circumference
        arc.style.strokeDashoffset = offset
      }
    }).to({}, { duration: 0.3 }) // hold at 100 for 300ms

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      id="loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D0D0D',
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* SVG Circle Progress */}
        <svg style={{ position: 'absolute' }} width="180" height="180" viewBox="0 0 180 180">
          {/* Track circle */}
          <circle cx="90" cy="90" r="80" fill="none" stroke="#2A2A2A" strokeWidth="3" />
          {/* Progress arc */}
          <circle
            ref={arcRef}
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="#C8F135"
            strokeWidth="3"
            strokeDasharray="502.65"
            strokeDashoffset="502.65"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
        </svg>
        {/* Number display */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span
            ref={numRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              color: '#F0EDE6',
              fontSize: 'clamp(40px, 6vw, 64px)',
            }}
          >
            0
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              color: '#888',
              fontSize: '20px',
              marginTop: '8px',
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* Bottom labels */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          color: '#888',
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Excel Sean
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          color: '#888',
          fontSize: '12px',
          letterSpacing: '0.08em',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Portfolio 2026
      </div>
    </div>
  )
}
