import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ── Import speaker images ── */
import bsc1 from '../assets/pictures/speaker/bnccSkillClass/bsc1.jpg'
import ai1 from '../assets/pictures/speaker/aiBrainRot/ai1.webp'
import ldka1 from '../assets/pictures/speaker/leadershipCamp/ldka1.jpg'

gsap.registerPlugin(ScrollTrigger)

const speakerData = [
  {
    date: 'May 2026',
    event: 'BNCC Skill Class 2.0',
    title: 'LinkedIn for Better Personal Branding',
    role: 'Panelist · Mentor · Judge',
    detail: 'Mentored 40+ participants. Served as panelist and project judge for a session on personal branding and LinkedIn optimization.',
    image: bsc1,
  },
  {
    date: 'June 2025',
    event: 'Empowering Digital Generation Through AI',
    title: 'Artificial Intelligence & Brain Rot',
    role: 'Speaker · Demonstrator',
    detail: 'Taught AI prompting fundamentals and live-built games (Tic Tac Toe, Snake, Memory Game). Demonstrated Sora, Veo 3, and Suno AI to a live audience.',
    image: ai1,
  },
  {
    date: 'Oct 2024',
    event: 'Youth Leadership Camp — LDKS',
    title: '10 Pillars of Leadership',
    role: 'Keynote Speaker',
    detail: 'Delivered a session on the 10 Pillars of Leadership to incoming student council members at Mitra Harapan Junior High School.',
    image: ldka1,
  },
]

export default function GuestSpeaker() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const panels = section.querySelectorAll('.voice-panel')
    const dots = section.querySelectorAll('.voice-dot')
    const totalPanels = panels.length

    if (totalPanels === 0) return

    // Set first panel active by default
    panels[0].classList.add('is-active')

    // Title animation with immediateRender: false to fix bug
    const voiceTitle = section.querySelector('.section-title')
    const voiceEyebrow = section.querySelector('.section-eyebrow')
    const voiceBody = section.querySelector('.section-body')

    if (voiceTitle) {
      gsap.set(voiceTitle, { opacity: 1, y: 0 }) // safe default
      gsap.from(voiceTitle, {
        scrollTrigger: { trigger: section, start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        immediateRender: false,
      })
    }

    if (voiceEyebrow) {
      gsap.from(voiceEyebrow, {
        scrollTrigger: { trigger: section, start: 'top 85%' },
        y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
        immediateRender: false,
      })
    }

    if (voiceBody) {
      gsap.from(voiceBody, {
        scrollTrigger: { trigger: section, start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power2.out',
        immediateRender: false,
      })
    }

    // Pin + Panel transition
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (totalPanels - 1) * 1.2}`,
      pin: '#voicePinWrapper',
      pinSpacing: true,
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress
        const index = Math.min(
          totalPanels - 1,
          Math.floor(progress * totalPanels)
        )

        panels.forEach((panel, i) => {
          if (i === index) {
            if (!panel.classList.contains('is-active')) {
              panel.classList.add('is-active')
              gsap.fromTo(panel,
                { opacity: 0, scale: 1.03 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
              )
              const content = panel.querySelector('.voice-panel-content')
              if (content) {
                gsap.fromTo(content,
                  { y: 30, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' }
                )
              }
            }
          } else {
            panel.classList.remove('is-active')
          }
        })

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index)
        })
      },
    })

    ScrollTrigger.refresh()

    return () => {
      st.kill()
    }
  }, [])

  return (
    <section className="voice-section" id="voiceSection" ref={sectionRef}>
      <div className="voice-pin-wrapper" id="voicePinWrapper">

        {/* Fixed header — stays visible across all panels */}
        <div className="voice-header">
          <p className="section-eyebrow">Voice</p>
          <h2 className="section-title">
            Not everyone gets<br /><span className="dim">invited to speak.</span>
          </h2>
          <p className="section-body">
            Competing is one thing. Being trusted to teach — that&apos;s another.
            Three times and counting, institutions and organizations have asked
            Excel to stand in front of a room and share what he knows.
          </p>
          {/* Progress indicator: 3 dots */}
          <div className="voice-progress">
            <span className="voice-dot active" data-index="0"></span>
            <span className="voice-dot" data-index="1"></span>
            <span className="voice-dot" data-index="2"></span>
          </div>
        </div>

        {/* Panels — each is a full-screen experience */}
        <div className="voice-panels">
          {speakerData.map((speaker, i) => (
            <div className={`voice-panel${i === 0 ? ' is-active' : ''}`} data-panel={i} key={i}>
              <div className="voice-panel-image" style={{ backgroundImage: `url(${speaker.image})` }}></div>
              <div className="voice-panel-overlay"></div>
              <div className="voice-panel-content">
                <span className="speaker-date">{speaker.date}</span>
                <p className="speaker-event">{speaker.event}</p>
                <h3 className="speaker-title">{speaker.title}</h3>
                <p className="speaker-role">{speaker.role}</p>
                <p className="speaker-detail">{speaker.detail}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
