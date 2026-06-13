import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useScrollAnimations(isLoaded) {
  useEffect(() => {
    if (!isLoaded) return

    // Delay to ensure DOM is fully ready after loader exit
    const timer = setTimeout(() => {
      // Section eyebrows (exclude voice/leadership — they handle their own)
      gsap.utils.toArray('.section-eyebrow').forEach((el) => {
        if (el.closest('.voice-section') || el.closest('.leadership-section')) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        })
      })

      // Section titles (exclude voice/leadership — they handle their own)
      gsap.utils.toArray('.section-title').forEach((el) => {
        if (el.closest('.voice-section') || el.closest('.leadership-section')) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
      })

      // Section bodies (exclude voice — it handles its own)
      gsap.utils.toArray('.section-body').forEach((el) => {
        if (el.closest('.voice-section')) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.15,
        })
      })

      // ─── Story quote — word-by-word reveal ───
      const quoteWords = document.querySelectorAll('.story-quote-text .word')
      if (quoteWords.length > 0) {
        gsap.from(quoteWords, {
          scrollTrigger: { trigger: '.story-quote-text', start: 'top 80%' },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        })
      }

      // ─── Origin Photo entrance animation ───
      const photoWrapper = document.querySelector('.origin-photo-wrapper')
      if (photoWrapper) {
        gsap.from('.origin-photo-wrapper', {
          scrollTrigger: { trigger: '.origin-photo-wrapper', start: 'top 80%' },
          x: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.2,
        })

        gsap.from('.origin-photo-accent-line', {
          scrollTrigger: { trigger: '.origin-photo-wrapper', start: 'top 80%' },
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.8,
          ease: 'power2.out',
        })
      }

      // ─── Achievement section — entrance (Revision 03) ───
      const achSection = document.querySelector('.ach-section')
      if (achSection) {
        // Section header
        gsap.from('.ach-section .section-title, .ach-section .section-eyebrow', {
          scrollTrigger: { trigger: '.ach-section', start: 'top 80%' },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        })

        // Cards stagger in
        gsap.from('.ach-card', {
          scrollTrigger: { trigger: '.ach-grid', start: 'top 80%' },
          y: 50,
          opacity: 0,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        })

        // Per-card background parallax on hover
        document.querySelectorAll('.ach-card').forEach((card) => {
          const bg = card.querySelector('.ach-bg')
          if (!bg) return

          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5
            gsap.to(bg, {
              x: x * 15,
              y: y * 15,
              scale: 1.08,
              duration: 0.6,
              ease: 'power2.out',
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(bg, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
            })
          })
        })
      }

      // (Voice and Leadership sections now handle their own GSAP animations
      // inside their respective components — GuestSpeaker.jsx and Leadership.jsx)

      // Skill columns stagger
      const skillsLayout = document.querySelector('.skills-layout')
      if (skillsLayout) {
        gsap.from('.skill-col', {
          scrollTrigger: { trigger: skillsLayout, start: 'top 80%' },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        })
      }

      // Statement dividers
      gsap.utils.toArray('.statement-text').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        })
      })

      // Close section headline
      const closeHeadline = document.querySelector('.close-headline')
      if (closeHeadline) {
        gsap.from(closeHeadline, {
          scrollTrigger: { trigger: closeHeadline, start: 'top 85%' },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
      }

      // Tech badges stagger
      gsap.utils.toArray('.tech-badge').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          y: 15,
          opacity: 0,
          duration: 0.4,
          delay: i * 0.05,
          ease: 'power2.out',
        })
      })

      // Story pills stagger
      gsap.utils.toArray('.story-pill').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          y: 10,
          opacity: 0,
          duration: 0.4,
          delay: i * 0.06,
          ease: 'power2.out',
        })
      })

      ScrollTrigger.refresh()
    }, 300)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [isLoaded])
}
