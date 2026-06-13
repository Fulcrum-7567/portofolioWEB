# Excel Sean — Portfolio Project Outline
> Complete build guide. Every decision, every section, every content detail documented.
> This file is the single source of truth for the entire portfolio project.

---

## 0. Project Brief

**Owner:** Excel Sean  
**Location:** Surabaya, Indonesia  
**Email:** excelsean777@gmail.com  
**LinkedIn:** linkedin.com/in/exccs  
**Phone:** +62-812-3326-9807

**Purpose:** A personal professional portfolio website, primarily targeting **Apple Developer Academy recruiters** and general employers/recruiters.

**Core Goal:** Communicate that Excel Sean is a high-performing, multidisciplinary generalist — a business-minded problem solver who can also build — without explicitly labeling himself a "product developer." The portfolio should make that conclusion feel inevitable to anyone who reads it.

**The Three Things Every Visitor Must Walk Away Knowing:**
1. Who he is (on a human, deeper level — not just titles)
2. What he can do (range + depth)
3. What he has achieved (with proof)

**Feeling to leave behind:** Impressed by his skills + Inspired by his story + Trust him as a professional. All three.

---

## 1. Identity & Narrative Direction

### The Core Story
Excel is a 3rd-year double degree student (Business + Computer Science) at Bina Nusantara University. But the portfolio must never make him feel like "just a student." The framing is: **someone who has been operating at a professional level since his first year of university** — competing nationally and internationally, leading organizations, mentoring others, and building real solutions to real problems.

### The Superpower
> "I get things done no matter what."

This is the personality thread that runs through every section. It must be felt, not just stated. Show it through what he's done, not by writing it as a tagline.

### The Generalist Angle
Excel does not have one narrow specialty. His background spans:
- Business strategy & competitive pitching
- Human resource development & people leadership  
- Product thinking & problem framing
- Web development (supporting skill)
- Public speaking & mentorship

The portfolio must **embrace the generalist identity as a strength**, not apologize for it. The framing: "I sit at the intersection of business thinking and product building."

### The Apple Developer Academy Angle
This portfolio is partly designed to support an Apple Developer Academy application. The strategy is **never mention ADA directly** — instead, every section quietly proves he belongs there: product thinking, execution ability, curiosity, and the willingness to build.

### Wording Rules (Critical)
- **No grateful tone.** Do NOT use phrases like "Thrilled to win...", "An incredible experience at...", "Deeply grateful for..."
- **Use statement format.** "Winner of...", "Finalist among 37 national teams", "Led a team that..."
- **No copy-paste from LinkedIn.** All copy must be rewritten in a confident, declarative tone.
- **Sentence case everywhere.** Never Title Case or ALL CAPS in body text.
- **Active voice always.**

---

## 2. Visual Design System

### Aesthetic Direction
Professional + expressive + modern + interactive. The portfolio should make visitors say **"woah, that's cool"** while still reading as serious and credible. It should feel like it was built by someone who understands both design and code.

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Background | `#0D0D0D` | Page base — dark canvas |
| Surface | `#161616` | Cards, sections |
| Surface 2 | `#1E1E1E` | Hover states, featured cards |
| Text Primary | `#F0EDE6` | All main text |
| Text Muted | `#888888` | Secondary text, subtitles |
| Accent | `#C8F135` | Acid lime — the signature color. Used for highlights, CTAs, labels, hover states |
| Border | `#2A2A2A` | All dividers and card borders |

**Dark theme throughout.** No light mode required for now. The dark canvas + acid lime accent is the signature visual identity.

### Typography
| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Headlines | Space Grotesk | 700 | clamp(42px, 7vw, 80px) for hero; clamp(28px, 4vw, 42px) for section titles |
| Body | Inter | 400 | 15–16px, line-height 1.7–1.8 |
| Labels / Eyebrows | Inter or Space Grotesk | 500 | 11–12px, letter-spacing 0.12–0.2em, uppercase |
| Stats | Space Grotesk | 700 | 28px |

Both fonts load from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap
```

### Layout
- Max content width: `900px`, centered, `padding: 0 2rem`
- Sections: `padding: 6rem 2rem`
- Cards: `background: var(--surface)`, `border: 0.5px solid var(--border)`, `border-radius: 16px`
- Grid gaps: `1px` on achievement/leadership grids (creates hairline separator effect between cards)

### CSS Variables (Root)
```css
:root {
  --bg: #0D0D0D;
  --surface: #161616;
  --surface2: #1E1E1E;
  --text: #F0EDE6;
  --muted: #888;
  --accent: #C8F135;
  --border: #2A2A2A;
}
```

### Signature Element
The hero headline assembles with a strong typographic statement. The grid texture overlay (`opacity: 0.03`) and the radial glow (`rgba(200,241,53,0.08)`) create depth without noise.

### Animation & Interactivity ("Wow" Layer)
These are **required** throughout the build — they are proof of character, not decoration:
- **Hero:** Kinetic text — headline words fade/slide in on load (use GSAP or CSS keyframes)
- **Scroll-triggered reveals:** Sections animate in as user scrolls (fade + slight translateY)
- **Hover micro-interactions:** Cards lift subtly, arrows appear, accent colors pulse
- **Custom cursor:** A subtle dot cursor that reacts to hoverable elements (grows on hover)
- **Easter egg:** One hidden interactive element only curious users will find (e.g., Konami code, or clicking the logo 5 times)
- **Page load sequence:** A brief cinematic intro before the hero appears
- **Smooth scroll:** All nav links scroll smoothly to their sections
- GSAP is already in Excel's stack — use it for the orchestrated animations

### Tech Stack for the Website
- HTML, CSS, JavaScript (vanilla)
- GSAP (animations)
- No frameworks required — but Next.js or similar is acceptable if preferred

---

## 3. Site Structure & Navigation

### Pages
Single-page application (SPA). All sections on one scrollable page. No separate pages needed for V1.

### Navigation (Sticky Top Bar)
```
[ EXCEL SEAN ]          [ Story ]  [ Work ]  [ Skills ]  [ Contact ]          [ Let's talk → ]
```
- Position: `sticky`, `top: 0`, `z-index: 100`
- Background: `rgba(13,13,13,0.85)` with `backdrop-filter: blur(12px)`
- Border bottom: `0.5px solid var(--border)`
- Logo: Space Grotesk, 15px, font-weight 600, letter-spacing 0.08em
- Nav links: 13px, color `var(--muted)`, hover → `var(--accent)`
- CTA button: acid lime background, dark text, 20px border-radius, font-weight 600

### Section Order
1. Hero
2. Origin / Story
3. Achievements
4. Capabilities / Skills
5. Leadership
6. Close / Contact

---

## 4. Section-by-Section Specifications

---

### Section 01 — Hero

**Purpose:** Make them stay. First 5 seconds must establish personality and intrigue.

**Layout:** Full viewport height (`min-height: 92vh`), flex column, justified center.

**Background Details:**
- Grid texture overlay: `background-image: linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`, `background-size: 60px 60px`, `opacity: 0.03`
- Radial glow: positioned top-right, `rgba(200,241,53,0.08)` — subtle lime ambient light

**Content:**
```
[eyebrow]    ○—— Based in Surabaya, Indonesia

[headline]   I don't wait
             to be told        ← color: var(--muted), font-weight 300
             how.              ← color: var(--accent)

[subtext]    Business thinker. Builder. Competitor. I've been solving real problems
             since before most people finish their first year of university.

[tags]       🏆 6× Competition Winner    👥 Led 100+ People
             🌏 National & International  ⚡ Currently Year 3

[scroll]     —— Scroll to meet me
```

**Headline Notes:**
- "I don't wait to be told how." is the chosen hero line. It captures the superpower identity without being arrogant.
- Animate: each line fades in sequentially on load (GSAP stagger or CSS animation-delay)

**Tag Pills:**
- `border: 0.5px solid var(--border)`, `border-radius: 20px`, `padding: 6px 14px`, 12px text
- Hover: `border-color: var(--accent)`, `color: var(--accent)`

---

### Section 02 — Origin / Story

**Eyebrow:** `Origin`  
**Headline:** `Not a typical student. / Never was.` (second line dimmed, font-weight 300)

**Purpose:** The human layer. This is where visitors go from "impressive" to "I want to meet this person."

**Layout:** Two-column grid (`1fr 1fr`), 4rem gap, aligned center. On mobile: single column.

**Left Column — Narrative Text:**

Paragraph 1:
> While most 1st-year students were figuring out their schedules, I was building teams, competing on national stages, and leading organizations. Not because I had to — because staying still never felt like an option.

Blockquote (accent left border, `2px solid var(--accent)`, padding-left 1.5rem):
> "I sit at the intersection of business thinking and product building. I don't just solve problems — I ship solutions."

Paragraph 2:
> Double degree in Business and Computer Science. I speak the language of strategy and the language of code — which means I can sit in any room and add value.

**Personality Pills** (below text):
- Business Strategy
- Product Thinking
- People Leadership
- Generalist

**Right Column — Stats Card:**

Card style: `background: var(--surface)`, `border: 0.5px solid var(--border)`, `border-radius: 16px`, `padding: 2rem`

| Stat Label | Value | Sub |
|---|---|---|
| Competitions entered | **6+** | National & International |
| Leadership roles held | **4+** | Concurrently |
| People mentored | **40+** | Directly |
| GPA | **3.65** | Double Degree, BINUS |

Stat value style: Space Grotesk, 28px, font-weight 700, color `var(--accent)`

---

### Section 03 — Achievements

**Eyebrow:** `Achievements`  
**Headline:** `Competed. Won. / Repeated.` (second line dimmed)

**Purpose:** Breadth first (overwhelming range), then depth on click (detailed case stories). Visitors should feel: "There's so much here" on first glance, then have the ability to go deeper.

**Layout:** Achievement grid with `1px` background separator (hairline grid effect). `border-radius: 16px`, `overflow: hidden`. Cards inside have hover states.

**Achievement Cards — Full List:**

| # | Rank Label | Title | Org | Date | Has Expandable? |
|---|---|---|---|---|---|
| 1 | 🥇 1st Place · International | SCUBA International Business Plan Competition | Brawijaya University, Faculty of Economics | Nov 2024 | ✅ Yes |
| 2 | 🏅 National Finalist | Hult Prize National Summit | Institut Teknologi Bandung | May 2026 | ✅ Yes |
| 3 | 🥇 1st Place · National | BMPC Business Pitch Competition | Bina Nusantara University | May 2024 | No |
| 4 | 🥉 Top 3 · Social Impact | Best Social Ideation — Grease Gone | Pikiran Terbaik Negeri (BUMN) | Aug 2025 | ✅ Yes |
| 5 | 🥇 Gold Medal · International + Innovation Award | International Youthpreneur Competition | Inventify Center | May 2025 | ✅ Yes |

**Featured cards** (cards 1 & 2): `border-bottom: 2px solid var(--accent)` to visually distinguish them.

**Card hover:** background shifts to `var(--surface2)`, arrow icon `↗` appears top-right (color `var(--accent)`)

**Expandable Detail Panels (click to open/close, one open at a time):**

**Card 1 — SCUBA / LABORA:**
- Title: LABORA — Digital Workforce Placement Platform
- Body: A digital-based workforce agency connecting skilled Indonesian workers with international opportunities in construction, engineering, and manufacturing. The platform combined job matching, document management, training modules, fintech features, and worker protection systems — building a transparent, ethical pipeline for overseas employment. Winner among 10 finalists selected from hundreds of participants.
- Tags: Product Design · Fintech · Social Impact · International

**Card 2 — Hult Prize:**
- Title: Hult Prize National Summit — Top 37 in Indonesia
- Body: Selected among the top 37 national finalists, competing at Institut Teknologi Bandung alongside Indonesia's most ambitious student entrepreneurs. A high-pressure environment for sharpening business ideas and building a network of fellow founders.
- Tags: Social Entrepreneurship · National Stage · ITB

**Card 4 — Grease Gone (BUMN):**
- Title: Grease Gone — Sustainable Grease Management Solution
- Body: An innovative grease trap filter made from recycled human hair, designed to simplify grease management for households and SMEs in the F&B sector. Reduces maintenance hassle while preventing land and water pollution from improper waste disposal. Winner of a grant and secured mentorship from ANGIN Advisory.
- Tags: Sustainability · SME · Grant Recipient · Social Impact

**Card 5 — Inventify / DreamBound:**
- Title: DreamBound — International Workforce Platform
- Body: An evolved iteration of LABORA, DreamBound is a digital-based platform connecting skilled Indonesian workers with international employment opportunities. Recognized with both the Gold Medal and the Innovation Business Award at the same competition — two awards from one submission.
- Tags: Product Thinking · International · Innovation

**Note on Card 3 (BMPC):** No additional detail known. Leave expandable empty or skip interaction for this card.

---

### Section 04 — Capabilities / Skills

**Eyebrow:** `Capabilities`  
**Headline:** `Think. Connect. / Build.` (second line dimmed)

**Purpose:** Show the three-axis identity. Prove Excel is not a one-dimensional candidate. Quietly argue for the Apple Developer Academy fit.

**Layout:** Three equal columns (`repeat(3, 1fr)`), `1.5rem` gap.

**Three Columns:**

**Column 1 — Think (Business & Strategy)**
- Label: `Think`
- Title: Business & Strategy
- Skills: Business Development · Problem Framing · Data Analytics · Digital Marketing · Project Management

**Column 2 — Connect (People & Leadership)**
- Label: `Connect`
- Title: People & Leadership
- Skills: HR Development · Conflict Resolution · Public Speaking · Mentorship · Recruitment Design

**Column 3 — Build (Tech & Product)**
- Label: `Build`
- Title: Tech & Product
- Skills: Web Development · UI/UX (Figma) · Data Visualization · AI Tools & Prompting · Prototyping

**Tech Badges Section (below the three columns):**

Label: `Tech I'm comfortable with` (12px, muted, uppercase, letter-spacing)

**Primary badges** (brighter — things he's actually used):
- HTML · CSS · JavaScript · GSAP

**Secondary badges** (familiar but supporting):
- Figma · Canva · Affinity · Visual Paradigm

**Important:** Do NOT include Java, Python, SQL, Supabase, Next.js, or Node.js. These were discussed and excluded because Excel hasn't meaningfully used them. Including them would misrepresent his skills to a tech-savvy reviewer.

**Framing Note:** Coding is shown as a **supporting skill** — "I understand the language of builders, even if I'm not a full-time developer." This is the honest, confident framing. The three-column Think/Connect/Build layout communicates this without needing to over-explain it.

---

### Section 05 — Leadership

**Eyebrow:** `Leadership`  
**Headline:** `Not just a member. / Always the one who steps up.` (second line dimmed)

**Purpose:** Show that leadership is a pattern, not a one-off. Four consecutive roles across multiple organizations, all with measurable outcomes.

**Layout:** Stacked list, `1px` background separator between items. `border-radius: 16px`, `overflow: hidden`.

**Leadership Items (in order, most recent first):**

**1. Head of Human Resource Development — HIMPRENEUR**
- Period: Nov 2024 – Nov 2025
- Metric badge: "60% improvement in candidate quality"
- Details (for hover expand or static): Led and mentored the HR team in resolving complex interpersonal conflicts. Implemented a structured recruitment method that filtered applicants to ensure only the most qualified candidates advanced.

**2. HR Deputy Manager — Bina Nusantara Computer Club (BNCC)**
- Period: Oct 2024 – Oct 2025
- Metric badge: "40% improvement in member performance"
- Details: Developed training programs enhancing technical and soft skills. Led strategic HR initiatives supporting organizational growth. Recognized for integrity and professionalism.

**3. Freshmen Partner — BINUS First Year Program**
- Period: Sep 2024 – Sep 2025
- Metric badge: "Mentored 7+ freshmen · 3 community projects"
- Details: Led a group of freshmen through three community service projects. Mentored and guided students throughout the academic year in academic, personal, and leadership growth.

**4. Student Council President — SMAK St. Bonaventura Senior High School**
- Period: Nov 2021 – Oct 2022
- Metric badge: "15+ programs created"
- Details: Created 15+ events and programs that became part of school culture. Raised funds for charitable causes. Set a new standard for student council performance.

**Metric Badge Style:**
- `background: rgba(200,241,53,0.08)`, `color: var(--accent)`, `border-radius: 20px`, `padding: 3px 10px`, `font-size: 12px`, `font-weight: 500`

---

### Section 06 — Mentorship / Guest Speaking

**Eyebrow:** `Mentorship`  
**Headline:** `Teaching what I know. / While still learning.`

**Purpose:** This section elevates Excel above a typical student. Being invited to speak and teach while in 3rd year is a differentiator.

**Note:** This section can be condensed or presented as a timeline/list. Keep it brief — the impact is in the fact that it happened, not the lengthy description.

**Three Speaking Engagements:**

**1. LinkedIn for Better Personal Branding — BNCC Skill Class 2.0**
- Date: May 2026
- Format: Panel discussion + judging
- Key fact: Directly mentored 40+ participants. Served as judge for the project showcase.
- Statement: Panelist and mentor for 40+ participants on personal branding and LinkedIn optimization.

**2. Empowering Digital Generation Through AI**
- Date: June 2025
- Format: Hands-on workshop
- Key fact: Taught AI prompting, built live demos (Tic Tac Toe, Snake, Memory Game), demonstrated Sora, Veo 3, Suno AI.
- Statement: Speaker on practical AI use — from prompting fundamentals to creative tools and live-coded demos.

**3. Youth Leadership Camp — 10 Pillars of Leadership**
- Date: Oct 2024
- Location: Mitra Harapan Junior High School (LDKS)
- Key fact: Delivered leadership frameworks to incoming student council members.
- Statement: Keynote speaker on the 10 Pillars of Leadership for incoming student council leaders.

---

### Section 07 — Close / Contact

**Purpose:** Leave them with momentum. The last thing they read should feel like the end of a good story — satisfying and memorable.

**Layout:** Centered, `padding: 8rem 2rem`

**Headline:**
```
Ready to build
something real?    ← "something real?" in var(--accent)
```

**Subtext:**
> I'm currently looking for opportunities where curiosity, execution, and people skills matter more than a single job title.

**CTA Buttons:**
- Primary: `Get in touch →` — acid lime background, dark text, `border-radius: 30px`
- Secondary: `Download CV` — transparent background, muted border

**Contact Info Block (below buttons):**
- Email: excelsean777@gmail.com
- LinkedIn: linkedin.com/in/exccs
- Location: Surabaya, Indonesia

**Footer:**
```
Built by Excel Sean · Surabaya, Indonesia · 2026
```

---

## 5. The "Wow" Layer — Interactivity Checklist

These are non-negotiable interactive elements that prove Excel can build, not just design.

| Element | Description | Priority |
|---|---|---|
| Kinetic hero text | Headline words animate in sequentially on load (GSAP stagger) | 🔴 High |
| Custom cursor | Small dot cursor that expands on hover over interactive elements | 🔴 High |
| Scroll-triggered reveals | Sections and cards fade + slide up as they enter viewport | 🔴 High |
| Achievement card expand | Click card → detail panel opens below (one at a time) | 🔴 High |
| Nav highlight | Active section highlighted in nav as user scrolls | 🟡 Medium |
| Page load sequence | Brief cinematic intro (e.g. name appears, then fades to hero) | 🟡 Medium |
| Smooth scroll | All anchor links scroll smoothly | 🟡 Medium |
| Dark mode (default) | Already dark — no toggle needed for V1 | ✅ Done |
| Easter egg | Hidden interaction — e.g. clicking logo 5× triggers a fun moment, or Konami code | 🟢 Nice to have |
| Hover micro-interactions | Cards lift, arrows appear, borders glow on hover | 🔴 High |

---

## 6. Content Tone Guide

Use this throughout all copy decisions:

| ❌ Don't write | ✅ Write instead |
|---|---|
| "Thrilled to win..." | "Winner of..." |
| "An incredible experience at..." | "Finalist at..." / "Competed at..." |
| "Deeply grateful for the opportunity..." | "Selected among 37 national finalists..." |
| "I am a product developer" | Let the work speak — never label it |
| "I am good at many things" | Show the range through structure |
| "Here are my skills:" | Frame it as identity: "Think. Connect. Build." |
| Long paragraphs of self-description | Short, punchy statements with real numbers |

---

## 7. Mobile Responsiveness Notes

- Hero headline: uses `clamp()` — scales down gracefully
- Two-column story layout → single column on mobile (`< 768px`)
- Three-column skills layout → single column on mobile
- Achievement grid: `auto-fit minmax(260px, 1fr)` — wraps naturally
- Nav: consider collapsing links into a hamburger on mobile
- Custom cursor: disable on touch devices

---

## 8. File Structure Suggestion

```
excel-sean-portfolio/
├── index.html
├── style.css
├── script.js          ← GSAP animations, scroll triggers, interactivity
├── assets/
│   ├── fonts/         ← (if self-hosting fonts)
│   ├── images/
│   │   └── excel-photo.jpg   ← personal photo for Story section
│   └── cv/
│       └── excel-sean-cv.pdf ← linked from Download CV button
└── README.md
```

---

## 9. Things Still Needed from Excel

Before the build is 100% complete, the following are missing and need to be provided:

- [ ] **Personal photo** — for the Story/Origin section. Should feel personal and real, not corporate.
- [ ] **Final CV as PDF** — for the Download CV button
- [ ] **Hero headline confirmation** — "I don't wait to be told how." — confirm this feels right, or suggest alternative
- [ ] **Inventify competition detail** — the idea pitched was "DreamBound" (essentially LABORA renamed). Any additional context on what made it win?
- [ ] **BMPC competition** — what was the idea pitched for the 1st place win at BINUS? No detail was provided.
- [ ] **Easter egg idea** — does Excel have a preference for what the hidden interaction should be?
- [ ] **"Currently thinking about..."** — optional closing section item. What is Excel currently working on or thinking about? (Shows he's always in motion)

---

## 10. Design Decisions Log

Decisions made during the planning conversation, preserved here for reference:

| Decision | Choice | Reason |
|---|---|---|
| Dark vs light theme | Dark (`#0D0D0D`) | Modern, confident, expressive — matches the "woah" brief |
| Accent color | Acid lime `#C8F135` | Unexpected for a business student, energetic, memorable |
| Display font | Space Grotesk | Geometric but warm — technical yet human |
| Hero headline | "I don't wait to be told how." | Captures superpower identity without arrogance |
| Skills framing | Think / Connect / Build | Communicates three-axis generalist without over-explaining |
| Coding depth | Supporting skill only | HTML/CSS/JS/GSAP confirmed. Java/Python/SQL/Supabase/Next.js/Node.js excluded — not honest to his actual level |
| Achievement layout | Breadth grid + expandable depth | Overwhelm on first glance, detail available on demand |
| Portfolio label | Generalist / product thinker | Never "product developer" — let the work make that conclusion |
| ADA mention | Never mention Apple Developer Academy | Portfolio proves fit implicitly — no explicit mention |

---

*End of outline. All decisions, content, copy, and structure are documented above.*
*Built in collaboration with Claude (Anthropic) · June 2026*
