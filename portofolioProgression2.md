# Excel Sean — Portfolio Revision 03
> Fourth iteration of build instructions.
> Previous revisions have implemented: loader, GSAP animations, parallax hero, decode effect, Guest Speaker carousel, achievement grid, origin rewrites.
> This document covers three focused areas: Voice carousel scroll behavior, Achievement section full rework (layout + card click detail), and Origin section photo integration.
> Read the full document before writing any code.

---

## 0. Reference — Wibily.agency Card Design

The attached screen recording shows **wibily.agency** as the visual reference for how achievement cards should look and be structured. Key observations from the reference:

- Cards live in a **consistent grid** where every card has identical proportions — no card is taller or wider than another unless intentionally featured
- Each card has a **large ghost number** (01, 02, 03, 04) watermarked in the background at very low opacity — purely decorative, adds depth
- Cards have a **small icon** top-left (simple, outlined)
- **Title** is prominent, mid-card
- **Short description** below the title in muted color
- **Tag/pill row** along the bottom of each card — horizontal list of keywords
- **Hover state:** card gets a brighter border or subtle background shift — clean, no dramatic transforms
- **Arrow (→)** appears bottom-right on hover
- The layout feels **clean, editorial, and structured** — not chaotic or over-designed
- When a card is clicked/selected, the detailed information appears in a **separate panel below or beside** the grid — NOT as an in-card accordion. The panel is spacious, clearly readable, and well-organized.

Apply this aesthetic philosophy to Excel Sean's achievement cards while keeping the existing dark color palette and acid lime accent.

---

## 1. Voice Section — Remove Arrow Buttons, Add Scroll-to-Slide

### Remove
Delete the previous/next arrow buttons (`#prevSpeaker`, `#nextSpeaker`, `.carousel-btn`, `.carousel-nav`) — both the HTML elements and all their JavaScript event listeners.

### New Interaction: Scroll-triggered horizontal slide

**Behavior:** When the user's cursor is positioned anywhere over the `.speaker-carousel` element and they scroll (mouse wheel), the carousel slides horizontally instead of the page scrolling vertically. The vertical page scroll is suppressed while the cursor is over the carousel. Once the user has scrolled through all cards (reached the end), normal vertical page scroll resumes.

This creates a natural, frictionless experience — the user never has to click anything, they just keep scrolling and the cards flow past.

**Implementation:**

```javascript
const carousel = document.querySelector('.speaker-carousel');
let isCarouselEnd = false;
let isCarouselStart = true;

carousel.addEventListener('wheel', (e) => {
  // Check if we've reached the end
  const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;
  const atStart = carousel.scrollLeft <= 5;
  
  // If scrolling backward and at start, let page scroll
  if (e.deltaY < 0 && atStart) return;
  
  // If scrolling forward and at end, let page scroll
  if (e.deltaY > 0 && atEnd) return;
  
  // Otherwise, intercept scroll and move carousel horizontally
  e.preventDefault();
  
  gsap.to(carousel, {
    scrollLeft: carousel.scrollLeft + (e.deltaY * 1.5),
    duration: 0.5,
    ease: 'power2.out',
    overwrite: true
  });
}, { passive: false });
```

**Visual hint for the user:** Add a small floating label that appears when the section first enters the viewport and fades away after 3 seconds:

```html
<div class="scroll-hint" id="speakerScrollHint">
  scroll to explore →
</div>
```

```css
.scroll-hint {
  position: absolute;
  bottom: -2rem;
  right: 0;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.4s;
}
```

```javascript
ScrollTrigger.create({
  trigger: '.speaker-carousel',
  start: 'top 80%',
  onEnter: () => {
    const hint = document.getElementById('speakerScrollHint');
    gsap.to(hint, { opacity: 1, duration: 0.4 });
    setTimeout(() => gsap.to(hint, { opacity: 0, duration: 0.6 }), 3000);
  },
  once: true
});
```

**Touch/mobile:** Keep the existing touch scroll behavior (swipe left/right natively). The wheel intercept only applies on non-touch devices.

```javascript
// Only apply wheel intercept on non-touch devices
if (!('ontouchstart' in window)) {
  carousel.addEventListener('wheel', ... ); // the handler above
}
```

**Progress indicator:** Add a thin progress bar below the carousel showing how far through the cards the user has scrolled. This gives visual feedback that there are more cards:

```html
<div class="carousel-progress-track">
  <div class="carousel-progress-bar" id="speakerProgressBar"></div>
</div>
```

```css
.carousel-progress-track {
  width: 100%;
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  margin-top: 1.5rem;
  overflow: hidden;
}

.carousel-progress-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}
```

```javascript
carousel.addEventListener('scroll', () => {
  const progress = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
  document.getElementById('speakerProgressBar').style.width = (progress * 100) + '%';
});
```

---

## 2. Achievement Section — Complete Layout & Detail Rework

### 2A. Grid Layout — Consistent Card Proportions

**The problem:** Cards are inconsistent in height and proportion. The grid feels uneven and messy.

**The fix:** A strict uniform grid where ALL cards are the same height. No card spans multiple columns on desktop — the featured distinction is handled through content emphasis (a highlight border or badge), NOT through size difference. This matches the wibily.agency reference where all 4 cards share identical dimensions.

**New grid CSS:**
```css
.ach-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
  background: transparent;
  border: none;
  border-radius: 0;
}

.ach-card {
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  border: 0.5px solid var(--border);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--surface);
  transition: border-color 0.25s ease;
}

.ach-card:hover {
  border-color: #444;
}

.ach-card.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 30px rgba(200,241,53,0.1);
}

/* Remove any span-2 or featured size overrides from previous revisions */
.ach-card.featured-ach:first-child {
  grid-column: span 1; /* reset — no more spanning */
}
```

**Mobile (< 640px):** `grid-template-columns: 1fr` — single column, all cards full width.

**5 cards in a 2-column grid:** First row: 2 cards. Second row: 2 cards. Third row: 1 card centered or full-width. For the lone card in row 3, center it:

```css
.ach-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: calc(50% - 0.75rem);
  margin: 0 auto;
}
```

### 2B. Card Visual Design — Wibily-Inspired

Each card now has the following structure inspired by the wibily reference. The image background is still used but is more restrained — the card does NOT look like a photo card. It looks like a **content card that has a subtle image texture behind it**.

**Visual layers per card (bottom to top):**
1. Background image at `opacity: 0.35` (very dim — just enough to add texture and context, not dominate)
2. `background: rgba(22,22,22,0.75)` overlay — keeps card dark and readable
3. Content layer

**Ghost number watermark:** Each card has a large number (01–05) in the top-right area, extremely low opacity:

```css
.ach-ghost-num {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(60px, 8vw, 90px);
  font-weight: 700;
  color: var(--text);
  opacity: 0.04;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  letter-spacing: -0.04em;
}
```

**Full card HTML structure (use this for all 5 cards):**
```html
<div class="ach-card" data-ach="a1" onclick="selectAch('a1')">
  <!-- Background image layer -->
  <div class="ach-bg" style="
    position:absolute; inset:0;
    background-image: url('IMAGE_URL_HERE');
    background-size: cover; background-position: center;
    opacity: 0.35;
    transition: opacity 0.4s ease;
  "></div>
  <!-- Dark overlay -->
  <div style="position:absolute;inset:0;background:rgba(22,22,22,0.78);"></div>
  
  <!-- Ghost number -->
  <span class="ach-ghost-num">01</span>
  
  <!-- Content -->
  <div class="ach-card-body">
    <!-- Rank badge top-left -->
    <p class="ach-rank">🥇 1st Place · International</p>
    
    <!-- Title -->
    <h3 class="ach-name">SCUBA International Business Plan Competition</h3>
    
    <!-- Org + year -->
    <p class="ach-org">Brawijaya University · Nov 2024</p>
    
    <!-- Tag pills at bottom -->
    <div class="ach-tags">
      <span class="ach-tag">Business Plan</span>
      <span class="ach-tag">International</span>
      <span class="ach-tag">Top 10 Finalist</span>
    </div>
  </div>
  
  <!-- Hover arrow -->
  <span class="ach-arrow">↗</span>
</div>
```

**Card body CSS:**
```css
.ach-card-body {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ach-rank {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
}

.ach-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(14px, 1.8vw, 18px);
  font-weight: 600;
  color: var(--text);
  line-height: 1.25;
  margin: 0.5rem 0 0.25rem;
}

.ach-org {
  font-size: 12px;
  color: var(--muted);
  flex: 1;
}

.ach-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 0.75rem;
}

.ach-tag {
  font-size: 11px;
  border: 0.5px solid var(--border);
  padding: 3px 10px;
  border-radius: 20px;
  color: var(--muted);
  font-family: 'Space Grotesk', sans-serif;
}

.ach-arrow {
  position: absolute;
  bottom: 1.25rem;
  right: 1.5rem;
  font-size: 16px;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 3;
}

.ach-card:hover .ach-arrow { opacity: 1; transform: translate(2px, -2px); }
.ach-card:hover .ach-bg { opacity: 0.5; } /* slightly brighter image on hover */
```

### 2C. All 5 Cards — Content Specification

**Card 1 — SCUBA**
- Ghost num: `01`
- Rank: `🥇 1st Place · International`
- Title: `SCUBA International Business Plan Competition`
- Org: `Brawijaya University · Nov 2024`
- Tags: `Business Plan` · `International` · `Top 10 Finalist`
- Image: `https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80`

**Card 2 — Hult Prize**
- Ghost num: `02`
- Rank: `🏅 National Finalist`
- Title: `Hult Prize National Summit`
- Org: `Institut Teknologi Bandung · May 2026`
- Tags: `Social Impact` · `National Stage` · `Top 37`
- Image: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80`

**Card 3 — BMPC**
- Ghost num: `03`
- Rank: `🥇 1st Place · National`
- Title: `BMPC Business Pitch Competition`
- Org: `Bina Nusantara University · May 2024`
- Tags: `Pitch` · `National` · `Business`
- Image: `https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80`

**Card 4 — Grease Gone**
- Ghost num: `04`
- Rank: `🥉 Top 3 · Social Impact`
- Title: `Best Social Ideation — Grease Gone`
- Org: `Pikiran Terbaik Negeri (BUMN) · Aug 2025`
- Tags: `Sustainability` · `Grant Recipient` · `Social Impact`
- Image: `https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80`

**Card 5 — Inventify**
- Ghost num: `05`
- Rank: `🥇 Gold Medal · International`
- Title: `International Youthpreneur Competition`
- Org: `Inventify Center · May 2025`
- Tags: `Innovation` · `Gold Medal` · `International`
- Image: `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80`

### 2D. Click Detail Panel — Replacing the In-Card Accordion

**Remove entirely:** All previous `.ach-expand` panels, the `toggleAch()` function, and any in-card accordion behavior. Delete the `id="a1"` through `id="a5"` expand divs.

**New behavior:** Clicking a card selects it (adds `.is-active` class). A **separate, standalone detail panel** below the grid updates to show that card's full information. Only one card can be active at a time. Clicking the active card again deselects it and closes the panel.

**Detail panel HTML (place immediately after the `.ach-grid` closing tag):**
```html
<div class="ach-detail-panel" id="achDetailPanel" aria-hidden="true">
  <div class="ach-detail-inner">
    
    <!-- Left: metadata column -->
    <div class="ach-detail-meta">
      <p class="ach-detail-rank" id="detailRank"></p>
      <h3 class="ach-detail-title" id="detailTitle"></h3>
      <p class="ach-detail-org" id="detailOrg"></p>
      <div class="ach-detail-tags" id="detailTags"></div>
    </div>
    
    <!-- Right: story column -->
    <div class="ach-detail-story">
      <p class="ach-detail-body" id="detailBody"></p>
    </div>
    
    <!-- Close button -->
    <button class="ach-detail-close" onclick="closeAchDetail()" aria-label="Close">✕</button>
    
  </div>
</div>
```

**Detail panel CSS:**
```css
.ach-detail-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
  opacity: 0;
  margin-top: 1.5rem;
  border-radius: 16px;
  border: 0.5px solid var(--border);
  background: var(--surface);
}

.ach-detail-panel.open {
  max-height: 400px;
  opacity: 1;
}

.ach-detail-inner {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2.5rem;
  padding: 2rem 2.5rem;
  position: relative;
}

.ach-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-right: 0.5px solid var(--border);
  padding-right: 2.5rem;
}

.ach-detail-rank {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.ach-detail-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 600;
  color: var(--text);
  line-height: 1.25;
  margin: 0.25rem 0;
}

.ach-detail-org {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.ach-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.75rem;
}

.ach-detail-story {
  display: flex;
  align-items: center;
}

.ach-detail-body {
  font-size: 14px;
  color: rgba(240,237,230,0.75);
  line-height: 1.8;
}

.ach-detail-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.ach-detail-close:hover { color: var(--text); }

/* Mobile: stack to single column */
@media (max-width: 640px) {
  .ach-detail-inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .ach-detail-meta {
    border-right: none;
    border-bottom: 0.5px solid var(--border);
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
}
```

**Detail content data (JavaScript object):**
```javascript
const achData = {
  a1: {
    rank: '🥇 1st Place · International',
    title: 'SCUBA International Business Plan Competition',
    org: 'Faculty of Economics and Business, Brawijaya University · Nov 2024',
    tags: ['Business Plan', 'International', 'Top 10 Finalist', 'Mentored by BINUS Faculty'],
    body: 'Winner among 10 finalists selected from hundreds of participants across Indonesia. The pitch centered on LABORA — a digital workforce placement agency connecting skilled Indonesian workers with international job opportunities in construction, engineering, and manufacturing, with built-in job matching, document management, and worker protection systems.'
  },
  a2: {
    rank: '🏅 National Finalist',
    title: 'Hult Prize National Summit',
    org: 'Institut Teknologi Bandung · May 2026',
    tags: ['Social Entrepreneurship', 'National Stage', 'Top 37 Nationally'],
    body: 'Selected as one of 37 national finalists to compete at the Hult Prize National Summit at ITB — Indonesia\'s most prestigious technical university. Competed alongside the country\'s most driven student entrepreneurs in a high-pressure environment built around solving real-world social challenges through business.'
  },
  a3: {
    rank: '🥇 1st Place · National',
    title: 'BMPC Business Pitch Competition',
    org: 'Bina Nusantara University · May 2024',
    tags: ['Business Pitch', 'National', '1st Year'],
    body: 'Won 1st place at the BMPC Business Pitch Competition hosted at Bina Nusantara University. A formative early competition that sharpened pitch delivery, business model structuring, and pressure performance — all in the first year of university.'
  },
  a4: {
    rank: '🥉 Top 3 · Social Impact',
    title: 'Best Social Ideation — Grease Gone',
    org: 'Pikiran Terbaik Negeri (BUMN) · Aug 2025',
    tags: ['Sustainability', 'Grant Recipient', 'Social Impact', 'SME Focus'],
    body: 'Top 3 winner and grant recipient for Grease Gone — an innovative grease trap filter made from recycled human hair, designed to simplify grease management for households and SMEs in the F&B sector. The project secured grant funding and mentorship from ANGIN Advisory, a leading Indonesian impact investment network.'
  },
  a5: {
    rank: '🥇 Gold Medal · International',
    title: 'International Youthpreneur Competition',
    org: 'Inventify Center · May 2025',
    tags: ['Innovation Award', 'Gold Medal', 'International', 'Dual Award'],
    body: 'Received two awards from one submission: the Gold Medal and the Innovation Business Award at the International Youthpreneur Competition hosted by Inventify Center. The submitted concept — DreamBound — is a digital workforce placement platform connecting skilled Indonesian workers with international employment opportunities.'
  }
};
```

**JavaScript — selectAch() and closeAchDetail():**
```javascript
let activeAch = null;

function selectAch(id) {
  const panel = document.getElementById('achDetailPanel');
  const data = achData[id];
  if (!data) return;
  
  // If clicking the already active card, close
  if (activeAch === id) {
    closeAchDetail();
    return;
  }
  
  // Remove active from all cards
  document.querySelectorAll('.ach-card').forEach(c => c.classList.remove('is-active'));
  
  // Set active card
  const activeCard = document.querySelector(`[data-ach="${id}"]`);
  if (activeCard) activeCard.classList.add('is-active');
  activeAch = id;
  
  // Populate panel content
  document.getElementById('detailRank').textContent = data.rank;
  document.getElementById('detailTitle').textContent = data.title;
  document.getElementById('detailOrg').textContent = data.org;
  document.getElementById('detailBody').textContent = data.body;
  
  // Tags
  const tagsEl = document.getElementById('detailTags');
  tagsEl.innerHTML = '';
  data.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'ach-tag';
    span.textContent = tag;
    tagsEl.appendChild(span);
  });
  
  // Open panel with GSAP
  panel.setAttribute('aria-hidden', 'false');
  panel.classList.add('open');
  
  // Animate panel open
  gsap.fromTo(panel, 
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  );
  
  // Scroll panel into view smoothly
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function closeAchDetail() {
  const panel = document.getElementById('achDetailPanel');
  gsap.to(panel, {
    opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    }
  });
  document.querySelectorAll('.ach-card').forEach(c => c.classList.remove('is-active'));
  activeAch = null;
}
```

**Update onclick on each card:** Change `onclick="toggleAch('aX')"` to `onclick="selectAch('aX')"` on all 5 cards. Also update `data-ach="aX"` attributes to match.

### 2E. Achievement Section Entrance Animation — Revised

Clean up previous animations. The new entrance is simpler and more controlled:

```javascript
// Section title
gsap.from('.ach-section .section-title, .ach-section .section-eyebrow', {
  scrollTrigger: { trigger: '.ach-section', start: 'top 80%' },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out'
});

// Cards stagger in
gsap.from('.ach-card', {
  scrollTrigger: { trigger: '.ach-grid', start: 'top 80%' },
  y: 50, opacity: 0, scale: 0.96,
  duration: 0.7, stagger: 0.1,
  ease: 'power3.out'
});

// Per-card image parallax on hover (keep from previous revision — it still applies)
```

---

## 3. Origin Section — Photo Integration

### Context
The file `myFace` is located in the `assets/` folder of the project. It is Excel Sean's personal photo. The task is to incorporate it into the Origin section in a way that looks intentional, designed, and aesthetically strong — not just a dropped-in headshot.

**Do NOT:**
- Plop the image into a plain `<img>` tag with no styling
- Use a circular avatar crop (too casual, looks like a profile pic)
- Stretch or distort the image
- Make it the dominant focus — the text is still the hero of the Origin section

**DO:**
- Design the image as part of the layout composition
- Give it a considered shape, frame, or treatment that matches the portfolio's dark aesthetic
- Make it feel editorial — like something you'd see in a portfolio book or magazine feature

### Photo Treatment Design

The image should appear as a **tall portrait card** — taller than wide, roughly a `3:4` or `2:3` ratio. This is placed to the **right of the text column**, making the Origin layout a two-column composition again (text left, photo right), but this time with the photo replacing where the old stats card was.

**Visual treatment:**

1. **Shape:** The photo is NOT a rectangle. Use `clip-path` to give it a subtle asymmetric cut at the top-right corner — like a chamfered corner card. This gives it personality without being gimmicky.
   ```css
   clip-path: polygon(0 0, 90% 0, 100% 8%, 100% 100%, 0 100%);
   ```
   This cuts a diagonal notch at the top-right corner — matches the angular, sharp aesthetic of the portfolio.

2. **Filter:** Apply a subtle duotone feel — `filter: grayscale(20%) contrast(1.05)` — keeps the image slightly desaturated without going full black and white. Feels cinematic.

3. **Border:** `border: 0.5px solid var(--border)` on the container, `border-radius: 4px` on the corners (the clip-path handles the main shape).

4. **Accent line:** A thin `2px` vertical line in `#C8F135` on the left edge of the photo container — like a bookmark or page marker. Runs the full height.

5. **Caption below the photo:** A small text below the image:
   ```
   Excel Sean  ·  Year 3, BINUS University
   ```
   Style: 11px, letter-spacing 0.1em, color `var(--muted)`, uppercase.

6. **Hover:** On hover, `filter: grayscale(0%) contrast(1.05)` — the slight desaturation lifts and the photo becomes fully vivid. Transition `0.4s ease`.

**HTML structure:**
```html
<div class="origin-photo-wrapper">
  <!-- Accent line -->
  <div class="origin-photo-accent-line"></div>
  
  <!-- Photo container -->
  <div class="origin-photo-container">
    <img 
      src="assets/myFace.[EXTENSION]" 
      alt="Excel Sean" 
      class="origin-photo-img"
    >
  </div>
  
  <!-- Caption -->
  <p class="origin-photo-caption">Excel Sean · Year 3, BINUS University</p>
</div>
```

**Note for IDE:** Check the file extension of `myFace` in the `assets/` folder. It may be `.jpg`, `.jpeg`, `.png`, or `.webp`. Use whichever extension is present.

**CSS:**
```css
.story-layout {
  display: grid;
  grid-template-columns: 1fr 340px; /* text | photo */
  gap: 4rem;
  align-items: start;
  margin-top: 3rem;
}

.origin-photo-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-left: 1.5rem; /* space for accent line */
}

.origin-photo-accent-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 1.75rem; /* stops above caption */
  width: 2px;
  background: var(--accent);
  border-radius: 2px;
}

.origin-photo-container {
  width: 100%;
  overflow: hidden;
  clip-path: polygon(0 0, 90% 0, 100% 8%, 100% 100%, 0 100%);
  border: 0.5px solid var(--border);
  border-radius: 4px;
  transition: clip-path 0.4s ease;
}

.origin-photo-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center top; /* prioritize face */
  display: block;
  filter: grayscale(20%) contrast(1.05);
  transition: filter 0.4s ease, transform 0.5s ease;
}

.origin-photo-wrapper:hover .origin-photo-img {
  filter: grayscale(0%) contrast(1.05);
  transform: scale(1.02);
}

.origin-photo-caption {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-left: 0; /* aligns with photo */
}

/* Mobile: stack below text */
@media (max-width: 768px) {
  .story-layout {
    grid-template-columns: 1fr;
  }
  .origin-photo-wrapper {
    max-width: 280px; /* keep it compact on mobile */
  }
}
```

**GSAP entrance animation for the photo:**
```javascript
gsap.from('.origin-photo-wrapper', {
  scrollTrigger: { trigger: '.origin-photo-wrapper', start: 'top 80%' },
  x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2
});

gsap.from('.origin-photo-accent-line', {
  scrollTrigger: { trigger: '.origin-photo-wrapper', start: 'top 80%' },
  scaleY: 0,
  transformOrigin: 'top center',
  duration: 0.8, ease: 'power2.out'
});
```

---

## 4. Summary of All Changes in This Revision

| # | Section | What changes |
|---|---|---|
| 1 | Voice / Speaker | Remove prev/next arrow buttons and all their JS. Add scroll-wheel horizontal slide. Add progress bar below carousel. Add scroll hint label on section enter. |
| 2 | Achievements | Rework grid to strict 2-column uniform layout (no spanning). All cards same aspect-ratio 16:9. |
| 3 | Achievements | Rework card design: dimmed background image, dark overlay, ghost number watermark, rank/title/org/tags layout matching wibily reference. |
| 4 | Achievements | Remove all `.ach-expand` accordion panels and `toggleAch()`. Replace with `selectAch()` and standalone detail panel below the grid. |
| 5 | Achievements | Update `onclick` attributes on all 5 cards from `toggleAch` to `selectAch`. Add `data-ach` attributes. |
| 6 | Achievements | Add `achData` JS object with full content for all 5 cards. Detail panel populates from this object. |
| 7 | Achievements | Clean up entrance animation — simpler stagger, no clip-path reveal complexity. |
| 8 | Origin | Restore two-column layout. Right column now holds the photo, not the stats card. |
| 9 | Origin | Integrate `assets/myFace` with chamfered clip-path, subtle desaturation filter, accent line, caption, hover treatment. |

---

## 5. Files to Touch in This Revision

```
index.html    → Remove carousel arrows, add scroll hint label, rework all .ach-card HTML, 
                 remove .ach-expand panels, add #achDetailPanel, add origin-photo-wrapper
style.css     → Carousel progress bar, .ach-card new styles, .ach-ghost-num, .ach-card-body, 
                 .ach-detail-panel, .origin-photo-wrapper and all photo sub-styles
script.js     → Remove arrow JS, add wheel scroll handler, add progress bar listener, 
                 add achData object, add selectAch() and closeAchDetail(), update GSAP entrance for achievements, 
                 add photo entrance animation
assets/       → Confirm myFace file extension and use correct path in img src
```

---

*End of Revision 03. Apply all changes on top of the existing codebase.*
*Produced in collaboration with Claude (Anthropic) · June 2026*
