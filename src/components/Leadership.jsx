import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ── Import leadership images ── */
// HIMPRENEUR — Head of HR
import hr1 from '../assets/pictures/leadership/HIMPRENEUR/humanResourceHead/HR1.jpg'
// HIMPRENEUR — Company Visit
import cv1 from '../assets/pictures/leadership/HIMPRENEUR/companyVisitCoordinator/CONVIS1.jpg'
import cv2 from '../assets/pictures/leadership/HIMPRENEUR/companyVisitCoordinator/CONVIS2.jpg'
// HIMPRENEUR — Bestari Sponsor
import bestari1 from '../assets/pictures/leadership/HIMPRENEUR/bestariSponsorPIC/bestari1.jpg'
import bestari2 from '../assets/pictures/leadership/HIMPRENEUR/bestariSponsorPIC/bestari2.jpg'
import bestari3 from '../assets/pictures/leadership/HIMPRENEUR/bestariSponsorPIC/bestari3.jpg'
// HIMPRENEUR — PKM Wringinanom
import pkm1 from '../assets/pictures/leadership/HIMPRENEUR/wringinanom/WRG1.webp'
import pkm2 from '../assets/pictures/leadership/HIMPRENEUR/wringinanom/WRG2.webp'
import pkm3 from '../assets/pictures/leadership/HIMPRENEUR/wringinanom/WRG3.webp'
// HIMPRENEUR — DIGICAMP
import digicamp1 from '../assets/pictures/leadership/HIMPRENEUR/digicampContributor/DIGICAMP1.webp'
import digicamp2 from '../assets/pictures/leadership/HIMPRENEUR/digicampContributor/DIGICAMP2.webp'
// HIMPRENEUR — LUMINOVA
import luminova1 from '../assets/pictures/leadership/HIMPRENEUR/luminova_Coordinator/LUM1.webp'
import luminova2 from '../assets/pictures/leadership/HIMPRENEUR/luminova_Coordinator/LUM2.webp'
import luminova3 from '../assets/pictures/leadership/HIMPRENEUR/luminova_Coordinator/LUM3.webp'
// HIMPRENEUR — Bonding, Evaluation & Mentoring
import bem1 from '../assets/pictures/leadership/HIMPRENEUR/bondingEvaluationmentoring/BEM1.webp'
import bem2 from '../assets/pictures/leadership/HIMPRENEUR/bondingEvaluationmentoring/BEM2.webp'
// HIMPRENEUR — Team Building Event
import tb1 from '../assets/pictures/leadership/HIMPRENEUR/teamBuildingEvent/TBE1.webp'
import tb2 from '../assets/pictures/leadership/HIMPRENEUR/teamBuildingEvent/TBE2.webp'
import tb3 from '../assets/pictures/leadership/HIMPRENEUR/teamBuildingEvent/TBE3.webp'
// Freshman Partner
import fp1 from '../assets/pictures/leadership/freshmenPartner/fp1.webp'
import fp2 from '../assets/pictures/leadership/freshmenPartner/fp2.webp'
import fp3 from '../assets/pictures/leadership/freshmenPartner/fp3.webp'
// BNCC — Internal Gathering
import bncc1 from '../assets/pictures/leadership/binaNusantaraComputerClub/internalGathering/ig1.webp'
import bncc2 from '../assets/pictures/leadership/binaNusantaraComputerClub/internalGathering/ig2.webp'
// BNCC — Leadership Development Program
import ldp1 from '../assets/pictures/leadership/binaNusantaraComputerClub/leadershipDevelopmentProgram/ldp1.webp'
import ldp2 from '../assets/pictures/leadership/binaNusantaraComputerClub/leadershipDevelopmentProgram/ldp2.webp'
import ldp3 from '../assets/pictures/leadership/binaNusantaraComputerClub/leadershipDevelopmentProgram/ldp3.webp'

gsap.registerPlugin(ScrollTrigger)

const leadershipData = [
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'Head of Human Resources',
    meta: 'Full-time · Nov 2024 – Jan 2026 · 1 yr 3 mos · Malang, East Java',
    desc: 'Mentored the HR team to resolve workplace conflicts fairly, helping create a more positive organizational culture. Introduced a stricter, more organized hiring process that improved the quality of new recruits by 60%.',
    images: [hr1],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'Coordinator of Company Visit Event Division',
    meta: 'Part-time · Oct 2025 – Dec 2025 · 3 mos · Malang, East Java',
    desc: 'Managed the event flow and schedule for industrial visits to PT Ajinomoto Indonesia and PT Insera Sena.',
    images: [cv1, cv2],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'PIC of Bestari Sponsor Division',
    meta: 'Part-time · Oct 2024 – Oct 2025 · 1 yr 1 mo · Malang, East Java',
    desc: 'Led the team responsible for finding sponsors for the Bestari and Bestrun events, securing funding and building partnerships to ensure these major events ran smoothly.',
    images: [bestari1, bestari2, bestari3],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'PKM Wringinanom Production Lead',
    meta: 'Part-time · Jul 2025 – Aug 2025 · 2 mos · Wringinanom, East Java',
    desc: 'Led a team of photographers and videographers documenting a 2-day community service event by BINUS Business School in Wringinanom Regency. Produced the official aftermovie and directed shot lists and camera angles for high-quality visual storytelling.',
    images: [pkm1, pkm2, pkm3],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'DIGICAMP Contributor',
    meta: 'Part-time · Jul 2025 · 1 mo · Malang, East Java',
    desc: 'Took on several diverse roles representing HIMPRENEUR in an 8-day annual event introducing high school students to campus life through trial classes, bazaars, and organization booths — representing BINUS Business School.',
    images: [digicamp1, digicamp2],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'Coordinator of LUMINOVA Security Division',
    meta: 'Part-time · Jun 2025 – Jul 2025 · 2 mos · Malang, East Java',
    desc: 'Led a 1-month community service collaboration with HIMTI, tutoring high school students at SMK 5, 10, 11 Malang and SMA Kalam Kudus Malang on UI/UX and Business Model Canvas concepts.',
    images: [luminova1, luminova2, luminova3],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'PIC of Bonding, Evaluation & Mentoring',
    meta: 'Part-time · Feb 2025 – Jul 2025 · 6 mos · Malang, East Java',
    desc: 'Led a monthly internal program strengthening team cohesion and professional growth — combining bonding activities, expert-led mentoring sessions, and structured evaluation for continuous improvement.',
    images: [bem1, bem2],
  },
  {
    org: 'HIMPRENEUR BINUS @ Malang',
    role: 'PIC of HIMPRENEUR Team Building Event',
    meta: 'Part-time · May 2025 · 1 mo · Malang, East Java',
    desc: 'Designed an event to develop members\' leadership skills while scouting high-potential individuals as future successors.',
    images: [tb1, tb2, tb3],
  },
  {
    org: 'BINUS University',
    role: 'Freshman Partner',
    meta: 'Part-time · Sep 2024 – Sep 2025 · 1 yr 1 mo · Malang, East Java',
    desc: 'Led and mentored 7+ freshmen in executing impactful community service projects while supporting their academic, personal, and leadership growth throughout the academic year.',
    images: [fp1, fp2, fp3],
  },
  {
    org: 'Bina Nusantara Computer Club (BNCC)',
    role: 'Internal Gathering Event Coordinator',
    meta: 'Part-time · May 2025 – Jul 2025 · 3 mos · Malang, East Java',
    desc: 'Directed the event team, delegating and overseeing tasks. Planned the overall event flow including interactive games and team-building activities, strengthening belonging across the team.',
    images: [bncc1, bncc2],
  },
  {
    org: 'Bina Nusantara Computer Club (BNCC)',
    role: 'Leadership Development Program Mentor',
    meta: 'Part-time · Jan 2025 – Apr 2025 · 4 mos · Malang, East Java',
    desc: 'Mentored 8 BNCC activists through the Leadership Development Program, providing coaching and helping them refine their work plan ("Raker") presentations and proposals for review by activists, seniors, and judges.',
    images: [ldp1, ldp2, ldp3],
  },
]

export default function Leadership() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const panels = section.querySelectorAll('.lead-panel')
    const counterEl = section.querySelector('#leadCurrentNum')
    const totalPanels = panels.length

    if (totalPanels === 0) return

    // Set first panel active
    panels[0].classList.add('is-active')

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (totalPanels - 1) * 1}`,
      pin: '#leadPinWrapper',
      pinSpacing: true,
      scrub: 0.4,
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

              // Image collage staggered entrance
              gsap.fromTo(panel.querySelectorAll('.lead-img'),
                { scale: 1.08, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
              )

              // Text content entrance
              const contentChildren = panel.querySelector('.lead-panel-content')?.children
              if (contentChildren) {
                gsap.fromTo(contentChildren,
                  { y: 25, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, delay: 0.15, ease: 'power2.out' }
                )
              }
            }
          } else {
            panel.classList.remove('is-active')
          }
        })

        // Update counter
        if (counterEl) {
          counterEl.textContent = String(index + 1).padStart(2, '0')
        }
      },
    })

    ScrollTrigger.refresh()

    return () => {
      st.kill()
    }
  }, [])

  return (
    <section className="leadership-section" id="leadershipSection" ref={sectionRef}>
      <div className="lead-pin-wrapper" id="leadPinWrapper">

        {/* Section label (persists across all panels) */}
        <div className="lead-meta-bar">
          <p className="section-eyebrow">Leadership</p>
          <p className="lead-counter"><span id="leadCurrentNum">01</span> / {leadershipData.length}</p>
        </div>

        <div className="lead-panels">
          {leadershipData.map((item, i) => (
            <div className={`lead-panel${i === 0 ? ' is-active' : ''}`} data-panel={i} key={i}>
              <div className={`lead-panel-images count-${item.images.length >= 3 ? 3 : 2}`}>
                {item.images.map((img, j) => (
                  <div className="lead-img" style={{ backgroundImage: `url(${img})` }} key={j}></div>
                ))}
              </div>
              <div className="lead-panel-content">
                <p className="lead-org-label">{item.org}</p>
                <h3 className="lead-role-title">{item.role}</h3>
                <p className="lead-panel-meta">{item.meta}</p>
                <p className="lead-panel-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
