# The circle: people and sites Chia and Flo learn from

Use this file for **concrete craft rules** (the circle's "ground altitude") and for **who to study next**.

## Craft rules (distilled; apply by default)

### Typography
- `text-wrap: balance` on titles and `text-wrap: pretty` on paragraphs. *(Jakub Krehel)*
- `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility` on the root. *(Jakub, Rauno)*
- `font-variant-numeric: tabular-nums` wherever digits change or line up (times, counts, dates).
- Never change font weight on hover or selected state, because it shifts layout. No weights below 400. Medium headings at 500–600. *(Rauno)*
- Use `clamp()` for fluid heading sizes. Inputs at **16px or more** so iOS doesn't zoom.

### Surfaces and edges
- Nested radii: **outer = inner + padding.**
- Prefer layered, translucent box-shadows over borders, because they adapt to images and color: `0 0 0 1px rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)`. On hover, raise the alphas slightly. *(Jakub)*
- Image hairline: `outline: 1px solid rgba(0,0,0,.1); outline-offset: -1px`.
- Use radial gradients rather than blurred rectangles for glows, to avoid banding and stay cheap. *(Rauno)*

### Motion
- **Interaction transitions under 200ms.** Use CSS transitions, which can be interrupted and retargeted, for interactions. Use keyframes only for one-off staged sequences. *(Rauno, Jakub)*
- **Enter:** `opacity 0 → 1`, `translateY(8px) → 0`, `blur(8px) → 0`, over 800ms with `cubic-bezier(.25,.46,.45,.94)`. Stagger 100ms between sections and **80ms between words** in a title. *(Jakub)*
- **Exit is quieter than enter:** for example `x → -70%`, `opacity → 0`, `blur(4px)`; a spring with duration 0.45 and no bounce. *(Jakub)*
- Scale relative to size: dialogs from about 0.8, button presses to 0.96. *(Rauno)*
- Don't animate frequent, low-novelty actions. Pause loops that are off-screen. Never animate during a theme switch. *(Rauno)*
- Stagger nav items with a spring and `blur(4px → 0)`; drop the secondary ornament in after a delay. *(Flo)*
- Respect `prefers-reduced-motion`.

### Interaction
- Hover styles only under `@media (hover: hover)`. Replace the iOS tap highlight with a real indicator.
- Toggles take effect immediately. Disable submit after submitting. Use optimistic UI and roll back on error with nearby feedback. *(Rauno)*
- `pointer-events: none` on decorative glows and gradients.
- Feedback near its trigger (an inline ✓, a highlighted input). **Empty states invite making the first thing.**
- Align optically, not geometrically (less padding on the icon side). *(Jakub)*
- Focus rings that respect radius. Icon-only controls get `aria-label`; illustrations get `aria-label` or a description.

## Creeds worth keeping in view

- **Rauno Freiberg:** "Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. Make it." See *interfaces.rauno.me*, *Devouring Details*, *historyofsoftware.org*.
- **Paco Coursey:** "Developing skill through doing." Remembers that "everything around me is someone's life work." (cmdk; the Writer editor; "Redesign 2021: return to simplicity.")
- **Amelia Wattenberger:** "Our interfaces have lost their senses." "Chatbots are not the future." "Bridging the hard and the soft." Tools for thought; data into meaning.
- **Andy Matuschak:** evergreen and working notes; stacked-pane note browsing (notes.andymatuschak.org), which Flo's three-pane notebook echoes.
- **Pocket Grove** (hand-lantern.vercel.app, on Flo's websites list): "Your hand is a lantern. Illuminate ruins, control rain, and explore shadows." Light as the interaction itself.

## People Flo admires (floguo.com/notes/people-i-admire)

Designers, engineers, and design engineers. Visit their sites when a pass needs fresh eyes.

Adam Noffsinger (noff.me) · Aileen Luo (aileenis.online) · Amelia Wattenberger (wattenberger.com) · Andy Matuschak (andymatuschak.org) · Andy Zhang (andyzhang.net) · Arsen Kolyba (arsenkolyba.com) · Bao To (baothiento.com) · Ben Issen (benissen.com) · Benji Taylor (benji.org) · Bradley Ziffer (bradleyziffer.com) · Brian Lovin (brianlovin.com) · BT Norris (btn0s.dev) · Chloe Yan (chloeyan.me) · Chris Pramana (chrispramana.com) · Dan Hollick (typefully.com/DanHollick) · Daniel Petho (danielpetho.com) · Elissa Martial (elissamartial.com) · Elizabeth Lin (lalizlabeth.com) · Emily Campbell (emilycampbell.co) · Emmi Wu (emmiwu.com) · Eve Bouffard (evebouffard.com) · Haolun Yang (haolunyang.com) · Henry Zhu (henryzoo.com) · Iris Leung (iriscleung.com) · Ishaan Dey (ishaand.com) · Jace (ja.mt) · Jade Franson (jadefranson.com) · Jakub Krehel (jakub.kr) · Jakub Zegzulka (zegzulka.com) · Joe Bell (joebell.studio) · Jordan Dworkin (jordandworkin.com) · Jordan Singer (ibuildmyideas.com) · Josephine Onggowarsito (josephines.world) · Josh Puckett (joshpuckett.me) · Josh Wolk (joshuawolk.com) · Kenneth Kuh (kennethkuh.info) · Lele Zhang (lelezhang.design) · Liam Matteson (liam.cv) · Lochie Axon (lochieaxon.com) · Maja (x.com/majamediaco) · Maxime Heckel (maximeheckel.com) · Mery Kaftar (mery.codes) · Michelle Liu (liumichelle.com) · Mitul Shah (mitul.ca) · Paco Coursey (paco.me) · Pauline Wee (paulinewee.com) · Preston Booth (prestonb.xyz) · Rachel Chen (rachelchen.tech) · Raghav Agarwal (rghv.ca) · Raphael Schaad (x.com/raphaelschaad) · Rauno Freiberg (rauno.me) · Ricky Zhang (rickyzhang.me) · Robert Pavlinić (rpavlini.com) · SJ Zhang (sj.land) · Smintfy (smintfy.com) · Soren (x.com/sorenblank) · Spoony Vu (spoony.work) · Szymon Kaliski (szymonkaliski.com) · Taha Hossain (tahahossain.com) · Thariq Shihipar (thariq.io) · Tikhon Belousko (tikhon.io) · Vladimir Agafonkin (agafonkin.com) · Wilson Hou (x.com/wilsonhou) · Zenith (bossadizenith.me)

Design engineers Flo names as personal north stars: **Rauno Freiberg, Andy Zhang, Bradley Ziffer, Maxime Heckel.**

## Websites Flo appreciates (floguo.com/notes/websites)

Adaline (adaline.ai) · Andy Matuschak's Notes · Blob Tracking 2 (r3f.maximeheckel.com) · Consumer App Studio · Covers (covers.brunoimbrizi.com) · Daybreak (daybreak.studio) · Dropbox Brand Guidelines (brand.dropbox.com) · Floor796 (floor796.com) · Inflight (inflight.co) · Ordinary Abundance (ordinaryabundance.com) · Paradigm (paradigmai.com) · Pocket Grove (hand-lantern.vercel.app) · Prime Intellect (primeintellect.com) · Vercel

## Flo's design-engineering syllabus (selected)

Vercel Web Interface Guidelines · interfaces.rauno.me · Devouring Details (Rauno) · animations.dev (Emil Kowalski) · ui.land · Interface Craft (Josh Puckett) · svg.guide (Nanda Syahrasyad) · "Details that make interfaces feel better" (Jakub Krehel) · Maggie Appleton, "Design Engineers" · Ahmad Shadeed's CSS articles

## Chia's reading list on the handmade web (from "Making Space for a Handmade Web")

Robin Rendle, "I am a poem I am not software" · Laurel Schwulst, "My website is a shifting house next to a river of knowledge" · Kevin Bewersdorf, "Spirit Surfing" · J. R. Carpenter, "A Handmade Web" · Olia Lialina, "A Vernacular Web" · Gary Zhexi Zhang, "Reenvisioning the Internet" · Austin Wade Smith, "Queer Servers and Feral Webs" · "Why Do We Call it a Homepage?"

Also referenced by Chia: Neocities, Rhizome, the School for Poetic Computation, JODI, Cassie McQuater's *Black Room*, Everest Pipkin's *Default Filename TV*, Gaston Bachelard's *The Poetics of Space*, and Legacy Russell's *Glitch Feminism*.
