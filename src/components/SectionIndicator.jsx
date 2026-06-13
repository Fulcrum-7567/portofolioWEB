import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  { id: 'hero', label: 'INTRO' },
  { id: 'story', label: 'ORIGIN' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'skills', label: 'CAPABILITIES' },
  { id: 'leadership', label: 'LEADERSHIP' },
  { id: 'contact', label: 'CONTACT' },
]

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState('INTRO')

  useEffect(() => {
    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const triggers = sections.map((section) => {
        const el = document.getElementById(section.id)
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(section.label),
          onEnterBack: () => setActiveSection(section.label),
        })
      })

      return () => triggers.forEach((t) => t?.kill())
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="section-indicator">
      <span className="section-indicator-text">{activeSection}</span>
    </div>
  )
}
