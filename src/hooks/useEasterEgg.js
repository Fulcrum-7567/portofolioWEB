import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function triggerEasterEgg() {
  // Screen flash
  const flash = document.createElement('div')
  flash.style.cssText =
    'position:fixed;inset:0;background:#C8F135;opacity:0.08;z-index:9990;pointer-events:none;'
  document.body.appendChild(flash)
  gsap.to(flash, { opacity: 0, duration: 0.4, onComplete: () => flash.remove() })

  // Notification
  const note = document.createElement('div')
  note.innerHTML =
    '\u201Cyou found it. now go build something.\u201D <span style="color:#888">\u2014 ES</span>'
  note.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(80px);
    background:#1E1E1E; border:0.5px solid #C8F135; color:#F0EDE6;
    font-size:13px; padding:12px 20px; border-radius:8px; z-index:9991;
    font-family:'Inter',sans-serif; white-space:nowrap;
  `
  document.body.appendChild(note)
  gsap.to(note, {
    y: 0,
    opacity: 1,
    duration: 0.4,
    ease: 'power3.out',
    onComplete: () => {
      gsap.to(note, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        delay: 3,
        onComplete: () => note.remove(),
      })
    },
  })
}

export default function useEasterEgg() {
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  useEffect(() => {
    const handleClick = () => {
      clickCount.current++
      clearTimeout(clickTimer.current)
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0
      }, 1500)

      if (clickCount.current >= 5) {
        clickCount.current = 0
        triggerEasterEgg()
      }
    }

    // Delay to ensure the nav logo is rendered
    const timer = setTimeout(() => {
      const logo = document.querySelector('.nav-logo')
      if (logo) {
        logo.addEventListener('click', handleClick)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(clickTimer.current)
      const logo = document.querySelector('.nav-logo')
      if (logo) {
        logo.removeEventListener('click', handleClick)
      }
    }
  }, [])
}
