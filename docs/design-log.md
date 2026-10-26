# Harshita's portfolio

Repo: `~/Documents/harshita-portfolio` (Next.js 14, App Router, TypeScript, Framer Motion). Tokens (since pass 3): `--bg #f8f7f3`, `--ink #1a1916`, `--ink-muted #57534c`, `--ink-faint #8a857c`, `--rule rgba(26,25,22,.12)`, `--accent #c84b2f`. Fonts: Spectral 200–500 (`--font-spectral`) + Courier Prime (`--font-courier`) sitewide; Playfair/Manrope/Plex still loaded for older case-study pages.

## 2026-10-25 — Pass 1: from node-graph to "everything Harshita notices and makes"

**Context:** Prior sessions had iterated the homepage through several directions — an ink/paper hero with a glyph-swarm canvas, an andretrousdale-style abstract node graph, a dmcg.co-style image-thumbnail graph, and most recently a live UnicornHero (a borrowed Unicorn Studio WebGL scene) + RightPanel accordion. The user then supplied a full creative brief: abandon the graph/dashboard direction entirely for a tagline-first landing ("everything Harshita notices and makes") that morphs into a sparse spatial field (no axes, no edges) with a quiet typographic list as an equal alternate view, blended from Chia Amisola / Flo Guo / Are.na sensibilities.

**Thesis:** *everything Harshita notices and makes — and the quiet record of who else has stopped to look.*

**Key discovery:** the repo already had a dormant "patronus" system (`lib/patronus.ts`, `components/PatronGreeting.tsx`, `components/ParticleCanvas.tsx`) from an earlier pass — every visitor gets a generated name (quietfox, goldenbird...) and a time-aware greeting on return. Completely unused by the live homepage. This became the pass's one bold move: a ritual of entry that cost almost nothing to revive because the care was already there.

**Moves made:**
1. Replaced `app/page.tsx` entirely: tagline alone/centered → 1.5s pause → morphs to a corner signature while field/list plots in (staggered, blur+opacity+translateY, 800ms, per circle.md).
2. Revived `PatronGreeting` + `patronus.ts`. Fixed a real gap: the component silently showed nothing on a visitor's *first* ever visit (the old design relied on `HeroCanvas` to handle that moment, which this page doesn't use) — extended `greetingMessage()` to handle `null` (first visit) with `"we'll call you {name}."` instead of returning early.
3. New `lib/entries.ts` — unified content model. Work entries reuse the real, already-well-written copy in `lib/projects.ts` (not rewritten). "Earlier practice" (HPE, Nutanix) uses the exact framing from the user's own brief — "agents before agents," "SRE background + internal tool" — not invented. Gatherings and Notes are left as honest empty states ("nothing gathered here yet") rather than fabricated content, since I don't have Harshita's Are.na handle or her own voice fragments yet.
4. New `components/Field.tsx` — deterministic seeded scatter (reused `mulberry32`/`hashString` from `lib/patronus.ts` rather than a new RNG), rejection-sampled for minimum spacing. No edges, no force simulation, no hub/spoke — explicitly not a graph.
5. New `components/QuietList.tsx` — sectioned, typographic, tabular-nums dates, same entries as the field.
6. Corner toggle (`field · list`), persisted to `localStorage`, defaults to field.
7. Kept `sv:section` / `sv:project-hover` event dispatches from `Field.tsx` so the existing `SiteVoice` ambient-commentary system (globally mounted in `layout.tsx`) keeps responding — didn't need to touch SiteVoice itself.

**What was cut:** `UnicornHero` (the borrowed WebGL scene — not hers), `RightPanel` accordion, the node-graph direction entirely. Not deleted from disk — reversible via git — just unused from `app/page.tsx`.

**Verified live:** landing pause → reveal → field hover (dot highlights, line reveals, correct opacity/height) → click navigates to real `/work/*` routes (password gate still intact for the two protected case studies) → list view renders all sections correctly → toggle persists across reload → patron greeting fires on both fresh and returning visits.

**Tooling note, not a product bug:** this session's Browser-pane screenshot tool repeatedly showed stale/clipped frames for content that mounts dynamically (the list view once rendered fully blank in a screenshot despite every DOM/computed-style check being correct) — confirmed real by forcing `resize_window` to desktop, which forces a recomposite. Future passes: don't trust a blank/broken screenshot immediately after a dynamic mount; verify via DOM before concluding there's a bug.

**Open questions for the next pass:**
- Harshita's actual Are.na handle, if she has one — Gatherings section is wired for it but has no fake data.
- Her own one-line fragments for Notes and any side-projects — I deliberately didn't invent voice for these.
- First-visit `PatronGreeting` copy ("we'll call you {name}.") is mine, in the site's already-established tonal register, not hers — worth her eyes.
- The field's rejection-sampling layout is honest but untested past ~10 entries; revisit spacing once Gatherings/Notes have real content and the field gets denser.
- Mobile not yet addressed — brief says field can simplify/default to list on small screens; not implemented this pass.
- `ParticleCanvas.tsx` (ambient ink-colored particle field, cursor-reactive) is still dormant — could be a good *very* quiet atmospheric layer behind the field view in a future pass, if restraint allows exactly one.

## 2026-10-25 — Pass 2: the labeled, audible plot

**Context:** Harshita called pass 1's field "terrible" — a personal site needs a *labeled* x and y axis. She then supplied the axes herself: **x = work ↔ wonder**, **y = make ↔ gather**, with concrete placement logic, plus asks for help on visuals, phrasing, ground color, type, and sound. Looking at pass 1 live also showed real defects beyond the missing axes: random positions (the plot meant nothing), label collisions at short heights (percent-based min-distance ignored label size), a morph that teleported (container alignment switched instantly; only font-size animated), and hover that shifted the dot (card centered on the point grew when the line appeared).

**Thesis:** *A plot of attention — work and wonder, made and gathered, and you, noticed today.*

**Moves made:**
1. **(Bold) The audible plot** — `lib/sound.ts`, Web Audio, no files. y picks pitch from A-major pentatonic A3–F♯5 (make low → gather high); x picks the ear (work left → wonder right). Sine + quiet triangle octave, 8ms attack, 1.4s exponential decay, peak 0.05, 2.4kHz lowpass. **Off by default**; `sound off` in the top-right nav, chime on enable, persisted; context only wakes on a real click/keypress. Verified via oscillator spy: visitor point 554Hz pan +0.62, AI Email 247Hz pan −0.32. List rows pluck the same notes as their plot positions.
2. Labeled axes: `← work` · `wonder →` · `gather ↑` · `make ↓`, hairlines drawn from center (450ms), halfway ticks, definitions in `title` attributes. Hand-placed coordinates in `lib/entries.ts`; plot has a min height (620px) so short screens scroll instead of collide. Collision-checked by glyph ranges at 597, 760, 1440px wide: zero.
3. Visitor plotted in gather · wonder as the only accent ("you", meta `{name} · gathered {timeAgo}`, line = greeting, auto-open 6.5s). Replaces the separate `PatronGreeting` corner. Visit is read once per load at module level (guards React dev double-mount turning first visits into "back so soon").
4. "as text" view mirrors the quadrants (`make · work`… with italic notes from her own definitions), newest-first order.
5. True morph via Framer `layout` (sampled: continuous over ~650ms). Newsreader replaces Playfair on the homepage; ground `#ecebe4` replaces `#c3bcaa`. One-liners rewritten from salesy/hedged ("*Potentially* streamlining…") to specific, grounded in observations already in the repo.

**Also fixed:** `SiteVoice` hardcoded near-white text "for the blue Unicorn canvas" — unreadable on paper — and used a second terracotta dot. Now `--ink-muted`, a `↳` mark, its own patch of paper, aligned to the 40px margin.

**Cut:** global `*` 300ms color transition (slowed all hover feedback past 200ms; existed for a disabled dark mode); Unicorn watermark CSS; random seeded placement; `PatronGreeting`'s separate corner; Manrope on the homepage; the title "Support-staff progress tool" (→ "Support progress tool").

**Open questions for the next pass:**
- **Dates conflict.** `lib/projects.ts` (Influence 2024, AI Email 2023, GitHub 2022, Sony 2021) vs. the résumé list (Salesloft 2025–, GitHub 2024, UW 2023–25). Pass 2 shows résumé dates. Harshita must confirm; case-study pages still show the old ones.
- One-liners are drafts drawn from repo copy (some of which earlier sessions may have written). Need her eyes, especially "the unboxing is the emotional peak…" and "a review change that helped most developers and quietly broke it for some."
- Gather quadrants still empty except the visitor — Are.na handle needed.
- Tuning: offer a Bhupali/Mohanam framing for the pentatonic only if she wants it — don't presume heritage.
- Tagline says *notices*; axis says *gather*. Kept her words; worth naming with her.
- `app/api/taste-blocks/route.ts` (untracked) imports `@supabase/supabase-js`, which isn't installed — `next build` will fail until it's installed or the file is removed. Not touched.
- Next pass candidates: time-of-day ground (dusk palette), real Are.na pull, keyboard traversal of the plot (arrow keys move between nearest points, each plucking).

## 2026-10-25 — Pass 3: flipped, imaged, and a house around it

**Harshita's critique of pass 2:** axes backwards (the important work must be top-right); not visually impactful; fonts poor; axis titles should explain themselves on hover; "giving work-in-progress"; hovering points should show beautiful images; "as text" should be the old Trousdale-style index panel with hover images on the left; lighter ground; and a real personal-site system — about, writing, résumé in a corner. "Brainstorm with the design team" → run as the Chia × Flo studio, inline.

**Found while looking:** only GitHub (≈20 files) and Sony (one hover image, stranded in `app/work/sony/`) have real imagery. `HoverImages` pointed at `/work-1.jpg`, `/about-1.jpg`… — none exist, so it rendered grey boxes printed with filenames: a big part of the WIP feel. The real Sony artifact is *Sonia, an AI assistant asking for data consent* — contradicting the repo's "headphone unboxing" case-study copy (likely written by an earlier session). The GitHub screenshot is dated Jul 18, 2023 — a third date for that project.

**Thesis:** *A plot of attention — the made work in the light, the gathered things in the dark, and you, drawn in dots.*

**Moves made:**
1. **(Bold) Images unfold from the points** toward the plot's center (`Plate` component, 200ms scale+blur reveal; the resting label hides, a captioned figure replaces it). Real artifacts for Sony/GitHub (copied to `public/work/*/hover.avif`); **your creature drawn from `SHAPES` point clouds** for *you* (104 dots for "smoke"); Patronus shows fox/moth/heron; everything else gets a **typeset title card** (Chia's form: Spectral light italic title + paired-noun litany in Courier) — never stock photos.
2. **Axes flipped**: x = wonder ← → work, y = gather ↓ ↑ make; make·work top-right under one atmospheric layer (warm radial light, rgba(236,206,166,.30)). Axis words are now **large Spectral 200 italic** (clamp 26–50px) in `--ink-faint`; hover/focus → word goes to ink + a card: `{pole} · {n} things`, definition, "lives here: …".
3. **Type: Spectral + Courier Prime** (Chia consult: typewriter + literary serif; Courier Prime is the screenwriting face → her theatre background, metadata as stage directions). Replaced Newsreader / Plex Mono / Manrope across homepage, RightPanel, SiteVoice, list.
4. **"as text" = the Trousdale RightPanel again** (desktop) + rewritten `HoverImages` stage using the same plates; mobile falls back to the quadrant list. Fixed: stage positions were off-screen (left column at −92px at 1280w) — now anchored 64px left of the panel. Panel titles/dates aligned with the plot (Sony capstone, GitHub usability study, Salesloft 2025). `[ABOUT_TEXT]` replaced; "Metric placeholder" rows filtered; HPE/Nutanix/Patronus/Site voice rows added with hover plates.
5. **The house**: `/about` (verified facts only: bio line already on site, Salesloft now, experience list, contact), `/writing` + `/writing/on-the-plot` (a third-person note on how the site is arranged — axes, sound, type), `/resume` (HTML CV from the experience list, each role linked to its plotted work, print/save-as-pdf). Bottom-right corner: `about · writing · résumé`; shared `PageShell`.

**Fixed during verification:** horizontal overflow from the light layer (inset −5%); `work →` crammed at the edge (XS 34→32, words at ±(XS+10)); tagline colliding with the view nav under 760px (nav drops below); bottom nav floating over the plot on short screens (fixed → absolute); captions squeezing titles to two lines (meta stacked under title); "your creature, a smoke" alt phrasing.

**Cut:** Newsreader; the grey-green ground; missing-file grey boxes; side-by-side caption rows; the fixed bottom-right sound control (moved into the top nav last pass, kept).

**Open questions for the next pass:**
- **Content truth, highest priority.** Sony case-study long-form (RightPanel details + `/work/sony`) describes headphone onboarding; the artifact is an AI-consent assistant. Dates: lib/projects (2021–24) vs résumé (2024–25) vs GitHub screenshot (2023). Site now uses résumé dates everywhere on the homepage/panel; case-study pages still old. Harshita must confirm.
- Title-card litanies and one-liners are drafts — need her pass.
- Real screenshots for Influence Graph, AI Email, HPE, Nutanix → drop at `public/work/<id>/hover.(avif|jpg)` and set `plate.src` in `lib/entries.ts`.
- About is facts-only by design; her own paragraph would transform it.
- Gather quadrants still empty except the visitor — Are.na handle.
- `app/api/taste-blocks/route.ts` still breaks `next build` (missing `@supabase/supabase-js`).
- Next pass candidates: real image for every made·work point; keyboard traversal of the plot; dusk palette.

## 2026-10-25 — Pass 4: what josephines.world knows, said in Harshita's voice

**Ask:** dissect josephines.world (Josephine Onggowarsito — on Flo's people-I-admire list) and borrow its delight without copying, through the axis approach; axis words "horrid, too big"; publish the site as an Artifact.

**Dissection (looked live, DOM + screens):** intro = thesis (ASCII merry-go-round → work literally goes round in 3 repeating rows); intro as scrubbable media (restart/pause/finish); a pannable world — click glides the camera, compass "Return to center"; one ink at many alphas (#000 @ .3–.9 on #fafafa); three-voice captions (year solid grotesk 14 / name EB Garamond 15 @ .7 / category grotesk 11 @ .4); one handmade gesture (signature-script initial + italic serif name); biography as live time zones (JKT/TPE/SF with day/night glyphs); bracketed dialect (`Sound [Off]`, `[Index]`); bio facts with anchor words at full ink; a plainly stated worldview paragraph; "(internet decorator)".

**Thesis:** *A plot of attention — the made work in the light, the gathered things in the dark, and you, on her clock.*

**Moves made (translated, not copied):**
1. **(Bold) Her time beside yours** — clock line under the tagline: `seattle 10:31 am · you, 1:31 pm` (or "— your time too"). Josephine's clocks are *her* places; ours puts the already-plotted visitor on the clock.
2. Axis words → **labels, not headlines**: Spectral 300 italic 19px + Courier 11px gloss (`things produced`, `things kept`, `applied, shipped`, `open-ended`); hover card kept.
3. **Screenplay parentheticals** as the interface dialect (theatre): `(sound off)`, `(skip)` — vs. her brackets.
4. **Two-voice resting captions** (Courier year + Spectral title); the third voice (kind of work) moved into the hover figure — three-line captions collided at ≤760px.
5. **One ink, many alphas**: `--ink .94 / --ink-muted .68 / --ink-faint .5` on one warm ink.
6. Skippable opening (`(skip)`, click, or any key).
7. Make·work re-placed in strict rows (≥.17 apart in y, alternating x; plot min-height 760): zero collisions at 760/1280/1440; years hide <700px. Two dots touch label edges by ≤2px at 597px (phone; text view is default there).
8. **Artifact** published: https://claude.ai/artifact/R4WPdAqtB6tbdzdyihFksb — self-contained vanilla port (plot, hover plates with Sony/GitHub embedded, creature plates, axis cards, sound, clock, visitor ritual, index panel + image stage, phone list, about/writing/résumé as rooms at #about #writing #resume). No print button (frame forbids it); email shown as copyable text. Case-study links don't exist inside the artifact.

**Deliberately not taken:** her signature lockup, the pannable carousel world, numbered [01]–[05] bio — those are hers.

**Open questions for the next pass:**
- Harshita's own worldview paragraph and a parenthetical self-title (her "(internet decorator)") — the two highest-value missing things; only she can write them.
- The artifact is a hand port of the Next site — they will drift. Decide which is canonical.
- Dusk palette driven by the Seattle clock (Chia's split from this pass).
- Carried over: content-truth (Sony copy, dates), real images for 4 projects, Are.na handle, supabase build break.

## 2026-10-25 — Pass 5: Ainsley Romero, the two-site reading, and the serif

**Ask:** study ainsleyromero.com, derive what to take from it and josephines.world together; find a great serif (Spectral isn't landing).

**Ainsley, looked live (DOM + source):** the homepage *is* a plot — heavy black axes, ~40 hand-placed dots (`{x:28,y:12,label:…}` in source); axis labels are phrases with wordplay (*from play ↔ for play*, *investigating form ↔ investigating language*), side labels rotated along the axis; hover writes the title diagonally out of the dot, and the work's image appears at plot center *under* the dots; filters are a comma-sentence (*Books, Branding, Posters,*) and colour matching dots cornflower blue — the only colour; a hand-drawn spiral monogram; plain NimbusSanL/Arial, hand-coded; about = one huge paragraph with a chiasmus (*"takes play very seriously and language very playfully"*); hidden `last updated on 2.29.24`. Probably the "axis portfolio" Harshita half-remembered; the only credit in source is to a Linda van Deursen workshop (The Image of Graphic Design) on one project — not to an axis philosophy. Told her so.

**Two-site derivation:** both have (1) a self-description with a turn, (2) one handmade gesture, (3) density (16 projects ×3; ~40 dots), (4) one ink + one meaningful accent, (5) plain system type with personality in one place. Harshita has (4); missing (1)(2)(3) — density is the biggest gap (8 points + visitor). Not to take: Ainsley's rotation, heavy axes, diagonal titles, blue filter dots.

**Serif:** built an audition artifact — https://claude.ai/artifact/VBnbqyzkeBipsopNe8nFp1 — six open-licence Google faces (Literata, Castoro, Piazzolla, IM Fell English, Brygada 1918, Spectral as control) set in her real copy at real sizes beside Courier Prime, light/regular toggle; paid alternatives named (Martina Plantijn, GT Alpina, ABC Arizona Serif). Recommendation: **Literata** (optical sizes 7–72; calm legible small italic) for the whole site; **Castoro** if she wants more character (single weight). Avoided: Instrument Serif, Fraunces, Playfair, Cormorant, Lora (overused), EB Garamond (Josephine's).

**Not implemented:** no site change this pass — waiting on her pick (one-line swap in `app/layout.tsx` + `--font-spectral` references).

**Open / next:** her choice of serif; her twist-line self-description; a real handmade mark; ~15–20 more real points (gatherings, studies, notes); `title`-attribute "last plotted" date. Carried over: content truth (Sony, dates), images for 4 projects, Are.na handle, supabase build break, artifact vs. Next drift.

## Pass 6 — 2026-10-25 · Ainsley weight, dmcg motion
- **Thesis held.** *everything Harshita notices and makes*: one heavy cross, everything else quiet.
- **Moves.**
  - IM Fell English replaces Spectral (one weight; never bold or light).
  - Axes are now 2px ink with ticks at ±0.5, and the field spans ~80% of the page.
  - **(Bold one)** Hovering a point no longer opens a side card. A large figure (clamp 280–640px) opens at the plot's center, with dots kept above it. The figure is a link to the case study.
  - dmcg motion everywhere: arrive with `cubic-bezier(.22,1,.36,1)`, blur 8→0, scale .97→1, stagger .12s + 70ms; exit .22s with `(.4,0,.2,1)`.
  - Picsum placeholders give every entry an image until the real artifacts arrive.
- **Cut.** The side-unfolding hover card, the radial light, and the old long RightPanel stagger (up to 2.5s).
- **Open.**
  - Real artifact images.
  - Case-study pages are still Playfair and the old grid, so they need a pass to match.
  - Sony copy vs artifact.
  - Her own one-line self-description, a hand-made mark.
- **Next pass.** Bring the case-study template into the same voice. The figure → page transition could become a shared-element morph.

## Pass 7 — 2026-10-25 · Mint, and a note at the origin
- **Thesis.** *The origin* — everything on the plot is measured from her, so that's where she says hello.
- **Moves.**
  - **(Bold one)** A wreath of seven cursive loops, drawn as a single pen line, now sits where the axes cross.
    - It's generated by code (`lib/organic.ts` → `garland`) and turned to Seattle's hour, one full turn a day.
    - It draws itself in over 2.4s after the axes appear.
    - Hovering shows "(who's plotting this?)".
    - Clicking blooms a petal-shaped sheet out of the mark: a spring (stiffness 90, damping 14), then the shape breathes on an 18s loop with a pencil outline drifting out of step.
    - Her name is written in Ballet (opsz 72) by a soft-edged mask sweeping left to right, then a swash is drawn under it and the lines settle in one after another.
    - It closes by folding back into the mark.
  - Background is now #BCE4C5 mint. The ink shifted to deep green (16,36,25) at .94 / .74 / .57. Accent deepened to #A8391F to hold 4.5:1 on mint.
  - Axis words are 17px, sit past the line ends, and lose their resting gloss (it's in the hover card now). Lines run to clamp(78px, 7vw, 112px) from the sides and 34px from the top and bottom, ending in open 2px arrowheads.
  - The artifact was rebuilt to match: same geometry, figure, origin note and motion, written in plain JS with a hand-rolled spring. Placeholder photos are embedded.
- **Cut.** The ↑ ↓ ← → glyphs inside the words, the resting Courier glosses, and paper white.
- **Open.**
  - The about copy in the note is a first-person draft. "Theatre and a camera came first" is inferred from the old site's faded nodes, so she needs to confirm or rewrite it.
  - Case-study pages are still the old style.
  - The phone plot is crowded (the text view is the default there).
- **Next pass.** Case-study template in the mint voice. Maybe let the origin note remember a returning visitor's name.

## Pass 8 — 2026-10-25 · Why it lacked Ainsley's spark; the artifact becomes the workbench
- **Diagnosis.**
  - Too few things: 9 dots against her ~40.
  - Too many voices: a period serif plus Courier plus italics. Hers is one plain voice and one hand mark.
  - Colour meant nothing; hers marks a filter.
  - Too much softness (blur, shadows, spring), where her plot is direct.
  - The axes read as chart furniture (arrowheads, ticks); hers are poster lines.
- **Moves.**
  - Plain Helvetica/Arial everywhere except the tagline and the note (IM Fell). Labels sit to the right of the dots.
  - 3px axes, no arrowheads or ticks, and the lines stop short of the mark.
  - The plot grew from 9 to 16 real items plus the visitor, adding: Each point a note, On the plot, M.S. at UW, Résumé, LinkedIn, The garage, Theatre, Photography.
  - **(Bold one)** A filter sentence: Product, Research, AI, Systems, Playgrounds, Notes, Gathered, Elsewhere, Off-screen. Choosing one turns its dots the accent colour and fades the rest.
  - Cream #F5F2E6 fading to #DDEBD5 from 38% down.
  - A filled seven-loop mark that turns once a minute.
  - The note is now a classic engraved long-star card. Her name is set in IM Fell, with the H and S in Mea Culpa.
  - Edit mode: every setting, plus dragging, adding and editing points. Saves to the db doc `design/current` (Editors write, everyone reads), so I can read her tuning back.
- **Cut.** The blob and spring panel, Ballet, the mint ground, the Courier small print.
- **Open.**
  - She tunes in edit mode, then I port `design/current` to the Next site.
  - Theatre and Photography need her own lines.
  - The Next site is still on pass 7.

## Pass 9 — 2026-10-25 · Only the real things; theatre and odds & ends as tables of prints
- **Ask.** Cut the made-up points (Patronus, site voice, the sound note, résumé/LinkedIn as dots). Pull everything from her old Framer portfolio and the Salesloft PDF (the PDF is context only, not for publishing). Add a theatre dot that opens arranged photos, then a theatre page. Borrow from odds & ends. No orange accent. Try Averia Serif Libre. Add Rama Duwaji to the skill and add more interaction.
- **Moves.**
  - The plot is 13 real points:
    - Influence Graph and AI Email Assistant (Salesloft)
    - GitHub pull requests
    - Sony
    - Keeping AI models in check (HPE)
    - A Safe Space (UW + UW Medicine)
    - Support progress tool (Nutanix)
    - Sir Wobblefoot
    - Theatre
    - Props, people & "problems" (her paper)
    - Odds & ends
    - Films, logged (Letterboxd)
    - M.S. at UW
  - **(Bold one)** Theatre and Odds & ends are cluster points. Hover drops five photos on the plot like prints, each turned a little. Clicking opens a room where every photo is a print you can pick up and move, with a "(tidy up)" / "(scatter them)" toggle.
  - The origin note and About now use her own words ("I care about making beautiful things that help people." / "aspiring morning person" / CS + theatre / software engineer building ML systems / cinema, music, making lists, pictures of silly things).
  - The accent is oxblood #7A2433 (her glaze), replacing terracotta. Averia Serif Libre is her voice (tagline, rooms, note, weight 300 for body). Plain Helvetica stays on the plot. IM Fell plus Mea Culpa only for the name.
  - Rama: settled clay vessels now boil (three redrawings cycled about every 167ms).
  - Corrected facts: LinkedIn is /in/harshita-shyale; HPE was AI model monitoring (data drift, built in React); the Sony framing is "smart, sustainable customer experience"; added RoxHealth AI (2024) and Focused Space (2023) to the résumé; résumé PDF link from the old site.
- **Cut.** The visitor/patronus ritual, the made-up component points, the "On the plot" writing room, the picsum stock photos.
- **Skill.** Added `references/rama-duwaji.md` (hand-lettered words, line boil, small loops on still objects, material texture, a ground, limits) and a "Hand" lens.
- **Open.**
  - Her own handwriting for the axis words and her name (the Rama move).
  - Real images for Influence Graph, AI Email Assistant and Nutanix (title cards for now).
  - gather · work holds only UW.
  - Port all of this to the Next site once she's tuned it.
