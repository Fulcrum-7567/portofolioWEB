# Excel Sean — Portfolio Revision 02
> This is the third iteration of build instructions.
> The base HTML and the first round of animations (GSAP, Tailwind, loader, cursor, marquee, scroll triggers) are already implemented.
> This document contains ONLY changes, additions, and replacements to apply on top of what already exists.
> Read the full document before touching any code. Every instruction is intentional.

---

## 0. Current Site Flow (For Reference)

```
[Loader] → [Hero] → [Marquee] → [Origin] → [Marquee] → [Achievements] → [Capabilities] → [Leadership] → [Contact]
```

**After this revision, the new flow will be:**

```
[Loader] → [Hero] → [Marquee] → [Origin] → [Guest Speaker] → [Achievements] → [Capabilities] → [Leadership] → [Contact]
```

A new **Guest Speaker section** is inserted between Origin and Achievements. The Marquee strip between Origin and Achievements moves to sit between Guest Speaker and Achievements instead.

---

## 1. Hero Section — Mouse Parallax Background

### Remove
Remove the existing custom cursor (`#cursor` and `#cursorRing` elements and all their associated JavaScript). The cursor is being replaced entirely by the parallax effect described below.

### Reference
Dulcedo.com (dulcedo.com) uses a mouse-tracking parallax on its hero section — as the user moves the mouse across the screen, layered elements shift at different depths and speeds, creating a sense of three-dimensional depth without any 3D library. The background layer moves slower, foreground elements move faster, and the effect is smooth and continuous.

### What to build

**Concept:** The Hero section background has multiple layered elements that respond to mouse position. As the mouse moves, each layer translates in the opposite direction at a different speed multiplier, creating a parallax depth illusion. This only activates in the Hero section — when the user scrolls past the Hero, the effect stops.

**Layers (from back to front):**

| Layer | Element | Depth multiplier | Description |
|---|---|---|---|
| Layer 1 (back) | Grid texture overlay | `0.008` | Slowest — barely moves |
| Layer 2 | Radial accent glow (lime circle) | `0.02` | Moves slightly more |
| Layer 3 | Small floating particle dots | `0.035` | Medium movement |
| Layer 4 (front) | Hero eyebrow + scroll indicator | `0.012` | Very subtle shift |

The headline text itself does NOT move — it stays fixed. Only the background atmosphere layers move.

**Floating particles:**
Add 6–8 small dots (`4–8px` diameter, `background: #C8F135`, `opacity: 0.15–0.4`, randomly sized and positioned across the hero section). These are purely atmospheric — they should feel like distant stars, not interactive elements.

**HTML additions inside `.hero`:**
```html
<!-- Add these inside the hero section, before other content -->
<div class="parallax-layer" data-depth="0.008" id="parallaxGrid"></div>
<div class="parallax-layer" data-depth="0.02" id="parallaxGlow"></div>
<div class="parallax-layer" data-depth="0.035" id="parallaxParticles">
  <span class="particle" style="top:15%;left:12%;width:5px;height:5px;opacity:0.25;"></span>
  <span class="particle" style="top:72%;left:8%;width:3px;height:3px;opacity:0.15;"></span>
  <span class="particle" style="top:30%;left:78%;width:7px;height:7px;opacity:0.35;"></span>
  <span class="particle" style="top:65%;left:85%;width:4px;height:4px;opacity:0.2;"></span>
  <span class="particle" style="top:45%;left:55%;width:3px;height:3px;opacity:0.18;"></span>
  <span class="particle" style="top:20%;left:40%;width:6px;height:6px;opacity:0.3;"></span>
  <span class="particle" style="top:80%;left:60%;width:4px;height:4px;opacity:0.22;"></span>
  <span class="particle" style="top:10%;left:90%;width:5px;height:5px;opacity:0.28;"></span>
</div>
```

**CSS:**
```css
.parallax-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: transform;
}

.particle {
  position: absolute;
  background: #C8F135;
  border-radius: 50%;
  display: block;
}

/* Override the existing radial glow to be a parallax layer */
#parallaxGlow::after {
  content: '';
  position: absolute;
  top: 20%;
  right: 8%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,241,53,0.1) 0%, transparent 70%);
}
```

**JavaScript — Mouse Parallax (GSAP):**
```javascript
const hero = document.querySelector('.hero');
const parallaxLayers = document.querySelectorAll('.parallax-layer');

// Only active while hero is in viewport
let heroParallaxActive = true;

// ScrollTrigger to disable when hero leaves view
ScrollTrigger.create({
  trigger: hero,
  start: 'top top',
  end: 'bottom top',
  onLeave: () => { heroParallaxActive = false; },
  onEnterBack: () => { heroParallaxActive = true; }
});

window.addEventListener('mousemove', (e) => {
  if (!heroParallaxActive) return;
  
  // Center of viewport as origin point
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  parallaxLayers.forEach(layer => {
    const depth = parseFloat(layer.dataset.depth);
    const moveX = dx * depth * -1; // invert for natural feel
    const moveY = dy * depth * -1;
    gsap.to(layer, {
      x: moveX,
      y: moveY,
      duration: 1.2,
      ease: 'power2.out'
    });
  });
});
```

**Important:** The hero section needs `position: relative` and `overflow: hidden` — confirm these are already set. The parallax layers must not bleed outside the hero bounds.

---

## 2. Hero Section — Headline Decode Effect on Hover

### What it is
When the user hovers over the headline text "Experience outranks Everything", the text undergoes a scramble/decode animation — characters rapidly cycle through random characters before resolving back to the correct letters. This is sometimes called a "hacker text" or "glitch decode" effect.

### Behavior
- **Trigger:** `mouseenter` on the `.hero-headline` element
- **What happens:** Each character in the text cycles through random alphanumeric characters at high speed (every `40–60ms`), then one by one "locks in" to the correct character from left to right
- **Duration:** Full decode completes in approximately `1.2–1.6 seconds`
- **Cooldown:** After decoding completes, the effect cannot be triggered again for `2 seconds` (prevents jitter if user re-hovers immediately)
- **Characters used for scramble:** `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&`
- **Spaces stay as spaces** — do not scramble whitespace
- **The accent color on "Everything" must be preserved** — after decoding, the word "Everything" returns to `color: #C8F135`

### Implementation

Wrap each character of the headline in a `<span>` using JavaScript on page load (do this dynamically, not in HTML, to keep markup clean):

```javascript
function initDecodeEffect() {
  const headline = document.querySelector('.hero-headline');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  let isDecoding = false;
  let cooldown = false;

  // Store original text structure (preserving span elements for line1/line2)
  const lines = headline.querySelectorAll('span.line1, span.line2');
  
  lines.forEach(line => {
    const originalText = line.textContent;
    const isAccent = line.classList.contains('line2'); // "Everything" line
    line.innerHTML = '';
    
    [...originalText].forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.dataset.original = char;
      if (isAccent) span.style.color = '#C8F135';
      line.appendChild(span);
    });
  });

  headline.addEventListener('mouseenter', () => {
    if (isDecoding || cooldown) return;
    isDecoding = true;

    const allSpans = headline.querySelectorAll('span.line1 span, span.line2 span');
    const totalChars = allSpans.length;
    const decodeDelay = 1400 / totalChars; // spread decode across 1.4s

    // Start scramble for all characters
    const intervals = [];
    allSpans.forEach((span, i) => {
      if (span.dataset.original === ' ') return;
      const interval = setInterval(() => {
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
      }, 45);
      intervals.push({ interval, span, index: i });
    });

    // Lock in characters one by one from left to right
    intervals.forEach(({ interval, span }, i) => {
      setTimeout(() => {
        clearInterval(interval);
        span.textContent = span.dataset.original;
        // Restore accent color if this span is inside line2
        if (span.closest('.line2')) span.style.color = '#C8F135';
      }, i * decodeDelay);
    });

    // Reset flags after full decode
    setTimeout(() => {
      isDecoding = false;
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 2000);
    }, 1400 + 300);
  });
}

// Call after hero animation completes
// Add initDecodeEffect() at the end of initHeroAnimation()
```

---

## 3. Origin Section — Text Changes

Apply all of the following text replacements precisely. Do not change any surrounding HTML structure — only the text content changes.

### Change 1 — Opening paragraph
**Find and replace:**

Old text:
```
While most 1st-year students were figuring out their schedules, I was building teams, competing on national stages, and leading organizations. Not because I had to — because staying still never felt like an option.
```

New text:
```
While most 1st and 2nd year students were figuring out their schedules, I was thriving in many organizations at the same time while competing in national and international stages. Not because I had to, but because staying still never felt like an option.
```

### Change 2 — Blockquote (aesthetic statement)
**Find and replace:**

Old text:
```
"I sit at the intersection of business thinking and product building. I don't just solve problems — I ship solutions."
```

New text:
```
"You are the average of the Five People you spend the most time with."
```

**Styling rules for this quote (critical — this is the aesthetic centerpiece of the Origin section):**

The quote must stand out dramatically. Apply the following treatment:

- Remove the standard blockquote left-border style
- The full quote renders in large display type: Space Grotesk, `clamp(22px, 3.5vw, 36px)`, font-weight 300 (light), color `#888` (muted)
- The words **"Five People"** are wrapped in a `<strong>` tag and styled: font-weight 700, color `#F0EDE6` (bright), with a subtle underline using `border-bottom: 1px solid #C8F135`, `padding-bottom: 2px`
- The entire quote is surrounded by large decorative quotation marks: `"` before the first word and `"` after the last, rendered in a very large size (`font-size: clamp(60px, 10vw, 120px)`), color `#C8F135`, `opacity: 0.12`, positioned absolutely at top-left and bottom-right of the quote container
- The quote block has `padding: 2rem 3rem`, `margin: 2.5rem 0`, no border, `position: relative`, `overflow: visible`
- On scroll trigger, the quote animates in with a **word-by-word fade** — each word fades and slides up with a stagger of `0.08s`, `duration 0.6s each`, `ease: power2.out`

**HTML structure:**
```html
<div class="story-quote-block" style="position:relative; padding: 2rem 3rem; margin: 2.5rem 0;">
  <!-- Decorative open quote -->
  <span class="deco-quote deco-open" style="
    position:absolute; top:-20px; left:10px;
    font-family:'Space Grotesk',sans-serif;
    font-size:clamp(60px,10vw,120px);
    color:#C8F135; opacity:0.12;
    line-height:1; pointer-events:none; user-select:none;
  ">"</span>
  
  <p class="story-quote-text" style="
    font-family:'Space Grotesk',sans-serif;
    font-size:clamp(22px,3.5vw,36px);
    font-weight:300;
    color:#888;
    line-height:1.4;
  ">
    <!-- Each word wrapped in span for stagger animation (do this via JS) -->
    You are the average of the 
    <strong style="font-weight:700; color:#F0EDE6; border-bottom:1px solid #C8F135; padding-bottom:2px;">Five People</strong>
    you spend the most time with.
  </p>
  
  <!-- Decorative close quote -->
  <span class="deco-quote deco-close" style="
    position:absolute; bottom:-40px; right:10px;
    font-family:'Space Grotesk',sans-serif;
    font-size:clamp(60px,10vw,120px);
    color:#C8F135; opacity:0.12;
    line-height:1; pointer-events:none; user-select:none;
  ">"</span>
</div>
```

**GSAP scroll animation for the quote:**
```javascript
// Word-by-word reveal for the quote
const quoteEl = document.querySelector('.story-quote-text');
if (quoteEl) {
  // Split text nodes into word spans (skip the <strong> element)
  // Use a simple word wrapper approach
  const words = quoteEl.querySelectorAll('.word'); // add .word spans via JS
  gsap.from(words, {
    scrollTrigger: { trigger: quoteEl, start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.5,
    stagger: 0.06, ease: 'power2.out'
  });
}
```

**Note for IDE:** To wrap individual words in spans while preserving the `<strong>` tag around "Five People", use a text node walker — iterate child nodes of `.story-quote-text`, wrap text nodes word by word, leave element nodes (like `<strong>`) intact.

### Change 3 — Second paragraph
**Find and replace:**

Old text:
```
Double degree in Business and Computer Science. I speak the language of strategy and the language of code — which means I can sit in any room and add value.
```

New text:
```
Double Degree Undergraduate in Business and Information Systems with a strong interest in business strategy, business competitions, and artificial intelligence. Passionate about sharing knowledge and helping others learn.
```

### Change 4 — Remove the stats card entirely

Remove the entire right-column stats card from the Origin section. This is the card containing:
- Competitions entered / 6+
- Leadership roles held / 4+
- People mentored / 40+
- GPA / 3.65

After removing it, the Origin section layout changes from a 2-column grid to a **single-column layout** (`max-width: 680px`, centered or left-aligned consistent with other sections). The left column content (the three paragraphs, the quote, the personality pills) remains — only the stats card on the right is removed.

Update the CSS for `.story-layout`:
```css
.story-layout {
  display: block; /* was grid */
  max-width: 680px;
}
```

---

## 4. New Section — Guest Speaker (Insert Between Origin and Achievements)

### Section Position
Insert this section **after** the Origin section and **before** the Achievements section. The Marquee divider strip that currently sits between Origin and Achievements should move to sit between **Guest Speaker and Achievements** instead. No marquee between Origin and Guest Speaker.

### Narrative Framing (Critical — Read Before Writing Any Copy)

The story this section must tell is: **not everyone gets invited to speak**. Competing in competitions and joining organizations is something many students do. But being trusted to stand in front of an audience and share your knowledge — being called upon as a resource, as an authority — that is a different category entirely. This section is the proof that Excel Sean is not a regular student. He is someone that others turn to for guidance.

Every visual and copy choice in this section should reinforce that message without stating it directly.

### Section Header Copy

**Eyebrow:** `Voice`
**Headline:** `Not everyone gets / invited to speak.` (second line dimmed — `font-weight: 300`, `color: var(--muted)`)
**Subtext (below headline):**
> Competing is one thing. Being trusted to teach — that's another. Three times and counting, institutions and organizations have asked Excel to stand in front of a room and share what he knows.

### Card Layout — Horizontal Scroll Carousel

The three guest speaker cards are presented as a **horizontal scroll carousel**. On desktop, 1.5 cards are visible at a time (so users can see there is more to scroll to). On mobile, 1 card is fully visible with a peek of the next.

**Scroll behavior:** The carousel scrolls horizontally when the user scrolls down while the section is in view (scroll-hijack style, like Dulcedo's sections), OR it can be a standard drag/swipe carousel with arrow controls. The drag/swipe approach is more reliable — implement drag-to-scroll with mouse and touch support.

**Implementation approach:**

Use a horizontally overflowing flex container with `scroll-snap-type: x mandatory` on the container and `scroll-snap-align: start` on each card. Add drag-to-scroll via mouse events and GSAP for smooth momentum.

**Container CSS:**
```css
.speaker-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* hide scrollbar */
  cursor: grab;
  padding-bottom: 1rem;
}

.speaker-carousel::-webkit-scrollbar { display: none; }
.speaker-carousel.is-dragging { cursor: grabbing; }
```

**Card CSS:**
Each card is `16:9 ratio`. On desktop, width = `calc(60vw - 2rem)`, max `520px`. The card height is auto-calculated by the aspect ratio.

```css
.speaker-card {
  flex: 0 0 calc(60vw - 2rem);
  max-width: 520px;
  aspect-ratio: 16 / 9;
  scroll-snap-align: start;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface);
  border: 0.5px solid var(--border);
}

@media (max-width: 640px) {
  .speaker-card {
    flex: 0 0 85vw;
  }
}
```

**Drag-to-scroll JavaScript (GSAP):**
```javascript
const carousel = document.querySelector('.speaker-carousel');
let isDragging = false;
let startX, scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  carousel.classList.add('is-dragging');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  carousel.classList.remove('is-dragging');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
});

// Touch support
carousel.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});
carousel.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - carousel.offsetLeft;
  carousel.scrollLeft = scrollLeft - (x - startX) * 1.2;
});
```

**Navigation arrows (optional but recommended):**
Add previous/next arrow buttons floating over the right side of the carousel section.

```html
<div class="carousel-nav">
  <button class="carousel-btn" id="prevSpeaker">←</button>
  <button class="carousel-btn" id="nextSpeaker">→</button>
</div>
```

```javascript
const cardWidth = document.querySelector('.speaker-card').offsetWidth + 24; // + gap
document.getElementById('nextSpeaker').addEventListener('click', () => {
  gsap.to(carousel, { scrollLeft: carousel.scrollLeft + cardWidth, duration: 0.6, ease: 'power2.inOut' });
});
document.getElementById('prevSpeaker').addEventListener('click', () => {
  gsap.to(carousel, { scrollLeft: carousel.scrollLeft - cardWidth, duration: 0.6, ease: 'power2.inOut' });
});
```

### Card Content — All Three Cards

Each card has:
- A background image (16:9, `object-fit: cover`)
- A dark gradient overlay: `linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.5) 50%, rgba(13,13,13,0.1) 100%)`
- Content anchored to the bottom of the card
- A small top-right date badge

**Card 1 — BNCC Skill Class 2.0**

```html
<div class="speaker-card">
  <img src="[EXCEL_TO_PROVIDE_PHOTO]" alt="BNCC Skill Class 2.0" 
       class="speaker-img" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
  <!-- Fallback placeholder until real photo provided: -->
  <!-- src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80" -->
  <div class="speaker-overlay"></div>
  <div class="speaker-content">
    <span class="speaker-date">May 2026</span>
    <p class="speaker-event">BNCC Skill Class 2.0</p>
    <h3 class="speaker-title">LinkedIn for Better Personal Branding</h3>
    <p class="speaker-role">Panelist · Mentor · Judge</p>
    <p class="speaker-detail">Mentored 40+ participants. Served as panelist and project judge for a session on personal branding and LinkedIn optimization.</p>
  </div>
</div>
```

**Card 2 — AI & Digital Generation**

```html
<div class="speaker-card">
  <img src="[EXCEL_TO_PROVIDE_PHOTO]" alt="AI Speaker Session"
       class="speaker-img" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
  <!-- Fallback: src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80" -->
  <div class="speaker-overlay"></div>
  <div class="speaker-content">
    <span class="speaker-date">June 2025</span>
    <p class="speaker-event">Empowering Digital Generation Through AI</p>
    <h3 class="speaker-title">Artificial Intelligence & Brain Rot</h3>
    <p class="speaker-role">Speaker · Demonstrator</p>
    <p class="speaker-detail">Taught AI prompting fundamentals and live-built games (Tic Tac Toe, Snake, Memory Game). Demonstrated Sora, Veo 3, and Suno AI to a live audience.</p>
  </div>
</div>
```

**Card 3 — Youth Leadership Camp**

```html
<div class="speaker-card">
  <img src="[EXCEL_TO_PROVIDE_PHOTO]" alt="Youth Leadership Camp"
       class="speaker-img" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
  <!-- Fallback: src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80" -->
  <div class="speaker-overlay"></div>
  <div class="speaker-content">
    <span class="speaker-date">Oct 2024</span>
    <p class="speaker-event">Youth Leadership Camp — LDKS</p>
    <h3 class="speaker-title">10 Pillars of Leadership</h3>
    <p class="speaker-role">Keynote Speaker</p>
    <p class="speaker-detail">Delivered a session on the 10 Pillars of Leadership to incoming student council members at Mitra Harapan Junior High School.</p>
  </div>
</div>
```

**Shared card CSS:**
```css
.speaker-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(13,13,13,0.95) 0%,
    rgba(13,13,13,0.5) 50%,
    rgba(13,13,13,0.1) 100%
  );
  border-radius: inherit;
}

.speaker-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 2;
}

.speaker-date {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  background: rgba(13,13,13,0.6);
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
}

.speaker-event {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.speaker-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
  margin-bottom: 0.4rem;
}

.speaker-role {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 0.75rem;
}

.speaker-detail {
  font-size: 13px;
  color: rgba(240,237,230,0.7);
  line-height: 1.5;
}
```

### Photo Handling Note
Excel will provide real photos from each speaking event. When provided, replace the placeholder Unsplash URLs with the actual photo files placed in `assets/images/speaker/`. The `[EXCEL_TO_PROVIDE_PHOTO]` placeholder marks exactly where each photo goes.

### Section Entrance Animation (GSAP)
```javascript
gsap.from('.section-eyebrow, .speaker-section .section-title, .speaker-section .section-body', {
  scrollTrigger: { trigger: '.speaker-section', start: 'top 80%' },
  y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

gsap.from('.speaker-card', {
  scrollTrigger: { trigger: '.speaker-carousel', start: 'top 85%' },
  x: 60, opacity: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out'
});
```

---

## 5. Achievements Section — Full Rework

### Remove — Subtext line
Delete this line entirely. It does not exist anywhere on the page anymore:
```
From university halls to international stages — every competition was a real problem, a real team, and a real result.
```

### Remove — LABORA expandable card
Remove the expandable detail panel for Card 1 (SCUBA / LABORA). The `id="a1"` expand panel with the title "LABORA — Digital Workforce Placement Platform" and its body text is deleted entirely.

The SCUBA card itself stays — only the expandable detail is removed. The card can still have the click interaction, but clicking it no longer opens anything (remove the `onclick` attribute from the SCUBA card, or make it a no-op).

### Rework — Card Layout & Proportions

**The problem:** Cards are inconsistent in size and ratio. Some are taller than others. The grid is not visually balanced.

**The fix:** All achievement cards must be `16:9 aspect ratio`. Use `aspect-ratio: 16 / 9` on every `.ach-card`. The grid changes to a more intentional mixed layout:

**Desktop grid (≥ 1024px):**
```
[ Card 1 — SCUBA (featured, 2 cols wide) ] [ Card 2 — Hult (1 col) ]
[ Card 3 — BMPC (1 col) ] [ Card 4 — BUMN (1 col) ] [ Card 5 — Inventify (1 col) ]
```

Use CSS Grid:
```css
.ach-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  background: transparent; /* remove the 1px background separator approach */
  border: none;
  border-radius: 0;
  margin-top: 3rem;
}

.ach-card {
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  border: 0.5px solid var(--border);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--surface);
}

/* Featured card spans 2 columns */
.ach-card.featured-ach:first-child {
  grid-column: span 2;
}
```

**Mobile (< 640px):** All cards single column, full width, `aspect-ratio: 16/9`.

### Rework — Card Visual Design

All cards in the achievement section use the **image-mode** design (image background + gradient overlay + text on top). This is already specified in the previous guidelines for featured cards — now apply it to ALL cards uniformly.

Every card must have:
1. A background image (`object-fit: cover`, `width: 100%`, `height: 100%`, `position: absolute`, `inset: 0`)
2. A gradient overlay anchored to the bottom: `linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.55) 55%, rgba(13,13,13,0.15) 100%)`
3. Card content (rank, title, org, year) absolutely positioned at bottom-left, `z-index: 2`
4. Arrow icon (`↗`) at top-right, initially `opacity: 0`, fades in on hover

**Updated image URLs (all 16:9 appropriate Unsplash images):**

| Card | Title | Image URL |
|---|---|---|
| 1 (featured, 2-col) | SCUBA — International Business Plan | `https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=85` |
| 2 | Hult Prize National Summit | `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=85` |
| 3 | BMPC Business Pitch | `https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=85` |
| 4 | Grease Gone — BUMN | `https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=85` |
| 5 | Inventify / DreamBound | `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=85` |

### Rework — Achievement Card Animations ("Go Wild — But Elegant")

These animations must feel premium. Smooth, intentional, and rewarding. No jank, no bounce.

**1. Section entrance — staggered reveal with clip-path:**
```javascript
gsap.from('.ach-card', {
  scrollTrigger: { trigger: '.ach-grid', start: 'top 75%' },
  clipPath: 'inset(0 100% 0 0)',
  opacity: 0,
  duration: 0.9,
  stagger: {
    amount: 0.6,
    from: 'start'
  },
  ease: 'power3.inOut',
  onStart: function() {
    gsap.set('.ach-card', { clipPath: 'inset(0 0% 0 0)' });
  }
});
```

**Alternative if clip-path causes issues:**
```javascript
gsap.from('.ach-card', {
  scrollTrigger: { trigger: '.ach-grid', start: 'top 75%' },
  y: 60, opacity: 0, scale: 0.97,
  duration: 0.8, stagger: 0.12,
  ease: 'power3.out'
});
```

**2. Image parallax on hover (per card):**
Each card's background image shifts slightly when the mouse moves over the card, creating a subtle depth effect:
```javascript
document.querySelectorAll('.ach-card').forEach(card => {
  const img = card.querySelector('.ach-bg-img');
  if (!img) return;
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, {
      x: x * 15,
      y: y * 15,
      scale: 1.08,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(img, {
      x: 0, y: 0, scale: 1,
      duration: 0.8, ease: 'power2.out'
    });
  });
});
```

**3. Rank badge animation on card entrance:**
The rank label (e.g., "🥇 1st Place · International") should slide up from below the gradient as each card reveals:
```javascript
gsap.from('.ach-rank', {
  scrollTrigger: { trigger: '.ach-grid', start: 'top 75%' },
  y: 20, opacity: 0, duration: 0.6,
  stagger: 0.15, delay: 0.3,
  ease: 'power2.out'
});
```

**4. Featured card (SCUBA, 2-column) — extra treatment:**
The featured card gets an additional animated border glow on scroll enter:
```javascript
const featuredCard = document.querySelector('.ach-card.featured-ach');
ScrollTrigger.create({
  trigger: featuredCard,
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo(featuredCard, 
      { boxShadow: '0 0 0px rgba(200,241,53,0)' },
      { boxShadow: '0 0 40px rgba(200,241,53,0.15)', duration: 1.2, ease: 'power2.out' }
    );
  }
});
```

**5. Expandable detail cards — smooth height animation:**
For the cards that still have expandable details (Cards 2, 4, 5), the expand/collapse should animate height smoothly instead of `display: none` toggling:
```javascript
function toggleAch(id) {
  const panel = document.getElementById(id);
  if (!panel || !panel.innerHTML.trim()) return;
  
  const isOpen = panel.classList.contains('open');
  
  // Close all
  document.querySelectorAll('.ach-expand.open').forEach(p => {
    gsap.to(p, {
      height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut',
      onComplete: () => p.classList.remove('open')
    });
  });
  
  // Open clicked if it was closed
  if (!isOpen) {
    panel.classList.add('open');
    panel.style.height = 'auto';
    const h = panel.scrollHeight;
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.style.overflow = 'hidden';
    gsap.to(panel, {
      height: h, opacity: 1, duration: 0.5, ease: 'power2.out',
      onComplete: () => { panel.style.height = 'auto'; }
    });
  }
}
```

---

## 6. Summary of All Changes in This Revision

| # | Section | What changes |
|---|---|---|
| 1 | Hero | Remove old cursor entirely. Add mouse parallax background with layered depth effect (dulcedo.com reference). |
| 2 | Hero | Add decode/scramble animation on hover over headline text. |
| 3 | Origin | Replace opening paragraph text (new wording). |
| 4 | Origin | Replace blockquote text with "Five People" quote + full aesthetic treatment (large decorative marks, word stagger animation, bold "Five People"). |
| 5 | Origin | Replace second paragraph text (new wording about double degree). |
| 6 | Origin | Remove stats card entirely. Switch layout from 2-column to single column. |
| 7 | New Section | Insert Guest Speaker section between Origin and Achievements. Horizontal drag carousel, 3 cards at 16:9 ratio, image cards with overlay text. Move marquee strip to after this section. |
| 8 | Achievements | Remove subtext "From university halls to international stages...". |
| 9 | Achievements | Remove LABORA expandable detail panel (Card 1 expand content). Make SCUBA card non-expandable. |
| 10 | Achievements | Rework all cards to 16:9 aspect ratio. New CSS Grid layout (featured card = 2 cols). |
| 11 | Achievements | Apply image-mode design (background image + gradient overlay) to ALL cards uniformly. |
| 12 | Achievements | Add clip-path reveal animation on scroll, per-card image parallax on hover, glow on featured card, smooth height expand/collapse. |

---

## 7. Files to Touch in This Revision

```
index.html    → Guest Speaker section, card structure updates, quote HTML, parallax layers, headline span wrapping
style.css     → speaker-card, speaker-carousel, story-quote-block, deco-quote, ach-grid new layout, image-mode cards
script.js     → parallax mouse effect, decode effect, word stagger for quote, carousel drag, achievement animations
```

---

## 8. Photo Placeholders — Awaiting Real Images from Excel

The following slots are waiting for real photos. Use Unsplash fallbacks in the meantime:

| Slot | Fallback URL | Notes |
|---|---|---|
| Speaker Card 1 (BNCC) | `https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80` | Conference/panel setting |
| Speaker Card 2 (AI session) | `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80` | Tech/workshop setting |
| Speaker Card 3 (Leadership camp) | `https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80` | Youth/leadership setting |

When Excel provides real photos, place them in `assets/images/speaker/` and replace the src attributes. No structural changes needed.

---

*End of Revision 02. Apply all changes on top of the existing codebase.*
*Produced in collaboration with Claude (Anthropic) · June 2026*
