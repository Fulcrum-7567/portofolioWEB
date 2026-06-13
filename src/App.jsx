import React, { useState, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import Lenis from 'lenis'
import Loader from './components/Loader'
import Marquee from './components/Marquee'
import GuestSpeaker from './components/GuestSpeaker'
import Leadership from './components/Leadership'
import SectionIndicator from './components/SectionIndicator'
import useScrollAnimations from './hooks/useScrollAnimations'
import useEasterEgg from './hooks/useEasterEgg'
import myFaceImg from './assets/pictures/myFace.webp'
import './App.css'

/* Smooth scroll approach: Using Lenis (free, MIT-licensed) as ScrollSmoother fallback.
   ScrollSmoother requires GSAP Club membership. Lenis pairs well with ScrollTrigger. */
gsap.registerPlugin(ScrollTrigger, Draggable)

/* ──────────────────────────────────────────────
   Achievement data (for detail panel)
   ────────────────────────────────────────────── */
const achData = {
  a1: {
    rank: '🥇 1st Place · International',
    title: 'SCUBA International Business Plan Competition',
    org: 'Faculty of Economics and Business, Brawijaya University · Nov 2024',
    tags: ['Business Plan', 'International', 'Top 10 Finalist', 'Mentored by BINUS Faculty'],
    body: 'Winner among 10 finalists selected from hundreds of participants across Indonesia. The pitch centered on LABORA — a digital workforce placement agency connecting skilled Indonesian workers with international job opportunities in construction, engineering, and manufacturing, with built-in job matching, document management, and worker protection systems.',
  },
  a2: {
    rank: '🏅 National Finalist',
    title: 'Hult Prize National Summit',
    org: 'Institut Teknologi Bandung · May 2026',
    tags: ['Social Entrepreneurship', 'National Stage', 'Top 37 Nationally'],
    body: "Selected as one of 37 national finalists to compete at the Hult Prize National Summit at ITB — Indonesia's most prestigious technical university. Competed alongside the country's most driven student entrepreneurs in a high-pressure environment built around solving real-world social challenges through business.",
  },
  a3: {
    rank: '🥇 1st Place · National',
    title: 'BMPC Business Pitch Competition',
    org: 'Bina Nusantara University · May 2024',
    tags: ['Business Pitch', 'National', '1st Year'],
    body: 'Won 1st place at the BMPC Business Pitch Competition hosted at Bina Nusantara University. A formative early competition that sharpened pitch delivery, business model structuring, and pressure performance — all in the first year of university.',
  },
  a4: {
    rank: '🥉 Top 3 · Social Impact',
    title: 'Best Social Ideation — Grease Gone',
    org: 'Pikiran Terbaik Negeri (BUMN) · Aug 2025',
    tags: ['Sustainability', 'Grant Recipient', 'Social Impact', 'SME Focus'],
    body: 'Top 3 winner and grant recipient for Grease Gone — an innovative grease trap filter made from recycled human hair, designed to simplify grease management for households and SMEs in the F&B sector. The project secured grant funding and mentorship from ANGIN Advisory, a leading Indonesian impact investment network.',
  },
  a5: {
    rank: '🥇 Gold Medal · International',
    title: 'International Youthpreneur Competition',
    org: 'Inventify Center · May 2025',
    tags: ['Innovation Award', 'Gold Medal', 'International', 'Dual Award'],
    body: 'Received two awards from one submission: the Gold Medal and the Innovation Business Award at the International Youthpreneur Competition hosted by Inventify Center. The submitted concept — DreamBound — is a digital workforce placement platform connecting skilled Indonesian workers with international employment opportunities.',
  },
}

/* ──────────────────────────────────────────────
   Achievement card selection
   ────────────────────────────────────────────── */
let activeAch = null

function selectAch(id) {
  const panel = document.getElementById('achDetailPanel')
  const data = achData[id]
  if (!data || !panel) return

  // If clicking the already active card, close
  if (activeAch === id) {
    closeAchDetail()
    return
  }

  // Remove active from all cards
  document.querySelectorAll('.ach-card').forEach((c) => c.classList.remove('is-active'))

  // Set active card
  const activeCard = document.querySelector(`[data-ach="${id}"]`)
  if (activeCard) activeCard.classList.add('is-active')
  activeAch = id

  // Populate panel content
  document.getElementById('detailRank').textContent = data.rank
  document.getElementById('detailTitle').textContent = data.title
  document.getElementById('detailOrg').textContent = data.org
  document.getElementById('detailBody').textContent = data.body

  // Tags
  const tagsEl = document.getElementById('detailTags')
  tagsEl.innerHTML = ''
  data.tags.forEach((tag) => {
    const span = document.createElement('span')
    span.className = 'ach-tag'
    span.textContent = tag
    tagsEl.appendChild(span)
  })

  // Open panel with GSAP
  panel.setAttribute('aria-hidden', 'false')
  panel.classList.add('open')

  gsap.fromTo(
    panel,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  )

  // Scroll panel into view
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, 100)
}

function closeAchDetail() {
  const panel = document.getElementById('achDetailPanel')
  if (!panel) return
  gsap.to(panel, {
    opacity: 0,
    y: 10,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      panel.classList.remove('open')
      panel.setAttribute('aria-hidden', 'true')
    },
  })
  document.querySelectorAll('.ach-card').forEach((c) => c.classList.remove('is-active'))
  activeAch = null
}

// Expose to window for onclick handlers
if (typeof window !== 'undefined') {
  window.selectAch = selectAch
  window.closeAchDetail = closeAchDetail
}

/* ──────────────────────────────────────────────
   Headline decode/scramble effect
   ────────────────────────────────────────────── */
function initDecodeEffect() {
  const headline = document.querySelector('.hero-headline')
  if (!headline) return

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'
  let isDecoding = false
  let cooldown = false

  const lines = headline.querySelectorAll('span.line1, span.line2')

  lines.forEach((line) => {
    const originalText = line.textContent
    const isAccent = line.classList.contains('line2')
    line.innerHTML = ''

      ;[...originalText].forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char
        span.dataset.original = char
        if (isAccent) span.style.color = '#C8F135'
        line.appendChild(span)
      })
  })

  headline.addEventListener('mouseenter', () => {
    if (isDecoding || cooldown) return
    isDecoding = true

    const allSpans = headline.querySelectorAll('span.line1 span, span.line2 span')
    const totalChars = allSpans.length
    const decodeDelay = 1400 / totalChars

    const intervals = []
    allSpans.forEach((span, i) => {
      if (span.dataset.original === ' ') return
      const interval = setInterval(() => {
        span.textContent = chars[Math.floor(Math.random() * chars.length)]
      }, 45)
      intervals.push({ interval, span, index: i })
    })

    intervals.forEach(({ interval, span }, i) => {
      setTimeout(() => {
        clearInterval(interval)
        span.textContent = span.dataset.original
        if (span.closest('.line2')) span.style.color = '#C8F135'
      }, i * decodeDelay)
    })

    setTimeout(() => {
      isDecoding = false
      cooldown = true
      setTimeout(() => {
        cooldown = false
      }, 2000)
    }, 1400 + 300)
  })
}

/* ──────────────────────────────────────────────
   Hero mouse parallax effect
   ────────────────────────────────────────────── */
function initHeroParallax() {
  const hero = document.querySelector('.hero')
  const parallaxLayers = document.querySelectorAll('.parallax-layer')
  if (!hero || parallaxLayers.length === 0) return

  let heroParallaxActive = true

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onLeave: () => { heroParallaxActive = false },
    onEnterBack: () => { heroParallaxActive = true },
  })

  window.addEventListener('mousemove', (e) => {
    if (!heroParallaxActive) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    parallaxLayers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth)
      const moveX = dx * depth * -1
      const moveY = dy * depth * -1
      gsap.to(layer, { x: moveX, y: moveY, duration: 1.2, ease: 'power2.out' })
    })
  })
}

/* ──────────────────────────────────────────────
   Word wrapper for quote animation
   ────────────────────────────────────────────── */
function initQuoteWordWrap() {
  const quoteEl = document.querySelector('.story-quote-text')
  if (!quoteEl) return

  const fragment = document.createDocumentFragment()
  quoteEl.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/)
      words.forEach((word) => {
        if (word.trim() === '') {
          fragment.appendChild(document.createTextNode(word))
        } else {
          const span = document.createElement('span')
          span.className = 'word'
          span.textContent = word
          span.style.display = 'inline-block'
          fragment.appendChild(span)
        }
      })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false)
      clone.className = (clone.className || '') + ' word'
      clone.style.display = 'inline-block'
      clone.textContent = node.textContent
      fragment.appendChild(clone)
    }
  })
  quoteEl.innerHTML = ''
  quoteEl.appendChild(fragment)
}

/* ──────────────────────────────────────────────
   Hero entrance animation
   ────────────────────────────────────────────── */
function initHeroAnimation() {
  const tl = gsap.timeline()

  tl.from('.hero-headline .line1', { y: 80, opacity: 0, duration: 0.9, ease: 'power3.out' })
    .from('.hero-headline .line2', { y: 80, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('.hero-tags .tag', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3')
    .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')

  tl.call(() => {
    initDecodeEffect()
    initHeroParallax()
    initQuoteWordWrap()
  })
}

/* ──────────────────────────────────────────────
   Main App Component
   ────────────────────────────────────────────── */
function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const mainRef = useRef(null)

  const lenisRef = useRef(null)

  const handleLoaderComplete = useCallback(() => {
    setIsLoaded(true)
    if (mainRef.current) {
      gsap.set(mainRef.current, { visibility: 'visible' })
      gsap.to(mainRef.current, { opacity: 1, duration: 0.4 })
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after Lenis init
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    setTimeout(() => initHeroAnimation(), 100)
  }, [])

  useScrollAnimations(isLoaded)
  useEasterEgg()

  useEffect(() => {
    if (!isLoaded) return

    const timer = setTimeout(() => {
      const navLinks = document.querySelectorAll('.nav-links a')
      const sectionMap = [
        { el: document.getElementById('story'), index: 0 },
        { el: document.getElementById('achievements'), index: 1 },
        { el: document.getElementById('skills'), index: 2 },
        { el: document.getElementById('contact'), index: 3 },
      ]

      sectionMap.forEach(({ el, index }) => {
        if (!el || !navLinks[index]) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            navLinks.forEach((l) => l.classList.remove('active'))
            navLinks[index].classList.add('active')
          },
          onEnterBack: () => {
            navLinks.forEach((l) => l.classList.remove('active'))
            navLinks[index].classList.add('active')
          },
        })
      })

      // ── Draggable decorative elements ──
      document.querySelectorAll('.drag-object').forEach((el) => {
        Draggable.create(el, {
          type: 'x,y',
          bounds: el.closest('section') || el.parentElement,
          edgeResistance: 0.65,
          onDragStart: function () {
            gsap.to(this.target, { scale: 1.08, duration: 0.2 })
          },
          onDragEnd: function () {
            gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'power2.out' })
          },
        })
      })

      // ── Entrance animation for drag objects ──
      gsap.from('.drag-object', {
        scrollTrigger: { trigger: '.drag-object', start: 'top 90%' },
        opacity: 0,
        scale: 0.7,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
      })
    }, 600)

    return () => {
      clearTimeout(timer)
      // Clean up Lenis on unmount
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [isLoaded])

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      <SectionIndicator />

      <div ref={mainRef} id="mainContent" style={{ opacity: 0, visibility: 'hidden' }}>
        {/* ══════ NAV ══════ */}
        <nav>
          <span className="nav-logo">EXCEL SEAN</span>
          <div className="nav-links">
            <a href="#story">Story</a>
            <a href="#achievements">Work</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
          <a href="#contact" className="nav-cta">Let&apos;s talk →</a>
        </nav>

        {/* ══════ HERO ══════ */}
        <section id="hero" className="hero">
          <div className="parallax-layer" data-depth="0.008" id="parallaxGrid"></div>
          <div className="parallax-layer" data-depth="0.02" id="parallaxGlow"></div>
          <div className="parallax-layer" data-depth="0.035" id="parallaxParticles">
            <span className="particle" style={{ top: '15%', left: '12%', width: '5px', height: '5px', opacity: 0.25 }}></span>
            <span className="particle" style={{ top: '72%', left: '8%', width: '3px', height: '3px', opacity: 0.15 }}></span>
            <span className="particle" style={{ top: '30%', left: '78%', width: '7px', height: '7px', opacity: 0.35 }}></span>
            <span className="particle" style={{ top: '65%', left: '85%', width: '4px', height: '4px', opacity: 0.2 }}></span>
            <span className="particle" style={{ top: '45%', left: '55%', width: '3px', height: '3px', opacity: 0.18 }}></span>
            <span className="particle" style={{ top: '20%', left: '40%', width: '6px', height: '6px', opacity: 0.3 }}></span>
            <span className="particle" style={{ top: '80%', left: '60%', width: '4px', height: '4px', opacity: 0.22 }}></span>
            <span className="particle" style={{ top: '10%', left: '90%', width: '5px', height: '5px', opacity: 0.28 }}></span>
          </div>
          <div className="parallax-layer" data-depth="0.012" id="parallaxUI"></div>

          {/* Draggable decoration — Hero */}
          <div className="drag-object" id="dragObject1"><span>EST. 2023</span></div>

          <div className="port">
            <h1 className="hero-headline">
              <span className="line1">Experience outranks</span>
              <span className="line2 accent">Everything</span>
            </h1>
            <p className="hero-sub">
              Business thinker. Builder. Competitor. I&apos;ve been solving real problems since
              before most people finish their first year of university.
            </p>
            <div className="hero-tags">
              <span className="tag">🏆 6× Competition Winner</span>
              <span className="tag">👥 Led 100+ People</span>
              <span className="tag">🌏 National &amp; International</span>
              <span className="tag">⚡ Currently Year 3</span>
            </div>
            <p className="hero-scroll">
              <span className="scroll-line"></span> Scroll to meet me
            </p>
          </div>
        </section>

        <Marquee />

        {/* ══════ STORY / ORIGIN ══════ */}
        <section id="story" style={{ position: 'relative' }}>
          {/* Draggable decoration — Origin */}
          <div className="drag-object shape-square" id="dragObject2"></div>

          <div className="port">
            <p className="section-eyebrow">Origin</p>
            <h2 className="section-title">
              Not a typical student.
              <br />
              <span className="dim">Never was.</span>
            </h2>
            <div className="story-layout">
              <div>
                <p className="section-body">
                  While most 1st and 2nd year students were figuring out their schedules, I was
                  thriving in many organizations at the same time while competing in national and
                  international stages. Not because I had to, but because staying still never felt
                  like an option.
                </p>

                <div className="story-quote-block">
                  <span className="deco-quote deco-open">&ldquo;</span>
                  <p className="story-quote-text">
                    You are the average of the{' '}
                    <strong>Five People</strong>{' '}
                    you spend the most time with.
                  </p>
                  <span className="deco-quote deco-close">&rdquo;</span>
                </div>

                <p className="section-body">
                  Double Degree Undergraduate in Business and Information Systems with a strong
                  interest in business strategy, business competitions, and artificial intelligence.
                  Passionate about sharing knowledge and helping others learn.
                </p>
                <div className="story-pills">
                  <span className="story-pill">Business Strategy</span>
                  <span className="story-pill">Product Thinking</span>
                  <span className="story-pill">People Leadership</span>
                  <span className="story-pill">Generalist</span>
                </div>
              </div>

              {/* ─── Origin Photo ─── */}
              <div className="origin-photo-wrapper">
                <div className="origin-photo-accent-line"></div>
                <div className="origin-photo-container">
                  <img
                    src={myFaceImg}
                    alt="Excel Sean"
                    className="origin-photo-img"
                  />
                </div>
                <p className="origin-photo-caption">Excel Sean · Year 3, BINUS University</p>
              </div>
            </div>
          </div>
        </section>

        <GuestSpeaker />
        <Marquee />

        {/* ══════ ACHIEVEMENTS ══════ */}
        <section id="achievements" className="ach-section">
          <div className="port">
            <p className="section-eyebrow">Achievements</p>
            <h2 className="section-title">
              Competed. Won.
              <br />
              <span className="dim">Repeated.</span>
            </h2>

            <div className="ach-grid" id="achGrid">
              {/* Card 1 — SCUBA */}
              <div className="ach-card" data-ach="a1" onClick={() => selectAch('a1')}>
                <div className="ach-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80')" }}></div>
                <div className="ach-bg-overlay"></div>
                <span className="ach-ghost-num">01</span>
                <div className="ach-card-body">
                  <p className="ach-rank">🥇 1st Place · International</p>
                  <h3 className="ach-name">SCUBA International Business Plan Competition</h3>
                  <p className="ach-org">Brawijaya University · Nov 2024</p>
                  <div className="ach-tags">
                    <span className="ach-tag">Business Plan</span>
                    <span className="ach-tag">International</span>
                    <span className="ach-tag">Top 10 Finalist</span>
                  </div>
                </div>
                <span className="ach-arrow">↗</span>
              </div>

              {/* Card 2 — Hult Prize */}
              <div className="ach-card" data-ach="a2" onClick={() => selectAch('a2')}>
                <div className="ach-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80')" }}></div>
                <div className="ach-bg-overlay"></div>
                <span className="ach-ghost-num">02</span>
                <div className="ach-card-body">
                  <p className="ach-rank">🏅 National Finalist</p>
                  <h3 className="ach-name">Hult Prize National Summit</h3>
                  <p className="ach-org">Institut Teknologi Bandung · May 2026</p>
                  <div className="ach-tags">
                    <span className="ach-tag">Social Impact</span>
                    <span className="ach-tag">National Stage</span>
                    <span className="ach-tag">Top 37</span>
                  </div>
                </div>
                <span className="ach-arrow">↗</span>
              </div>

              {/* Card 3 — BMPC */}
              <div className="ach-card" data-ach="a3" onClick={() => selectAch('a3')}>
                <div className="ach-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80')" }}></div>
                <div className="ach-bg-overlay"></div>
                <span className="ach-ghost-num">03</span>
                <div className="ach-card-body">
                  <p className="ach-rank">🥇 1st Place · National</p>
                  <h3 className="ach-name">BMPC Business Pitch Competition</h3>
                  <p className="ach-org">Bina Nusantara University · May 2024</p>
                  <div className="ach-tags">
                    <span className="ach-tag">Pitch</span>
                    <span className="ach-tag">National</span>
                    <span className="ach-tag">Business</span>
                  </div>
                </div>
                <span className="ach-arrow">↗</span>
              </div>

              {/* Card 4 — Grease Gone */}
              <div className="ach-card" data-ach="a4" onClick={() => selectAch('a4')}>
                <div className="ach-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80')" }}></div>
                <div className="ach-bg-overlay"></div>
                <span className="ach-ghost-num">04</span>
                <div className="ach-card-body">
                  <p className="ach-rank">🥉 Top 3 · Social Impact</p>
                  <h3 className="ach-name">Best Social Ideation — Grease Gone</h3>
                  <p className="ach-org">Pikiran Terbaik Negeri (BUMN) · Aug 2025</p>
                  <div className="ach-tags">
                    <span className="ach-tag">Sustainability</span>
                    <span className="ach-tag">Grant Recipient</span>
                    <span className="ach-tag">Social Impact</span>
                  </div>
                </div>
                <span className="ach-arrow">↗</span>
              </div>

              {/* Card 5 — Inventify */}
              <div className="ach-card" data-ach="a5" onClick={() => selectAch('a5')}>
                <div className="ach-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80')" }}></div>
                <div className="ach-bg-overlay"></div>
                <span className="ach-ghost-num">05</span>
                <div className="ach-card-body">
                  <p className="ach-rank">🥇 Gold Medal · International</p>
                  <h3 className="ach-name">International Youthpreneur Competition</h3>
                  <p className="ach-org">Inventify Center · May 2025</p>
                  <div className="ach-tags">
                    <span className="ach-tag">Innovation</span>
                    <span className="ach-tag">Gold Medal</span>
                    <span className="ach-tag">International</span>
                  </div>
                </div>
                <span className="ach-arrow">↗</span>
              </div>
            </div>

            {/* ─── Detail Panel ─── */}
            <div className="ach-detail-panel" id="achDetailPanel" aria-hidden="true">
              <div className="ach-detail-inner">
                <div className="ach-detail-meta">
                  <p className="ach-detail-rank" id="detailRank"></p>
                  <h3 className="ach-detail-title" id="detailTitle"></h3>
                  <p className="ach-detail-org" id="detailOrg"></p>
                  <div className="ach-detail-tags" id="detailTags"></div>
                </div>
                <div className="ach-detail-story">
                  <p className="ach-detail-body" id="detailBody"></p>
                </div>
                <button className="ach-detail-close" onClick={() => closeAchDetail()} aria-label="Close">✕</button>
              </div>
            </div>
          </div>
        </section>

        <Marquee />

        {/* ══════ SKILLS / CAPABILITIES ══════ */}
        <section id="skills" style={{ position: 'relative' }}>
          {/* Draggable decoration — Capabilities */}
          <div className="drag-object" id="dragObject3"><span>always learning</span></div>

          <div className="port">
            <p className="section-eyebrow">Capabilities</p>
            <h2 className="section-title">
              Think. Connect.
              <br />
              <span className="dim">Build.</span>
            </h2>
            <p className="section-body">
              Three axes that define how I work. Not siloed — these overlap in everything I do.
            </p>
            <div className="skills-layout">
              <div className="skill-col">
                <p className="skill-col-label">Think</p>
                <p className="skill-col-title">Business &amp;<br />Strategy</p>
                <ul className="skill-list">
                  <li><span className="skill-dot"></span>Business Development</li>
                  <li><span className="skill-dot"></span>Problem Framing</li>
                  <li><span className="skill-dot"></span>Data Analytics</li>
                  <li><span className="skill-dot"></span>Digital Marketing</li>
                  <li><span className="skill-dot"></span>Project Management</li>
                </ul>
              </div>
              <div className="skill-col">
                <p className="skill-col-label">Connect</p>
                <p className="skill-col-title">People &amp;<br />Leadership</p>
                <ul className="skill-list">
                  <li><span className="skill-dot"></span>HR Development</li>
                  <li><span className="skill-dot"></span>Conflict Resolution</li>
                  <li><span className="skill-dot"></span>Public Speaking</li>
                  <li><span className="skill-dot"></span>Mentorship</li>
                  <li><span className="skill-dot"></span>Recruitment Design</li>
                </ul>
              </div>
              <div className="skill-col">
                <p className="skill-col-label">Build</p>
                <p className="skill-col-title">Tech &amp;<br />Product</p>
                <ul className="skill-list">
                  <li><span className="skill-dot"></span>Web Development</li>
                  <li><span className="skill-dot"></span>UI/UX (Figma)</li>
                  <li><span className="skill-dot"></span>Data Visualization</li>
                  <li><span className="skill-dot"></span>AI Tools &amp; Prompting</li>
                  <li><span className="skill-dot"></span>Prototyping</li>
                </ul>
              </div>
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              <p style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500 }}>
                Tech I&apos;m comfortable with
              </p>
              <div className="tech-row">
                <span className="tech-badge primary">HTML</span>
                <span className="tech-badge primary">CSS</span>
                <span className="tech-badge primary">JavaScript</span>
                <span className="tech-badge primary">GSAP</span>
                <span className="tech-badge">Figma</span>
                <span className="tech-badge">Canva</span>
                <span className="tech-badge">Affinity</span>
                <span className="tech-badge">Visual Paradigm</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ LEADERSHIP ══════ */}
        <Leadership />

        {/* ══════ CLOSE / CONTACT ══════ */}
        <div id="contact" className="close-section" style={{ position: 'relative' }}>
          {/* Draggable decoration — Contact */}
          <div className="drag-object shape-circle" id="dragObject4"><span>say hi</span></div>

          <h2 className="close-headline">
            Ready to build
            <br />
            <span style={{ color: 'var(--accent)' }}>something real?</span>
          </h2>
          <p className="close-sub">
            I&apos;m currently looking for opportunities where curiosity, execution, and people
            skills matter more than a single job title.
          </p>
          <div className="close-btns">
            <a href="mailto:excelsean777@gmail.com" className="btn-primary">Get in touch →</a>
            <a href="#" className="btn-secondary">Download CV</a>
          </div>
          <div className="contact-info">
            <a href="mailto:excelsean777@gmail.com" className="contact-link">excelsean777@gmail.com</a>
            <a href="https://linkedin.com/in/exccs" target="_blank" rel="noopener noreferrer" className="contact-link">linkedin.com/in/exccs</a>
            <span className="contact-link">Surabaya, Indonesia</span>
          </div>
        </div>

        <div className="footer">
          <p>Built by Excel Sean · Surabaya, Indonesia · 2026</p>
        </div>
      </div>
    </>
  )
}

export default App
