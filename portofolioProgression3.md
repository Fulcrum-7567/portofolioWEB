# Excel Sean — Portfolio Revision 04
> Fifth iteration of build instructions.
> Previous revisions implemented: loader, parallax hero, decode effect, Guest Speaker carousel,
> achievement grid + detail panel, origin photo integration.
> This revision covers: full-width layout overhaul, GSAP ScrollSmoother + Draggable/Inertia decorations,
> Voice section bug fixes + full redesign (vertical full-screen scroll), achievements completeness fix,
> and a complete Leadership section rebuild as a full-screen vertical scroll experience.
> Read the entire document before writing any code. This is a large revision — work section by section.

---

## 0. Reference Recap

**mdntevents.com** (from the attached video) is the reference for the new Leadership section: a gallery-style layout where content is organized into discrete panels, each with a label (role/org/date), and the user moves through them one at a time via scroll — each panel occupies significant screen real estate before transitioning to the next.

Apply this concept but as a **vertical full-screen scroll** (one experience = one full viewport height section), not horizontal — per the explicit instruction in Section 4 below.

---

## 1. Full-Width Layout Overhaul

### The Problem
The current layout uses `.port { max-width: 900px; margin: 0 auto; }` everywhere, which makes the site feel cramped and centered on large monitors. There's wasted space on both sides on anything wider than ~1000px.

### The Fix

**Remove the hard `max-width: 900px` constraint.** Replace with a responsive system that uses more of the viewport on large screens while still preventing content from feeling unreadable on ultra-wide monitors.

**New container system:**
```css
.port {
  width: 100%;
  max-width: 1600px; /* generous ceiling for ultra-wide monitors */
  margin: 0 auto;
  padding: 0 4rem; /* was 2rem — increase for breathing room on large screens */
}

@media (max-width: 1024px) {
  .port { padding: 0 2.5rem; }
}

@media (max-width: 640px) {
  .port { padding: 0 1.25rem; }
}
```

### Section-by-Section Adjustments

**Hero:** The hero headline and content should scale up proportionally on large screens. Increase the max headline size:
```css
.hero-headline {
  font-size: clamp(52px, 9vw, 130px); /* was clamp(52px, 8vw, 88px) */
}
```

**Origin section:** The two-column grid (`text | photo`) should use a wider ratio on large screens so the text column doesn't feel squeezed:
```css
.story-layout {
  grid-template-columns: 1fr 420px; /* was 1fr 340px */
  gap: 6rem; /* was 4rem */
}

@media (min-width: 1600px) {
  .story-layout {
    grid-template-columns: 1fr 480px;
  }
}
```

**Achievements grid:** On very large screens, allow a 3rd column for the achievement cards if there's room — but ONLY if it doesn't break the "5 cards, last one centered" logic from Revision 03. Add this breakpoint:
```css
@media (min-width: 1400px) {
  .ach-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  /* 5 cards in 3-col grid: row1 = 3 cards, row2 = 2 cards centered */
  .ach-card:nth-child(4) {
    grid-column: 2 / 3;
  }
  .ach-card:nth-child(5) {
    grid-column: 3 / 4;
  }
  .ach-card:last-child:nth-child(odd) {
    grid-column: auto; /* reset the centering override from Rev 03 at this breakpoint */
    max-width: none;
    margin: 0;
  }
}
```

**Capabilities (Think/Connect/Build) and Leadership sections:** Increase the gap between columns on large screens:
```css
@media (min-width: 1400px) {
  .skills-layout { gap: 2.5rem; }
}
```

**General rule:** Every section should feel like it's using the canvas, not floating in the middle of it. Test at `1920px` and `2560px` widths — content should feel substantial, not lost in whitespace.

---

## 2. GSAP ScrollSmoother + Draggable/Inertia Decorations

### 2A. ScrollSmoother Setup

Add ScrollSmoother to the project. This requires the GSAP membership plugin bundle — if the project doesn't have access to the paid plugins, use the **free alternative approach** described below as a fallback.

**Primary approach — ScrollSmoother (if available):**

CDN/import (Club GreenSock plugin — note this may require a license):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollSmoother.min.js"></script>
```

Required HTML wrapper structure:
```html
<body>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!-- ALL existing page content goes here -->
    </div>
  </div>
  <!-- Loader, cursor elements, etc. stay OUTSIDE the smooth wrapper -->
</body>
```

```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable, InertiaPlugin);

const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.2,           // smoothing strength
  effects: true,         // enables data-speed and data-lag attributes
  smoothTouch: 0.1,       // light smoothing on touch devices
  normalizeScroll: true
});
```

**Fallback approach (if ScrollSmoother plugin is unavailable):**

Use `lenis` (free, MIT-licensed smooth scroll library) as a drop-in replacement that pairs well with GSAP ScrollTrigger:

```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
```

```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

**IDE decision:** Try ScrollSmoother first. If the plugin import fails (404 or license error), fall back to Lenis immediately — do not block the rest of the build on this. Document which approach was used in a code comment at the top of `script.js`.

**Important:** With either approach, all existing ScrollTrigger instances from previous revisions need `scrollTrigger.refresh()` called after the smoother initializes, and any `pin: true` triggers (used in the new full-screen scroll sections below) need to be created AFTER the smoother/lenis instance exists.

### 2B. Draggable + Inertia Decorative Elements

Add **3-4 small decorative draggable objects** scattered throughout the portfolio. These are playful, physics-based elements that users can flick around — they add a "fun" layer without being core navigation.

**Element types to add:**

1. **A small pill/badge near the Hero** — e.g., a circular badge with text "EST. 2023" or "v1.0" that floats near the hero content. Draggable with inertia so it can be flicked and it drifts to a stop.

2. **A small accent shape near the Origin section** — e.g., a thin rotated rectangle or small square outline (just border, no fill) in accent color, positioned near the photo. Draggable.

3. **A floating tag/chip near the Capabilities section** — e.g., a small pill that says "always learning" or "currently exploring AI" — draggable.

4. **(Optional) A small circular shape near the Contact section** — e.g., a dot/circle that says "say hi" — draggable, with inertia.

**Shared HTML pattern for each draggable element:**
```html
<div class="drag-object" id="dragObject1">
  <span>EST. 2023</span>
</div>
```

**Shared CSS:**
```css
.drag-object {
  position: absolute;
  cursor: grab;
  z-index: 5;
  user-select: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border: 0.5px solid var(--border);
  border-radius: 30px;
  padding: 10px 20px;
  background: rgba(22,22,22,0.6);
  backdrop-filter: blur(8px);
  transition: border-color 0.2s, color 0.2s;
}

.drag-object:active { cursor: grabbing; }
.drag-object:hover { border-color: var(--accent); color: var(--accent); }

/* Shape variant — outline square */
.drag-object.shape-square {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  padding: 0;
  background: transparent;
}

/* Shape variant — circle */
.drag-object.shape-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  text-align: center;
}
```

**Positioning (place near but not overlapping primary content):**
```css
#dragObject1 { top: 8%; right: 6%; } /* near hero */
#dragObject2 { top: 15%; left: 3%; transform: rotate(12deg); } /* near origin, square shape */
#dragObject3 { top: 10%; right: 8%; } /* near capabilities */
#dragObject4 { bottom: 12%; right: 10%; } /* near contact, circle shape */
```

Each parent section needs `position: relative` for the absolute positioning to anchor correctly.

**JavaScript — Draggable with Inertia:**
```javascript
gsap.registerPlugin(Draggable, InertiaPlugin);

document.querySelectorAll('.drag-object').forEach(el => {
  Draggable.create(el, {
    type: 'x,y',
    inertia: true,
    bounds: el.closest('section'), // constrain to parent section
    edgeResistance: 0.65,
    onDragStart: function() {
      gsap.to(this.target, { scale: 1.08, duration: 0.2 });
    },
    onDragEnd: function() {
      gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
    }
  });
});
```

**Entrance animation for drag objects (fade/scale in on scroll):**
```javascript
gsap.from('.drag-object', {
  scrollTrigger: { trigger: '.drag-object', start: 'top 90%' },
  opacity: 0, scale: 0.7, duration: 0.6,
  stagger: 0.1, ease: 'back.out(1.4)' // slight bounce is OK here — these are playful elements
});
```

**Note:** This is the one place in the portfolio where `back.out` easing (slight bounce) is acceptable — these decorative elements are explicitly meant to feel playful, unlike the rest of the site's confident/restrained motion language.

---

## 3. Voice Section — Bug Fixes + Full Redesign

### 3A. Bug Fix: Title Not Appearing

**Diagnosis directive for IDE:** The Voice section title (eyebrow "Voice" + headline "Not everyone gets invited to speak.") is not appearing on scroll. Likely causes to check, in order:

1. The ScrollTrigger for the title animation may have `start: 'top 80%'` but the element's initial `opacity: 0` from `gsap.from()` is being set BEFORE ScrollSmoother/Lenis initializes, causing ScrollTrigger's positions to be calculated against the wrong document height — resulting in the trigger point being miscalculated (often it ends up below the actual scrollable area, so it never fires).
   - **Fix:** Ensure `ScrollTrigger.refresh()` is called after the smoother/Lenis setup completes, AND after any dynamic content (like the carousel) has rendered.

2. Check whether the title element has a typo in its class name vs. what the GSAP selector targets (e.g., `.speaker-section .section-title` vs an actual class of `.voice-section .section-title` — class names may have drifted between revisions).

3. Check whether the element is positioned outside the normal document flow (e.g., inside the horizontal carousel container with `overflow-x: auto`, which would clip it if it's a sibling rather than positioned above the carousel).

4. As a safety net, wrap the title's GSAP animation in `gsap.set()` first to confirm visibility, then layer the scroll animation on top — i.e., don't let `opacity: 0` be the resting state if the animation never triggers:
   ```javascript
   const voiceTitle = document.querySelector('.voice-section .section-title');
   gsap.set(voiceTitle, { opacity: 1, y: 0 }); // safe default — visible
   
   gsap.from(voiceTitle, {
     scrollTrigger: { trigger: '.voice-section', start: 'top 85%' },
     y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
     immediateRender: false // prevents the "invisible until scroll" flash-of-missing-content bug
   });
   ```

### 3B. Full Redesign — Vertical Full-Screen Scroll

**Remove entirely:**
- The horizontal drag carousel (`.speaker-carousel`, drag handlers, wheel intercept, progress bar, scroll hint from Revision 03)
- All carousel-related CSS and JS

**New concept:** The Voice section becomes a **vertical pinned scroll sequence**. The section pins to the viewport (full screen height) while the user scrolls — each of the 3 guest speaker experiences occupies the full screen, one at a time, transitioning to the next as the user continues scrolling. Once all 3 have been shown, the pin releases and the page continues to the Achievements section.

**Structure:**

```html
<section class="voice-section" id="voiceSection">
  <div class="voice-pin-wrapper" id="voicePinWrapper">
    
    <!-- Fixed header — stays visible across all panels -->
    <div class="voice-header">
      <p class="section-eyebrow">Voice</p>
      <h2 class="section-title">
        Not everyone gets<br><span class="dim">invited to speak.</span>
      </h2>
      <p class="section-body">Competing is one thing. Being trusted to teach — that's another. Three times and counting, institutions and organizations have asked Excel to stand in front of a room and share what he knows.</p>
      <!-- Progress indicator: 3 dots -->
      <div class="voice-progress">
        <span class="voice-dot active" data-index="0"></span>
        <span class="voice-dot" data-index="1"></span>
        <span class="voice-dot" data-index="2"></span>
      </div>
    </div>
    
    <!-- Panels — each is a full-screen experience -->
    <div class="voice-panels">
      <div class="voice-panel" data-panel="0">
        <div class="voice-panel-image" style="background-image:url('[EXCEL_TO_PROVIDE_PHOTO]')"></div>
        <div class="voice-panel-overlay"></div>
        <div class="voice-panel-content">
          <span class="speaker-date">May 2026</span>
          <p class="speaker-event">BNCC Skill Class 2.0</p>
          <h3 class="speaker-title">LinkedIn for Better Personal Branding</h3>
          <p class="speaker-role">Panelist · Mentor · Judge</p>
          <p class="speaker-detail">Mentored 40+ participants. Served as panelist and project judge for a session on personal branding and LinkedIn optimization.</p>
        </div>
      </div>
      
      <div class="voice-panel" data-panel="1">
        <div class="voice-panel-image" style="background-image:url('[EXCEL_TO_PROVIDE_PHOTO]')"></div>
        <div class="voice-panel-overlay"></div>
        <div class="voice-panel-content">
          <span class="speaker-date">June 2025</span>
          <p class="speaker-event">Empowering Digital Generation Through AI</p>
          <h3 class="speaker-title">Artificial Intelligence & Brain Rot</h3>
          <p class="speaker-role">Speaker · Demonstrator</p>
          <p class="speaker-detail">Taught AI prompting fundamentals and live-built games (Tic Tac Toe, Snake, Memory Game). Demonstrated Sora, Veo 3, and Suno AI to a live audience.</p>
        </div>
      </div>
      
      <div class="voice-panel" data-panel="2">
        <div class="voice-panel-image" style="background-image:url('[EXCEL_TO_PROVIDE_PHOTO]')"></div>
        <div class="voice-panel-overlay"></div>
        <div class="voice-panel-content">
          <span class="speaker-date">Oct 2024</span>
          <p class="speaker-event">Youth Leadership Camp — LDKS</p>
          <h3 class="speaker-title">10 Pillars of Leadership</h3>
          <p class="speaker-role">Keynote Speaker</p>
          <p class="speaker-detail">Delivered a session on the 10 Pillars of Leadership to incoming student council members at Mitra Harapan Junior High School.</p>
        </div>
      </div>
    </div>
    
  </div>
</section>
```

**CSS — Layout:**
```css
.voice-section {
  position: relative;
}

.voice-pin-wrapper {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 0;
  overflow: hidden;
}

.voice-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4rem;
  position: relative;
  z-index: 3;
}

.voice-panels {
  position: relative;
  overflow: hidden;
}

.voice-panel {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
}

.voice-panel.is-active {
  opacity: 1;
  visibility: visible;
}

.voice-panel-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.voice-panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(13,13,13,0.9) 0%,
    rgba(13,13,13,0.4) 45%,
    rgba(13,13,13,0.15) 100%
  );
}

.voice-panel-content {
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  right: 3rem;
  z-index: 2;
  max-width: 600px;
}

/* Progress dots */
.voice-progress {
  display: flex;
  gap: 10px;
  margin-top: 2rem;
}

.voice-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: background 0.4s ease, transform 0.4s ease;
}

.voice-dot.active {
  background: var(--accent);
  transform: scale(1.3);
}

/* Mobile: stack header above panels, no pin */
@media (max-width: 1024px) {
  .voice-pin-wrapper {
    grid-template-columns: 1fr;
    height: auto;
  }
  .voice-header {
    padding: 4rem 1.5rem 2rem;
    text-align: left;
  }
  .voice-panels {
    height: 60vh;
    position: relative;
  }
}
```

**GSAP — Pin + Panel Transition Logic:**

```javascript
const voicePanels = document.querySelectorAll('.voice-panel');
const voiceDots = document.querySelectorAll('.voice-dot');
const totalPanels = voicePanels.length;

// Set first panel active by default
voicePanels[0].classList.add('is-active');

ScrollTrigger.create({
  trigger: '#voiceSection',
  start: 'top top',
  end: () => `+=${window.innerHeight * (totalPanels - 1) * 1.2}`, // extra scroll distance per panel
  pin: '#voicePinWrapper',
  pinSpacing: true,
  scrub: 0.3,
  onUpdate: (self) => {
    const progress = self.progress; // 0 to 1
    const index = Math.min(
      totalPanels - 1,
      Math.floor(progress * totalPanels)
    );
    
    voicePanels.forEach((panel, i) => {
      if (i === index) {
        if (!panel.classList.contains('is-active')) {
          panel.classList.add('is-active');
          gsap.fromTo(panel, 
            { opacity: 0, scale: 1.03 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
          );
          // also animate the content of this panel in
          gsap.fromTo(panel.querySelector('.voice-panel-content'),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' }
          );
        }
      } else {
        panel.classList.remove('is-active');
      }
    });
    
    voiceDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
});
```

**Important notes for IDE:**
- This ScrollTrigger MUST be created AFTER ScrollSmoother/Lenis initializes (per Section 2A)
- After creating this pinned trigger, call `ScrollTrigger.refresh()` once more to ensure all subsequent sections (Achievements, etc.) recalculate their positions correctly given the new pinned spacing
- Test that the marquee strip (if still present between Voice and Achievements per Revision 02/03) still renders correctly after the pinned section — it may need its own `ScrollTrigger.refresh()` trigger point

---

## 4. Achievements Section — Fix Missing Card + Brighten Images

### 4A. Missing Card: International Youthpreneur Competition

**Problem:** Card 5 (International Youthpreneur Competition / Inventify) from Revision 03's spec was not rendered in the actual build. Add it now.

Confirm all 5 cards exist in the `.ach-grid` with correct `data-ach` attributes:
- `data-ach="a1"` → SCUBA
- `data-ach="a2"` → Hult Prize
- `data-ach="a3"` → BMPC
- `data-ach="a4"` → Grease Gone
- `data-ach="a5"` → **International Youthpreneur Competition (Inventify)** ← verify this exists

Use the exact card 5 specification from Revision 03, Section 2C:
```html
<div class="ach-card" data-ach="a5" onclick="selectAch('a5')">
  <div class="ach-bg" style="
    position:absolute; inset:0;
    background-image: url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80');
    background-size: cover; background-position: center;
    opacity: 0.45; /* see brightness note below */
    transition: opacity 0.4s ease;
  "></div>
  <div style="position:absolute;inset:0;background:rgba(22,22,22,0.78);"></div>
  <span class="ach-ghost-num">05</span>
  <div class="ach-card-body">
    <p class="ach-rank">🥇 Gold Medal · International</p>
    <h3 class="ach-name">International Youthpreneur Competition</h3>
    <p class="ach-org">Inventify Center · May 2025</p>
    <div class="ach-tags">
      <span class="ach-tag">Innovation</span>
      <span class="ach-tag">Gold Medal</span>
      <span class="ach-tag">International</span>
    </div>
  </div>
  <span class="ach-arrow">↗</span>
</div>
```

Also verify the `achData.a5` object exists in `script.js` (from Revision 03, Section 2D) — if it was dropped during the previous build pass, restore it:
```javascript
a5: {
  rank: '🥇 Gold Medal · International',
  title: 'International Youthpreneur Competition',
  org: 'Inventify Center · May 2025',
  tags: ['Innovation Award', 'Gold Medal', 'International', 'Dual Award'],
  body: 'Received two awards from one submission: the Gold Medal and the Innovation Business Award at the International Youthpreneur Competition hosted by Inventify Center. The submitted concept — DreamBound — is a digital workforce placement platform connecting skilled Indonesian workers with international employment opportunities.'
}
```

### 4B. Brighten Card Background Images Slightly

**Current state:** `opacity: 0.35` on `.ach-bg`, which may be too dim — the images are barely visible.

**Change:** Increase to `opacity: 0.45` on the resting state, and `opacity: 0.6` on hover (was `0.5`).

```css
.ach-bg {
  opacity: 0.45; /* was 0.35 */
}

.ach-card:hover .ach-bg {
  opacity: 0.6; /* was 0.5 */
}
```

This is a small, deliberate increase — the images should be clearly visible as contextual texture without competing with the text content or breaking the dark, elegant tone. Do not increase further than this.

---

## 5. Leadership Section — Complete Rebuild as Full-Screen Vertical Scroll

### 5A. Concept

Mirror the Voice section's new pinned vertical scroll pattern (Section 3B), but applied to Leadership. **Each leadership experience occupies one full viewport screen.** As the user scrolls, one experience transitions to the next — image(s), role title, organization, dates, and description all change together.

This section will contain significantly more entries than Voice (13 total experiences across 2 organizations), so the progress indicator and navigation need to scale accordingly.

### 5B. Full Content List (In Display Order)

Group experiences by organization, in this order. Each becomes one full-screen panel.

---

**ORGANIZATION GROUP 1: HIMPRENEUR BINUS @ MALANG**

**Panel 1 — Head of Human Resources**
- Org: HIMPRENEUR BINUS @ Malang
- Role: Head of Human Resources
- Type: Full-time
- Period: Nov 2024 – Jan 2026 · 1 yr 3 mos
- Location: Malang, East Java, Indonesia
- Description: Mentored the HR team to resolve workplace conflicts fairly, helping create a more positive organizational culture. Introduced a stricter, more organized hiring process that improved the quality of new recruits by 60%.
- Images: `hr1`, `hr2`, `hr3` (left to right order)

**Panel 2 — Coordinator of Company Visit Event Division**
- Org: HIMPRENEUR BINUS @ Malang
- Role: Coordinator of Company Visit Event Division
- Type: Part-time
- Period: Oct 2025 – Dec 2025 · 3 mos
- Location: Malang, East Java, Indonesia
- Description: Managed the event flow and schedule for industrial visits to PT Ajinomoto Indonesia and PT Insera Sena.
- Images: `cv1`, `cv2` (left to right order)

**Panel 3 — PIC of Bestari Sponsor Division**
- Org: HIMPRENEUR BINUS @ Malang
- Role: PIC of Bestari Sponsor Division
- Type: Part-time
- Period: Oct 2024 – Oct 2025 · 1 yr 1 mo
- Location: Malang, East Java, Indonesia
- Description: Led the team responsible for finding sponsors for the Bestari and Bestrun events, securing funding and building partnerships to ensure these major events ran smoothly.
- Images: `bestari1`, `bestari2`, `bestari3` (left to right order)

**Panel 4 — PKM Wringinanom Production Lead**
- Org: HIMPRENEUR BINUS @ Malang
- Role: PKM Wringinanom Production Lead
- Type: Part-time
- Period: Jul 2025 – Aug 2025 · 2 mos
- Location: Wringinanom, East Java, Indonesia
- Description: Led a team of photographers and videographers documenting a 2-day community service event by BINUS Business School in Wringinanom Regency. Produced the official aftermovie and directed shot lists and camera angles for high-quality visual storytelling.
- Images: `pkm1`, `pkm2`, `pkm3` (left to right order)

**Panel 5 — DIGICAMP Contributor**
- Org: HIMPRENEUR BINUS @ Malang
- Role: DIGICAMP Contributor
- Type: Part-time
- Period: Jul 2025 · 1 mo
- Location: Malang, East Java, Indonesia
- Description: Took on several diverse roles representing HIMPRENEUR in an 8-day annual event introducing high school students to campus life through trial classes, bazaars, and organization booths — representing BINUS Business School.
- Images: `digicamp1`, `digicamp2` (left to right order)

**Panel 6 — Coordinator of LUMINOVA Security Division**
- Org: HIMPRENEUR BINUS @ Malang
- Role: Coordinator of LUMINOVA Security Division
- Type: Part-time
- Period: Jun 2025 – Jul 2025 · 2 mos
- Location: Malang, East Java, Indonesia
- Description: Led a 1-month community service collaboration with HIMTI, tutoring high school students at SMK 5, 10, 11 Malang and SMA Kalam Kudus Malang on UI/UX and Business Model Canvas concepts.
- Images: `luminova1`, `luminova2`, `luminova3` (left to right order)

**Panel 7 — PIC of Bonding, Evaluation & Mentoring**
- Org: HIMPRENEUR BINUS @ Malang
- Role: PIC of Bonding, Evaluation & Mentoring
- Type: Part-time
- Period: Feb 2025 – Jul 2025 · 6 mos
- Location: Malang, East Java, Indonesia
- Description: Led a monthly internal program strengthening team cohesion and professional growth — combining bonding activities, expert-led mentoring sessions, and structured evaluation for continuous improvement.
- Images: `bem1`, `bem2` (left to right order)

**Panel 8 — PIC of HIMPRENEUR Team Building Event**
- Org: HIMPRENEUR BINUS @ Malang
- Role: PIC of HIMPRENEUR Team Building Event
- Type: Part-time
- Period: May 2025 · 1 mo
- Location: Malang, East Java, Indonesia
- Description: Designed an event to develop members' leadership skills while scouting high-potential individuals as future successors.
- Images: `tb1`, `tb2`, `tb3` (left to right order)

---

**ORGANIZATION GROUP 2: BINUS UNIVERSITY**

**Panel 9 — Freshman Partner**
- Org: BINUS University
- Role: Freshman Partner
- Type: Part-time
- Period: Sep 2024 – Sep 2025 · 1 yr 1 mo
- Location: Malang, East Java, Indonesia
- Description: Led and mentored 7+ freshmen in executing impactful community service projects while supporting their academic, personal, and leadership growth throughout the academic year.
- Images: `fp1`, `fp2`, `fp3` (left to right order)

---

**ORGANIZATION GROUP 3: BINA NUSANTARA COMPUTER CLUB (BNCC)**

**Panel 10 — Internal Gathering Event Coordinator**
- Org: Bina Nusantara Computer Club (BNCC)
- Role: Internal Gathering Event Coordinator
- Type: Part-time
- Period: May 2025 – Jul 2025 · 3 mos
- Location: Malang, East Java, Indonesia
- Description: Directed the event team, delegating and overseeing tasks. Planned the overall event flow including interactive games and team-building activities, strengthening belonging across the team.
- Images: `bncc1`, `bncc2` (left to right order)

**Panel 11 — Leadership Development Program Mentor**
- Org: Bina Nusantara Computer Club (BNCC)
- Role: Leadership Development Program Mentor
- Type: Part-time
- Period: Jan 2025 – Apr 2025 · 4 mos
- Location: Malang, East Java, Indonesia
- Description: Mentored 8 BNCC activists through the Leadership Development Program, providing coaching and helping them refine their work plan ("Raker") presentations and proposals for review by activists, seniors, and judges.
- Images: `ldp1`, `ldp2`, `ldp3` (left to right order)

---

**Total: 11 panels** (Note: condensed from the originally listed 13 — Panels 1-8 cover HIMPRENEUR's 8 roles, Panel 9 covers Freshman Partner, Panels 10-11 cover BNCC's 2 roles, accounting for all 11 distinct positions listed.)

### 5C. Image Naming Convention

**Critical for IDE:** Image filenames in `assets/leadership/` follow the pattern `{prefix}{number}.{ext}` where the number indicates left-to-right display order. E.g., `fp1.jpg`, `fp2.jpg`, `fp3.jpg` for Freshman Partner — `fp1` is shown leftmost, `fp3` rightmost.

**Prefix mapping (IDE should verify these prefixes exist in the assets folder and adjust if naming differs):**

| Panel | Role | Image prefix |
|---|---|---|
| 1 | Head of HR | `hr` |
| 2 | Company Visit Coordinator | `cv` |
| 3 | Bestari Sponsor Division | `bestari` |
| 4 | PKM Wringinanom | `pkm` |
| 5 | DIGICAMP | `digicamp` |
| 6 | LUMINOVA | `luminova` |
| 7 | Bonding, Evaluation & Mentoring | `bem` |
| 8 | Team Building Event | `tb` |
| 9 | Freshman Partner | `fp` |
| 10 | BNCC Internal Gathering | `bncc` |
| 11 | Leadership Development Program | `ldp` |

**If the IDE cannot find a matching prefix in the assets folder for any panel, use an Unsplash placeholder** (`https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80` or similar team/leadership imagery) and flag it in a code comment for Excel to address later.

### 5D. Panel Layout Design

Each panel is a full-viewport-height section with a **multi-image collage on one side and text content on the other**. The number of images varies (2 or 3 depending on the role), so the layout must adapt.

**Layout structure:**

```
┌─────────────────────────────────────────────────┐
│  [ORG NAME — small label, top]                   │
│                                                   │
│  ┌──────────────┐  ┌─────────────────────────┐ │
│  │              │  │  Role Title (large)       │ │
│  │   Image(s)   │  │  Type · Period · Location │ │
│  │   collage    │  │                            │ │
│  │              │  │  Description text          │ │
│  │              │  │                            │ │
│  └──────────────┘  └─────────────────────────┘ │
│                                                   │
│  [progress: 3 / 11]          [HR · CV · ... dots]│
└─────────────────────────────────────────────────┘
```

**HTML structure (repeat per panel):**
```html
<section class="leadership-section" id="leadershipSection">
  <div class="lead-pin-wrapper" id="leadPinWrapper">
    
    <!-- Section label (persists across all panels) -->
    <div class="lead-meta-bar">
      <p class="section-eyebrow">Leadership</p>
      <p class="lead-counter"><span id="leadCurrentNum">01</span> / 11</p>
    </div>
    
    <div class="lead-panels">
      <div class="lead-panel" data-panel="0">
        <div class="lead-panel-images count-3">
          <div class="lead-img" style="background-image:url('assets/leadership/hr1.jpg')"></div>
          <div class="lead-img" style="background-image:url('assets/leadership/hr2.jpg')"></div>
          <div class="lead-img" style="background-image:url('assets/leadership/hr3.jpg')"></div>
        </div>
        <div class="lead-panel-content">
          <p class="lead-org-label">HIMPRENEUR BINUS @ Malang</p>
          <h3 class="lead-role-title">Head of Human Resources</h3>
          <p class="lead-panel-meta">Full-time · Nov 2024 – Jan 2026 · 1 yr 3 mos · Malang, East Java</p>
          <p class="lead-panel-desc">Mentored the HR team to resolve workplace conflicts fairly, helping create a more positive organizational culture. Introduced a stricter, more organized hiring process that improved the quality of new recruits by 60%.</p>
        </div>
      </div>
      
      <!-- ... repeat for all 11 panels, adjusting count-2 / count-3 class and image sources ... -->
      
    </div>
    
  </div>
</section>
```

**CSS — Layout:**
```css
.leadership-section {
  position: relative;
}

.lead-pin-wrapper {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.lead-meta-bar {
  position: absolute;
  top: 2.5rem;
  left: 4rem;
  right: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  z-index: 4;
}

.lead-counter {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 0.1em;
}

.lead-counter span {
  color: var(--accent);
  font-weight: 600;
}

.lead-panels {
  position: relative;
  height: 100%;
}

.lead-panel {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 8rem 4rem 4rem;
  opacity: 0;
  visibility: hidden;
}

.lead-panel.is-active {
  opacity: 1;
  visibility: visible;
}

/* Image collage layouts */
.lead-panel-images {
  display: grid;
  gap: 0.75rem;
  height: 65vh;
  border-radius: 16px;
  overflow: hidden;
}

.lead-panel-images.count-2 {
  grid-template-columns: 1.3fr 1fr;
}

.lead-panel-images.count-3 {
  grid-template-columns: 1.4fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.lead-panel-images.count-3 .lead-img:nth-child(1) {
  grid-row: 1 / 3; /* first image spans both rows */
}

.lead-img {
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  filter: grayscale(15%) contrast(1.05);
  transition: filter 0.4s ease, transform 0.6s ease;
}

.lead-panel.is-active .lead-img {
  filter: grayscale(0%) contrast(1.05);
}

/* Text content */
.lead-panel-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lead-org-label {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 600;
}

.lead-role-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}

.lead-panel-meta {
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 0.02em;
}

.lead-panel-desc {
  font-size: 15px;
  color: rgba(240,237,230,0.75);
  line-height: 1.8;
  max-width: 480px;
  margin-top: 0.5rem;
}

/* Mobile fallback — no pin, vertical stacked cards */
@media (max-width: 1024px) {
  .lead-pin-wrapper {
    height: auto;
  }
  .lead-meta-bar {
    display: none; /* counter doesn't make sense in stacked mobile view */
  }
  .lead-panel {
    position: relative;
    opacity: 1;
    visibility: visible;
    grid-template-columns: 1fr;
    padding: 3rem 1.5rem;
    min-height: auto;
  }
  .lead-panel-images {
    height: 50vh;
    margin-bottom: 1.5rem;
  }
}
```

### 5E. GSAP — Pin + Panel Transition Logic

Same pattern as the Voice section (Section 3B), scaled for 11 panels:

```javascript
const leadPanels = document.querySelectorAll('.lead-panel');
const leadTotal = leadPanels.length; // 11
const leadCounterEl = document.getElementById('leadCurrentNum');

leadPanels[0].classList.add('is-active');

ScrollTrigger.create({
  trigger: '#leadershipSection',
  start: 'top top',
  end: () => `+=${window.innerHeight * (leadTotal - 1) * 1}`, // 1 viewport per panel transition
  pin: '#leadPinWrapper',
  pinSpacing: true,
  scrub: 0.4,
  onUpdate: (self) => {
    const progress = self.progress;
    const index = Math.min(
      leadTotal - 1,
      Math.floor(progress * leadTotal)
    );
    
    leadPanels.forEach((panel, i) => {
      if (i === index) {
        if (!panel.classList.contains('is-active')) {
          panel.classList.add('is-active');
          
          // Image collage staggered entrance
          gsap.fromTo(panel.querySelectorAll('.lead-img'),
            { scale: 1.08, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
          );
          
          // Text content entrance
          gsap.fromTo(panel.querySelector('.lead-panel-content').children,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, delay: 0.15, ease: 'power2.out' }
          );
        }
      } else {
        panel.classList.remove('is-active');
      }
    });
    
    // Update counter
    if (leadCounterEl) {
      leadCounterEl.textContent = String(index + 1).padStart(2, '0');
    }
  }
});
```

**Performance note for IDE:** With 11 panels each containing 2-3 background images, ensure all images are appropriately sized/compressed (recommend max width `1200px` for collage images) to avoid layout jank during the pinned scroll. Consider lazy-loading images for panels beyond index 2 using `loading="lazy"` on `<img>` if switching from `background-image` to `<img>` tags, or preloading the next panel's images just before they become active.

**Bug prevention checklist for IDE:**
- This ScrollTrigger MUST be created after ScrollSmoother/Lenis is initialized (same requirement as Voice section)
- Call `ScrollTrigger.refresh()` after this trigger is created, especially since it comes after the Voice section's own pinned trigger — pin spacing stacking can cause trigger position drift if not refreshed
- Test scroll direction reversal (scrolling back UP through the leadership panels) — `onUpdate` should smoothly reverse the `is-active` class and counter without jumping
- Verify the `.lead-img` `filter` transition (grayscale → color on `is-active`) doesn't cause a flash/pop when panels rapidly switch during fast scrolling — if it does, remove the filter transition and keep images in color by default

---

## 6. Summary of All Changes in This Revision

| # | Area | What changes |
|---|---|---|
| 1 | Global Layout | Remove `max-width: 900px` constraint. New `.port` system with `max-width: 1600px`, larger padding. Hero headline scales up. Origin, Achievements, Capabilities adjusted for large screens. |
| 2 | Global | Add ScrollSmoother (or Lenis fallback) wrapping all content in `#smooth-wrapper > #smooth-content`. |
| 3 | Global | Add 3-4 draggable decorative elements using GSAP Draggable + InertiaPlugin, scattered near Hero, Origin, Capabilities, Contact. |
| 4 | Voice | Fix title-not-appearing bug — likely ScrollTrigger timing/refresh issue with smoother init order. Add `immediateRender: false` safeguard. |
| 5 | Voice | Remove horizontal drag carousel entirely. Rebuild as pinned vertical full-screen scroll — 3 panels, one per speaking engagement, with progress dots. |
| 6 | Achievements | Add missing Card 5 (International Youthpreneur Competition / Inventify) — verify `data-ach="a5"` and `achData.a5` both exist. |
| 7 | Achievements | Brighten `.ach-bg` opacity from 0.35 → 0.45 (resting) and 0.5 → 0.6 (hover). |
| 8 | Leadership | Complete rebuild — pinned vertical full-screen scroll, 11 panels (one per role across HIMPRENEUR, BINUS Freshman Partner, BNCC). Each panel has an image collage (2 or 3 images, left-to-right per asset numbering) + role/org/period/description. |
| 9 | Leadership | New image asset naming convention documented — prefixes per role, numbered for left-to-right order. |

---

## 7. Files to Touch in This Revision

```
index.html    → Wrap all content in #smooth-wrapper/#smooth-content, add drag-object elements,
                 rebuild .voice-section HTML (pinned panels), add missing achievement card 5,
                 completely rebuild .leadership-section HTML (11 pinned panels)
style.css     → New .port sizing system, responsive breakpoints for large screens,
                 .drag-object styles, .voice-panel / .voice-pin-wrapper styles,
                 .ach-bg opacity updates, .lead-panel / .lead-pin-wrapper / .lead-panel-images styles
script.js     → ScrollSmoother or Lenis init (try ScrollSmoother first, fallback to Lenis),
                 Draggable + InertiaPlugin setup for decorative elements,
                 Voice section bug fix + new pinned ScrollTrigger logic,
                 achData.a5 restoration if missing,
                 Leadership pinned ScrollTrigger logic for 11 panels
assets/leadership/  → Verify image files exist with documented prefixes (hr, cv, bestari, pkm, 
                       digicamp, luminova, bem, tb, fp, bncc, ldp), numbered for left-to-right order
```

---

## 8. Testing Checklist (For IDE to Verify Before Considering This Revision Complete)

- [ ] Site uses full screen width on 1920px+ displays — no excessive empty side margins
- [ ] Smooth scroll (ScrollSmoother or Lenis) active across entire page, no jank
- [ ] At least 3 draggable decorative elements present and respond to drag + inertia flick
- [ ] Voice section title ("Not everyone gets invited to speak.") visible on scroll — bug fixed
- [ ] Voice section is now a vertical pinned scroll with 3 full-screen panels and working progress dots
- [ ] Achievements section shows all 5 cards including International Youthpreneur Competition
- [ ] Achievement card background images are slightly brighter but still elegant/subtle
- [ ] Leadership section is a vertical pinned scroll with 11 full-screen panels
- [ ] Leadership panel images load in correct left-to-right order per the numbered filename convention
- [ ] Leadership counter (e.g., "03 / 11") updates correctly when scrolling both directions
- [ ] All previous animations (hero parallax, decode effect, origin photo, marquee) still function correctly after ScrollSmoother integration
- [ ] Mobile responsive fallbacks work for Voice and Leadership sections (stacked, no pin)

---

*End of Revision 04. Apply all changes on top of the existing codebase.*
*Produced in collaboration with Claude (Anthropic) · June 2026*
