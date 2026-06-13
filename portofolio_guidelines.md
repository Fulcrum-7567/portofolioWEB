# Excel Sean — Portfolio Build Guidelines
> This file is the continuation guide for the IDE.
> The base jsx framework has already been built and fed into the project.
> This document covers all updates, changes, additions, and animation instructions to be applied on top of that base.
> Read this file fully before writing any code. Every decision here is intentional.

---

## 0. Context & Starting Point

The base jsx file contains the initial draft of the portfolio with the following sections already scaffolded:
- Navigation bar
- Hero section
- Origin / Story section
- Achievements section
- Capabilities / Skills section
- Leadership section
- Close / Contact section

The task now is to **upgrade** that base into the full, polished, animated portfolio described in this document. Do not rebuild from scratch — extend and refine what exists.

---

## 1. Tech Stack Changes

### Add to the project

**GSAP (GreenSock Animation Platform)**
The primary animation library for all motion in this portfolio. Use GSAP for:
- Loading screen animations
- Hero text entrance
- Scroll-triggered reveals
- Staggered list animations
- Hover micro-interactions that need JS control

CDN link to add in `<head>`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

Register ScrollTrigger plugin at the top of your JS:
```javascript
gsap.registerPlugin(ScrollTrigger);
```

**Tailwind CSS**
Use Tailwind CSS as the utility layer for layout, spacing, and responsive design. It works alongside the existing custom CSS — do not remove the existing `:root` CSS variables or the custom classes. Tailwind handles the structural/responsive layer; custom CSS handles the design tokens and brand-specific styles.

CDN link to add in `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

Configure Tailwind to extend your existing color palette in a `<script>` tag:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'es-bg': '#0D0D0D',
          'es-surface': '#161616',
          'es-surface2': '#1E1E1E',
          'es-text': '#F0EDE6',
          'es-muted': '#888888',
          'es-accent': '#C8F135',
          'es-border': '#2A2A2A',
        },
        fontFamily: {
          display: ['Space Grotesk', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
        }
      }
    }
  }
</script>
```

---

## 2. Loading Screen (First Thing Visitors See)

### Reference
Federico Pian's portfolio at federicopian.com uses a percentage-based loading screen with a circular progress indicator. The number counts from 0 to 100% while a circle animates around it. When it reaches 100%, the loader fades out and the main content enters.

### What to build

A full-screen loading overlay that covers the entire page on first load. It must be the **very first thing a visitor sees** — the main portfolio content should be hidden (`opacity: 0`, `visibility: hidden`) until the loader completes.

**Visual structure of the loader:**
```
[full screen — background: #0D0D0D]

         ┌─────────────────┐
         │                 │
         │   [SVG Circle   │
         │    Progress]    │
         │                 │
         │      87%        │   ← large number, Space Grotesk, bold
         │                 │
         └─────────────────┘

    [bottom left]              [bottom right]
    EXCEL SEAN                 Portfolio 2026
```

**Exact specs:**

- Background: `#0D0D0D` (same as site background — seamless)
- Center element: An SVG circle (stroke-based progress ring), roughly `180px` diameter
- Circle stroke color: `#C8F135` (accent) for the progress arc; `#2A2A2A` (border color) for the track
- Circle stroke width: `3px`
- Number inside circle: Space Grotesk, `clamp(40px, 6vw, 64px)`, font-weight 700, color `#F0EDE6`
- `%` symbol: smaller, color `#888888`, positioned top-right of the number
- Bottom-left text: "EXCEL SEAN" — 12px, letter-spacing 0.2em, uppercase, color `#888888`
- Bottom-right text: "Portfolio 2026" — 12px, letter-spacing 0.08em, color `#888888`

**Animation behavior (use GSAP):**

1. On page load, the loader is immediately visible, full screen
2. Count from `0` to `100` over approximately `2.2 seconds` — not linear, use GSAP's `power2.inOut` easing so it accelerates through the middle and slows at 100
3. The SVG circle `stroke-dashoffset` animates from full (empty circle) to zero (complete circle), in sync with the number count
4. At `100%`, hold for `300ms`
5. Then: the loader fades out with a `clip-path` wipe or a vertical slide-up — the loader panel slides up and off screen (`y: -100%`), revealing the site underneath. Duration: `0.8s`, easing: `power3.inOut`
6. Simultaneously, trigger the hero entrance animation (see Section 4)

**HTML structure:**
```html
<div id="loader" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D]">
  <div class="relative flex items-center justify-center">
    <!-- SVG Circle Progress -->
    <svg class="absolute" width="180" height="180" viewBox="0 0 180 180">
      <!-- Track circle -->
      <circle cx="90" cy="90" r="80" fill="none" stroke="#2A2A2A" stroke-width="3"/>
      <!-- Progress arc -->
      <circle id="loaderArc" cx="90" cy="90" r="80" fill="none" 
              stroke="#C8F135" stroke-width="3"
              stroke-dasharray="502.65" stroke-dashoffset="502.65"
              stroke-linecap="round"
              transform="rotate(-90 90 90)"/>
    </svg>
    <!-- Number display -->
    <div class="flex items-start">
      <span id="loaderNum" class="font-display font-bold text-[#F0EDE6]" style="font-size: clamp(40px,6vw,64px);">0</span>
      <span class="font-display font-light text-[#888] text-xl mt-2">%</span>
    </div>
  </div>
  <!-- Bottom labels -->
  <div class="absolute bottom-8 left-8 text-[#888] text-xs tracking-[0.2em] uppercase font-body">Excel Sean</div>
  <div class="absolute bottom-8 right-8 text-[#888] text-xs tracking-[0.08em] font-body">Portfolio 2026</div>
</div>
```

**JavaScript (GSAP) for the loader:**
```javascript
// circumference of circle with r=80: 2 * π * 80 = 502.65
const circumference = 502.65;
const loaderArc = document.getElementById('loaderArc');
const loaderNum = document.getElementById('loaderNum');
const loader = document.getElementById('loader');

// Hide main content initially
gsap.set('body > *:not(#loader)', { opacity: 0, visibility: 'hidden' });

const loaderTl = gsap.timeline({
  onComplete: () => {
    // Slide loader up off screen
    gsap.to(loader, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        // Reveal main content
        gsap.set('body > *:not(#loader)', { visibility: 'visible' });
        gsap.to('body > *:not(#loader)', { opacity: 1, duration: 0.4 });
        // Trigger hero animation
        initHeroAnimation();
      }
    });
  }
});

// Count and arc animation
const counter = { val: 0 };
loaderTl.to(counter, {
  val: 100,
  duration: 2.2,
  ease: 'power2.inOut',
  onUpdate: () => {
    const progress = Math.round(counter.val);
    loaderNum.textContent = progress;
    const offset = circumference - (progress / 100) * circumference;
    loaderArc.style.strokeDashoffset = offset;
  }
}).to({}, { duration: 0.3 }); // hold at 100 for 300ms
```

---

## 3. Layout Reference — SPYLT.com

### What to take from spylt.com (layout only, NOT color or branding)

The spylt.com website demonstrates a specific approach to layout and content presentation that should be adopted for Excel Sean's portfolio:

**Key layout principles to adopt:**

1. **Large typographic statements as section anchors**
   - Spylt uses oversized, bold headline text that takes up significant vertical space before the supporting content
   - Adopt this: every section should open with a typographic "punch" — big, bold, unapologetic — before any supporting body copy or cards appear
   - Example: The achievements section headline shouldn't just be 42px — it should feel like it dominates the first moment of that section

2. **Content blocks that breathe**
   - Spylt uses generous whitespace between content modules, making each section feel like its own world
   - Apply: increase section padding to `8rem 2rem` minimum. Let sections breathe. Don't pack content.

3. **Mixed-size grid layouts for showcasing items**
   - Spylt shows product items in a mixed grid — some cards larger, some smaller, creating visual rhythm and hierarchy
   - Apply this to the Achievements and Leadership sections: the featured achievement cards should be visually larger (spanning 2 columns) and less prominent ones smaller (1 column). Not a uniform grid.

4. **Horizontal scrolling marquee / ticker strip**
   - Spylt uses a scrolling text ticker strip as a visual divider between sections
   - Add a marquee strip between major sections (e.g., between Hero and Story, and between Achievements and Skills)
   - Content of the marquee: rotate through phrases that represent Excel's identity:
     `BUSINESS THINKER · PROBLEM SOLVER · COMPETITOR · BUILDER · GENERALIST · GETS THINGS DONE ·`
   - Style: small caps, letter-spacing 0.2em, color `#2A2A2A` on a `#161616` background strip, or inverted: `#888` text on `#0D0D0D`. The strip should scroll infinitely left using CSS animation or GSAP.

5. **Image cards with overlay text**
   - Spylt presents content items as image cards where the text overlays the image with a dark gradient at the bottom
   - Apply this to Achievement and Leadership cards that have images (see Section 7 of this document): image fills the card, dark gradient overlay at bottom, title and rank text appear over the image

6. **Full-width "statement" sections**
   - Spylt has sections where a single large statement spans nearly the full viewport width
   - Apply: between sections, consider adding a full-width single-sentence statement in very large type that summarizes the narrative transition. Example: between Story and Achievements, a full-width line that says `"And then the results started showing."` in 60–80px font, color `#2A2A2A` (very dark, subtle), that becomes visible only on scroll.

7. **Sticky section labels**
   - Spylt uses small labels that stick to the side or top of sections to indicate what part of the page you're in
   - Apply: a small vertical text label on the left side (`position: fixed`, rotated 90deg) that shows the current section name as the user scrolls. Color: `#2A2A2A`, transitions to `#888` when the section is active.

---

## 4. Hero Section Updates

### Change: Hero Headline

**Remove:** "I don't wait to be told how."
**Replace with:** "Experience outranks Everything"

Exact typographic treatment:
```
Experience outranks        ← color: #F0EDE6, font-weight 700
Everything                 ← color: #C8F135 (accent), font-weight 700
```

Both lines use the same font size (`clamp(52px, 8vw, 88px)`), Space Grotesk. The accent line should feel like a punch — it lands after the setup.

**Alternative treatment (also acceptable):**
```
Experience                 ← #F0EDE6, weight 700
outranks                   ← #888888, weight 300 (dimmed, connecting word)
Everything                 ← #C8F135, weight 700
```
Let the IDE choose whichever reads more powerfully in the actual rendered output.

### Remove: Location Tag

Remove the eyebrow text that reads "Based in Surabaya, Indonesia". Do not replace it with anything. The hero should open directly with the headline.

The hero eyebrow line with the horizontal rule before "Based in Surabaya, Indonesia" — remove the entire element.

### Hero entrance animation (GSAP — triggered after loader completes)

Function name: `initHeroAnimation()`

```javascript
function initHeroAnimation() {
  const heroTl = gsap.timeline();
  
  heroTl
    .from('.hero-headline .line1', {
      y: 80, opacity: 0, duration: 0.9, ease: 'power3.out'
    })
    .from('.hero-headline .line2', {
      y: 80, opacity: 0, duration: 0.9, ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-sub', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero-tags .tag', {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-scroll', {
      opacity: 0, duration: 0.5
    }, '-=0.2');
}
```

Each line of the headline should be wrapped in a `<span>` with class `line1`, `line2` etc for targeting:
```html
<h1 class="hero-headline">
  <span class="line1 block">Experience outranks</span>
  <span class="line2 block accent">Everything</span>
</h1>
```

---

## 5. Global Scroll-Triggered Animations

Apply to ALL sections using GSAP ScrollTrigger. Every section entrance should feel intentional, not instant.

### Standard section entrance (apply to all section titles and bodies):
```javascript
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    y: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
  });
});

gsap.utils.toArray('.section-body').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.15
  });
});
```

### Stats counter animation (Origin section):
When the stats card scrolls into view, the numbers should count up from 0 to their final value:
```javascript
gsap.utils.toArray('.stat-value').forEach(el => {
  const target = parseInt(el.textContent);
  if (isNaN(target)) return; // skip GPA (3.65)
  const obj = { val: 0 };
  gsap.to(obj, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    val: target,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
  });
});
```

### Achievement cards stagger:
```javascript
gsap.from('.ach-card', {
  scrollTrigger: { trigger: '#achGrid', start: 'top 80%' },
  y: 50, opacity: 0, duration: 0.6,
  stagger: 0.1, ease: 'power2.out'
});
```

### Leadership items stagger:
```javascript
gsap.from('.lead-item', {
  scrollTrigger: { trigger: '.lead-list', start: 'top 80%' },
  x: -40, opacity: 0, duration: 0.6,
  stagger: 0.12, ease: 'power2.out'
});
```

### Skill columns stagger:
```javascript
gsap.from('.skill-col', {
  scrollTrigger: { trigger: '.skills-layout', start: 'top 80%' },
  y: 40, opacity: 0, duration: 0.7,
  stagger: 0.15, ease: 'power3.out'
});
```

---

## 6. Custom Cursor

A custom cursor must replace the default browser cursor on desktop. On touch/mobile devices, the custom cursor should not appear.

**Behavior:**
- Default state: small filled circle, `12px` diameter, color `#C8F135` (accent), `50%` border-radius
- Hover state (over any `<a>`, `<button>`, `.ach-card`, `.lead-item`): cursor expands to `40px`, changes to transparent with a `1.5px solid #C8F135` border (ring shape), with a slight mix-blend-mode effect
- The cursor should follow the mouse with a slight lag (use GSAP quickSetter for smooth following)

**HTML (add just before closing `</body>`):**
```html
<div id="cursor" class="fixed pointer-events-none z-[9998] rounded-full transition-none" 
     style="width:12px;height:12px;background:#C8F135;transform:translate(-50%,-50%);top:0;left:0;"></div>
<div id="cursorRing" class="fixed pointer-events-none z-[9997] rounded-full transition-none"
     style="width:40px;height:40px;border:1.5px solid #C8F135;transform:translate(-50%,-50%);top:0;left:0;opacity:0;"></div>
```

**JavaScript:**
```javascript
// Only on non-touch devices
if (!('ontouchstart' in window)) {
  document.body.style.cursor = 'none';
  
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  
  const xSetter = gsap.quickSetter(cursor, 'x', 'px');
  const ySetter = gsap.quickSetter(cursor, 'y', 'px');
  const rxSetter = gsap.quickSetter(ring, 'x', 'px');
  const rySetter = gsap.quickSetter(ring, 'y', 'px');
  
  window.addEventListener('mousemove', (e) => {
    xSetter(e.clientX);
    ySetter(e.clientY);
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
  });
  
  // Hover states
  document.querySelectorAll('a, button, .ach-card, .lead-item, .tag, .nav-cta').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 0, duration: 0.2 });
      gsap.to(ring, { opacity: 1, scale: 1, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(ring, { opacity: 0, scale: 0.8, duration: 0.2 });
    });
  });
}
```

---

## 7. Images in Achievement & Leadership Sections

### Context
Excel will provide real photos from his competitions and organizational activities in the future. For now, use placeholder images from a stock source. The image cards should be built so that swapping in a real image later requires only changing the `src` attribute.

### Stock image source
Use `https://images.unsplash.com` for all placeholder images. Select images that are contextually relevant (business presentations, conference settings, teams, etc.).

### Achievement Cards — Image Integration

The achievement cards should now support an **image mode**: cards with images display the image as a full card background with a dark gradient overlay, and the text sits on top of the image. This matches the Spylt layout reference where images carry the content.

**For the two featured achievement cards (SCUBA and Hult Prize), use image mode.**
**For the smaller achievement cards, image mode is optional but preferred.**

Updated card structure for image-mode cards:
```html
<div class="ach-card featured-ach image-card" onclick="toggleAch('a1')" 
     style="background-image: url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'); background-size: cover; background-position: center;">
  <div class="ach-card-overlay"></div> <!-- dark gradient overlay -->
  <div class="ach-card-content">
    <span class="ach-arrow">↗</span>
    <p class="ach-rank">🥇 1st Place · International</p>
    <p class="ach-name">SCUBA International Business Plan Competition</p>
    <p class="ach-org">Brawijaya University · Faculty of Economics</p>
    <p class="ach-year">Nov 2024 · Winner among 10 finalists from hundreds</p>
  </div>
</div>
```

**CSS additions:**
```css
.image-card {
  position: relative;
  min-height: 260px;
}

.ach-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(13,13,13,0.95) 0%,
    rgba(13,13,13,0.6) 50%,
    rgba(13,13,13,0.2) 100%
  );
  border-radius: inherit;
}

.ach-card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
}
```

**Suggested Unsplash images per achievement card:**

| Card | Description | Suggested Unsplash query |
|---|---|---|
| SCUBA / LABORA | International business pitch | `https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80` (business presentation) |
| Hult Prize | Conference / summit stage | `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80` (conference) |
| BMPC | Pitch/business competition | `https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80` (team pitch) |
| Grease Gone / BUMN | Innovation / sustainability | `https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80` (sustainability) |
| Inventify / DreamBound | Entrepreneurship award | `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80` (startup award) |

### Leadership Items — Image Integration

The leadership section items should have a small square thumbnail image on the right side of each row. This adds visual richness and makes the section feel less like a resume list.

Image size: `80px × 80px`, `border-radius: 8px`, `object-fit: cover`, positioned at the right end of the `lead-header` row.

**Updated lead-item structure:**
```html
<div class="lead-item">
  <div class="lead-header">
    <div>
      <p class="lead-role">Head of Human Resource Development</p>
      <p class="lead-org">HIMPRENEUR</p>
    </div>
    <div class="flex items-center gap-4">
      <p class="lead-period">2024–2025</p>
      <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160&q=80" 
           alt="HIMPRENEUR" 
           class="lead-thumb"
           style="width:80px;height:80px;border-radius:8px;object-fit:cover;flex-shrink:0;">
    </div>
  </div>
  <span class="lead-metric">60% improvement in candidate quality</span>
</div>
```

**Suggested images per leadership role:**

| Role | Suggested Unsplash image |
|---|---|
| HIMPRENEUR HR Head | `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160&q=80` (team meeting) |
| BNCC HR Deputy | `https://images.unsplash.com/photo-1531482615713-2afd69097998?w=160&q=80` (computer club) |
| Freshmen Partner | `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=160&q=80` (mentoring) |
| Student Council President | `https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=160&q=80` (high school leadership) |

**Important note for future swap:** When Excel provides real photos, simply replace the `src` URL. No structural changes needed.

---

## 8. Marquee Strip (Divider Between Sections)

Add a horizontally scrolling marquee strip as a visual divider between:
1. Hero section and Origin/Story section
2. Achievements section and Capabilities section

**Content (repeating):**
```
BUSINESS THINKER · PROBLEM SOLVER · COMPETITOR · BUILDER · GENERALIST · GETS THINGS DONE · EXPERIENCE OUTRANKS EVERYTHING ·
```

**HTML:**
```html
<div class="marquee-strip overflow-hidden py-4 border-y border-[#2A2A2A] bg-[#0D0D0D]">
  <div class="marquee-track flex gap-12 whitespace-nowrap" style="width: max-content;">
    <!-- Repeat the content twice for seamless loop -->
    <span class="marquee-content text-xs tracking-[0.2em] uppercase text-[#2A2A2A] font-display font-medium">
      BUSINESS THINKER · PROBLEM SOLVER · COMPETITOR · BUILDER · GENERALIST · GETS THINGS DONE · EXPERIENCE OUTRANKS EVERYTHING ·
    </span>
    <span class="marquee-content text-xs tracking-[0.2em] uppercase text-[#2A2A2A] font-display font-medium">
      BUSINESS THINKER · PROBLEM SOLVER · COMPETITOR · BUILDER · GENERALIST · GETS THINGS DONE · EXPERIENCE OUTRANKS EVERYTHING ·
    </span>
  </div>
</div>
```

**CSS:**
```css
@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  animation: marqueeScroll 25s linear infinite;
}

.marquee-strip:hover .marquee-track {
  animation-play-state: paused;
}
```

---

## 9. Animation Tone Guide

These rules govern ALL animation decisions in the portfolio. Consistency matters.

| Principle | Rule |
|---|---|
| **Purposeful** | Every animation has a reason — reveal information, guide attention, reward curiosity. No animation for decoration only. |
| **Fast entrances** | Elements enter quickly (`0.6–0.9s`). Slow animations feel sluggish. |
| **Ease out** | Always ease out on entrances (`power2.out`, `power3.out`). Easing in feels unnatural for appearing elements. |
| **Stagger sparingly** | Stagger delays should be `0.08–0.15s`. Longer staggers feel slow and theatrical. |
| **No bounce** | Do not use `bounce` or `elastic` easing. The portfolio tone is confident, not playful. Exception: the easter egg. |
| **Scroll start** | All scroll triggers start at `top 80–85%` of viewport. Elements should already be partly visible when they start animating. |
| **Hover: fast** | Hover micro-interactions: `0.2s` max. Users expect immediate feedback. |
| **GSAP over CSS** | Prefer GSAP for all meaningful animations. CSS transitions only for simple color/opacity hover states. |

---

## 10. Easter Egg

One hidden interaction that only curious users will find. This rewards people who explore the site.

**Trigger:** Click the "EXCEL SEAN" logo in the nav **5 times** in quick succession.

**What happens:**
1. A brief screen flash in accent color (`#C8F135`) — full screen, `opacity: 0.08`, duration `0.15s`
2. A small notification appears bottom-center of the screen:
   ```
   "you found it. now go build something." — ES
   ```
   Style: small card, `background: #1E1E1E`, `border: 0.5px solid #C8F135`, `color: #F0EDE6`, 13px, `border-radius: 8px`, `padding: 12px 20px`
3. The notification slides up from the bottom, holds for `3 seconds`, then fades out

**JavaScript:**
```javascript
let logoClickCount = 0;
let logoClickTimer;

document.querySelector('.nav-logo').addEventListener('click', () => {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1500);
  
  if (logoClickCount >= 5) {
    logoClickCount = 0;
    triggerEasterEgg();
  }
});

function triggerEasterEgg() {
  // Flash
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#C8F135;opacity:0.08;z-index:9990;pointer-events:none;';
  document.body.appendChild(flash);
  gsap.to(flash, { opacity: 0, duration: 0.4, onComplete: () => flash.remove() });
  
  // Notification
  const note = document.createElement('div');
  note.innerHTML = '"you found it. now go build something." <span style="color:#888">— ES</span>';
  note.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(80px);
    background:#1E1E1E; border:0.5px solid #C8F135; color:#F0EDE6;
    font-size:13px; padding:12px 20px; border-radius:8px; z-index:9991;
    font-family:'Inter',sans-serif; white-space:nowrap;
  `;
  document.body.appendChild(note);
  gsap.to(note, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out',
    onComplete: () => {
      gsap.to(note, { opacity: 0, y: -20, duration: 0.4, delay: 3, onComplete: () => note.remove() });
    }
  });
}
```

---

## 11. Mobile Responsiveness Rules

Apply these breakpoints when building with Tailwind:

| Breakpoint | Width | Changes |
|---|---|---|
| `sm` | < 640px | Single column everything. Hero headline: `clamp(36px,10vw,52px)`. Loader circle: `140px`. |
| `md` | 640–1024px | Two-column story layout switches to one column. Skills three-column switches to one column. |
| `lg` | > 1024px | Full layout as specified throughout this document. |

**Custom cursor:** disabled on touch devices (check `'ontouchstart' in window`).

**Marquee strip:** always visible on all screen sizes.

**Achievement grid:** `auto-fit minmax(280px, 1fr)` — wraps naturally on smaller screens.

---

## 12. Summary of All Changes from Base HTML

| # | What changes | Action |
|---|---|---|
| 1 | Add GSAP + ScrollTrigger | Add CDN scripts to `<head>` |
| 2 | Add Tailwind CSS | Add CDN script + config to `<head>` |
| 3 | Loading screen | Build new `#loader` element, add JS counter + circle animation |
| 4 | Hero headline | Change to "Experience outranks Everything" |
| 5 | Remove location eyebrow | Delete "Based in Surabaya, Indonesia" element |
| 6 | Hero animation | Wrap headline spans with `.line1/.line2`, add `initHeroAnimation()` |
| 7 | Scroll animations | Add ScrollTrigger to all sections, stat counters, card staggers |
| 8 | Custom cursor | Add `#cursor` + `#cursorRing` elements and cursor JS |
| 9 | Marquee strips | Add marquee dividers after Hero and after Achievements |
| 10 | Achievement images | Update featured cards to image-mode with gradient overlay |
| 11 | Leadership thumbnails | Add `80×80` thumbnail images to each leadership row |
| 12 | Easter egg | Add logo click counter + notification JS |
| 13 | Layout rhythm | Increase section padding, ensure typographic punches open each section |
| 14 | Sticky section label | Add fixed left-side section indicator that updates on scroll |

---

## 13. Files to Update / Create

```
excel-sean-portfolio/
├── index.html          ← primary file to update (all structural changes)
├── style.css           ← add new CSS: image-card overlay, marquee, cursor, loader
├── script.js           ← all GSAP code: loader, hero anim, scroll triggers, cursor, easter egg
└── assets/
    └── images/         ← placeholder Unsplash URLs used inline for now; swap later
```

Keep all JS in one `script.js` file loaded at the bottom of `<body>` with `defer`. Load order matters:
1. Google Fonts (in `<head>`)
2. Tailwind CDN (in `<head>`)
3. GSAP + ScrollTrigger CDN (in `<head>`)
4. `style.css` (in `<head>`)
5. `script.js` (bottom of `<body>`, or `<head>` with `defer`)

---

*End of guidelines. All changes documented above build on top of the existing base HTML file.*
*Produced in collaboration with Claude (Anthropic) · June 2026*
